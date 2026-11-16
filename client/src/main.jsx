import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import InternshipDetails from "./pages/InternshipDetails.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";
import "./index.css";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode><BrowserRouter><AuthProvider><Routes>
    <Route path="/login" element={<AuthPage mode="login" />} />
    <Route path="/register" element={<AuthPage mode="register" />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/" element={<App />} />
      <Route path="/internships/:id" element={<InternshipDetails />} />
    </Route>
    <Route path="*" element={<main className="container"><h1>Page not found</h1><a href="/">Go home</a></main>} />
  </Routes></AuthProvider></BrowserRouter></React.StrictMode>
);
