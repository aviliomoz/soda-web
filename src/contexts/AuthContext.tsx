import { createContext, useContext, useEffect, useState } from "react";
import { ApiResponse, AuthResponse } from "../utils/types";
import { User } from "../schemas/user.schema";
import { api } from "../lib/axios";

type AuthContextType = {
  loading: boolean;
  checking: boolean;
  user: User | null;
  accessToken: string | null;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);

  const checkAuth = async () => {

    if (user) return

    setChecking(true);

    try {
      const { data } = await api.get<ApiResponse<AuthResponse>>("/auth/check");

      if (data.ok && data.data) {
        setUser(data.data.user);
        setAccessToken(data.data.accessToken);
      } else if (data.error || !data.data) {
        setUser(null);
        setAccessToken(null);
        throw new Error(data.error)
      }
    } catch (error) {
      throw new Error((error as Error).message)
    } finally {
      setChecking(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);

    try {
      const { data } = await api.post<ApiResponse<AuthResponse>>("/auth/login", { email, password });

      if (data.ok && data.data) {
        setUser(data.data.user);
        setAccessToken(data.data.accessToken);
      } else if (data.error || !data.data) {
        setUser(null);
        setAccessToken(null);
        throw new Error(data.error)
      }
    } catch (error) {
      throw new Error((error as Error).message)
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {

    setLoading(true);

    try {

      const { data } = await api.get<ApiResponse<undefined>>("/auth/logout")

      if (data.ok && data.data) {
        setUser(null);
        setAccessToken(null);
      } else if (data.error || !data.data) {
        setUser(null);
        setAccessToken(null);
      }
    } catch (error) {
      throw new Error((error as Error).message)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, loading, checking }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context)
    throw new Error("useAuth debe estar dentro de AuthContextProvider");

  return context;
};
