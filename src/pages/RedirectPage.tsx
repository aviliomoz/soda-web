import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const RedirectPage = () => {
  const { user, checking } = useAuth(); // Simulacion de auth

  if (!user && !checking) return <Navigate to={"/login"} />;

  return <Navigate to={"/dashboard"} />;
};
