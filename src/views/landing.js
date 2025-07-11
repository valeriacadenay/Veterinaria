export default function landing() {
  document.getElementById("root").innerHTML = `
    <section id="landing">
      <header class="landing-header">
        <h1>🐾 PetCare Center</h1>
        <nav>
          <button id="go-login">Iniciar sesión</button>
          <button id="go-register">Registrarse</button>
        </nav>
      </header>
      <main class="landing-main">
        <section class="landing-text">
          <h2>Tu mascota merece vacaciones también</h2>
          <p>En <strong>PetCare Center</strong> cuidamos de tu peludo amigo...</p>
          <div class="landing-cta">
            <button id="cta-login">Ya tengo cuenta</button>
            <button id="cta-register">Quiero registrarme</button>
          </div>
        </section>
        <div class="landing-image">
          <img src="https://cdn.pixabay.com/photo/2017/09/25/13/12/dog-2785074_1280.jpg" alt="Perro feliz en cuidado" />
        </div>
      </main>
      <footer class="landing-footer">
        <p>&copy; 2025 PetCare Center. Todos los derechos reservados.</p>
      </footer>
    </section>
  `;

  // Eventos para redirigir SPA sin recarga
  document.getElementById("go-login").addEventListener("click", () => {
    history.pushState({}, "", "/login");
    import("../views/login.js").then(module => module.default(  document.getElementById("root")));
  });

  document.getElementById("go-register").addEventListener("click", () => {
    history.pushState({}, "", "/register");
    import("../views/register.js").then(module => module.default(  document.getElementById("root")));
  });

  document.getElementById("cta-login").addEventListener("click", () => {
    history.pushState({}, "", "/login");
    import("../views/login.js").then(module => module.default(  document.getElementById("root")));
  });

  document.getElementById("cta-register").addEventListener("click", () => {
    history.pushState({}, "", "/register");
    import("../views/register.js").then(module => module.default(  document.getElementById("root")));
  });
}

