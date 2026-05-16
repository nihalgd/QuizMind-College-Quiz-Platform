import { useState } from "react";
import { useApp } from "../context/AppContext";
import Icon from "../components/Icon";

const LoginPage = () => {
  const { login } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      if (!result.success) {
        setError(result.message);
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-600 rounded-2xl mb-4">
            <Icon name="brain" className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">QuizMind</h1>
          <p className="text-gray-500 mt-1">AI-Powered College Quiz Platform</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Sign in to your account</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700">
              <Icon name="alert-circle" className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email or Roll Number</label>
              <div className="relative">
                <Icon name="mail" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-brand-500 transition-colors"
                  placeholder="Enter your email or roll number"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Icon name="lock" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-brand-500 transition-colors"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Icon name="loader-2" className="w-4 h-4 animate-spin" /> Signing in...</>
              ) : (
                <><Icon name="log-in" className="w-4 h-4" /> Sign In</>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-500 mb-3">Demo Credentials</p>
            <div className="space-y-1.5">
              <button onClick={() => { setEmail("student@skitm.in"); setPassword("password"); }} className="w-full text-left text-xs px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                <span className="font-semibold">Student:</span> student@skitm.in / password
              </button>
              <button onClick={() => { setEmail("teacher@skitm.in"); setPassword("password"); }} className="w-full text-left text-xs px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors">
                <span className="font-semibold">Teacher:</span> teacher@skitm.in / password
              </button>
              <button onClick={() => { setEmail("admin@skitm.in"); setPassword("password"); }} className="w-full text-left text-xs px-3 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                <span className="font-semibold">Admin:</span> admin@skitm.in / password
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">© 2024 QuizMind. All rights reserved.</p>
      </div>
    </div>
  );
};

export default LoginPage;
