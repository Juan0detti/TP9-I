import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Registro() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: "", email: "", contraseña: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.nombre || !form.email || !form.contraseña) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || "Error en el registro");
      }

      alert("Registro exitoso. Inicia sesión.");
      navigate("/login");
    } catch (err) {
      setError("No se pudo registrar el usuario. " + err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-lineal-to-b from-blue-200 to-blue-400">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-80 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-blue-700">
          Iniciar Sesión
        </h2>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <input
          type="Text"
          name="nombre"
          placeholder="Nombre completo"
          value={form.nombre}
          onChange={handleChange}
          className="w-full border rounded-xl p-2"
        />

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          className="w-full border rounded-xl p-2"
        />
        <input
          type="password"
          name="contraseña"
          placeholder="Contraseña"
          value={form.contraseña}
          onChange={handleChange}
          className="w-full border rounded-xl p-2"
        />
          {error && <p className="text-red-600 mb-3">{error}</p>}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded"
          >
            Crear cuenta
          </button>
        </form>
      </div>
  );
}
