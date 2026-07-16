import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LangProvider } from "@/context/LangContext";
import { ThemeProvider } from "@/context/ThemeContext";
import LandingPage from "@/pages/LandingPage";

function App() {
  return (
    <div className="App">
      <ThemeProvider>
      <LangProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </BrowserRouter>
      </LangProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
