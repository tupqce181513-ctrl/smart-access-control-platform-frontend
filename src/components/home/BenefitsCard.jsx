import { Shield, Zap, TrendingUp, Layers } from 'lucide-react';
import { useState } from 'react';

function BenefitsCard() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const benefits = [
    {
      icon: Shield,
      title: 'Bảo Mật Cao',
      description: 'Bảo vệ thiết bị của bạn với mã hóa end-to-end và xác thực đa yếu tố',
      gradient: 'from-orange-500 to-red-500',
      bgHover: 'bg-orange-50 dark:bg-orange-950'
    },
    {
      icon: Zap,
      title: 'Hiệu Quả Cao',
      description: 'Tự động hóa quyền truy cập và tiết kiệm thời gian quản lý',
      gradient: 'from-yellow-500 to-orange-500',
      bgHover: 'bg-yellow-50 dark:bg-yellow-950'
    },
    {
      icon: TrendingUp,
      title: 'Độ Tin Cậy',
      description: 'Hệ thống hoạt động 24/7 với 99.9% uptime được đảm bảo',
      gradient: 'from-green-500 to-emerald-500',
      bgHover: 'bg-green-50 dark:bg-green-950'
    },
    {
      icon: Layers,
      title: 'Khả Năng Mở Rộng',
      description: 'Dễ dàng quản lý từ 1 đến hàng triệu thiết bị',
      gradient: 'from-purple-500 to-indigo-500',
      bgHover: 'bg-purple-50 dark:bg-purple-950'
    },
  ];

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-10">
        <div style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.3), transparent 50%),
                           radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.3), transparent 50%)`,
        }} className="absolute inset-0"></div>
      </div>

      <div className="mx-auto max-w-7xl relative z-10">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-white sm:text-5xl">Tại Sao Chọn Chúng Tôi</h2>
          <p className="text-xl text-gray-300">
            Chúng tôi cung cấp những lợi ích vượt trội đối với các nền tảng khác
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={benefit.title}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`relative group flex gap-6 rounded-2xl p-8 transition-all duration-500 cursor-pointer transform
                  ${isHovered 
                    ? `bg-linear-to-br ${benefit.gradient} text-white shadow-2xl scale-105 z-20` 
                    : 'bg-white/5 dark:bg-white/10 backdrop-blur text-white border border-white/10'
                  }`}
                style={{
                  animation: `slideUp 0.6s ease-out forwards`,
                  animationDelay: `${index * 0.15}s`,
                }}
              >
                {/* Shimmer effect */}
                {isHovered && (
                  <div className="absolute inset-0 rounded-2xl" style={{
                    background: 'linear-gradient(135deg, transparent 20%, rgba(255,255,255,0.2) 50%, transparent 80%)',
                    animation: 'shimmer 2s infinite'
                  }} />
                )}

                <div className="relative z-10 shrink-0">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-500 transform ${
                    isHovered 
                      ? `bg-white/30 scale-125 -rotate-6` 
                      : 'bg-white/10 scale-100 rotate-0'
                  }`}>
                    <Icon 
                      size={32}
                      className={`transition-all duration-500 ${
                        isHovered 
                          ? 'text-white scale-125 rotate-12' 
                          : `text-gray-300 ${hoveredIndex !== null && index !== hoveredIndex ? 'opacity-30 scale-75' : ''}`
                      }`}
                      style={{
                        filter: isHovered ? 'drop-shadow(0 0 12px rgba(255,255,255,0.5))' : 'none'
                      }}
                    />
                  </div>
                </div>

                <div className="relative z-10 flex-1">
                  <h3 className="mb-3 text-2xl font-bold transition-all duration-300">
                    {benefit.title}
                  </h3>
                  <p className={`transition-all duration-300 leading-relaxed ${
                    isHovered 
                      ? 'text-white/90' 
                      : 'text-gray-400'
                  }`}>
                    {benefit.description}
                  </p>

                  {/* Interactive element */}
                  {isHovered && (
                    <div className="mt-6 flex items-center gap-3 text-white/80 text-sm opacity-0 animate-fade-in-delayed">
                      <div className="flex-1 h-1 bg-white/30 rounded-full"></div>
                      <span>Khám phá</span>
                      <div className="flex-1 h-1 bg-white/30 rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }

        @keyframes fadeInDelayed {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-delayed {
          animation: fadeInDelayed 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  );
}

export default BenefitsCard;
