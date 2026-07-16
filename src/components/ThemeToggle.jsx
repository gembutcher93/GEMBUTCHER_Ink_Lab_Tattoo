import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      data-testid="theme-toggle"
      onClick={toggleTheme}
      aria-label={isLight ? "Passa al tema scuro" : "Passa al tema chiaro"}
      title={isLight ? "Tema scuro" : "Tema chiaro"}
      className="relative flex items-center justify-center w-9 h-9 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md transition-colors duration-200 hover:border-cyan-neon/40 focus-visible:outline-none focus-visible:ring-2"
      style={{ borderColor: "var(--gb-line)" }}
    >
      <Sun
        className="w-4 h-4 absolute transition-all duration-300"
        style={{
          color: "var(--gb-orange)",
          opacity: isLight ? 0 : 1,
          transform: isLight ? "rotate(90deg) scale(0.5)" : "rotate(0) scale(1)",
        }}
      />
      <Moon
        className="w-4 h-4 absolute transition-all duration-300"
        style={{
          color: "var(--gb-cyan)",
          opacity: isLight ? 1 : 0,
          transform: isLight ? "rotate(0) scale(1)" : "rotate(-90deg) scale(0.5)",
        }}
      />
    </button>
  );
};

export default ThemeToggle;
