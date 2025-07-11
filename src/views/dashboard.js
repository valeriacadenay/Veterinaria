import { renderNav } from '../components/nav.js';

export default function dashboard(div) {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  // Redirección si no está autenticado
  if (!user) {
    history.pushState({}, "", "/login");
    import("./login.js").then(module => module.default(div));
    return;
  }

  // Contenido del dashboard basado en el rol
  const dashboardContent = user.roleId === 1 
    ? `<h2>Panel de Trabajador</h2><p>Bienvenido, ${user.nombre}.</p>`
    : `<h2>Panel de Cliente</h2><p>Bienvenido, ${user.nombre}.</p>`;

  // Renderiza la navegación y luego el contenido específico de la página
  div.innerHTML = `
    ${renderNav()} 
    <div class="dashboard-container">
      <h1>Dashboard</h1>
      ${dashboardContent}
    </div>
  `;
}