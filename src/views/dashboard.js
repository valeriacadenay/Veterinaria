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

  // RENDERIZA DASHBOARD
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
          <h3 id="form-title">Agregar Nueva Mascota</h3>
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
  `;

  const petFormModal = div.querySelector("#pet-form-modal");
  const petForm = div.querySelector("#pet-form");
  const petsContainer = div.querySelector("#pets-container");
  const addPetBtn = div.querySelector("#add-pet-btn");
  const cancelPetFormBtn = div.querySelector("#cancel-pet-form");
  const formTitle = div.querySelector("#form-title");

  let editingPetId = null;

  // Mostrar formulario para agregar nueva mascota
  addPetBtn.addEventListener("click", () => {
    formTitle.textContent = "Agregar Nueva Mascota";
    petForm.reset();
    editingPetId = null;
    petFormModal.classList.remove("hidden");
  });

  // Cancelar formulario
  cancelPetFormBtn.addEventListener("click", () => {
    petFormModal.classList.add("hidden");
  });

  // Obtener mascotas del usuario (GET)
  async function loadPets() {
    try {
      const response = await fetch(`http://localhost:3000/pets?ownerId=${user.id}`);
      const pets = await response.json();

      petsContainer.innerHTML = pets.map(pet => `
        <div class="pet-card">
          <img src="${pet.image || 'https://via.placeholder.com/150'}" alt="${pet.nombre}">
          <h3>${pet.nombre}</h3>
          <p>Tipo: ${pet.tipo}</p>
          <p>Edad: ${pet.edad} años</p>
          <button data-id="${pet.id}" class="edit-btn">Editar</button>
        </div>
      `).join("");

      // Agregar evento a botones de editar
      const editButtons = petsContainer.querySelectorAll(".edit-btn");
      editButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
          const petId = e.target.getAttribute("data-id");
          editPet(petId);
        });
      });

    } catch (error) {
      console.error(error);
      alert("Error al cargar mascotas");
    }
  }

  loadPets(); // Cargar mascotas al iniciar

  // Agregar o editar mascota
  petForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = petForm.querySelector("#pet-name").value.trim();
    const type = petForm.querySelector("#pet-type").value.trim();
    const age = parseInt(petForm.querySelector("#pet-age").value.trim());
    const image = petForm.querySelector("#pet-image").value.trim();

    const petData = {
      nombre: name,
      tipo: type,
      edad: age,
      image: image || null,
      ownerId: user.id
    };

    try {
      let response;

      if (editingPetId) {
        // PATCH si estamos editando
        response = await fetch(`http://localhost:3000/pets/${editingPetId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(petData)
        });
        if (!response.ok) throw new Error("Error al editar la mascota");
        alert("Mascota actualizada exitosamente");
      } else {
        // POST si es nueva mascota
        response = await fetch("http://localhost:3000/pets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(petData)
        });
        if (!response.ok) throw new Error("Error al registrar la mascota");
        alert("Mascota registrada exitosamente");
      }

      petForm.reset();
      petFormModal.classList.add("hidden");
      loadPets(); // ✅ Actualiza lista sin recargar página

    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al guardar la mascota");
    }
  });

  // Función para editar mascota
  async function editPet(petId) {
    try {
      const response = await fetch(`http://localhost:3000/pets/${petId}`);
      const pet = await response.json();

      // Llena el formulario con datos existentes
      petForm.querySelector("#pet-name").value = pet.nombre;
      petForm.querySelector("#pet-type").value = pet.tipo;
      petForm.querySelector("#pet-age").value = pet.edad;
      petForm.querySelector("#pet-image").value = pet.image || "";

      formTitle.textContent = "Editar Mascota";
      editingPetId = petId;
      petFormModal.classList.remove("hidden");

    } catch (error) {
      console.error(error);
      alert("Error al cargar datos de la mascota");
    }
  }
}


