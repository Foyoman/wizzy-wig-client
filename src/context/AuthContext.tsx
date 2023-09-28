import { createContext, useState, useEffect, ReactNode } from "react";
import jwt_decode from "jwt-decode";

import { useDispatch } from "react-redux";
import { setError } from "../store/appSlice";

// @ts-ignore
const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const SERVER_URL = "http://localhost:8000/api/token/";

  const dispatch = useDispatch();

  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens")!)
      : null
  );
  const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwt_decode(localStorage.getItem("authTokens")!)
      : null
  );
  const [loading, setLoading] = useState(true);

  const loginUser = async (e: React.FormEvent<HTMLFormElement>) => {
    const usernameInput = e.currentTarget.username as HTMLInputElement;
    const passwordInput = e.currentTarget.password as HTMLInputElement;

    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: usernameInput.value,
        password: passwordInput.value,
      }),
    });

    const data = await response.json();

    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwt_decode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
      window.location.reload();
    } else {
      console.error(response);
      dispatch(setError(response.status));
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    window.location.reload();
  };

  const contextData = {
    user: user,
    setUser: setUser,
    authTokens: authTokens,
    setAuthTokens: setAuthTokens,
    loginUser: loginUser,
    logoutUser: logoutUser,
  };

  useEffect(() => {
    if (authTokens) {
      setUser(jwt_decode(authTokens.access));
    }
    setLoading(false);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
