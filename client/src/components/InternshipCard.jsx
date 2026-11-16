// InternshipCard: shows one internship with details and an Apply Now action.
import { Link } from "react-router-dom";
function InternshipCard({ internship, applied, onApply, canApply = true }) {
  const { company, role, location, mode, duration, stipend, skills, deadline } = internship;

  // Show 0 as "Unpaid" and other values in Indian rupee format, e.g. 15,000
  const stipendText = stipend > 0 ? "\u20B9" + stipend.toLocaleString("en-IN") + " / month" : "Unpaid";

  // Turn "2026-12-20" into a readable date
  const deadlineText = deadline
    ? new Date(deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "Open";

  return (
    <article className="card">
      <div className="card-head">
        {/* First letter of the company name works as a simple logo */}
        <div className="logo">{company.charAt(0)}</div>
        <div>
          <h3 className="card-role"><Link to={`/internships/${internship._id}`}>{role}</Link></h3>
          <p className="card-company">{company}</p>
        </div>
      </div>

      <div className="meta">
        <span>{location}</span>
        <span>{mode}</span>
        <span>{duration}</span>
      </div>

      <div className="skills">
        {skills.map((skill) => <span className="skill" key={skill}>{skill}</span>)}
      </div>

      <div className="card-foot">
        <div>
          <p className="stipend">{stipendText}</p>
          <p className="deadline">Apply by {deadlineText}</p>
        </div>
        {/* disabled stops a second click once the student has applied */}
        {canApply && <button className="btn btn-primary" onClick={onApply} disabled={applied}>
          {applied ? "Applied" : "Apply now"}
        </button>}
      </div>
    </article>
  );
}

export default InternshipCard;
