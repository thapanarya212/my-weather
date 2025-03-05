import { useEffect, useState, PropsWithChildren } from "react";
import { Header } from "./header";
import { ArrowUpCircle, Sun, Moon } from "lucide-react";

export function Layout({ children }: PropsWithChildren) {
  const [showScroll, setShowScroll] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Handle scroll visibility for the "Back to Top" button
  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className={`bg-gradient-to-br from-background to-muted ${darkMode ? "dark" : ""}`}>
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-opacity-80 backdrop-blur-md">
        <Header />
      </header>

      {/* Dark Mode Toggle Button */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-5 right-5 p-2 rounded-full bg-gray-800 text-white shadow-lg hover:bg-gray-700 transition"
      >
        {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>

      {/* Main Content */}
      <main className="min-h-screen container mx-auto px-4 py-8">{children}</main>

      {/* Footer */}
      <footer className="border-t backdrop-blur supports-[backdrop-filter]:bg-background/60 py-12">
        <div className="container mx-auto px-4 text-center text-gray-200">
          <p>Made with 💗 by Aaryan Adithy</p>
          <p>© {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {/* {showScroll && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-5 right-5 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-500 transition"
        >
          <ArrowUpCircle className="h-6 w-6" />
        </button>
      )} */}
    </div>
  );
}
