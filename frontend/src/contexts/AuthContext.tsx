import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";

interface AuthUser {
  userId: string;
  tenantId: string;
  tenantSlug?: string;
  role: string;
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (token: string, refreshToken: string, user: AuthUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function isValidJwt(token: string): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  try {
    const payload = JSON.parse(atob(parts[1]));
    if (!payload.exp) return false;
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

function safeParseUser(json: string | null): AuthUser | null {
  if (!json) return null;
  try {
    const parsed = JSON.parse(json);
    if (parsed && typeof parsed.userId === "string" && typeof parsed.email === "string") {
      return parsed as AuthUser;
    }
    return null;
  } catch {
    localStorage.removeItem("bitex_user");
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("bitex_token");
    const savedUser = safeParseUser(localStorage.getItem("bitex_user"));

    if (savedToken && isValidJwt(savedToken) && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
      setIsLoading(false);
    } else if (savedToken && !isValidJwt(savedToken)) {
      const refreshToken = localStorage.getItem("bitex_refresh_token");
      if (refreshToken && savedUser) {
        api.post("/api/auth/refresh", { refreshToken })
          .then((res) => {
            localStorage.setItem("bitex_token", res.data.token);
            localStorage.setItem("bitex_refresh_token", res.data.refreshToken);
            setToken(res.data.token);
            setUser(savedUser);
          })
          .catch(() => {
            clearStorage();
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        clearStorage();
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "bitex_token") {
        if (!e.newValue) {
          setToken(null);
          setUser(null);
        } else if (isValidJwt(e.newValue)) {
          setToken(e.newValue);
          const u = safeParseUser(localStorage.getItem("bitex_user"));
          setUser(u);
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const clearStorage = useCallback(() => {
    localStorage.removeItem("bitex_token");
    localStorage.removeItem("bitex_refresh_token");
    localStorage.removeItem("bitex_user");
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback((newToken: string, newRefreshToken: string, newUser: AuthUser) => {
    localStorage.setItem("bitex_token", newToken);
    localStorage.setItem("bitex_refresh_token", newRefreshToken);
    localStorage.setItem("bitex_user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/api/auth/logout");
    } catch {
      // Server-side logout is best-effort
    }
    clearStorage();
  }, [clearStorage]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token && isValidJwt(token ?? ""), isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
