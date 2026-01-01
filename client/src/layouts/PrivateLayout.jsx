import { useState, useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { FaSearch, FaPen, FaUser, FaHome, FaBookmark, FaFileAlt, FaBell, FaCog } from "react-icons/fa";
import NotificationDropdown from "../components/notification/NotificationDropdown";

const PrivateLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">Blog Website</span>
          </Link>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-gray-100 rounded-full p-1">
            <Link
              to="/dashboard"
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                isActive("/dashboard")
                  ? "bg-white text-green-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FaHome size={14} />
              Home
            </Link>
            <Link
              to="/bookmarks"
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                isActive("/bookmarks")
                  ? "bg-white text-green-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FaBookmark size={14} />
              Saved
            </Link>
            <Link
              to="/drafts"
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                isActive("/drafts")
                  ? "bg-white text-green-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FaFileAlt size={14} />
              Drafts
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="hidden lg:block">
              <form onSubmit={handleSearch} className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition"
                />
              </form>
            </div>

            {/* Mobile search toggle */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition"
            >
              <FaSearch size={18} />
            </button>

            {/* Write button */}
            <Link
              to="/new-story"
              className="flex items-center gap-2 px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium transition shadow-sm"
            >
              <FaPen size={14} />
              <span className="hidden sm:inline">Write</span>
            </Link>

            {/* Notifications */}
            <NotificationDropdown />

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-semibold shadow-sm hover:shadow-md transition"
              >
                <FaUser size={16} />
              </button>

              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">My Account</p>
                    </div>
                    <Link
                      to={`/profile/${userId}`}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FaUser size={14} className="text-gray-400" />
                      Profile
                    </Link>
                    <Link
                      to="/bookmarks"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FaBookmark size={14} className="text-gray-400" />
                      Bookmarks
                    </Link>
                    <Link
                      to="/drafts"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FaFileAlt size={14} className="text-gray-400" />
                      Drafts
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FaCog size={14} className="text-gray-400" />
                      Settings
                    </Link>
                    <hr className="my-2 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile search bar */}
        {showSearch && (
          <div className="lg:hidden px-4 pb-3 bg-white border-t border-gray-100">
            <form onSubmit={handleSearch} className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </form>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet context={{ searchQuery }} />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex items-center justify-around py-2">
          <Link
            to="/dashboard"
            className={`flex flex-col items-center gap-1 px-4 py-2 ${
              isActive("/dashboard") ? "text-green-600" : "text-gray-500"
            }`}
          >
            <FaHome size={20} />
            <span className="text-xs">Home</span>
          </Link>
          <Link
            to="/search"
            className={`flex flex-col items-center gap-1 px-4 py-2 ${
              isActive("/search") ? "text-green-600" : "text-gray-500"
            }`}
          >
            <FaSearch size={20} />
            <span className="text-xs">Search</span>
          </Link>
          <Link
            to="/new-story"
            className="flex flex-col items-center gap-1 px-4 py-2"
          >
            <div className="w-12 h-12 -mt-6 bg-green-600 rounded-full flex items-center justify-center shadow-lg">
              <FaPen size={18} className="text-white" />
            </div>
          </Link>
          <Link
            to="/bookmarks"
            className={`flex flex-col items-center gap-1 px-4 py-2 ${
              isActive("/bookmarks") ? "text-green-600" : "text-gray-500"
            }`}
          >
            <FaBookmark size={20} />
            <span className="text-xs">Saved</span>
          </Link>
          <Link
            to={`/profile/${userId}`}
            className={`flex flex-col items-center gap-1 px-4 py-2 ${
              location.pathname.includes("/profile") ? "text-green-600" : "text-gray-500"
            }`}
          >
            <FaUser size={20} />
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </nav>

      {/* Spacer for mobile bottom nav */}
      <div className="md:hidden h-20"></div>
    </div>
  );
};

export default PrivateLayout;
