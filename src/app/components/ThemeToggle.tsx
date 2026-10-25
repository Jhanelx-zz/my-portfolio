// src/app/components/ThemeToggle.tsx
"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

function subscribeToTheme(callback: () => void) {
  window.addEventListener("theme-change", callback);
  return () => window.removeEventListener("theme-change", callback);
}

function getThemeSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerThemeSnapshot() {
  return false;
}

export default function ThemeToggle() {
  const darkMode = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    window.dispatchEvent(new Event("theme-change"));
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
      title={`Switch to ${darkMode ? "light" : "dark"} mode`}
      className="rounded-full border border-black/10 bg-black/5 p-2 text-gray-700 transition hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10"
    >
      {darkMode ? (
        <Sun size={18} aria-hidden="true" />
      ) : (
        <Moon size={18} aria-hidden="true" />
      )}
    </button>
  );
}