import { useEffect, useState } from "react";
import api from "../api";

const EMPTY = { company: "", role: "", location: "", mode: "On-site", duration: "", stipend: 0, category: "Other", skills: "", deadline: "", description: "" };
export default function ManageInternships() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function load() { try { const { data } = await api.get("/internships/mine"); setItems(data); } catch (e) { setError(e.response?.data?.message || "Could not load your listings."); } }
  useEffect(() => { load(); }, []);
  function change(e) { setForm({ ...form, [e.target.name]: e.target.value }); }
  function reset() { setForm(EMPTY); setEditingId(null); setError(""); }
  async function submit(e) {
    e.preventDefault(); setBusy(true); setError("");
    const payload = { ...form, stipend: Number(form.stipend), skills: form.skills.split(",").map(s => s.trim()).filter(Boolean) };
    try { if (editingId) await api.put(`/internships/${editingId}`, payload); else await api.post("/internships", payload); reset(); await load(); }
    catch (err) { setError(err.response?.data?.message || "Could not save listing."); }
    finally { setBusy(false); }
  }
  function edit(item) { setEditingId(item._id); setForm({ ...EMPTY, ...item, skills: (item.skills || []).join(", "), stipend: item.stipend || 0 }); window.scrollTo({ top: 0, behavior: "smooth" }); }
  async function remove(id) {
    if (!window.confirm("Delete this internship listing? This cannot be undone.")) return;
    try { await api.delete(`/internships/${id}`); await load(); if (editingId === id) reset(); }
    catch (err) { setError(err.response?.data?.message || "Could not delete listing."); }
  }
  return <section className="manage-page">
    <h2 className="section-title">Manage internship listings</h2>
    <form className="manage-form" onSubmit={submit}>
      <h3>{editingId ? "Edit listing" : "Add a new internship"}</h3>
      <div className="manage-grid">
        <label>Company<input className="input" name="company" value={form.company} onChange={change} required /></label>
        <label>Role<input className="input" name="role" value={form.role} onChange={change} required /></label>
        <label>Location<input className="input" name="location" value={form.location} onChange={change} required /></label>
        <label>Mode<select className="input" name="mode" value={form.mode} onChange={change}><option>On-site</option><option>Remote</option><option>Hybrid</option></select></label>
        <label>Duration<input className="input" name="duration" value={form.duration} onChange={change} placeholder="3 Months" required /></label>
        <label>Monthly stipend (₹)<input className="input" type="number" min="0" name="stipend" value={form.stipend} onChange={change} /></label>
        <label>Category<input className="input" name="category" value={form.category} onChange={change} /></label>
        <label>Skills (comma separated)<input className="input" name="skills" value={form.skills} onChange={change} /></label>
        <label>Application deadline<input className="input" type="date" name="deadline" value={form.deadline || ""} onChange={change} /></label>
      </div>
      <label>Description<textarea className="input" rows="3" name="description" value={form.description || ""} onChange={change} /></label>
      {error && <p className="form-error">{error}</p>}
      <div className="modal-actions"><button className="btn btn-primary" disabled={busy}>{busy ? "Saving..." : editingId ? "Update listing" : "Create listing"}</button>{editingId && <button type="button" className="btn btn-outline" onClick={reset}>Cancel edit</button>}</div>
    </form>
    <h3 className="section-title">Your listings ({items.length})</h3>
    <div className="manage-list">{items.map(item => <article className="manage-item" key={item._id}><div><strong>{item.role}</strong><p>{item.company} · {item.location} · {item.duration}</p></div><div className="manage-actions"><button className="btn btn-outline small" onClick={() => edit(item)}>Edit</button><button className="btn btn-outline small" onClick={() => remove(item._id)}>Delete</button></div></article>)}{items.length === 0 && <p className="muted">You have not created any listings yet.</p>}</div>
  </section>;
}
