// File: src/js/auth.js
import { render } from "/router.js";
import { api } from "./api.js"; // Importamos la API

// ... (loginUser, logoutUser, isAuthenticated)



export function registerUser(e) {
  e.preventDefault();
  const userData = {
    nombre: e.target.nombre.value,
    email: e.target.email.value,
    contrasena: e.target.password.value,
    // El valor del select es un string, lo convertimos a número
    roleId: parseInt(e.target.roleId.value) 
  };

  // Usamos el método post de nuestra api.js
  api.post("users", userData)
    .then(() => {
      alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
      history.pushState({}, "", "/login");
      render("/login");
    })
    .catch(error => {
      console.error("Error en el registro:", error);
      alert("Hubo un error durante el registro. Inténtalo de nuevo.");
    });
}
