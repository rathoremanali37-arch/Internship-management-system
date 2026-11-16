// App.jsx is the ROOT component. It owns all the data (state) and API calls,
// and passes data down to the child components as "props".
// The whole site is ONE page: we switch content with the activeTab state
// and show the apply form in a modal (no routing needed).
import { useState, useEffect } from "react";
import api from "./api";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Dashboard from "./components/Dashboard";
import SearchFilter from "./components/SearchFilter";
import InternshipList from "./components/InternshipList";
import ApplicationTracker from "./components/ApplicationTracker";
import ApplyModal from "./components/ApplyModal";
import Toast from "./components/Toast";
import { useAuth } from "./auth/AuthContext";
import ManageInternships from "./components/ManageInternships";

// Default values of the search bar and filters. "All" means "do not filter".
const EMPTY_FILTERS = { search: "", location: "All", mode: "All", category: "All" };

function App() {
  const { user, logout } = useAuth();
  // ---------- STATE ----------
  // useState(initialValue) returns [currentValue, functionToChangeIt].
  // When a setter is called, React re-draws the component with the new value.
  const [internships, setInternships] = useState([]);        // list shown as cards
  const [applications, setApplications] = useState([]);      // the student's applications
  const [stats, setStats] = useState({ totalInternships: 0, myApplications: 0, shortlisted: 0, companies: 0 });
  const [meta, setMeta] = useState({ locations: [], categories: [] }); // dropdown options
  const [filters, setFilters] = useState(EMPTY_FILTERS);     // search text + dropdown values
  const [activeTab, setActiveTab] = useState("browse");      // "browse" or "applications"
  const [selectedInternship, setSelectedInternship] = useState(null); // internship inside the modal
  const [loading, setLoading] = useState(true);              // true while internships load
  const [serverError, setServerError] = useState("");        // shown if the API is not reachable
  const [toast, setToast] = useState(null);                  // { message, type } or null

  // ---------- API CALLS ----------
  // Each function sends a request to Express. Express reads/writes MongoDB
  // and sends JSON back. "await" pauses until the reply arrives.

  async function loadInternships(currentFilters) {
    try {
      setLoading(true);
      // params become the query string: /internships?search=react&mode=Remote
      const res = await api.get("/internships", { params: currentFilters });
      setInternships(res.data); // res.data is the JSON array sent by Express
      setServerError("");
    } catch (error) {
      setServerError("Cannot reach the server. Start the backend (npm start in /server) and MongoDB.");
    } finally {
      setLoading(false); // runs whether the request worked or failed
    }
  }

  async function loadApplications() {
    try {
      const res = await api.get("/applications");
      setApplications(res.data);
    } catch (error) {
      setServerError("Cannot reach the server. Start the backend (npm start in /server) and MongoDB.");
    }
  }

  async function loadStats() {
    try {
      const res = await api.get("/stats");
      setStats(res.data);
    } catch (error) {
      // stats are secondary; the main error banner is handled above
    }
  }

  async function loadMeta() {
    try {
      const res = await api.get("/internships/meta");
      setMeta(res.data);
    } catch (error) {
      // dropdowns simply stay empty if this fails
    }
  }

  // ---------- useEffect ----------
  // useEffect(function, [dependencies]) runs the function after React draws the screen.

  // 1) Empty [] = run ONCE when the page first opens: load everything except internships.
  useEffect(() => {
    loadApplications();
    loadStats();
    loadMeta();
  }, []);

  // 2) Runs on the first load AND every time "filters" changes.
  //    The 300 ms timer waits until the student stops typing before calling the API.
  useEffect(() => {
    const timer = setTimeout(() => loadInternships(filters), 300);
    return () => clearTimeout(timer); // cleanup: cancel the old timer if filters change again
  }, [filters]);

  // ---------- EVENT HANDLERS ----------

  function showToast(message, type = "success") {
    setToast({ message, type });
  }

  // Called by SearchFilter whenever a field changes.
  // { ...filters, [name]: value } copies the old filters and replaces just one field.
  function handleFilterChange(name, value) {
    setFilters({ ...filters, [name]: value });
  }

  // Called by ApplyModal when the student submits the form.
  // Returns an error message (string) on failure, or "" on success.
  async function handleApply(formData) {
    if (user?.role !== "student") return "Only student accounts can submit applications.";
    try {
      // POST sends formData as JSON in req.body; Express saves it in MongoDB.
      await api.post("/applications", { internshipId: selectedInternship._id, ...formData });
      await loadApplications(); // refresh the tracker list
      await loadStats();        // refresh the dashboard numbers
      showToast("Application submitted for " + selectedInternship.company);
      setSelectedInternship(null); // close the modal
      return "";
    } catch (error) {
      // error.response.data.message is the message written in the Express route
      return error.response?.data?.message || "Something went wrong. Please try again.";
    }
  }

  // Called by ApplicationTracker when a status is changed (demo feature).
  async function handleStatusChange(id, status) {
    try {
      await api.patch("/applications/" + id + "/status", { status }); // PATCH = update part of a record
      await loadApplications();
      await loadStats();
      showToast("Status changed to " + status);
    } catch (error) {
      showToast("Could not change status", "error");
    }
  }

  // Called by ApplicationTracker when the student withdraws an application.
  async function handleWithdraw(id) {
    try {
      await api.delete("/applications/" + id); // DELETE removes the record from MongoDB
      await loadApplications();
      await loadStats();
      showToast("Application withdrawn");
    } catch (error) {
      showToast("Could not withdraw application", "error");
    }
  }

  // A Set of internship ids the student already applied to (used to disable the Apply button).
  const appliedIds = new Set(applications.map((app) => app.internship?._id));

  function goToBrowse() {
    setActiveTab("browse");
    // wait one tick so the browse section exists, then scroll to it
    setTimeout(() => document.getElementById("browse")?.scrollIntoView({ behavior: "smooth" }), 0);
  }

  // ---------- WHAT IS DRAWN ON THE SCREEN (JSX) ----------
  return (
    <div className="app">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} applicationCount={applications.length} user={user} onLogout={logout} />

      <main className="container">
        <Hero onBrowse={goToBrowse} />

        {serverError && <div className="error-banner">{serverError}</div>}

        <Dashboard stats={stats} role={user?.role} />

        {/* Conditional rendering: only ONE of these two sections is shown at a time */}
        {activeTab === "manage" && (user?.role === "company" || user?.role === "admin") ? (
          <ManageInternships />
        ) : activeTab === "browse" ? (
          <section id="browse">
            <h2 className="section-title">Available internships</h2>
            <SearchFilter
              filters={filters}
              meta={meta}
              onChange={handleFilterChange}
              onClear={() => setFilters(EMPTY_FILTERS)}
              resultCount={internships.length}
            />
            <InternshipList
              internships={internships}
              loading={loading}
              appliedIds={appliedIds}
              onApply={setSelectedInternship}
              canApply={user?.role === "student"}
            />
          </section>
        ) : (
          <section id="applications">
            <h2 className="section-title">My applications</h2>
            <ApplicationTracker
              applications={applications}
              onStatusChange={handleStatusChange}
              onWithdraw={handleWithdraw}
              onBrowse={goToBrowse}
              canManage={user?.role === "company" || user?.role === "admin"}
            />
          </section>
        )}
      </main>

      <footer className="footer">Internship Management System. MERN stack college project.</footer>

      {/* The modal is drawn only when an internship has been selected */}
      {selectedInternship && (
        <ApplyModal
          internship={selectedInternship}
          onSubmit={handleApply}
          onClose={() => setSelectedInternship(null)}
          user={user}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

export default App;
