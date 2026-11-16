// Navbar: top bar with the logo and two tab buttons.
// Props (data given by the parent App):
//   activeTab        - which tab is currently selected
//   onTabChange      - function to call when a tab is clicked
//   applicationCount - number shown in the small badge
function Navbar({ activeTab, onTabChange, applicationCount, user, onLogout }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand">
          <span className="brand-mark">IM</span>
          <span className="brand-name">InternHub</span>
        </div>

        <nav className="nav-tabs">
          {/* className changes depending on the active tab, so the selected tab looks highlighted */}
          <button
            className={activeTab === "browse" ? "tab active" : "tab"}
            onClick={() => onTabChange("browse")}
          >
            Browse internships
          </button>
          {user?.role !== "student" && <button className={activeTab === "manage" ? "tab active" : "tab"} onClick={() => onTabChange("manage")}>Manage listings</button>}
          <button
            className={activeTab === "applications" ? "tab active" : "tab"}
            onClick={() => onTabChange("applications")}
          >
            {user?.role === "student" ? "My applications" : "Applications received"}
            <span className="badge">{applicationCount}</span>
          </button>
        </nav>
        <div className="nav-user"><span>{user?.name} · {user?.role}</span><button className="btn btn-outline small" onClick={onLogout}>Log out</button></div>
      </div>
    </header>
  );
}

export default Navbar;
