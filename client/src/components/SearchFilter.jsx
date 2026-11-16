// SearchFilter: search bar + three dropdown filters.
// These are "controlled inputs": the value shown comes from state in App,
// and every change is sent back up with onChange, so App can call the API again.
function SearchFilter({ filters, meta, onChange, onClear, resultCount }) {
  const modes = ["Remote", "On-site", "Hybrid"];

  return (
    <div className="filter-bar">
      <input
        className="input search-input"
        type="text"
        placeholder="Search by role, company or skill"
        value={filters.search}
        onChange={(e) => onChange("search", e.target.value)} // e.target.value = what the user typed
      />

      <select className="input" value={filters.location} onChange={(e) => onChange("location", e.target.value)}>
        <option value="All">All locations</option>
        {meta.locations.map((place) => (
          <option key={place} value={place}>{place}</option>
        ))}
      </select>

      <select className="input" value={filters.mode} onChange={(e) => onChange("mode", e.target.value)}>
        <option value="All">All work modes</option>
        {modes.map((mode) => (
          <option key={mode} value={mode}>{mode}</option>
        ))}
      </select>

      <select className="input" value={filters.category} onChange={(e) => onChange("category", e.target.value)}>
        <option value="All">All categories</option>
        {meta.categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <button className="btn btn-outline" onClick={onClear}>Clear</button>
      <span className="result-count">{resultCount} found</span>
    </div>
  );
}

export default SearchFilter;
