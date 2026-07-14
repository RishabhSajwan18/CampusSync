import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { isAuthenticated, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-surface/95 backdrop-blur-sm">
      <nav className="mx-auto flex h-12 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="text-sm font-semibold text-content">
          CampusSync
        </Link>

        <div className="hidden items-center gap-6 sm:flex">
          <Link to="/" className="text-sm text-content-muted transition-colors duration-200 hover:text-content">
            Home
          </Link>
          <Link
            to="/browse"
            className="text-sm text-content-muted transition-colors duration-200 hover:text-content"
          >
            Browse
          </Link>

          {!loading && isAuthenticated ? (
            <>
              <Link
                to="/report"
                className="text-sm text-content-muted transition-colors duration-200 hover:text-content"
              >
                Report Item
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm text-content-muted transition-colors duration-200 hover:text-content"
              >
                Logout
              </button>
            </>
          ) : (
            !loading && (
              <>
                <Link
                  to="/login"
                  className="text-sm text-content-muted transition-colors duration-200 hover:text-content"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-sm text-content-muted transition-colors duration-200 hover:text-content"
                >
                  Signup
                </Link>
              </>
            )
          )}
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          AI Matching Active
        </span>
      </nav>
    </header>
  );
}
