// InternshipList: decides what to show in the browse section:
// loading placeholders, an empty message, or the grid of cards.
import InternshipCard from "./InternshipCard";

function InternshipList({ internships, loading, appliedIds, onApply, canApply = true }) {
  // 1) Still waiting for the API: show grey placeholder boxes
  if (loading) {
    return (
      <div className="card-grid">
        {[1, 2, 3].map((n) => <div key={n} className="skeleton" />)}
      </div>
    );
  }

  // 2) The API answered but nothing matched the search/filters
  if (internships.length === 0) {
    return (
      <div className="empty">
        <h3>No internships match your search</h3>
        <p>Try a different keyword or press Clear to remove the filters.</p>
      </div>
    );
  }

  // 3) Show one card for every internship
  return (
    <div className="card-grid">
      {internships.map((item) => (
        <InternshipCard
          key={item._id}                         // MongoDB gives every document a unique _id
          internship={item}
          applied={appliedIds.has(item._id)}     // true if the student already applied
          canApply={canApply}
          onApply={() => onApply(item)}          // opens the modal for this internship
        />
      ))}
    </div>
  );
}

export default InternshipList;
