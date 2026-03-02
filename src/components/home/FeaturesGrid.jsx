import { Lock, BarChart3, Bell, Smartphone } from 'lucide-react';
import { useState } from 'react';

function FeaturesGrid() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const features = [
    {
      icon: Lock,
      title: 'Truy Cập An Toàn',
      description: 'Kiểm soát ai có thể truy cập thiết bị của bạn với quyền hạn chi tiết',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: BarChart3,
      title: 'Nhật Ký Hoạt Động',
      description: 'Theo dõi tất cả các nỗ lực truy cập và tương tác thiết bị',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Bell,
      title: 'Cảnh Báo Thời Gian Thực',
      description: 'Nhận thông báo ngay lập tức cho các sự kiện quan trọng',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Smartphone,
      title: 'Quản Lý Thiết Bị',
      description: 'Quản lý và giám sát tất cả thiết bị của bạn từ một nơi',
      color: 'from-green-500 to-emerald-500'
    },
  ];

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.4), transparent 50%), 
                           radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.4), transparent 50%)`,
        }} className="absolute inset-0"></div>
      </div>

      <div className="mx-auto max-w-7xl relative z-10">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
            Tính Năng Chính
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Mọi công cụ bạn cần để quản lý truy cập an toàn và hiệu quả
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={feature.title}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`relative group rounded-2xl p-8 transition-all duration-500 cursor-pointer transform
                  ${isHovered 
                    ? `bg-linear-to-br ${feature.color} text-white shadow-2xl scale-105 z-20` 
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg border border-gray-100 dark:border-gray-700'
                  }`}
                style={{
                  animation: `slideUp 0.6s ease-out forwards`,
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                {/* Shimmer effect on hover */}
                {isHovered && (
                  <div className="absolute inset-0 rounded-2xl" style={{
                    background: 'linear-gradient(135deg, transparent 20%, rgba(255,255,255,0.15) 50%, transparent 80%)',
                    animation: 'shimmer 2s infinite'
                  }} />
                )}

                <div className="relative z-10">
                  {/* Icon with complex animation */}
                  <div className={`mb-6 inline-block rounded-xl p-4 transition-all duration-500 transform
                    ${isHovered 
                      ? 'bg-white/20 scale-125 -rotate-6' 
                      : 'bg-gray-100 dark:bg-gray-700 scale-100 rotate-0'
                    }`}
                  >
                    <Icon
                      size={32}
                      className={`transition-all duration-500 ${
                        isHovered 
                          ? 'text-white scale-125 rotate-12' 
                          : `text-blue-600 dark:text-blue-400 ${hoveredIndex !== null && index !== hoveredIndex ? 'opacity-40 scale-75' : ''}`
                      }`}
                      style={{
                        filter: isHovered ? 'drop-shadow(0 0 12px rgba(255,255,255,0.6))' : 'none'
                      }}
                    />
                  </div>

                  <h3 className="mb-3 text-xl font-bold transition-all duration-300">
                    {feature.title}
                  </h3>

                  <p className={`transition-all duration-300 leading-relaxed ${
                    isHovered 
                      ? 'text-white/90' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {feature.description}
                  </p>

                  {/* Floating interaction text */}
                  {isHovered && (
                    <div className="mt-6 inline-flex items-center gap-2 text-white text-sm font-semibold opacity-0 animate-fade-in-delayed">
                      <span>Tìm hiểu thêm</span>
                      <div className="w-5 h-5 rounded-full border border-white flex items-center justify-center">
                        <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
                      </div>
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

export default FeaturesGrid;
