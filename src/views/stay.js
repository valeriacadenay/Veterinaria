export default async function stay(div) {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) {
    alert("Debes iniciar sesión primero.");
    history.replaceState({}, "", "/login");
    import("./login.js").then(module => module.default(div));
    return;
  }

  // Solo workers pueden ver esta vista
  if (user.rolId !== 1) {
    alert("No tienes permisos para acceder a esta página.");
    history.replaceState({}, "", "/dashboard");
    import("./dashboard.js").then(module => module.default(div));
    return;
  }

  // Render base
  div.innerHTML = `
    <section id="stay-dashboard">
      <h2>Gestión de Estancias</h2>
      <button id="add-stay-btn">Agregar Estancia</button>

      <div id="stay-form-modal" class="modal hidden">
        <div class="modal-content">
          <h3>Registrar Nueva Estancia</h3>
          <form id="stay-form">
            <input type="number" id="pet-id" placeholder="ID de la mascota" required />
            <input type="date" id="ingreso" required />
            <input type="date" id="salida" required />
            <input type="number" id="valor-dia" placeholder="Valor por día" required min="0" />
            <input type="text" id="servicios-adicionales" placeholder="Servicios adicionales (separados por coma)" />
            <label>
              <input type="checkbox" id="completada" /> Completada
            </label>

            <div class="form-buttons">
              <button type="submit">Guardar</button>
              <button type="button" id="cancel-stay-form">Cancelar</button>
            </div>
          </form>
        </div>
      </div>

      <div class="stays-container" id="stays-container"></div>
    </section>
  `;

  const stayFormModal = div.querySelector("#stay-form-modal");
  const stayForm = div.querySelector("#stay-form");
  const staysContainer = div.querySelector("#stays-container");
  const addStayBtn = div.querySelector("#add-stay-btn");
  const cancelStayFormBtn = div.querySelector("#cancel-stay-form");

  // Mostrar modal
  addStayBtn.addEventListener("click", () => {
    stayForm.reset();
    stayFormModal.classList.remove("hidden");
  });

  cancelStayFormBtn.addEventListener("click", () => {
    stayFormModal.classList.add("hidden");
  });

  // Cargar estancias
  async function loadStays() {
    try {
      const response = await fetch("http://localhost:3000/stays");
      const stays = await response.json();

      staysContainer.innerHTML = stays.map(stay => {
        const ingresoDate = new Date(stay.ingreso);
        const salidaDate = new Date(stay.salida);
        const diffTime = Math.abs(salidaDate - ingresoDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 para incluir ambos días
        const valorTotal = diffDays * stay.valorDia;

        return `
          <div class="stay-card">
            <p><strong>ID:</strong> ${stay.id}</p>
            <p>Mascota ID: ${stay.petId}</p>
            <p>Ingreso: ${stay.ingreso}</p>
            <p>Salida: ${stay.salida}</p>
            <p>Servicios Adicionales: ${stay.serviciosAdicionales.join(", ")}</p>
            <p>Valor Día: $${stay.valorDia}</p>
            <p><strong>Valor Total: $${valorTotal.toLocaleString()}</strong></p>
            <p>Completada: ${stay.completada ? "Sí" : "No"}</p>
            <button data-id="${stay.id}" class="delete-stay-btn">Eliminar</button>
          </div>
        `;
      }).join("");

      // DELETE stay
      const deleteBtns = staysContainer.querySelectorAll(".delete-stay-btn");
      deleteBtns.forEach(btn => {
        btn.addEventListener("click", async (e) => {
          const stayId = e.target.getAttribute("data-id");
          if (confirm("¿Eliminar estancia?")) {
            await fetch(`http://localhost:3000/stays/${stayId}`, { method: "DELETE" });
            alert("Estancia eliminada");
            loadStays();
          }
        });
      });

    } catch (error) {
      console.error(error);
      alert("Error al cargar estancias");
    }
  }

  loadStays();

  // SUBMIT stay form
  stayForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const petId = parseInt(stayForm.querySelector("#pet-id").value.trim());
    const ingreso = stayForm.querySelector("#ingreso").value;
    const salida = stayForm.querySelector("#salida").value;
    const valorDia = parseInt(stayForm.querySelector("#valor-dia").value.trim());
    const serviciosAdicionales = stayForm.querySelector("#servicios-adicionales").value.split(",").map(s => s.trim()).filter(Boolean);
    const completada = stayForm.querySelector("#completada").checked;

    const stayData = {
      petId,
      ingreso,
      salida,
      valorDia,
      serviciosAdicionales,
      completada
    };

    try {
      const response = await fetch("http://localhost:3000/stays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stayData)
      });
      if (!response.ok) throw new Error("Error al registrar estancia");

      alert("Estancia registrada exitosamente");
      stayForm.reset();
      stayFormModal.classList.add("hidden");
      loadStays();

    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al registrar la estancia");
    }
  });
}
