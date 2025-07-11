export default async function stay(div) {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user || user.rolId !== 1) {
    alert("Acceso denegado. Debes ser un trabajador para ver esta página.");
    history.replaceState({}, "", "/login");
    import("./login.js").then(module => module.default(div));
    return;
  }

  div.innerHTML = `
    <section id="stay-dashboard">
      <h2>Gestión de Estancias</h2>
      <button id="add-stay-btn">Agregar Estancia</button>

      <div id="stay-form-modal" class="modal">
        <div class="modal-content">
          <h3>Registrar Nueva Estancia</h3>
          <form id="stay-form">
            <input type="text" id="pet-id" placeholder="ID de la mascota" required />
            <input type="number" id="valor-dia" placeholder="Valor por día" required min="0" />
            <input type="date" id="ingreso" required title="Fecha de Ingreso"/>
            <input type="date" id="salida" required title="Fecha de Salida"/>
            <input type="text" id="servicios-adicionales" placeholder="Servicios (ej: Baño, Corte)" style="grid-column: 1 / -1;" />
            <label>
              <input type="checkbox" id="completada" />
              Estancia Completada
            </label>
            <div class="form-buttons" style="grid-column: 1 / -1;">
              <button type="submit">Guardar</button>
              <button type="button" id="cancel-stay-form">Cancelar</button>
            </div>
          </form>
        </div>
      </div>

      <div class="stays-container" id="stays-container">Cargando estancias...</div>
    </section>
  `;

  const stayFormModal = div.querySelector("#stay-form-modal");
  const stayForm = div.querySelector("#stay-form");
  const staysContainer = div.querySelector("#stays-container");
  const addStayBtn = div.querySelector("#add-stay-btn");
  const cancelStayFormBtn = div.querySelector("#cancel-stay-form");

  addStayBtn.addEventListener("click", () => {
    stayForm.reset();
    stayFormModal.classList.add("visible");
  });

  cancelStayFormBtn.addEventListener("click", () => {
    stayFormModal.classList.remove("visible");
  });

  async function loadStays() {
    try {
      const response = await fetch("http://localhost:3000/stays");
      const stays = await response.json();
      if (!response.ok) throw new Error("Error al obtener estancias");

      if (stays.length === 0) {
        staysContainer.innerHTML = "<p>No hay estancias registradas.</p>";
        return;
      }

      staysContainer.innerHTML = stays.map(stay => {
        const ingresoDate = new Date(stay.ingreso);
        const salidaDate = new Date(stay.salida);
        const diffTime = Math.abs(salidaDate - ingresoDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
        const valorTotal = diffDays * stay.valorDia;

        return `
          <div class="stay-card ${stay.completada ? 'status-completed' : 'status-active'}">
            <div class="stay-content">
              <p><strong>ID Estancia:</strong> ${stay.id}</p>
              <p><strong>ID Mascota:</strong> ${stay.petId}</p>
              <p><strong>Ingreso:</strong> ${stay.ingreso}</p>
              <p><strong>Salida:</strong> ${stay.salida}</p>
              <p><strong>Servicios:</strong> ${stay.serviciosAdicionales?.join(", ") || "Ninguno"}</p>
              <p><strong>Valor Día:</strong> $${stay.valorDia.toLocaleString()}</p>
              <p class="total-value"><strong>Valor Total: $${valorTotal.toLocaleString()}</strong></p>
            </div>
            <div class="card-footer">
              <button data-id="${stay.id}" class="delete-stay-btn">Eliminar</button>
            </div>
          </div>
        `;
      }).join("");

      staysContainer.addEventListener("click", async (e) => {
          if (e.target.classList.contains('delete-stay-btn')) {
              const stayId = e.target.getAttribute("data-id");
              if (confirm(`¿Estás seguro de que quieres eliminar la estancia con ID ${stayId}?`)) {
                  await fetch(`http://localhost:3000/stays/${stayId}`, { method: "DELETE" });
                  alert("Estancia eliminada");
                  loadStays();
              }
          }
      });

    } catch (error) {
      console.error(error);
      staysContainer.innerHTML = "<p>Error al cargar las estancias. Intenta de nuevo.</p>";
    }
  }

  stayForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const stayData = {
      petId: parseInt(stayForm.querySelector("#pet-id").value),
      ingreso: stayForm.querySelector("#ingreso").value,
      salida: stayForm.querySelector("#salida").value,
      valorDia: parseInt(stayForm.querySelector("#valor-dia").value),
      serviciosAdicionales: stayForm.querySelector("#servicios-adicionales").value.split(",").map(s => s.trim()).filter(Boolean),
      completada: stayForm.querySelector("#completada").checked
    };

    try {
      const response = await fetch("http://localhost:3000/stays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stayData)
      });
      if (!response.ok) throw new Error("Error al registrar la estancia");
      alert("Estancia registrada exitosamente");
      stayForm.reset();
      stayFormModal.classList.remove("visible"); 
      loadStays();
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al registrar la estancia");
    }
  });

  loadStays();
}