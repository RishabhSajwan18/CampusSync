import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/report";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface text-content">
      <Navbar />
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <form onSubmit={handleSubmit} className="card w-full max-w-md p-6 sm:p-8">
          <h1 className="text-xl font-semibold text-content">Login</h1>
          <p className="mt-1 text-sm text-content-muted">Sign in to report lost or found items.</p>

          {error && (
            <div className="mt-4 rounded-md border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
              {error}
            </div>
          )}

          <div className="mt-5 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-xs font-medium text-content-muted">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1 block text-xs font-medium text-content-muted">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                disabled={loading}
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? "Signing in..." : "Login"}
            </button>
          </div>

          <p className="mt-4 text-center text-sm text-content-muted">
            No account?{" "}
            <Link to="/signup" className="text-primary hover:text-accent">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
