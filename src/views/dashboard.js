import { renderNav } from '../components/nav.js';

export default function dashboard(div) {
  // GUARDIAN DE AUTENTICACIÓN
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) {
    alert("Debes iniciar sesión primero.");
    history.replaceState({}, "", "/login");
    import("./login.js").then(module => module.default(div));
    return;
  }

  // SI PASA EL GUARDIAN, RENDERIZA DASHBOARD
  div.innerHTML = `
    <section id="dashboard">
      <div class="dashboard-header">
        <h2>Mis Mascotas</h2>
        <div>
          <button id="add-pet-btn">Agregar Mascota</button>
          <button id="logout-btn">Cerrar sesión</button>
        </div>
      </div>

      <div id="pet-form-modal" class="modal hidden">
        <div class="modal-content">
          <h3>Agregar Nueva Mascota</h3>
          <form id="pet-form">
            <input type="text" id="pet-name" placeholder="Nombre de la mascota" required />
            <input type="text" id="pet-type" placeholder="Tipo (Ej: Perro, Gato...)" required />
            <input type="number" id="pet-age" placeholder="Edad (años)" required min="0" />
            <input type="url" id="pet-image" placeholder="URL de imagen (opcional)" />

            <div class="form-buttons">
              <button type="submit">Guardar</button>
              <button type="button" id="cancel-pet-form">Cancelar</button>
            </div>
          </form>
        </div>
      </div>

      <div class="pets-container" id="pets-container">
        <!-- Aquí se insertarán dinámicamente las mascotas -->
      </div>
    </section>
  `
  ;

}
