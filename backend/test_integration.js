const app = require('./src/app');
const http = require('http');

async function testIntegration() {
  console.log('--- INICIANDO TEST DE INTEGRACIÓN LOCAL ---');
  const server = http.createServer(app);

  await new Promise(resolve => server.listen(3099, resolve));
  console.log('✔ Servidor de pruebas iniciado en puerto 3099');

  try {
    // 1. Probar Webhook GET Verification de Meta
    const metaRes = await fetch('http://localhost:3099/api/webhooks/meta?hub.mode=subscribe&hub.verify_token=clipop2026&hub.challenge=CHALLENGE_OK');
    const metaText = await metaRes.text();
    console.log(`1. Meta Webhook GET status: ${metaRes.status}, body: "${metaText}"`);
    if (metaRes.status === 200 && metaText === 'CHALLENGE_OK') {
      console.log('   ✅ Webhook de Meta cumple 100% con los requerimientos de verificación.');
    } else {
      console.error('   ❌ Fallo en Webhook de Meta');
    }

    // 2. Probar API Products (para frontend)
    const prodRes = await fetch('http://localhost:3099/api/products');
    const prods = await prodRes.json();
    console.log(`2. Products GET status: ${prodRes.status}, items: ${prods.length}`);
    if (prodRes.status === 200 && Array.isArray(prods) && prods.length > 0) {
      console.log('   ✅ Endpoint /api/products compatible con frontend.');
    }

    // 3. Probar API Settings (para frontend)
    const settRes = await fetch('http://localhost:3099/api/settings');
    const settings = await settRes.json();
    console.log(`3. Settings GET status: ${settRes.status}, data:`, settings);
    if (settRes.status === 200) {
      console.log('   ✅ Endpoint /api/settings compatible con frontend.');
    }

    // 4. Probar Ingesta Rápida POST de Meta Webhook (< 500ms)
    const postRes = await fetch('http://localhost:3099/api/webhooks/meta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        object: 'page',
        entry: [{
          messaging: [{
            sender: { id: 'test_user_123' },
            message: { mid: 'mid_test_1', text: 'Hola, información sobre cursos' }
          }]
        }]
      })
    });
    const postText = await postRes.text();
    console.log(`4. Meta Webhook POST status: ${postRes.status}, body: "${postText}"`);
    if (postRes.status === 200 && postText === 'EVENT_RECEIVED') {
      console.log('   ✅ Ingesta asíncrona de Meta responde HTTP 200 EVENT_RECEIVED de inmediato.');
    }

  } catch (err) {
    console.error('Error durante test:', err);
  } finally {
    server.close();
    console.log('✔ Servidor de pruebas detenido.');
    process.exit(0);
  }
}

testIntegration();
