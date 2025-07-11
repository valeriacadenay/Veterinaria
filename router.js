import landing from "./src/views/landing.js";
import login from "./src/views/login.js";
import register from "./src/views/register.js";
import dashboard from "./src/views/dashboard.js";
import stay from './src/views/stay.js';


const routes = {
   "/": { view: landing, protected: false },
   "/login": { view: login, protected: false },
   "/register": { view: register, protected: false },
   "/dashboard": { view: dashboard, protected: true },
   "/stays": { view: stay, protected: true },

};

const rootDiv = document.getElementById("root");

export function render(path) {
  const route = routes[path];
  if (route) {
    if (route.protected) {
      alert("Acceso denegado. Debes iniciar sesión.");
      history.replaceState({}, "", "/login");
      routes["/login"].view(rootDiv);
    } else {
      route.view(rootDiv);
    }
  } else {
    // notfound(rootDiv);
  }
}

function onNavigate(event) {
  const target = event.target.closest("a[data-link]");
  if (target) {
    event.preventDefault();
    const path = target.getAttribute("href");
    history.pushState({}, "", path);
    render(path);
  }
}

export function initRouter() {
  window.addEventListener("popstate", () => {
    render(window.location.pathname);
  });

  document.body.addEventListener("click", onNavigate);

  render(window.location.pathname);
}
