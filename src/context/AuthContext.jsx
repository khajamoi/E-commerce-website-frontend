// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // will hold { id, name, email, role }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem("fe_user");
    const token = localStorage.getItem("fe_token");
    if (raw && token) {
      setUser(JSON.parse(raw)); // ✅ Now includes name + id + role
    }
    setLoading(false);
  }, []);

  async function signup(payload) {
    const res = await api.post("/auth/signup", payload);
    return res.data; // just register, do not auto-login
  }

  async function adminSignup(payload) {
    const res = await api.post("/auth/admin/signup", payload);
    return res.data;
  }

  async function login(email, password) {
    const res = await api.post("/auth/login", { email, password });

    // ✅ res.data contains { token, id, name, email, role }
    const { token, id, name, email: resEmail, role } = res.data;

    localStorage.setItem("fe_token", token);

    const userObj = { id, name, email: resEmail, role };
    localStorage.setItem("fe_user", JSON.stringify(userObj));

    setUser(userObj);
    return userObj;
  }

  function logout() {
    localStorage.removeItem("fe_token");
    localStorage.removeItem("fe_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, adminSignup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}


// import React, { createContext, useContext, useEffect, useState } from "react";
// import api from "../api/api";

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const raw = localStorage.getItem("fe_user");
//     const token = localStorage.getItem("fe_token");
//     if (raw && token) setUser(JSON.parse(raw));
//     setLoading(false);
//   }, []);

//   async function loginStepOne(email, password) {
//     const res = await api.post("/auth/login", { email, password });
//     return res.data; // message
//   }

//   async function verifyOtp(email, otp) {
//     const res = await api.post("/auth/verify-otp", { email, otp });
//     const { token, id, name, email: resEmail, role } = res.data;

//     localStorage.setItem("fe_token", token);
//     const userObj = { id, name, email: resEmail, role };
//     localStorage.setItem("fe_user", JSON.stringify(userObj));
//     setUser(userObj);
//     return userObj;
//   }

//   async function signup(payload) {
//     const res = await api.post("/auth/signup", payload);
//     return res.data;
//   }

//   async function adminSignup(payload) {
//     const res = await api.post("/auth/admin/signup", payload);
//     return res.data;
//   }

//   function logout() {
//     localStorage.removeItem("fe_token");
//     localStorage.removeItem("fe_user");
//     setUser(null);
//   }

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         loginStepOne,
//         verifyOtp,
//         signup,
//         adminSignup,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }
// ////