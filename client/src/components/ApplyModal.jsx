// ApplyModal: a pop-up form that appears on top of the page (no new page needed).
import { useState, useEffect, useRef } from "react";

// onSubmit(formData) is handleApply in App.jsx; it returns "" on success or an error text.
function ApplyModal({ internship, onSubmit, onClose, user }) {
  // One state object holds every form field
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", phone: "", note: "" });
  const phoneInputRef = useRef(null); // direct reference to the phone field for keyboard focus
  const [error, setError] = useState("");          // message shown above the button
  const [submitting, setSubmitting] = useState(false); // disables the button while saving

  // Close the modal when the Escape key is pressed.
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    phoneInputRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey); // cleanup when the modal closes
  }, [onClose]);

  // Runs on every keystroke: updates only the field that changed.
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault(); // stops the browser from reloading the page

    // Client-side validation: quick checks before calling the server
    if (form.name.trim().length < 2) return setError("Please enter your full name.");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError("Please enter a valid email address.");
    if (!/^\d{10}$/.test(form.phone)) return setError("Phone number must be 10 digits.");

    setError("");
    setSubmitting(true);
    const message = await onSubmit(form); // sends the data to Express
    setSubmitting(false);
    if (message) setError(message);       // show the server error (for example "already applied")
  }

  return (
    // Clicking the dark background closes the modal
    <div className="overlay" onClick={onClose}>
      {/* stopPropagation: clicks inside the white box should NOT close the modal */}
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <h2>Apply for {internship.role}</h2>
        <p className="modal-sub">{internship.company}, {internship.location}</p>

        <form onSubmit={handleSubmit} noValidate>
          <label>
            Full name
            <input className="input" name="name" value={form.name} readOnly />
          </label>
          <label>
            Email
            <input className="input" type="email" name="email" value={form.email} readOnly />
          </label>
          <label>
            Phone number
            <input ref={phoneInputRef} className="input" name="phone" value={form.phone} onChange={handleChange} maxLength={10} />
          </label>
          <label>
            Why are you a good fit? (optional)
            <textarea className="input" name="note" rows={3} value={form.note} onChange={handleChange} />
          </label>

          {error && <p className="form-error">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Submitting" : "Submit application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApplyModal;
