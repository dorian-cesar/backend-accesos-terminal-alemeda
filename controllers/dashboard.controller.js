import os from "os";

export const mostrarDashboard = (req, res) => {
  const usoCPU = os.loadavg()[0].toFixed(2);
  const memoriaLibre = (os.freemem() / 1024 / 1024).toFixed(2);
  const memoriaTotal = (os.totalmem() / 1024 / 1024).toFixed(2);
  const uptime = (os.uptime() / 60).toFixed(2);

  res.render("dashboard", {
    stats: { usoCPU, memoriaLibre, memoriaTotal, uptime },
    usuario: req.usuario
  });
};
