// Hero: the welcome section at the top of the page.
// onBrowse is a function from App that scrolls down to the internship list.
function Hero({ onBrowse }) {
  return (
    <section className="hero">
      <div>
        <h1>Find the internship that starts your career</h1>
        <p>
          Search openings from top companies, apply in a minute and track every
          application from Applied to Shortlisted in one place.
        </p>
        <button className="btn btn-light" onClick={onBrowse}>
          Browse internships
        </button>
      </div>
    </section>
  );
}

export default Hero;
