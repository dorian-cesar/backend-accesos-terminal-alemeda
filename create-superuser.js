// create-superuser.js
import dotenv from "dotenv";
import { 
  obtenerUsuarioPorCorreo, 
  crearUsuario, 
  actualizarPasswordUsuario 
} from "./models/user.model.js";

dotenv.config();

async function createSuperUser() {
  try {
    const correo = "super@usuario.cl";
    const passwordPlano = "wit123";
    
    console.log("=== CREANDO/ACTUALIZANDO SUPER USUARIO ===");
    console.log("Correo:", correo);
    console.log("Password:", passwordPlano);
    
    // Verificar si el usuario ya existe
    const usuarioExistente = await obtenerUsuarioPorCorreo(correo);
    
    if (usuarioExistente) {
      console.log("✅ Usuario encontrado. Actualizando contraseña...");
      
      await actualizarPasswordUsuario(usuarioExistente.id, passwordPlano);
      console.log("🎉 Contraseña actualizada correctamente");
      
    } else {
      console.log("📝 Creando nuevo usuario...");
      
      const nuevoUsuario = {
        nombre: "Super Usuario",
        correo: correo,
        password: passwordPlano,
        rol: "superadmin"
      };
      
      const userId = await crearUsuario(nuevoUsuario);
      console.log("🎉 Usuario creado correctamente con ID:", userId);
    }
    
    console.log("\n✅ Proceso completado!");
    console.log("Ahora puedes iniciar sesión con:");
    console.log("Correo: super@usuario.cl");
    console.log("Password: wit123");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    process.exit();
  }
}

// Ejecutar el script
createSuperUser();