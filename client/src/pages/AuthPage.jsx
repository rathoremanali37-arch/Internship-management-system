import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function AuthPage({ mode }) {
  const isRegister = mode === "register";
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  function change(e) { setForm({ ...form, [e.target.name]: e.target.value }); }
  async function submit(e) {
    e.preventDefault(); setError("");
    if (form.password.length < 8) return setError("Password must be at least 8 characters.");
    setBusy(true);
    try {
      if (isRegister) await register(form); else await login({ email: form.email, password: form.password });
      navigate("/", { replace: true });
    } catch (err) { setError(err.response?.data?.message || "Unable to continue. Please try again."); }
    finally { setBusy(false); }
  }
  return <main className="auth-page"><section className="auth-card">
    <Link className="auth-brand" to="/">InternHub</Link>
    <h1>{isRegister ? "Create your account" : "Welcome back"}</h1>
    <p>{isRegister ? "Register to explore and apply for internships." : "Log in to track your internship applications."}</p>
    <form onSubmit={submit} className="auth-form">
      {isRegister && <label>Full name<input className="input" name="name" value={form.name} onChange={change} required minLength={2} /></label>}
      <label>Email address<input className="input" type="email" name="email" value={form.email} onChange={change} required /></label>
      <label>Password<input className="input" type="password" name="password" value={form.password} onChange={change} required minLength={8} /></label>
      {error && <p className="form-error">{error}</p>}
      <button className="btn btn-primary auth-submit" disabled={busy}>{busy ? "Please wait..." : isRegister ? "Create account" : "Log in"}</button>
    </form>
    <p className="auth-switch">{isRegister ? "Already have an account? " : "New to InternHub? "}<Link to={isRegister ? "/login" : "/register"}>{isRegister ? "Log in" : "Create account"}</Link></p>
  </section></main>;
}
