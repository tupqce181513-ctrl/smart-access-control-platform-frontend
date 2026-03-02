import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Home, Sun, Moon } from 'lucide-react';

function NotFoundPage() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authThemeDark') === 'true';
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('authThemeDark', isDark.toString());
  }, [isDark]);

  return (
    <div className={`relative flex min-h-screen items-center justify-center bg-linear-to-br ${isDark ? 'from-gray-900 via-slate-900 to-gray-900' : 'from-slate-50 via-gray-50 to-stone-50'} px-4 py-8 overflow-hidden ${isDark ? 'dark' : ''}`}>
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Gradient blobs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-slate-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-stone-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        
        {/* Grid background */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent),
                           linear-gradient(90deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent)`,
          backgroundSize: '50px 50px',
        }}></div>
      </div>

      {/* Theme toggle */}
      <button
        onClick={() => setIsDark(!isDark)}
        className="absolute top-6 right-6 z-20 p-2 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition text-gray-700 dark:text-gray-300"
        aria-label="Toggle theme"
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        <div className="rounded-2xl border border-white/20 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl p-8 shadow-2xl">
          {/* Icon badge */}
          <div className="mb-6 flex justify-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-gray-600 to-slate-600 shadow-lg">
              <Search size={32} className="text-white" />
            </div>
          </div>

          {/* 404 Number */}
          <h1 className="text-6xl md:text-7xl font-black text-center text-gray-900 dark:text-gray-100 mb-4 tracking-tight">
            404
          </h1>

          {/* Main message */}
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-2">
            Page Not Found
          </h2>
          <p className="text-center text-sm text-gray-600 dark:text-gray-300 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Gradient divider */}
          <div className="mb-6 h-1 w-full bg-linear-to-r from-gray-500 via-slate-500 to-stone-500 rounded-full opacity-50"></div>

          {/* Action buttons */}
          <div className="space-y-3">
            <Link
              to="/"
              className="block w-full rounded-lg bg-linear-to-r from-gray-600 to-slate-600 px-6 py-3 text-center text-sm font-medium text-white transition hover:shadow-lg hover:shadow-gray-500/50 dark:shadow-lg flex items-center justify-center gap-2"
            >
              <Home size={18} />
              Go to Home
            </Link>

            <button
              onClick={() => window.history.back()}
              className="block w-full rounded-lg border-2 border-gray-400 dark:border-gray-500 px-6 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300 transition hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              Go Back
            </button>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Need help? Contact support
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

export default NotFoundPage;
