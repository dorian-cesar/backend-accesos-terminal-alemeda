// controllers/public.controller.js
export const infoServer = (req, res) => {
  const info = {
    uptime: process.uptime(),
    memoriaLibre: (process.memoryUsage().heapFree / 1024 / 1024).toFixed(2),
    memoriaTotal: (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2),
    cpu: process.cpuUsage(),
    env: process.env.NODE_ENV
  };
  res.json(info);
};