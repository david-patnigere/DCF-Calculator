import "./App.css";
import HeaderNavigationContainer from "./components/HeaderNavigationContainer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import USADcfCalculatorContainer from "./components/DcfCalculator/DcfCalculatorContainer";
import IndianDcfCalculatorContainer from "./components/IndianDcfCalculator/DcfCalculatorContainer";

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <HeaderNavigationContainer />
        <div className="App-body">
          {/* <p>This is the body tag</p> */}
          <Routes>
            <Route path="/usa" element={<USADcfCalculatorContainer />} />
            <Route path="/india" element={<IndianDcfCalculatorContainer />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}
