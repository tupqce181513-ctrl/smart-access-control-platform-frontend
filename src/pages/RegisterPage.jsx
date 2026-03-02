import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { UserPlus, Sun, Moon, Home } from 'lucide-react';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuth } from '../hooks/useAuth';

function RegisterPage() {
  const { isAuthenticated } = useAuth();
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authThemeDark') === 'true';
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('authThemeDark', isDark.toString());
  }, [isDark]);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className={`relative flex min-h-screen items-center justify-center bg-linear-to-br ${isDark ? 'from-gray-900 via-green-900 to-teal-900' : 'from-green-50 via-emerald-50 to-teal-50'} px-4 py-8 overflow-hidden ${isDark ? 'dark' : ''}`}>
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Gradient blobs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        
        {/* Grid background */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent),
                           linear-gradient(90deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent)`,
          backgroundSize: '50px 50px',
        }}></div>
      </div>

      {/* Navigation buttons */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-20 p-2 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition text-gray-700 dark:text-gray-300"
        aria-label="Go to home"
      >
        <Home size={20} />
      </Link>

      {/* Theme toggle */}
      <button
        onClick={() => setIsDark(!isDark)}
        className="absolute top-6 right-6 z-20 p-2 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition text-gray-700 dark:text-gray-300"
        aria-label="Toggle theme"
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <Toaster position="top-right" />
      
      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        <div className="rounded-2xl border border-white/20 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl p-8 shadow-2xl">
          {/* Logo and header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-green-600 to-emerald-600 mb-4 shadow-lg">
              <UserPlus size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-green-600 to-emerald-600">
              Join Us
            </h1>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Smart Access Control</p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Create your account</p>
          </div>

          {/* Gradient divider */}
          <div className="mb-6 h-1 w-full bg-linear-to-r from-green-500 via-emerald-500 to-teal-500 rounded-full opacity-50"></div>

          <RegisterForm />
        </div>

        {/* Bottom decoration */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            ✨ Start your secure access journey today
          </p>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}

export default RegisterPage;
