import "./HeaderNavigationView.css";
import { Link } from "react-router-dom";

const HeaderNavigationView = () => {
  return (
    <div className="app-header">
      <span className="app-title">DCF Calculator</span>
      <nav className="nav-links">
        <Link to="/" className="no-style">
          Overview
        </Link>
        <Link to="/Dcf-calculator" className="no-style">
          DCF Calculator
        </Link>
      </nav>
    </div>
  );
};

export default HeaderNavigationView;
