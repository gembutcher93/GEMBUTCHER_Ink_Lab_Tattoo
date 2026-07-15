import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LangProvider } from "@/context/LangContext";
import LandingPage from "@/pages/LandingPage";

function App() {
  return (
    <div className="App">
      <LangProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </BrowserRouter>
      </LangProvider>
    </div>
  );
}

export default App;
