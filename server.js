import app from './app.js';

const PORT = process.env.PORT || 3000;

// Determinar el host basado en el entorno
const getHost = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.HOST || '0.0.0.0';
  }
  return 'localhost';
};

const HOST = getHost();

app.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor ejecutándose en http://${HOST}:${PORT}`);
  console.log(`📍 Entorno: ${process.env.NODE_ENV}`);
  console.log(`🌐 URL Base: ${process.env.BASE_URL}`);
  console.log(`📊 Acceso local: http://localhost:${PORT}`);
});