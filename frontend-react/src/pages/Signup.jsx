import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signup(name, email, password);
      navigate("/report", { replace: true });
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
          <h1 className="text-xl font-semibold text-content">Create Account</h1>
          <p className="mt-1 text-sm text-content-muted">Join CampusSync to report items on campus.</p>

          {error && (
            <div className="mt-4 rounded-md border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
              {error}
            </div>
          )}

          <div className="mt-5 space-y-4">
            <div>
              <label htmlFor="name" className="mb-1 block text-xs font-medium text-content-muted">
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                disabled={loading}
              />
            </div>
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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                disabled={loading}
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </div>

          <p className="mt-4 text-center text-sm text-content-muted">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:text-accent">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
