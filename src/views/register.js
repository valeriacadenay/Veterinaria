export default function register(div) {
  div.innerHTML = `
    <section id="register">
      <h2>Registro</h2>
      <form id="register-form">
        <input type="text" id="nombre" placeholder="Nombre completo" required>
        <input type="text" id="identidad" placeholder="Identidad" required>
        <input type="text" id="telefono" placeholder="Teléfono" required>
        <input type="text" id="direccion" placeholder="Dirección" required>
        <input type="email" id="email" placeholder="Correo electrónico" required>
        <input type="password" id="password" placeholder="Contraseña" required>
        <button type="submit">Registrarse</button>
      </form>
    </section>
  `;

  const $registerForm = document.getElementById("register-form");
  const $nombre = document.getElementById("nombre");
  const $identidad = document.getElementById("identidad");
  const $telefono = document.getElementById("telefono");
  const $direccion = document.getElementById("direccion");
  const $email = document.getElementById("email");
  const $password = document.getElementById("password");

  $registerForm.addEventListener("submit", function(event) {
    event.preventDefault();
    registerUser();
  });

  async function registerUser() {
    let response = await fetch(`http://localhost:3000/users?email=${$email.value}`);
    let data = await response.json();

    if (data.length > 0) {
      alert("Este correo ya está registrado. Inicia sesión.");
    } else {
      // Si no existe, crea el nuevo usuario
      const newUser = {
        nombre: $nombre.value,
        identidad: $identidad.value,
        telefono: $telefono.value,
        direccion: $direccion.value,
        email: $email.value,
        contrasena: $password.value,
        rolId: 2 // ID del rol customer según tu db.json
      };

      let postResponse = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(newUser)
      });

      let createdUser = await postResponse.json();

      alert("Registro exitoso, ahora puedes iniciar sesión.");

      // Redirige a login
      history.pushState({}, "", "/login");
      import("./login.js").then(module => module.default(div));
    }
  }
}
