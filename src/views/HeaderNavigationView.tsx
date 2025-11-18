import "./HeaderNavigationView.css";

const HeaderNavigationView = () => {
  return (
    <header className="app-header">
      <span className="app-title">DCF Calculator</span>
      <div className="nav-links">
        <nav>
          <a>Overview</a>
        </nav>
        <nav>
          <a>FCF Calculator</a>
        </nav>
      </div>
    </header>
  );
};

export default HeaderNavigationView;
