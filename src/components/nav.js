
export function renderNav() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  let navLinks = '';

  // Si el usuario está logueado
  if (user) {
    // Links para un cliente
    if (user.roleId === 2) { 
      navLinks = `
        <a href="/dashboard" data-link>Mis Mascotas</a>
        <a href="/new-stay" data-link>Nueva Estancia</a>
      `;
    }
    // Links para un trabajador
    if (user.roleId === 1) {
      navLinks = `
        <a href="/dashboard" data-link>Ver Estancias</a>
        <a href="/customers" data-link>Clientes</a>
      `;
    }
  }

  const navHTML = `
    <nav class="main-nav">
      <a href="/" data-link class="logo">🐾 PetCare</a>
      <div class="nav-links">
        ${navLinks}
      </div>
      <button id="logout-btn" class="${user ? 'visible' : 'hidden'}">Cerrar Sesión</button>
    </nav>
  `;
  
  // Añadimos el listener para el botón de logout aquí
  // Usamos un timeout para asegurar que el botón exista en el DOM
  setTimeout(() => {
    const logoutBtn = document.getElementById('logout-btn');
    // if (logoutBtn) {
    //   logoutBtn.addEventListener('click', logoutUser);
    // }
  }, 0);

  return navHTML;
}