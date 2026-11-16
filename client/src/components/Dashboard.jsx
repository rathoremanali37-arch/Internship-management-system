// Dashboard: the four summary cards.
// "stats" comes from GET /api/stats, which counts documents in MongoDB.
function Dashboard({ stats, role = "student" }) {
  // Keeping the card details in an array lets us draw all four with .map()
  const cards = [
    { label: "Total internships", value: stats.totalInternships, note: "Open positions" },
    { label: role === "student" ? "My applications" : "Applications received", value: stats.myApplications, note: role === "student" ? "Sent so far" : "For your listings" },
    { label: "Shortlisted", value: stats.shortlisted, note: "Moved ahead" },
    { label: "Available companies", value: stats.companies, note: "Hiring now" }
  ];

  return (
    <section className="dashboard">
      {/* .map() turns each object in the array into a card. "key" helps React track items. */}
      {cards.map((card) => (
        <div className="stat-card" key={card.label}>
          <span className="stat-label">{card.label}</span>
          <span className="stat-value">{card.value}</span>
          <span className="stat-note">{card.note}</span>
        </div>
      ))}
    </section>
  );
}

export default Dashboard;
