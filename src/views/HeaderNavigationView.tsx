import "./HeaderNavigationView.css";
import { Link } from "react-router-dom";

const HeaderNavigationView = () => {
  return (
    <div className="app-header">
      <span className="app-title">DCF Calculator</span>
      <nav className="nav-links">
        <Link to="/usa" className="no-style">
          US Stocks
        </Link>
        <Link to="/india" className="no-style">
          Indian Stocks
        </Link>
      </nav>
    </div>
  );
};

export default HeaderNavigationView;
