
export default function login(div) {
  div.innerHTML = `
    <h1>Login</h1>
    <form id="loginForm">
      <input type="text" name="email" placeholder="Correo" required>
      <input type="password" name="password" placeholder="Contraseña" required>
      <button type="submit">Iniciar Sesión</button>
    </form>
  `;

  document.getElementById("loginForm").addEventListener("submit",  function logoutUser() {
  localStorage.removeItem("currentUser");
  history.pushState({}, "", "/");
  render("/"); // Usamos el render del router para mostrar la página de inicio
});
}
