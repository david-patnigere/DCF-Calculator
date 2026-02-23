import "./App.css";
import HeaderNavigationContainer from "./components/HeaderNavigationContainer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DcfCalculatorContainer from "./components/DcfCalculator/DcfCalculatorContainer";

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <HeaderNavigationContainer />
        <div className="App-body">
          {/* <p>This is the body tag</p> */}
          <Routes>
            <Route
              path="/dcf-calculator"
              element={<DcfCalculatorContainer />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}
