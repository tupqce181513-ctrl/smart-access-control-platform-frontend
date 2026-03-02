import { UserPlus, LogIn, Settings, BarChart3 } from 'lucide-react';

function StepsSection() {
  const steps = [
    {
      icon: UserPlus,
      number: '1',
      title: 'Tạo Tài Khoản',
      description: 'Đăng ký tài khoản miễn phí và xác minh email của bạn',
      color: 'from-blue-500 to-cyan-500',
      iconColor: 'text-cyan-600 dark:text-white'
    },
    {
      icon: LogIn,
      number: '2',
      title: 'Đăng Nhập',
      description: 'Đăng nhập vào bảng điều khiển chính của bạn',
      color: 'from-cyan-500 to-teal-500',
      iconColor: 'text-teal-600 dark:text-white'
    },
    {
      icon: Settings,
      number: '3',
      title: 'Cấu Hình Thiết Bị',
      description: 'Thêm thiết bị và đặt quyền truy cập chi tiết',
      color: 'from-teal-500 to-green-500',
      iconColor: 'text-green-600 dark:text-white'
    },
    {
      icon: BarChart3,
      number: '4',
      title: 'Giám Sát',
      description: 'Theo dõi hoạt động và nhận thông báo theo thời gian thực',
      color: 'from-green-500 to-emerald-500',
      iconColor: 'text-emerald-600 dark:text-white'
    },
  ];

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-10 dark:opacity-20">
        <div style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.3), transparent 70%)`,
        }} className="absolute inset-0"></div>
      </div>

      <div className="mx-auto max-w-7xl relative z-10">
        <div className="mb-20 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
            Cách Hoạt Động
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Bắt đầu sử dụng trong 4 bước đơn giản
          </p>
        </div>

        {/* Steps container with connections */}
        <div className="relative">
          {/* Connection line - static gradient */}
          <div className="absolute top-10 left-0 right-0 h-1 hidden lg:block">
            <div className="h-full bg-linear-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-full opacity-50"></div>
          </div>

          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="relative group"
                  style={{
                    animation: `fadeInScale 0.6s ease-out forwards`,
                    animationDelay: `${index * 0.2}s`,
                  }}
                >
                  {/* Number circle - consistent styling */}
                  <div className="mb-6 flex justify-center relative">
                    <div
                      className={`relative inline-flex h-20 w-20 items-center justify-center rounded-full font-bold text-white text-xl transition-all duration-500 transform group-hover:scale-110 group-hover:shadow-2xl bg-linear-to-br ${step.color} shadow-lg`}
                    >
                      {step.number}
                    </div>
                  </div>

                  {/* Icon container - consistent styling */}
                  <div className="mb-6 text-center">
                    <div
                      className={`inline-flex items-center justify-center rounded-2xl p-6 transition-all duration-500 transform group-hover:scale-110 group-hover:shadow-xl bg-linear-to-br ${step.color} bg-opacity-10 dark:bg-opacity-20`}
                    >
                      <Icon
                        size={40}
                        className={`${step.iconColor} transition-all duration-500 group-hover:scale-110 group-hover:-rotate-12`}
                      />
                    </div>
                  </div>

                  {/* Text content - consistent styling */}
                  <div className="mb-6 text-center">
                    <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white transition-all duration-300 group-hover:scale-105">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 transition-all duration-300 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Bottom accent - animated dots */}
                  <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 transition-all duration-500">
                    <div className={`w-1 h-1 rounded-full transition-all duration-500 bg-linear-to-r ${step.color} opacity-50 group-hover:opacity-100 group-hover:scale-150`}></div>
                    <div className={`w-1 h-1 rounded-full transition-all duration-500 bg-linear-to-r ${step.color} opacity-30 group-hover:opacity-75`}></div>
                    <div className={`w-1 h-1 rounded-full transition-all duration-500 bg-linear-to-r ${step.color} opacity-50 group-hover:opacity-100 group-hover:scale-150`}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .dark {
          color-scheme: dark;
        }
      `}</style>
    </section>
  );
}

export default StepsSection;
