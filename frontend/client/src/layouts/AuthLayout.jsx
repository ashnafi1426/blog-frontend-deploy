import { Outlet, Link } from "react-router-dom";
import { FaPen } from "react-icons/fa";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <Link to="/" className="flex items-center gap-3 mb-12">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <FaPen className="text-white" size={24} />
            </div>
            <span className="text-3xl font-bold">Medium</span>
          </Link>
          
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Share your story<br />with the world
          </h1>
          
          <p className="text-xl text-white/80 mb-8 max-w-md">
            Join millions of readers and writers discovering ideas, knowledge, and perspectives.
          </p>
          
          <div className="flex items-center gap-8 text-white/70">
            <div>
              <div className="text-3xl font-bold text-white">100M+</div>
              <div className="text-sm">Monthly readers</div>
            </div>
            <div className="w-px h-12 bg-white/30"></div>
            <div>
              <div className="text-3xl font-bold text-white">500K+</div>
              <div className="text-sm">Writers</div>
            </div>
            <div className="w-px h-12 bg-white/30"></div>
            <div>
              <div className="text-3xl font-bold text-white">1M+</div>
              <div className="text-sm">Stories</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Mobile Header */}
        <header className="lg:hidden py-6 px-6 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <FaPen className="text-white" size={16} />
            </div>
            <span className="text-xl font-bold text-gray-900">Medium</span>
          </Link>
        </header>

        {/* Auth Content */}
        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 px-6 border-t border-gray-100">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
            <Link to="/" className="hover:text-green-600 transition">Home</Link>
            <span>•</span>
            <a href="#" className="hover:text-green-600 transition">Help</a>
            <span>•</span>
            <a href="#" className="hover:text-green-600 transition">Privacy</a>
            <span>•</span>
            <a href="#" className="hover:text-green-600 transition">Terms</a>
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">
            © {new Date().getFullYear()} Medium Clone. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};
export default AuthLayout;
