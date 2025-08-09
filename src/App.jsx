import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Routes, Route } from "react-router-dom";
import CalculateRoutes from "./services/CalculateRoutes.jsx";

export default function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000, // duração da animação
      once: true, // anima só uma vez (true) ou toda vez que aparecer (false)
    });
  }, []);

  return (
    <Routes>
      <Route path="/" element={<CalculateRoutes />} />
    </Routes>
  );
}
