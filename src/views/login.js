export default function login(div) {
  // Ya no necesitamos tocar el body. La magia ocurre en el CSS
  // con la clase ".login-page-container".

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

  // --- Lógica del formulario ---

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
            alert("Ese correo no existe, regístrate primero.");
        } else {
            // Asumiendo que tu campo de contraseña en db.json es "contrasena"
            if (data[0].contrasena === $password.value) { 
                alert("Login exitoso");
                localStorage.setItem("currentUser", JSON.stringify(data[0]));
                
                // Navegación a la siguiente ruta
                history.pushState({}, "", "/dashboard");
                import("./dashboard.js").then(module => module.default(div));
            } else {
                alert("Contraseña incorrecta");
            }
        }
    } catch (error) {
        console.error("Error al intentar iniciar sesión:", error);
        alert("Hubo un problema al conectar con el servidor.");
    }
  }
}