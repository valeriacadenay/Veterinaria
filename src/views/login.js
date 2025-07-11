export default function login(div) {
  div.innerHTML = `
    <section id="login">
      <h2>Iniciar Sesión</h2>
      <form id="login-form">
        <input type="email" id="email" placeholder="Correo electrónico" required>
        <input type="password" id="password" placeholder="Contraseña" required>
        <button type="submit">Ingresar</button>
      </form>
    </section>
  `;

  const $loginForm = document.getElementById("login-form");
  const $email = document.getElementById("email");
  const $password = document.getElementById("password");

  $loginForm.addEventListener("submit", function(event) {
    event.preventDefault();
    loginUser();
  });

  async function loginUser() {
    let response = await fetch(`http://localhost:3000/users?email=${$email.value}`);
    let data = await response.json();

    if (data.length == 0) {
      alert("Ese correo no existe, regístrate primero.");
    } else {
      if (data[0].contrasena === $password.value) { // Usa el campo correcto de tu db.json
        alert("Login exitoso");
        localStorage.setItem("currentUser", JSON.stringify(data[0]));
        history.pushState({}, "", "/dashboard");
        import("./dashboard.js").then(module => module.default(div));
      } else {
        alert("Contraseña incorrecta");
      }
    }
  }
}
