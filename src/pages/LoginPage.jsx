import { useState } from "react";
import Icon from "../components/Icon";
import { useApp } from "../context/AppContext";

const LoginPage = () => {
  const { login, navigate } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    window.setTimeout(() => {
      const result = login(email, password);
      if (!result.success) setError(result.message);
      setLoading(false);
    }, 350);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600">
            <Icon name="brain" className="h-9 w-9 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">QuizMind</h1>
          <p className="mt-1 text-gray-500">College quiz management system</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">Sign in to your account</h2>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <Icon name="alert-circle" className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Email or Roll Number</label>
              <div className="relative">
                <Icon name="mail" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm transition-colors focus:border-brand-500"
                  placeholder="Enter your email or roll number"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Icon name="lock" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm transition-colors focus:border-brand-500"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-2.5 font-medium text-white transition-colors hover:bg-brand-700 disabled:bg-brand-400"
            >
              {loading ? (
                <>
                  <Icon name="loader-2" className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Icon name="log-in" className="h-4 w-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="font-medium text-brand-600 transition-colors hover:text-brand-700"
              >
                Register here
              </button>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">Built for role-based college quiz workflows.</p>
      </div>
    </div>
  );
};

export default LoginPage;
