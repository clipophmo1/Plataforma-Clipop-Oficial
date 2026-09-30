const whatsappService = require('../services/baileysService');

async function getStatus(req, res) {
  const isConnected = whatsappService.isWhatsAppConnected();
  const waData = whatsappService.getWhatsAppStatus ? whatsappService.getWhatsAppStatus() : {};
  res.json({
    connected: isConnected,
    status: waData.status || (isConnected ? 'CONNECTED' : 'DISCONNECTED'),
    qr: waData.qr || whatsappService.getLatestQrCode(),
    pairingCode: waData.pairingCode || null,
    connectedNumber: waData.connectedNumber || null
  });
}

async function getQr(req, res) {
  const qrCode = whatsappService.getLatestQrCode();
  const isConnected = whatsappService.isWhatsAppConnected();
  res.json({
    qr: qrCode,
    connected: isConnected
  });
}

async function connect(req, res) {
  try {
    await whatsappService.startWhatsAppSession();
    const isConnected = whatsappService.isWhatsAppConnected();
    const waData = whatsappService.getWhatsAppStatus ? whatsappService.getWhatsAppStatus() : {};
    res.json({
      success: true,
      connected: isConnected,
      status: waData.status || (isConnected ? 'CONNECTED' : 'DISCONNECTED'),
      qr: waData.qr || whatsappService.getLatestQrCode(),
      pairingCode: waData.pairingCode || null,
      connectedNumber: waData.connectedNumber || null
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

async function logout(req, res) {
  try {
    const result = await whatsappService.logoutWhatsAppSession();
    res.json(result || { success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

async function requestPairingCode(req, res) {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    return res.status(400).json({ success: false, error: 'Se requiere el número de teléfono' });
  }

  try {
    const result = await whatsappService.requestPairingCode(phoneNumber);
    if (result && (result.success || result.code)) {
      const pairingCode = result.code || result.pairingCode || result;
      res.json({
        success: true,
        code: pairingCode,
        pairingCode: pairingCode,
        phone: result.phone || phoneNumber
      });
    } else {
      res.status(400).json({
        success: false,
        error: result?.error || 'No se pudo generar el código de emparejamiento'
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

async function sendMessage(req, res) {
  const { phone, message } = req.body;
  if (!phone || !message) {
    return res.status(400).json({ success: false, error: 'Se requieren "phone" y "message"' });
  }

  try {
    const userJid = phone.includes('@s.whatsapp.net') ? phone : `${phone}@s.whatsapp.net`;
    const result = await whatsappService.sendWhatsAppDirectMessage(userJid, message);
    res.json(result || { success: true, message: 'Mensaje enviado' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = {
  getStatus,
  getQr,
  connect,
  logout,
  requestPairingCode,
  sendMessage
};
