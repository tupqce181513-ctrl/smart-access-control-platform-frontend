import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

function HeroSection() {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-blue-600 via-blue-700 to-indigo-900 px-4 py-20 text-white sm:px-6 lg:px-8">
      {/* Animated background elements - Enhanced */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main blobs with complex animations */}
        <div
          className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"
          style={{
            animation: 'blob 7s infinite',
          }}
        ></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          style={{
            animation: 'blob 7s infinite 2s',
          }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          style={{
            animation: 'blob 7s infinite 4s',
          }}
        ></div>

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-200 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + i}s infinite ease-in-out`,
              animationDelay: `${i * 0.5}s`,
            }}
          ></div>
        ))}

        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent),
                            linear-gradient(90deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent)`,
            backgroundSize: '50px 50px',
          }}
        ></div>
      </div>

      {/* Glow effect - follows mouse */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px at ${50 + mousePosition.x}% ${50 + mousePosition.y}%, rgba(59, 130, 246, 0.1), transparent 80%)`,
        }}
      ></div>

      {/* Content */}
      <div className="mx-auto max-w-4xl text-center relative z-10">
        {/* Sparkle icon animated */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-2 border border-white/20 animate-fade-in-down">
          <Sparkles size={16} className="text-yellow-300 animate-spin" style={{ animationDuration: '3s' }} />
          <span className="text-sm font-medium text-blue-100">Giải pháp hiện đại cho bảo mật</span>
        </div>

        <h1 className="mb-6 text-5xl font-bold leading-tight animate-fade-in-up text-transparent bg-clip-text bg-linear-to-r from-white via-blue-100 to-blue-200 sm:text-7xl">
          Nền Tảng Quản Lý Kiểm Soát Truy Cập Thông Minh
        </h1>

        <p className="mb-8 text-xl text-blue-100 animate-fade-in-up animation-delay-200 sm:text-2xl leading-relaxed">
          Kiểm soát toàn quyền đối với truy cập thiết bị của bạn, giám sát hoạt động thời gian thực và quản lý quyền hạn một cách dễ dàng.
        </p>

        <div className="flex flex-col justify-center gap-4 animate-fade-in-up animation-delay-400 sm:flex-row">
          <button
            onClick={() => navigate('/login')}
            className="group relative inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 transition-all duration-300 hover:scale-110 hover:shadow-2xl active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white to-transparent translate-x-full group-hover:translate-x-0 transition-transform duration-500 opacity-40"></div>
            <span className="relative">Đăng Nhập</span>
            <ArrowRight size={20} className="relative group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => navigate('/register')}
            className="group relative inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white bg-white/10 backdrop-blur-md px-8 py-3 font-semibold text-white transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:bg-white/20 active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white to-transparent translate-x-full group-hover:translate-x-0 transition-transform duration-500 opacity-20"></div>
            <span className="relative">Đăng Ký Ngay</span>
            <ArrowRight size={20} className="relative group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          33% { transform: translate(30px, -50px) scale(1.1) rotate(120deg); }
          66% { transform: translate(-20px, 20px) scale(0.9) rotate(240deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.6; }
          50% { transform: translateY(-30px) translateX(10px); opacity: 0.3; }
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

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-blob {
          animation: blob 8s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in-down {
          animation: fadeInDown 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
}

export default HeroSection;
