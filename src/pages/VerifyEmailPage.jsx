import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader, Sun, Moon } from 'lucide-react';
import { verifyEmail } from '../api/authApi';

function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState('loading');
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authThemeDark') === 'true';
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('authThemeDark', isDark.toString());
  }, [isDark]);

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        return;
      }

      try {
        await verifyEmail(token);
        setStatus('success');
      } catch (error) {
        console.error('Verify error:', error);
        setStatus('error');
      }
    };

    verify();
  }, [token]);

  const getIcon = () => {
    if (status === 'loading') {
      return <Loader size={48} className="text-blue-600 dark:text-blue-400 animate-spin mx-auto" />;
    }
    if (status === 'success') {
      return <CheckCircle size={48} className="text-green-600 dark:text-green-400 mx-auto" />;
    }
    return <AlertCircle size={48} className="text-red-600 dark:text-red-400 mx-auto" />;
  };

  const getGradient = () => {
    if (status === 'success') return 'from-green-600 to-emerald-600';
    if (status === 'error') return 'from-red-600 to-rose-600';
    return 'from-blue-600 to-indigo-600';
  };

  const getBackgroundGradient = () => {
    if (isDark) {
      if (status === 'success') return 'from-gray-900 via-green-900 to-teal-900';
      if (status === 'error') return 'from-gray-900 via-slate-800 to-stone-900';
      return 'from-gray-900 via-blue-900 to-purple-900';
    } else {
      if (status === 'success') return 'from-green-50 via-emerald-50 to-teal-50';
      if (status === 'error') return 'from-red-50 via-rose-50 to-pink-50';
      return 'from-blue-50 via-indigo-50 to-purple-50';
    }
  };

  return (
    <div className={`relative flex min-h-screen items-center justify-center bg-linear-to-br ${getBackgroundGradient()} px-4 py-8 overflow-hidden ${isDark ? 'dark' : ''}`}>
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Gradient blobs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        
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
        <div className="rounded-2xl border border-white/20 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl p-8 shadow-2xl text-center">
          {/* Status icon */}
          <div className="mb-6 flex justify-center">
            {getIcon()}
          </div>

          {status === 'loading' ? (
            <>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Verifying Email
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                Please wait while we confirm your email address...
              </p>
              <div className="h-1 w-full bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full opacity-50 mb-6"></div>
            </>
          ) : null}

          {status === 'success' ? (
            <>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-green-600 to-emerald-600 mb-2">
                Email Verified!
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                Your email has been successfully verified. You can now sign in to your account.
              </p>
              <div className="h-1 w-full bg-linear-to-r from-green-500 via-emerald-500 to-teal-500 rounded-full opacity-50 mb-6"></div>
            </>
          ) : null}

          {status === 'error' ? (
            <>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-red-400 to-rose-400 mb-2">
                Verification Failed
              </h1>
              <p className="text-sm text-red-700 dark:text-red-100 mb-6">
                The verification link is invalid or has expired. Please request a new one.
              </p>
              <div className="h-1 w-full bg-linear-to-r from-red-400 via-rose-400 to-pink-400 rounded-full mb-6"></div>
            </>
          ) : null}

          <Link
            to="/login"
            className={`inline-block rounded-lg bg-linear-to-r ${getGradient()} px-6 py-2 text-sm font-medium text-white transition hover:shadow-lg dark:shadow-lg`}
          >
            Go to Sign In
          </Link>
        </div>

        {/* Bottom decoration */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {status === 'success' && '✨ Welcome back!'}
            {status === 'error' && '🔄 Request a new verification link'}
            {status === 'loading' && '⏳ Almost there...'}
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

export default VerifyEmailPage;
