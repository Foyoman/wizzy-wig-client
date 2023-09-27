import { createContext, useState, useEffect, ReactNode } from "react";
import jwt_decode from "jwt-decode";

// @ts-ignore
const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const SERVER_URL = "http://localhost:8000/api/token/";

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

  const loginUser = async (e: React.FormEvent<HTMLFormElement>) => {
    // e.preventDefault();

    const emailInput = e.currentTarget.email as HTMLInputElement;
    const passwordInput = e.currentTarget.password as HTMLInputElement;

    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: emailInput.value,
        password: passwordInput.value,
      }),
    });

    const data = await response.json();

    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwt_decode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
    } else {
      console.error("Something went wrong!");
    }

    window.location.reload();
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    window.location.reload();
  };

  const updateToken = async () => {
    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: authTokens.refresh }),
    });

    const data = await response.json()

    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwt_decode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
    } else {
      logoutUser();
    }
  };

  const contextData = {
    user: user,
    loginUser: loginUser,
    logoutUser: logoutUser,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
