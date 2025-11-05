import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Dashboard from "../pages/Dashboard";
import MisVuelos from "../pages/MisVuelos";
import Itinerarios from "../pages/Itinerarios";
import Alertas from "../pages/Alertas";
import Destinos from "../pages/Destinos";
import Perfil from "../pages/Perfil";
import Login from "../pages/Login";
import Registro from "../pages/Registro";
import AdminDashboard from "../pages/AdminDashboard";
import ComprarPasajes from "../pages/comprar-pasajes";

export default function PasajeroRoutes() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar fijo a la izquierda */}
      <Sidebar />

      {/* Contenedor principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registro />} />
            <Route path="/pasajero/dashboard" element={<Dashboard />} />
            <Route path="/pasajero/vuelos" element={<MisVuelos />} />
            <Route path="/pasajero/itinerarios" element={<Itinerarios />} />
            <Route path="/pasajero/alertas" element={<Alertas />} />
            <Route path="/pasajero/destinos" element={<Destinos />} />
            <Route path="/pasajero/perfil" element={<Perfil />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<Navigate to="/pasajero/dashboard" />} />
            <Route
              path="/comprar-pasajes/:vueloId"
              element={<ComprarPasajes />}
            />
          </Routes>
        </div>
      </main>
    </div>
  );
}
