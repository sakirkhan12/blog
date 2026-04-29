import { createContext, useState, useEffect } from "react";
import API from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await API.get("/users/profile");
        setUser(res.data.user);
        setIsAuth(true);
        console.log(res.data.message)
        console.log(res.data.user)
      
      } catch (error) {
        setUser(null);
        setIsAuth(false);
        console.log(
          "Error:",
          error.response?.data?.message || error.message
        );
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};