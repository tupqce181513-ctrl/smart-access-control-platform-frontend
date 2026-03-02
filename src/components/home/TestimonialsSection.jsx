import { useEffect, useState } from 'react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      role: 'Giám Đốc IT',
      company: 'Công Ty Tech ABC',
      text: 'Nền tảng này thực sự giúp chúng tôi quản lý truy cập thiết bị dễ dàng hơn.',
      rating: 5,
      avatar: '👨‍💼'
    },
    {
      id: 2,
      name: 'Trần Thị B',
      role: 'Quản Lý Bảo Mật',
      company: 'Doanh Nghiệp XYZ',
      text: 'Với tính năng giám sát thời gian thực, chúng tôi không còn lo lắng về bảo mật.',
      rating: 5,
      avatar: '👩‍💼'
    },
    {
      id: 3,
      name: 'Lê Hoàng C',
      role: 'CTO',
      company: 'Startup 123',
      text: 'Giao diện trực quan và dễ sử dụng, tiết kiệm rất nhiều thời gian cho team.',
      rating: 5,
      avatar: '👨‍💻'
    },
    {
      id: 4,
      name: 'Phạm Minh D',
      role: 'Quản Lý Kho',
      company: 'Tập Đoàn OEM',
      text: 'Tính năng quản lý thiết bị rất mạnh mẽ và linh hoạt cho nhu cầu của chúng tôi.',
      rating: 5,
      avatar: '👨‍🔧'
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length, autoPlay]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setAutoPlay(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setAutoPlay(false);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setAutoPlay(false);
  };

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div style={{
          backgroundImage: `radial-gradient(circle at 30% 50%, rgba(99, 102, 241, 0.4), transparent 50%),
                           radial-gradient(circle at 70% 50%, rgba(59, 130, 246, 0.4), transparent 50%)`,
        }} className="absolute inset-0"></div>
      </div>

      <div className="mx-auto max-w-5xl relative z-10">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
            Những Câu Chuyện Thành Công
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Nghe từ những khách hàng đã tin tưởng chúng tôi
          </p>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-2xl"
          onMouseEnter={() => setAutoPlay(false)}
          onMouseLeave={() => setAutoPlay(true)}
        >
          {/* Main Carousel */}
          <div className="relative h-96 overflow-hidden">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="absolute inset-0 transition-all duration-700 ease-out"
                style={{
                  opacity: index === currentIndex ? 1 : 0,
                  transform: index === currentIndex 
                    ? 'translateX(0) scale(1)' 
                    : index < currentIndex
                      ? 'translateX(-100%) scale(0.9)'
                      : 'translateX(100%) scale(0.9)',
                }}
              >
                <div className="h-full flex flex-col justify-between p-12 sm:p-16">
                  {/* Stars animated */}
                  <div className="flex gap-2 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span 
                        key={i} 
                        className="text-3xl text-yellow-400 transition-all duration-300 animate-bounce"
                        style={{
                          animationDelay: `${i * 0.1}s`,
                          animationDuration: '1.5s'
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  {/* Quote and text */}
                  <p className="mb-8 flex items-start gap-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    <Quote size={32} className="mt-2 shrink-0 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-xl font-medium">{testimonial.text}</span>
                  </p>

                  {/* Author info */}
                  <div className="flex items-center gap-4 border-t border-gray-200 dark:border-gray-700 pt-6">
                    <div className="text-5xl">{testimonial.avatar}</div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-lg">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.role} · <span className="font-semibold">{testimonial.company}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation arrows */}
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-6 pointer-events-none">
            <button
              onClick={goToPrevious}
              className="pointer-events-auto group p-2 rounded-full bg-white/80 dark:bg-gray-700/80 backdrop-blur hover:bg-white dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-lg"
            >
              <ChevronLeft size={24} className="text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0 transition-transform" />
            </button>
            <button
              onClick={goToNext}
              className="pointer-events-auto group p-2 rounded-full bg-white/80 dark:bg-gray-700/80 backdrop-blur hover:bg-white dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-lg"
            >
              <ChevronRight size={24} className="text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0 transition-transform" />
            </button>
          </div>
        </div>

        {/* Dots Navigation - Enhanced */}
        <div className="mt-12 flex justify-center gap-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'w-10 h-10 bg-linear-to-r from-indigo-500 to-blue-500 shadow-lg scale-110'
                  : 'w-3 h-3 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 hover:scale-125'
              }`}
            >
              {index === currentIndex && (
                <div 
                  className="absolute inset-0 rounded-full border-2 border-white dark:border-gray-200 opacity-50"
                  style={{
                    animation: 'pulse-ring 2s ease-out infinite'
                  }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Progress indicator */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            {currentIndex + 1} / {testimonials.length}
          </div>
          <div className="relative w-32 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / testimonials.length) * 100}%`
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-ring {
          0% {
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
          }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .animate-bounce {
          animation: bounce 1s ease-in-out infinite;
        }

        .dark {
          color-scheme: dark;
        }
      `}</style>
    </section>
  );
}

export default TestimonialsSection;
