import axios from "../services/Axios.js";
import { useEffect, useState } from "react";
import Auth from "../pages/Auth.jsx";
import Home from "../pages/Home.jsx";
import LoadingCursor from "../utils/loadingCursor.jsx";

export default function CalculateRoutes() {
  const [loadingCount, setLoadingCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await axios.get(import.meta.env.VITE_API_URL + "/auth/me");

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

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use((config) => {
      setLoadingCount((prev) => prev + 1);
      return config;
    });

    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        setLoadingCount((prev) => prev - 1);
        return response;
      },
      (error) => {
        setLoadingCount((prev) => prev - 1);
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  if (isAuthenticated)
    return (
      <>
        <Home onLogOut={() => setIsAuthenticated(false)} />
        <LoadingCursor active={loadingCount > 0} />
      </>
    );

  return (
    <>
      <Auth onLoginSucess={() => setIsAuthenticated(true)} />
      <LoadingCursor active={loadingCount > 0} />
    </>
  );
}
