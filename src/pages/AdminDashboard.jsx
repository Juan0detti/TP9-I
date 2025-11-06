import React, { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [tab, setTab] = useState("aviones");

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Panel de Administración ✈️
      </h1>

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setTab("aviones")}
          className={`px-4 py-2 rounded-xl ${
            tab === "aviones" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Aviones
        </button>
        <button
          onClick={() => setTab("vuelos")}
          className={`px-4 py-2 rounded-xl ${
            tab === "vuelos" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Vuelos
        </button>
        <button
          onClick={() => setTab("alertas")}
          className={`px-4 py-2 rounded-xl ${
            tab === "alertas" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Alertas
        </button>
      </div>

      {tab === "aviones" && <Aviones />}
      {tab === "vuelos" && <Vuelos />}
      {tab === "alertas" && <Alertas />}
    </div>
  );
}

// ---------- FORMULARIO DE AVIONES ----------
function Aviones() {
  const [avion, setAvion] = useState({
    modelo: "",
    capacidad_business: "",
    capacidad_primera: "",
    matricula: "",
  });
  const [aviones, setAviones] = useState([]);

  const handleChange = (e) =>
    setAvion({ ...avion, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:3000/api/v1/avion", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(avion),
    });

    if (res.ok) {
      alert("Avión registrado ✅");
      setAvion({
        modelo: "",
        capacidad_business: "",
        capacidad_primera: "",
        matricula: "",
      });
      fetchAviones();
    } else {
      const data = await res.json();
      alert(`Error: ${data.error || "No se pudo registrar el avión"}`);
    }
  };

  const fetchAviones = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/v1/avion", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      setAviones(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar aviones:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este avión?")) return;

    const res = await fetch(`http://localhost:3000/api/v1/avion/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (res.ok) {
      alert("Avión eliminado 🗑️");
      fetchAviones();
    } else {
      const data = await res.json();
      alert(`Error: ${data.error || "No se pudo eliminar el avión"}`);
    }
  };

  useEffect(() => {
    fetchAviones();
  }, []);

  return (
    <div>
      <h2 className="text-2xl mb-2 font-semibold">Registrar Avión</h2>
      <form onSubmit={handleSubmit} className="grid gap-2 mb-4">
        <input
          name="modelo"
          value={avion.modelo}
          onChange={handleChange}
          placeholder="Modelo"
          className="border p-2 rounded"
        />
        <input
          name="capacidad_business"
          value={avion.capacidad_business}
          onChange={handleChange}
          placeholder="Capacidad Business"
          type="number"
          className="border p-2 rounded"
        />
        <input
          name="capacidad_primera"
          value={avion.capacidad_primera}
          onChange={handleChange}
          placeholder="Capacidad Primera"
          type="number"
          className="border p-2 rounded"
        />
        <input
          name="matricula"
          value={avion.matricula}
          onChange={handleChange}
          placeholder="Matrícula"
          className="border p-2 rounded"
        />
        <button className="bg-blue-500 text-white p-2 rounded">
          Registrar
        </button>
      </form>

      <h3 className="text-lg font-semibold mb-2">Aviones registrados:</h3>
      <ul className="border rounded p-3 bg-gray-50">
        {aviones.map((a) => (
          <li
            key={a.id}
            className="border-b py-2 flex justify-between items-center"
          >
            <span>
              ✈️ <strong>{a.modelo}</strong> — Business: {a.capacidad_business}{" "}
              | Primera: {a.capacidad_primera} | Matrícula: {a.matricula}
            </span>
            <button
              onClick={() => handleDelete(a.id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ... (código anterior)

// ---------- FORMULARIO DE VUELOS ----------
function Vuelos() {
  const [vuelos, setVuelos] = useState([]);
  const [aviones, setAviones] = useState([]);

  const estadosDisponibles = [
    "Programado",
    "En curso",
    "Atrasado",
    "Cancelado",
    "Completado",
  ];

  const [vuelo, setVuelo] = useState({
    origen: "",
    destino: "",
    fecha_salida: "",
    fecha_llegada: "",
    precio: "",
    avionID: "",
    // ⬅️ VALOR POR DEFECTO ACTUALIZADO
    estado: "Programado",
  });

  const token = localStorage.getItem("token");

  const handleChange = (e) =>
    setVuelo({ ...vuelo, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(vuelo);

    const res = await fetch("http://localhost:3000/api/v1/vuelos", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vuelo),
    });

    if (res.ok) {
      alert("Vuelo registrado ✅");
      setVuelo({
        origen: "",
        destino: "",
        fecha_salida: "",
        fecha_llegada: "",
        precio: "",
        avionID: "",
        estado: "Programado",
      });
      fetchVuelos();
    } else {
      const data = await res.json();
      alert(`Error: ${data.error || "No se pudo registrar el vuelo"}`);
    }
  };

  // ✅ FUNCIÓN PARA ELIMINAR VUELO (DELETE)
  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres ELIMINAR este vuelo?"))
      return;

    const res = await fetch(`http://localhost:3000/api/v1/vuelos/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      alert("Vuelo eliminado 🗑️");
      fetchVuelos();
    } else {
      const data = await res.json();
      alert(`Error al eliminar: ${data.error || "Fallo en el servidor."}`);
    }
  };

  // ✅ FUNCIÓN PARA CAMBIAR EL ESTADO (PUT)
  const handleStatusChange = async (id, newStatus) => {
    // Validar si el estado realmente cambió
    if (!newStatus) return;

    const res = await fetch(`http://localhost:3000/api/v1/vuelos/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ estado: newStatus }), // Enviamos el nuevo estado
    });

    if (res.ok) {
      alert(`Estado del vuelo ${id} cambiado a ${newStatus}!`);
      fetchVuelos(); // Recarga la lista
    } else {
      const data = await res.json();
      alert(
        `Error al cambiar estado: ${data.error || "Fallo en el servidor."}`
      );
    }
  };

  const fetchVuelos = async () => {
    const res = await fetch("http://localhost:3000/api/v1/vuelos", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setVuelos(Array.isArray(data) ? data : []);
  };

  const fetchAviones = async () => {
    const res = await fetch("http://localhost:3000/api/v1/avion", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setAviones(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchAviones();
    fetchVuelos();
  }, []);

  return (
    <div>
      <h2 className="text-2xl mb-2 font-semibold">Registrar Vuelo</h2>
      <form onSubmit={handleSubmit} className="grid gap-2 mb-4">
        {/* ... (Inputs de Origen, Destino, Fechas, Precio) ... */}
        <input
          name="origen"
          value={vuelo.origen}
          onChange={handleChange}
          placeholder="Origen"
          className="border p-2 rounded"
        />
        <input
          name="destino"
          value={vuelo.destino}
          onChange={handleChange}
          placeholder="Destino"
          className="border p-2 rounded"
        />
        <label className="text-sm font-semibold mt-2">Fecha de salida:</label>
        <input
          name="fecha_salida"
          value={vuelo.fecha_salida}
          onChange={handleChange}
          type="datetime-local"
          className="border p-2 rounded"
        />
        <label className="text-sm font-semibold mt-2">Fecha de llegada:</label>
        <input
          name="fecha_llegada"
          value={vuelo.fecha_llegada}
          onChange={handleChange}
          type="datetime-local"
          className="border p-2 rounded"
        />
        <input
          name="precio"
          value={vuelo.precio}
          onChange={handleChange}
          placeholder="Precio"
          type="number"
          className="border p-2 rounded"
        />
        {/* ... (Select de Avión) ... */}
        <select
          name="avionID"
          value={vuelo.avionID}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Seleccionar avión</option>
          {aviones.map((a) => (
            <option key={a.id} value={a.id}>
              {a.modelo} - {a.matricula}
            </option>
          ))}
        </select>
        <button className="bg-blue-500 text-white p-2 rounded">
          Registrar
        </button>
      </form>

      <h3 className="text-lg font-semibold mb-2">Vuelos registrados:</h3>

      <div className="overflow-x-auto border rounded bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ruta
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fechas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avión/Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {vuelos.map((v) => (
              <tr key={v.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {v.origen} → {v.destino}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(v.fecha_salida).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Avión: {v.avionID} | ${v.precio}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {/* ⬅️ SELECT para cambiar estado usando los valores ENUM */}
                  <select
                    value={v.estado || "Programado"}
                    onChange={(e) => handleStatusChange(v.id, e.target.value)}
                    className={`p-1 rounded border ${
                      v.estado === "Cancelado"
                        ? "bg-red-100 text-red-700 border-red-300"
                        : v.estado === "Completado"
                        ? "bg-green-100 text-green-700 border-green-300"
                        : "bg-yellow-100 text-yellow-700 border-yellow-300"
                    }`}
                  >
                    {estadosDisponibles.map((estado) => (
                      <option key={estado} value={estado}>
                        {estado}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {/* ⬅️ Botón Eliminar */}
                  <button
                    onClick={() => handleDelete(v.id)}
                    className="text-red-600 hover:text-red-900 ml-4 p-1"
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- FORMULARIO DE ALERTAS ----------
function Alertas() {
  const [alertas, setAlertas] = useState([]);
  const [alerta, setAlerta] = useState({ mensaje: "", tipo: "" });

  const handleChange = (e) =>
    setAlerta({ ...alerta, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:3000/api/v1/alertas/admin", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(alerta),
    });
    if (res.ok) {
      alert("Alerta creada ⚠️");
      setAlerta({ mensaje: "", tipo: "" });
      fetchAlertas();
    }
  };

  const fetchAlertas = async () => {
    const res = await fetch("http://localhost:3000/api/v1/alertas/recientes");
    const data = await res.json();
    setAlertas(data);
  };

  useEffect(() => {
    fetchAlertas();
  }, []);

  return (
    <div>
      <h2 className="text-2xl mb-2 font-semibold">Crear Alerta</h2>
      <form onSubmit={handleSubmit} className="grid gap-2 mb-4">
        <input
          name="mensaje"
          value={alerta.mensaje}
          onChange={handleChange}
          placeholder="Mensaje"
          className="border p-2 rounded"
        />
        <select
          name="tipo"
          value={alerta.tipo}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Seleccionar tipo</option>
          <option value="informativa">Informativa</option>
          <option value="urgente">Urgente</option>
        </select>
        <button className="bg-blue-500 text-white p-2 rounded">Crear</button>
      </form>

      <h3 className="text-lg font-semibold mb-2">Alertas activas:</h3>
      <ul className="border rounded p-3 bg-gray-50">
        {alertas.map((a) => (
          <li key={a.id} className="border-b py-1">
            [{a.tipo.toUpperCase()}] {a.mensaje}
          </li>
        ))}
      </ul>
    </div>
  );
}
