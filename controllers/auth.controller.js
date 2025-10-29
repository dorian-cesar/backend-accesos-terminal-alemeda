import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { obtenerUsuarioPorCorreo } from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

export const mostrarLogin = (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Accesos Terminal Alameda</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                height: 100vh; 
                display: flex; 
                justify-content: center; 
                align-items: center; 
                margin: 0;
            }
            .login-container { 
                background: white; 
                padding: 40px; 
                border-radius: 10px; 
                box-shadow: 0 10px 25px rgba(0,0,0,0.2); 
                width: 100%; 
                max-width: 400px;
            }
            .login-container h2 { 
                text-align: center; 
                margin-bottom: 30px; 
                color: #333;
            }
            .form-group { 
                margin-bottom: 20px;
            }
            .form-group label { 
                display: block; 
                margin-bottom: 5px; 
                color: #555;
            }
            .form-group input { 
                width: 100%; 
                padding: 12px; 
                border: 1px solid #ddd; 
                border-radius: 5px; 
                box-sizing: border-box;
            }
            .btn-login { 
                width: 100%; 
                padding: 12px; 
                background: #667eea; 
                color: white; 
                border: none; 
                border-radius: 5px; 
                cursor: pointer; 
                font-size: 16px;
            }
            .btn-login:hover { 
                background: #5a6fd8;
            }
            .error-message { 
                color: #dc3545; 
                text-align: center; 
                margin-top: 15px; 
                display: none;
            }
        </style>
    </head>
    <body>
        <div class="login-container">
            <h2>Acceso al Dashboard</h2>
            <form id="loginForm">
                <div class="form-group">
                    <label for="correo">Correo Electrónico:</label>
                    <input type="email" id="correo" name="correo" required>
                </div>
                <div class="form-group">
                    <label for="password">Contraseña:</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <button type="submit" class="btn-login">Iniciar Sesión</button>
            </form>
            <div id="errorMessage" class="error-message"></div>
        </div>

        <script>
            document.getElementById('loginForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const correo = document.getElementById('correo').value;
                const password = document.getElementById('password').value;
                const errorMessage = document.getElementById('errorMessage');
                
                try {
                    const response = await fetch('/api/auth/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ correo, password })
                    });
                    
                    const data = await response.json();
                    
                    if (response.ok) {
                        // Guardar token en localStorage
                        localStorage.setItem('token', data.token);
                        console.log('Token guardado:', data.token);
                        
                        // Redirigir al dashboard CON el token en la URL
                        window.location.href = '/api/dashboard?token=' + data.token;
                    } else {
                        errorMessage.textContent = data.mensaje || 'Error en el login';
                        errorMessage.style.display = 'block';
                    }
                } catch (error) {
                    errorMessage.textContent = 'Error de conexión';
                    errorMessage.style.display = 'block';
                }
            });

            // Verificar si ya está logueado
            window.addEventListener('load', () => {
                const token = localStorage.getItem('token');
                if (token) {
                    window.location.href = '/api/dashboard?token=' + token;
                }
            });
        </script>
    </body>
    </html>
  `);
};

export const login = async (req, res) => {
  const { correo, password } = req.body;

  try {
    console.log('Intento de login para:', correo);
    console.log('Password recibido:', password);

    const usuario = await obtenerUsuarioPorCorreo(correo);
    if (!usuario) {
      console.log('Usuario no encontrado');
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);
    console.log('Resultado de bcrypt.compare:', passwordValido);

    if (!passwordValido) {
      console.log('Contraseña incorrecta');
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol, correo: usuario.correo },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({ mensaje: "Inicio de sesión exitoso", token });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ mensaje: "Error interno", error: err.message });
  }
};

export const logout = (req, res) => {
  // Enviar página HTML que elimina el token y redirige
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cerrando sesión - Terminal Alameda</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                height: 100vh; 
                display: flex; 
                justify-content: center; 
                align-items: center; 
                margin: 0;
                color: white;
                text-align: center;
            }
            .logout-container {
                background: rgba(255, 255, 255, 0.1);
                padding: 40px;
                border-radius: 10px;
                backdrop-filter: blur(10px);
            }
        </style>
    </head>
    <body>
        <div class="logout-container">
            <h1>Cerrando sesión...</h1>
            <p>Serás redirigido al login en unos segundos.</p>
        </div>

        <script>
            // Eliminar token del localStorage
            localStorage.removeItem('token');
            console.log('Token eliminado del localStorage');
            
            // Redirigir al login después de 2 segundos
            setTimeout(() => {
                window.location.href = '/api/auth/login';
            }, 2000);
        </script>
    </body>
    </html>
  `);
};

// Nueva función para logout via API (para llamadas fetch)
export const logoutAPI = (req, res) => {
  res.json({ 
    mensaje: "Sesión cerrada correctamente",
    redirect: "/api/auth/login"
  });
};