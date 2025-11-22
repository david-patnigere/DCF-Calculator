import "./App.css";
import HeaderNavigationContainer from "./components/HeaderNavigationContainer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import OverviewContainer from "./components/Overview/OverviewContainer";
import FcfCalculatorContainer from "./components/FcfCalculator/FcfCalculatorContainer";

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <HeaderNavigationContainer />
        <div className="App-body">
          {/* <p>This is the body tag</p> */}
          <Routes>
            <Route path="/" element={<OverviewContainer />} />
            <Route
              path="/fcf-calculator"
              element={<FcfCalculatorContainer />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}
