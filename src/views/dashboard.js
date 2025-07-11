import { renderNav } from '../components/nav.js';

export default function dashboard(div) {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) {
    alert("Debes iniciar sesión primero.");
    history.replaceState({}, "", "/login");
    import("./login.js").then(module => module.default(div));
    return;
  }

  // Render según rol
  if (user.rolId === 2) {
    renderCustomerDashboard(div, user);
  } else if (user.rolId === 1) {
    renderWorkerDashboard(div);
  } else {
    div.innerHTML = "<p>Rol no reconocido</p>";
  }
}

async function renderCustomerDashboard(div, user) {
  // Se define el HTML. Nota que el modal tiene la clase "hidden" desde el principio.
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

      <div class="pets-container" id="pets-container"></div>
    </section>
  `;

  // --- Seleccionamos los elementos del DOM ---
  const petFormModal = div.querySelector("#pet-form-modal");
  const petForm = div.querySelector("#pet-form");
  const petsContainer = div.querySelector("#pets-container");
  const addPetBtn = div.querySelector("#add-pet-btn");
  const cancelPetFormBtn = div.querySelector("#cancel-pet-form");
  const formTitle = div.querySelector("#form-title");

  let editingPetId = null;

  // --- Lógica de los Eventos ---

 // Evento para MOSTRAR el modal al hacer clic en "Agregar Mascota"
  addPetBtn.addEventListener("click", () => {
    formTitle.textContent = "Agregar Nueva Mascota";
    petForm.reset();
    editingPetId = null;
    petFormModal.classList.add("visible");
  });

  // Evento para OCULTAR el modal al hacer clic en "Cancelar"
  cancelPetFormBtn.addEventListener("click", () => {
    
    petFormModal.classList.remove("visible");
  });

  // Evento para cerrar el modal si se hace clic en el fondo oscuro
  petFormModal.addEventListener("click", (event) => {
    if (event.target === petFormModal) {
      petFormModal.classList.remove("visible");
    }
  });

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

  loadPets();

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
        response = await fetch(`http://localhost:3000/pets/${editingPetId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(petData)
        });
        if (!response.ok) throw new Error("Error al editar la mascota");
        alert("Mascota actualizada exitosamente");
      } else {
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
      loadPets();

    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al guardar la mascota");
    }
  });

  async function editPet(petId) {
    try {
      const response = await fetch(`http://localhost:3000/pets/${petId}`);
      const pet = await response.json();

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
   const logoutBtn = div.querySelector("#logout-btn");
    logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    alert("Sesión cerrada correctamente");
    history.replaceState({}, "", "/landing");
    import("./landing.js").then(module => module.default(div));
  });
}

// En tu archivo worker-dashboard.js
async function renderWorkerDashboard(div) {
  div.innerHTML = `
    <section id="worker-dashboard">

      <button class="back-btn">&larr; Volver</button>
      
      <h2>Panel del Worker</h2>
      <button id="logout-btn">Cerrar sesión</button>
      <div class="worker-content">
        <h3>Todos los Usuarios</h3>
        <div id="users-container"></div>

        <h3>Todas las Mascotas</h3>
        <div id="pets-container"></div>

        <h3>Todas las Estancias</h3>
        <div id="stays-container"></div>
        <button id="manage-stays-btn">Gestionar Estancias</button>
      </div>
    </section>
  `;

  // --- Seleccionamos los elementos ---
  const usersContainer = div.querySelector("#users-container");
  const petsContainer = div.querySelector("#pets-container");
  const staysContainer = div.querySelector("#stays-container");
  const manageStaysBtn = div.querySelector("#manage-stays-btn");
  const logoutBtn = div.querySelector("#logout-btn");
  
  // --- FUNCIONALIDAD DEL BOTÓN DE VOLVER ---
  const backBtn = div.querySelector(".back-btn");
  backBtn.addEventListener("click", () => {
    history.back(); // Simplemente va a la página anterior en el historial
  });
  
  // El resto de tu código para el dashboard del trabajador va aquí...
  // (Toda la lógica de fetch, delete, edit, etc.)

  // ✅ BOTÓN REDIRECCIONAR A stays.js
  manageStaysBtn.addEventListener("click", () => {
    history.pushState({}, "", "/stays");
    import("./stay.js").then(module => module.default(div));
  });

  try {
    // GET USERS
    const usersRes = await fetch("http://localhost:3000/users");
    const users = await usersRes.json();

    usersContainer.innerHTML = users.map(user => `
      <div class="user-card">
        <p><strong>${user.nombre}</strong></p>
        <p>Email: ${user.email}</p>
        <button data-id="${user.id}" class="delete-user-btn">Eliminar</button>
      </div>
    `).join("");

    // DELETE USER
    usersContainer.addEventListener("click", async (e) => {
        if (e.target.classList.contains('delete-user-btn')) {
            const userId = e.target.getAttribute("data-id");
            if (confirm("¿Eliminar usuario?")) {
                await fetch(`http://localhost:3000/users/${userId}`, { method: "DELETE" });
                alert("Usuario eliminado");
                renderWorkerDashboard(div);
            }
        }
    });


    // GET PETS
    const petsRes = await fetch("http://localhost:3000/pets");
    const pets = await petsRes.json();

    petsContainer.innerHTML = pets.map(pet => `
      <div class="pet-card">
        <p><strong>${pet.nombre}</strong></p>
        <p>Tipo: ${pet.tipo}</p>
        <p>Edad: ${pet.edad} años</p>
        <button data-id="${pet.id}" class="edit-pet-btn">Editar</button>
        <button data-id="${pet.id}" class="delete-pet-btn">Eliminar</button>
      </div>
    `).join("");

    // DELETE & EDIT PET
    petsContainer.addEventListener("click", async (e) => {
        const target = e.target;
        const petId = target.getAttribute("data-id");

        if (target.classList.contains('delete-pet-btn')) {
            if (confirm("¿Eliminar mascota?")) {
                await fetch(`http://localhost:3000/pets/${petId}`, { method: "DELETE" });
                alert("Mascota eliminada");
                renderWorkerDashboard(div);
            }
        }

        if (target.classList.contains('edit-pet-btn')) {
            const newName = prompt("Nuevo nombre de la mascota:");
            if (newName) {
                await fetch(`http://localhost:3000/pets/${petId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nombre: newName })
                });
                alert("Mascota actualizada");
                renderWorkerDashboard(div);
            }
        }
    });

    // LOGOUT BUTTON
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        alert("Sesión cerrada correctamente");
        history.replaceState({}, "", "/");
        // Asumiendo que tienes un login.js para la página principal
        import("./login.js").then(module => module.default(div));
    });

    // GET STAYS
    const staysRes = await fetch("http://localhost:3000/stays");
    const stays = await staysRes.json();

    staysContainer.innerHTML = stays.map(stay => `
      <div class="stay-card">
        <p><strong>ID:</strong> ${stay.id}</p>
        <p>Mascota ID: ${stay.petId}</p>
        <p>Ingreso: ${stay.checkIn}</p>
        <p>Salida: ${stay.checkOut}</p>
        <p>Notas: ${stay.notes || "Sin notas"}</p>
      </div>
    `).join("");

  } catch (error) {
    console.error(error);
  }
}