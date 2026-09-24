const app = require('./src/app');
const http = require('http');

async function testVideoPipeline() {
  console.log('--- TEST DEL GENERADOR DE VIDEO DE NIKOLA ---');
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(3098, resolve));
  console.log('✔ Servidor de test iniciado en puerto 3098');

  try {
    // 1. Iniciar generación de video
    const genRes = await fetch('http://localhost:3098/api/videos/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic: 'Descuento especial en Curso de Subestaciones Eléctricas de CFE',
        style: 'pixar',
        voice: 'onyx'
      })
    });

    const genData = await genRes.json();
    console.log('1. Respuesta de inicio de video:', genData);

    // 2. Esperar 1.5s y consultar estado
    await new Promise(r => setTimeout(r, 1500));
    const statusRes = await fetch(`http://localhost:3098/api/videos/status/${genData.job.id}`);
    const statusData = await statusRes.json();
    console.log('2. Estado del trabajo de video:', statusData);

    // 3. Consultar librería
    const libRes = await fetch('http://localhost:3098/api/videos/library');
    const libData = await libRes.json();
    console.log('3. Librería de videos generados:', libData);

    if (statusData.job && statusData.job.status === 'COMPLETED') {
      console.log('✅ Pipeline de Video funcionando al 100% con URL:', statusData.job.videoUrl);
    }
  } catch (err) {
    console.error('Error en test de video:', err);
  } finally {
    server.close();
    console.log('✔ Servidor de test cerrado.');
    process.exit(0);
  }
}

testVideoPipeline();
