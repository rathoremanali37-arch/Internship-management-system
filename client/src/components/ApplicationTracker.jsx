// ApplicationTracker: lists the student's applications with a status badge.
import { useState } from "react";

const STATUSES = ["Applied", "Shortlisted", "Rejected"];

function ApplicationTracker({ applications, onStatusChange, onWithdraw, onBrowse, canManage = false }) {
  // Local state: which status tab is selected ("All" shows everything)
  const [statusFilter, setStatusFilter] = useState("All");

  // Count how many applications have each status (for the tab labels)
  const counts = { All: applications.length };
  STATUSES.forEach((s) => {
    counts[s] = applications.filter((app) => app.status === s).length;
  });

  // Applications that match the selected tab
  const visible =
    statusFilter === "All" ? applications : applications.filter((app) => app.status === statusFilter);

  // Nothing applied yet: invite the student to browse
  if (applications.length === 0) {
    return (
      <div className="empty">
        <h3>{canManage ? "No applications received yet" : "You have not applied anywhere yet"}</h3>
        <p>{canManage ? "Applications for your internship listings will appear here." : "Applications you send will appear here with their latest status."}</p>
        {!canManage && <button className="btn btn-primary" onClick={onBrowse}>Browse internships</button>}
      </div>
    );
  }

  return (
    <div>
      <div className="status-tabs">
        {["All", ...STATUSES].map((s) => (
          <button
            key={s}
            className={statusFilter === s ? "chip active" : "chip"}
            onClick={() => setStatusFilter(s)}
          >
            {s} ({counts[s]})
          </button>
        ))}
      </div>

      {visible.length === 0 && <p className="muted">No applications with this status.</p>}

      <div className="app-list">
        {visible.map((app) => {
          const job = app.internship; // filled by populate() on the server
          // If the internship was deleted from the database, skip this row
          if (!job) return null;
          return (
            <div className="app-row" key={app._id}>
              <div className="logo">{job.company.charAt(0)}</div>

              <div className="app-info">
                <h3 className="card-role">{job.role}</h3>
                <p className="card-company">{job.company}, {job.location}</p>
                {canManage && app.user && <p className="deadline">Applicant: {app.user.name} ({app.user.email})</p>}
                <p className="deadline">
                  Applied on {new Date(app.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>

              {/* status-applied / status-shortlisted / status-rejected decides the colour in CSS */}
              <span className={"status status-" + app.status.toLowerCase()}>{app.status}</span>

              <div className="app-actions">
                {/* Demo only: in a real system the company changes the status */}
                {canManage && <select
                  className="input small"
                  value={app.status}
                  onChange={(e) => onStatusChange(app._id, e.target.value)}
                  aria-label="Change application status"
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>}
                {!canManage && <button className="btn btn-outline small" onClick={() => onWithdraw(app._id)}>
                  Withdraw
                </button>}
              </div>
            </div>
          );
        })}
      </div>
      {canManage && <p className="muted note">Company users can update an applicant's status.</p>}
    </div>
  );
}

export default ApplicationTracker;
