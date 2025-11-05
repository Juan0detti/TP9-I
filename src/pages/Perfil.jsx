import React, { useState } from "react";

export default function Perfil() {
  const [form, setForm] = useState({
    nombre: "Nacho Odetti",
    email: "nacho@example.com",
    idioma: "Español",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Perfil actualizado");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Mi Perfil</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-4 max-w-md"
      >
        <div>
          <label className="block font-semibold">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block font-semibold">Idioma</label>
          <select
            name="idioma"
            value={form.idioma}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option>Español</option>
            <option>Inglés</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700"
        >
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
