import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import PasajeroRoutes from "./routes/PasajeroRoutes";

export default function App() {
  return (
    <Router>
      <PasajeroRoutes />
    </Router>
  );
}
