import { alertError, alertSuccess } from "../js/alert.js";

// En tu archivo login.js
export default function login(div) {
  // --- GUARDIA DE LOGIN AÑADIDO ---
  // Antes de mostrar nada, revisamos si ya hay un usuario logueado.
  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (user) {
    // Si hay un usuario, comprobamos su rol y lo redirigimos a su dashboard.
    alert("Ya tienes una sesión activa. Redirigiendo a tu panel...");
    if (user.rolId === 1) { // Es un Worker
      history.replaceState({}, "", "/dashboard");
      import("./dashboard.js").then(module => module.default(div, user));
    } else { // Es un Customer
      history.replaceState({}, "", "/dashboard");
      import("./dashboard.js").then(module => module.default(div, user));
    }
    return; // Detenemos la ejecución para no mostrar el formulario de login.
  }
  // --- FIN DEL GUARDIA ---


  // Si no hay ningún usuario logueado, entonces sí mostramos el formulario.
  // (El resto de tu código de login.js sigue aquí)
  div.innerHTML = `
    <div class="login-page-container">
      <section id="login">
        <h2>Iniciar Sesión</h2>
        <form id="login-form">
          <div class="input-group">
            <label for="email">Correo electrónico</label>
            <input type="email" id="email" required>
          </div>
          <div class="input-group">
            <label for="password">Contraseña</label>
            <input type="password" id="password" required>
          </div>
          <button type="submit">Ingresar</button>
        </form>
      </section>
    </div>
  `;

  const $loginForm = document.getElementById("login-form");
  const $email = document.getElementById("email");
  const $password = document.getElementById("password");

  $loginForm.addEventListener("submit", function(event) {
    event.preventDefault();
    loginUser();
  });

  async function loginUser() {
    try {
      let response = await fetch(`http://localhost:3000/users?email=${$email.value}`);
      let data = await response.json();

      if (data.length === 0) {
        alertError("Ese correo no existe, regístrate primero.");
      } else {
        const foundUser = data[0];
        if (foundUser.contrasena === $password.value) {
          alertSuccess("Login exitoso");
          localStorage.setItem("currentUser", JSON.stringify(foundUser));

          // Redirección basada en el rol
          if (foundUser.rolId === 1) {
            history.replaceState({}, "", "/dashboard");
            import("./dashboard.js").then(module => module.default(div, foundUser));
          } else {
            history.replaceState({}, "", "/dashboard");
            import("./dashboard.js").then(module => module.default(div, foundUser));
          }
        } else {
          alertError("Contraseña incorrecta");
        }
      }
    } catch (error) {
      console.error("Error al intentar iniciar sesión:", error);
    }
  }
}