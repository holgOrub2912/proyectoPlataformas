import { useEffect, useContext, useState, createContext } from "react";
import moment from 'moment';

// import { useNotification } from "./components/NotificationProvider";

const API_URL = import.meta.env.VITE_API_URL;

const getStoredUser = () => JSON.parse(localStorage.getItem("user"));

const setStoredUser = (user) =>
  localStorage.setItem("user", JSON.stringify(user));

const getStoredExpTime = () => moment.unix(localStorage.getItem("expDateTime"));

const setStoredExpTime = (time) => localStorage.setItem("expDateTime", time.unix())

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [expDateTime, setExpDateTime] = useState(getStoredExpTime());
  const [error, setError] = useState(null);
  // const { showSuccess, showError, showInfo } = useNotification();

  useEffect(() => {
    if (user) {
      setStoredUser(user);
    }
    if (expDateTime)
      setStoredExpTime(expDateTime);
  }, [user, expDateTime]);

  const logIn = async (username, password) => {
    setError(null);
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const response = await fetch(`${API_URL}/token`, {
        method: "POST",
        mode: "cors",
        body: formData,
      });

      if (response.ok) {
        const res = await response.json();
        setUser(res.user);
        setToken(res.access_token);
        setExpDateTime(moment().add(res.expires_in, 'seconds'));
        localStorage.setItem("token", res.access_token);
        // showSuccess(`Inicio de sesión exitoso. Bienvenido, ${username}!`);
        return res;
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.message || "Error al iniciar sesión";
        console.log(errorMessage)
        setError(errorMessage);
        // showError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err) {
      const errorMessage = err.message || "Error de conexión";
      // setError(errorMessage);
      // showError(errorMessage);
      throw err;
    }
  };

  const logOut = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("expDateTime");
    // showInfo("Sesión cerrada correctamente");
  };

  return (
    <AuthContext.Provider value={{ token, user, logIn, logOut, error, expDateTime }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  const vals = useContext(AuthContext);
  if (moment().isAfter(vals.expDateTime)){
    return {logIn: vals.logIn, logOut: vals.logOut};
  } else
    return vals;
    
};
