import { createContext, useState, useEffect } from "react";


export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // optional, buat loading state

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:5000/me", {
          credentials: "include",
        });

        // kalau 401 / 403 / error lain, anggap saja belum login
        if (!res.ok) {
          setUser(null);
          return;
        }

        const data = await res.json();
        if (data.success) {
          setUser(data.data);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Error cek /me:", err);
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
