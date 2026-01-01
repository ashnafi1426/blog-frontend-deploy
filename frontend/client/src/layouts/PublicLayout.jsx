import { useEffect, useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";

const PublicLayout = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(localStorage.getItem("theme") === "dark");
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-amber-400 dark:bg-gray-800 border-b border-gray-900 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-3xl font-serif font-bold text-gray-900 dark:text-white">
            Blog Website
          </Link>
          {/* Nav */}
          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className="hidden sm:block text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Our story
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className="hidden sm:block text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Membership
                </Link>
                <Link
                  to="/new-story"
                  className="hidden sm:block text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-semibold"
                >
                  Write
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/signup")}
                  className="hidden sm:block text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Membership
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="hidden sm:block text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-semibold"
                >
                  Write
                </button>
              </>
            )}

            {/* Theme toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              {isDark ? "☀️" : "🌙"}
            </button>

            {isLoggedIn ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Sign in
                </Link>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition"
                >
                  Get started
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
            <Link to="/about" className="hover:text-white">About</Link>
            <Link to="/help" className="hover:text-white">Help</Link>
            <Link to="/terms" className="hover:text-white">Terms</Link>
            <Link to="/privacy" className="hover:text-white">Privacy</Link>
            <Link to="/careers" className="hover:text-white">Careers</Link>
          </div>
          <p className="text-center text-gray-500 text-sm mt-4">
            © {new Date().getFullYear()} Medium Clone
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
