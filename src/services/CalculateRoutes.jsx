import axios from "axios";
import { useEffect, useState } from "react";
import Auth from "../pages/Auth.jsx";
import Home from "../pages/Home.jsx";

export default function CalculateRoutes() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await axios.get(import.meta.env.VITE_API_URL + "/auth/me", {
          withCredentials: true,
        });

        if (res.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    }

    checkAuth();
  }, []);

  if (isAuthenticated) return <Home onLogOut={() => setIsAuthenticated(false)} />;

  return <Auth onLoginSucess={() => setIsAuthenticated(true)} />;
}
