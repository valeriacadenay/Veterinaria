
export function renderNav() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  let navLinks = '';


  if (user) {

    if (user.roleId === 2) { 
      navLinks = `
        <a href="/dashboard" data-link>Mis Mascotas</a>
        <a href="/new-stay" data-link>Nueva Estancia</a>
      `;
    }
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
  
  setTimeout(() => {
    const logoutBtn = document.getElementById('logout-btn');
  }, 0);

  return navHTML;
}