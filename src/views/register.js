export default function register(div) {
  document.body.className = 'form-page-layout';

  div.innerHTML = `
    <section id="register">
      <h2>Crear una Cuenta</h2>
      <form id="register-form">

        <div class="input-group">
          <i class="fas fa-user"></i>
          <input type="text" id="nombre" placeholder="Nombre completo" required>
        </div>

        <div class="input-group">
          <i class="fas fa-id-card"></i>
          <input type="text" id="identidad" placeholder="Documento de Identidad" required>
        </div>

        <div class="input-group">
          <i class="fas fa-phone"></i>
          <input type="tel" id="telefono" placeholder="Teléfono" required>
        </div>

        <div class="input-group">
          <i class="fas fa-map-marker-alt"></i>
          <input type="text" id="direccion" placeholder="Dirección" required>
        </div>

        <div class="input-group">
          <i class="fas fa-envelope"></i>
          <input type="email" id="email" placeholder="Correo electrónico" required>
        </div>

        <div class="input-group">
          <i class="fas fa-lock"></i>
          <input type="password" id="password" placeholder="Contraseña" required>
        </div>

        <button type="submit">Registrarse</button>
      </form>

      <p class="login-link">
        ¿Ya tienes una cuenta? <a href="/login" id="go-to-login">Inicia Sesión</a>
      </p>

    </section>
  `;

  // --- Lógica del formulario (la tuya ya es correcta, solo la incluimos) ---

  const $registerForm = document.getElementById("register-form");
  const $nombre = document.getElementById("nombre");
  const $identidad = document.getElementById("identidad");
  const $telefono = document.getElementById("telefono");
  const $direccion = document.getElementById("direccion");
  const $email = document.getElementById("email");
  const $password = document.getElementById("password");

  // Listener para el enlace "Inicia Sesión"
  const $loginLink = document.getElementById("go-to-login");
  $loginLink.addEventListener("click", (e) => {
      e.preventDefault();
      history.pushState({}, "", "/login");
      // Limpiamos la clase del body antes de ir a otra página
      document.body.className = '';
      import("./login.js").then(module => module.default(div));
  });


  $registerForm.addEventListener("submit", function(event) {
    event.preventDefault();
    registerUser();
  });

  async function registerUser() {
    try {
        let response = await fetch(`http://localhost:3000/users?email=${$email.value}`);
        let data = await response.json();

        if (data.length > 0) {
            alert("Este correo ya está registrado. Inicia sesión.");
        } else {
            const newUser = {
                nombre: $nombre.value,
                identidad: $identidad.value,
                telefono: $telefono.value,
                direccion: $direccion.value,
                email: $email.value,
                contrasena: $password.value,
                rolId: 2 // Rol de cliente
            };

            let postResponse = await fetch("http://localhost:3000/users", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(newUser)
            });

            if (!postResponse.ok) {
                throw new Error('No se pudo completar el registro.');
            }

            alert("Registro exitoso, ahora puedes iniciar sesión.");

            history.pushState({}, "", "/login");
            document.body.className = ''; // Limpiar clase del body
            import("./login.js").then(module => module.default(div));
        }
    } catch (error) {
        console.error("Error en el registro:", error);
        alert("Ocurrió un error. Por favor, intenta de nuevo.");
    }
  }
}