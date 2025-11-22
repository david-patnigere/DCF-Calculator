import "./HeaderNavigationView.css";
import { Link } from "react-router-dom";

const HeaderNavigationView = () => {
  return (
    <div className="app-header">
      <span className="app-title">DCF Calculator</span>
      <nav className="nav-links">
        <Link to="/">Overview</Link>
        <Link to="/fcf-calculator">FCF Calculator</Link>
      </nav>
    </div>
  );
};

export default HeaderNavigationView;
