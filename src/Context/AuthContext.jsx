import { createContext, useEffect, useState } from "react";
import LoginSignupApi from "../api/LoginSignupApi";

export const AuthContext = createContext();

export const AuthContextProvider = (props) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [newUser, setNewUser] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const getUserDetails = async () => {
      const response = await LoginSignupApi.get("/", {
        headers: {
          Authorization: `Bearer ${user}`,
        },
      });

      setNewUser(response.data.user);
    };
    try {
      setLoading(true);
      setError(false);
      if (user) {
        getUserDetails();
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError();
    }
  }, [user]);

  const login = async (email, password, userType) => {
    const response = await LoginSignupApi.post(
      "/login",
      { email, password, userType },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;
    localStorage.setItem("user", JSON.stringify(data.token));
    setUser(data.token);
    console.log("LOGIN CONTEXT :", response);

    return { data: data };
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setNewUser(null);
  };

  const value = {
    user,
    setUser,
    newUser,
    setNewUser,
    login,
    loading,
    error,
    logout,
  };
  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
};
