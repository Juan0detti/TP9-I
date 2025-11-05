import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", contraseña: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error en el login");

      // Guardar token y usuario
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data));

      // Redirigir según el rol
      if (data.rol === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Error en el login:", err);
      setError("Correo o contraseña incorrectos.");
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

        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded-xl p-2 hover:bg-blue-700 transition"
        >
          Entrar
        </button>

        <p className="text-sm text-center">
          ¿No tienes cuenta?{" "}
          <span
            onClick={() => navigate("/registro")}
            className="text-blue-700 font-semibold cursor-pointer hover:underline"
          >
            Regístrate
          </span>
        </p>
      </form>
    </div>
  );
}
