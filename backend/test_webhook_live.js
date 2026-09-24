async function testLiveWebhook() {
  const url = 'https://clipop.com.mx/api/webhooks/meta?hub.mode=subscribe&hub.verify_token=clipop2026&hub.challenge=test1234';
  try {
    const res = await fetch(url);
    const body = await res.text();
    console.log('GET Verification Status:', res.status, 'Body:', body);
  } catch (err) {
    console.error('GET Verification Error:', err.message);
  }

  // Test POST incoming mock event
  const postUrl = 'https://clipop.com.mx/api/webhooks/meta';
  const mockPayload = {
    object: 'page',
    entry: [
      {
        id: '1098269179424331',
        time: Date.now(),
        messaging: [
          {
            sender: { id: '999888777' },
            recipient: { id: '1098269179424331' },
            timestamp: Date.now(),
            message: {
              mid: 'mid_test_' + Date.now(),
              text: 'Hola, prueba técnica de conexión en vivo'
            }
          }
        ]
      }
    ]
  };

  try {
    const resPost = await fetch(postUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockPayload)
    });
    const postResText = await resPost.text();
    console.log('POST Event Status:', resPost.status, 'Response:', postResText);
  } catch (err) {
    console.error('POST Event Error:', err.message);
  }

  // Check leads
  try {
    const leadsRes = await fetch('https://clipop.com.mx/api/leads');
    const leadsData = await leadsRes.json();
    console.log('Current Leads Count:', Array.isArray(leadsData) ? leadsData.length : 'Not array');
    console.log('Leads:', JSON.stringify(leadsData, null, 2));
  } catch (err) {
    console.error('Fetch Leads Error:', err.message);
  }
}

testLiveWebhook();
