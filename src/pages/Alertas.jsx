export default function Alertas() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-xl text-center">
        <h2 className="text-3xl font-bold mb-6 text-sky-700">Mis Alertas</h2>
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <p className="text-gray-500">No hay alertas activas.</p>
        </div>
      </div>
    </div>
  );
}
