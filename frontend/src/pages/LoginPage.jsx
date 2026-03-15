import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetUrl, setResetUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, googleLogin, forgotPass } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate('/');
    }
  };

  const handleGoogleLogin = async () => {
    // Mock Google login - in production, this would integrate with Google OAuth
    const mockGoogleData = {
      googleId: 'mock-google-id-' + Date.now(),
      email: 'demo@gmail.com',
      name: 'Demo User',
      avatar: 'https://via.placeholder.com/100'
    };
    const result = await googleLogin(mockGoogleData);
    if (result.success) {
      navigate('/');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    const result = await forgotPass(forgotEmail);
    if (result.success) {
      if (result.resetUrl) {
        setResetUrl(result.resetUrl);
      } else {
        setShowForgotPassword(false);
        setForgotEmail('');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-chocolate-800 via-chocolate-700 to-chocolate-900 flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-coral-400 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <span className="text-4xl">🍫</span>
            <span className="text-3xl font-display font-bold text-gold-400">ChocoDelight</span>
          </Link>
        </div>

        <div className="glass-card bg-white/95 p-8 shadow-2xl">
          <h2 className="text-2xl font-display font-bold text-chocolate-700 text-center mb-2">Welcome Back</h2>
          <p className="text-chocolate-400 text-center mb-8">Sign in to your sweet account</p>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50 transition-all duration-300 mb-6 shadow-sm"
          >
            <FcGoogle size={20} />
            <span>Continue with Google</span>
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-chocolate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-chocolate-400">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-chocolate-600 mb-1">Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-chocolate-300" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-11"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-chocolate-600 mb-1">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-chocolate-300" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-11 pr-11"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-chocolate-300 hover:text-chocolate-500"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 text-lg disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="text-center mt-4">
            <button
              onClick={() => setShowForgotPassword(true)}
              className="text-coral-400 hover:text-coral-500 text-sm font-medium transition-colors"
            >
              Forgot your password?
            </button>
          </div>

          <p className="text-center text-chocolate-400 mt-6 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-coral-400 font-semibold hover:text-coral-500 transition-colors">
              Create Account
            </Link>
          </p>
        </div>

        {/* Forgot Password Modal */}
        {showForgotPassword && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full">
              <h3 className="text-xl font-display font-bold text-chocolate-700 text-center mb-4">
                {resetUrl ? 'Reset Link Generated' : 'Reset Password'}
              </h3>

              {resetUrl ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 text-sm mb-2">
                      ✅ Reset link generated successfully! (Development Mode)
                    </p>
                    <p className="text-xs text-green-600 mb-3">
                      Check the server console for the full link, or copy the link below:
                    </p>
                    <div className="bg-white border rounded p-2 text-xs font-mono break-all">
                      {resetUrl}
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => navigator.clipboard.writeText(resetUrl)}
                      className="flex-1 py-3 px-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                    >
                      Copy Link
                    </button>
                    <button
                      onClick={() => {
                        setShowForgotPassword(false);
                        setResetUrl('');
                        setForgotEmail('');
                      }}
                      className="flex-1 py-3 px-4 border border-chocolate-200 text-chocolate-600 rounded-xl hover:bg-chocolate-50 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-chocolate-400 text-center mb-6">Enter your email address and we'll send you a link to reset your password.</p>

                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-chocolate-600 mb-1">Email</label>
                      <div className="relative">
                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-chocolate-300" />
                        <input
                          type="email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          className="input-field pl-11"
                          placeholder="you@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(false)}
                        className="flex-1 py-3 px-4 border border-chocolate-200 text-chocolate-600 rounded-xl hover:bg-chocolate-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 btn-primary py-3"
                      >
                        Send Reset Link
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
