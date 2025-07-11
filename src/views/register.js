// File: src/views/register.js

import { registerUser } from "../js/auth.js";

export default function register(div) {
  div.innerHTML = `
    <div class="form-container">
      <h1>Registro de Usuario</h1>
      <form id="registerForm">
        <input type="text" name="nombre" placeholder="Nombre completo" required>
        <input type="email" name="email" placeholder="Correo electrónico" required>
        <input type="password" name="password" placeholder="Contraseña" required>
        <select name="roleId" required>
          <option value="" disabled selected>Selecciona tu rol</option>
          <option value="2">Dueño de mascota (Customer)</option>
          <option value="1">Trabajador (Worker)</option>
        </select>
        <button type="submit">Registrarse</button>
      </form>
    </div>
  `;

  document.getElementById("registerForm").addEventListener("submit", registerUser);
}