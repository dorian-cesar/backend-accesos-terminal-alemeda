import os from "os";

export const mostrarDashboard = (req, res) => {
  const usoCPU = os.loadavg()[0].toFixed(2);
  const memoriaLibre = (os.freemem() / 1024 / 1024).toFixed(2);
  const memoriaTotal = (os.totalmem() / 1024 / 1024).toFixed(2);
  const uptime = (os.uptime() / 60).toFixed(2);

  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dashboard - Terminal Alameda</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                margin: 0; 
                padding: 20px; 
                background-color: #f5f5f5;
            }
            .container { 
                max-width: 1200px; 
                margin: 0 auto; 
                background: white; 
                padding: 20px; 
                border-radius: 8px; 
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header { 
                display: flex; 
                justify-content: space-between; 
                align-items: center; 
                margin-bottom: 30px; 
                padding-bottom: 20px; 
                border-bottom: 1px solid #eee;
            }
            .stats-grid { 
                display: grid; 
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
                gap: 20px; 
                margin-bottom: 30px;
            }
            .stat-card { 
                background: #f8f9fa; 
                padding: 20px; 
                border-radius: 8px; 
                border-left: 4px solid #007bff;
            }
            .stat-card h3 { 
                margin: 0 0 10px 0; 
                color: #333; 
                font-size: 14px;
            }
            .stat-card p { 
                margin: 0; 
                font-size: 24px; 
                font-weight: bold; 
                color: #007bff;
            }
            .user-info { 
                background: #e8f5e8; 
                padding: 15px; 
                border-radius: 8px; 
                margin-bottom: 20px;
            }
            .btn-logout { 
                background: #dc3545; 
                color: white; 
                padding: 10px 20px; 
                border: none; 
                border-radius: 4px; 
                cursor: pointer; 
                text-decoration: none; 
                display: inline-block;
            }
            .btn-logout:hover { 
                background: #c82333;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Dashboard Administrativo - Terminal Alameda</h1>
                <button onclick="logout()" class="btn-logout">Cerrar Sesión</button>
            </div>
            
            <div class="user-info">
                <h3>Usuario: ${req.usuario.correo}</h3>
                <p>Rol: ${req.usuario.rol}</p>
                <p>ID: ${req.usuario.id}</p>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <h3>Uso de CPU</h3>
                    <p>${usoCPU}%</p>
                </div>
                <div class="stat-card">
                    <h3>Memoria Libre</h3>
                    <p>${memoriaLibre} MB</p>
                </div>
                <div class="stat-card">
                    <h3>Memoria Total</h3>
                    <p>${memoriaTotal} MB</p>
                </div>
                <div class="stat-card">
                    <h3>Uptime del Sistema</h3>
                    <p>${uptime} min</p>
                </div>
            </div>

            <div>
                <h2>Acciones Rápidas</h2>
                <button onclick="verInfoServidor()">Ver Info del Servidor</button>
                <button onclick="gestionarUsuarios()">Gestionar Usuarios</button>
            </div>
        </div>

        <script>
            // Obtener token del localStorage
            const token = localStorage.getItem('token');
            
            // Verificar si hay token
            if (!token) {
                alert('No hay token de autenticación. Redirigiendo al login...');
                window.location.href = '/api/auth/login';
            }

            function logout() {
                // Eliminar token del localStorage
                localStorage.removeItem('token');
                // Redirigir al login
                window.location.href = '/api/auth/login';
            }

            function verInfoServidor() {
                // Hacer solicitud autenticada a la API
                fetch('/api/public/info', {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Info del servidor:', data);
                    alert('Info del servidor en consola');
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error al obtener info del servidor');
                });
            }

            function gestionarUsuarios() {
                // Hacer solicitud autenticada a la API de usuarios
                fetch('/api/users', {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al obtener usuarios');
                    }
                    return response.json();
                })
                .then(usuarios => {
                    console.log('Usuarios:', usuarios);
                    alert('Lista de usuarios en consola');
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error al obtener usuarios: ' + error.message);
                });
            }

            // Verificar el rol del usuario
            console.log('Usuario autenticado:', ${JSON.stringify(req.usuario)});
        </script>
        <script>
            function logout() {
                // Opción 1: Redirigir directamente al endpoint de logout
                window.location.href = '/api/auth/logout';
                
                // Opción 2: Hacer logout via fetch y luego redirigir
                /*
                fetch('/api/auth/logout', { method: 'POST' })
                    .then(response => response.json())
                    .then(data => {
                        // Eliminar token del localStorage
                        localStorage.removeItem('token');
                        // Redirigir al login
                        window.location.href = data.redirect || '/api/auth/login';
                    })
                    .catch(error => {
                        console.error('Error en logout:', error);
                        // Fallback: eliminar token y redirigir
                        localStorage.removeItem('token');
                        window.location.href = '/api/auth/login';
                    });
                */
            }

            // Verificar autenticación al cargar el dashboard
            window.addEventListener('load', () => {
                const token = localStorage.getItem('token');
                if (!token) {
                    // Si no hay token, redirigir al login
                    window.location.href = '/api/auth/login';
                }
            });
        </script>
    </body>
    </html>
  `);
};