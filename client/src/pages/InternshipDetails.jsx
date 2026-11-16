import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";
export default function InternshipDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { api.get(`/internships/${id}`).then(r => setItem(r.data)).catch(e => setError(e.response?.data?.message || "Could not load internship.")); }, [id]);
  if (error) return <main className="container"><p className="error-banner">{error}</p><Link to="/">Back to dashboard</Link></main>;
  if (!item) return <main className="container">Loading internship...</main>;
  return <main className="container details-page"><Link to="/">← Back to internships</Link><h1>{item.role}</h1><h3>{item.company}</h3><p>{item.location} · {item.mode} · {item.duration}</p><p>Stipend: ₹{Number(item.stipend || 0).toLocaleString("en-IN")}/month</p><p>{item.description}</p><p>Skills: {(item.skills || []).join(", ")}</p></main>;
}
