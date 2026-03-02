import { Mail, Phone, MapPin, Github, Linkedin, Twitter, ExternalLink } from 'lucide-react';
import { useState } from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();
  const [hoveredLink, setHoveredLink] = useState(null);

  const footerLinks = [
    { label: 'Trang Chủ', href: '#' },
    { label: 'Về Chúng Tôi', href: '#' },
    { label: 'Tính Năng', href: '#' },
    { label: 'Giá Cả', href: '#' },
  ];

  const legalLinks = [
    { label: 'Điều Khoản Dịch Vụ', href: '#' },
    { label: 'Chính Sách Bảo Mật', href: '#' },
    { label: 'Quản Lý Cookies', href: '#' },
  ];

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' },
  ];

  return (
    <footer className="relative bg-linear-to-b from-gray-950 to-black px-4 py-16 text-gray-300 sm:px-6 lg:px-8 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.3), transparent 50%),
                         radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.3), transparent 50%)`,
      }} />

      {/* Grid background */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(255,255,255,.02) 25%, rgba(255,255,255,.02) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.02) 75%, rgba(255,255,255,.02) 76%, transparent 77%, transparent),
                         linear-gradient(90deg, transparent 24%, rgba(255,255,255,.02) 25%, rgba(255,255,255,.02) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.02) 75%, rgba(255,255,255,.02) 76%, transparent 77%, transparent)`,
        backgroundSize: '60px 60px',
      }} />

      <div className="mx-auto max-w-7xl relative z-10">
        {/* Top section with branding */}
        <div className="mb-12 pb-8 border-b border-gray-800">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="mb-2 text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-indigo-400 to-purple-400">
                Smart Access Control
              </h2>
              <p className="max-w-md text-gray-400">
                Nền tảng quản lý kiểm soát truy cập thông minh cho các doanh nghiệp hiện đại
              </p>
            </div>
            {/* Social links - animated */}
            <div className="flex gap-4">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    className="group relative p-3 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 transition-all duration-300 hover:bg-white/20 hover:border-white/30 hover:scale-110 active:scale-95"
                    title={link.label}
                  >
                    <div className="absolute inset-0 rounded-xl bg-linear-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                    <Icon size={20} className="relative text-gray-300 group-hover:text-white transition-colors duration-300" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main footer grid */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          {/* Quick Links */}
          <div className="group animate-fade-in-up" style={{ animationDelay: '0s' }}>
            <h4 className="mb-6 text-lg font-semibold text-white relative inline-block">
              Liên Kết Nhanh
              <div className="absolute -bottom-2 left-0 h-1 w-0 bg-linear-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300 rounded-full" />
            </h4>
            <ul className="space-y-3 text-sm">
              {footerLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="text-gray-400 transition-all duration-300 hover:text-white hover:translate-x-2 inline-flex items-center gap-2 group/link"
                    onMouseEnter={() => setHoveredLink(`quick-${idx}`)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    {link.label}
                    <ExternalLink size={14} className="opacity-0 group-hover/link:opacity-100 transition-opacity duration-300" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="group animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h4 className="mb-6 text-lg font-semibold text-white relative inline-block">
              Pháp Lý
              <div className="absolute -bottom-2 left-0 h-1 w-0 bg-linear-to-r from-indigo-500 to-blue-500 group-hover:w-full transition-all duration-300 rounded-full" />
            </h4>
            <ul className="space-y-3 text-sm">
              {legalLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="text-gray-400 transition-all duration-300 hover:text-white hover:translate-x-2 inline-flex items-center gap-2 group/link"
                    onMouseEnter={() => setHoveredLink(`legal-${idx}`)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    {link.label}
                    <ExternalLink size={14} className="opacity-0 group-hover/link:opacity-100 transition-opacity duration-300" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact - Enhanced */}
          <div className="lg:col-span-2 group animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h4 className="mb-6 text-lg font-semibold text-white relative inline-block">
              Liên Hệ
              <div className="absolute -bottom-2 left-0 h-1 w-0 bg-linear-to-r from-purple-500 to-indigo-500 group-hover:w-full transition-all duration-300 rounded-full" />
            </h4>
            <div className="grid gap-6 sm:grid-cols-3">
              {/* Email */}
              <a
                href="mailto:support@smartaccess.com"
                className="relative group/contact p-4 rounded-xl bg-white/5 backdrop-blur border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-white/30 hover:scale-105 active:scale-95 overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-br from-blue-500 to-blue-600 opacity-0 group-hover/contact:opacity-10 transition-opacity duration-300" />
                <div className="relative flex items-start gap-3">
                  <Mail size={20} className="mt-0.5 text-blue-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-500 mb-1">Email</p>
                    <p className="text-sm text-gray-300 break-all">support@smartaccess.com</p>
                  </div>
                </div>
              </a>

              {/* Phone */}
              <a
                href="tel:+84281234567"
                className="relative group/contact p-4 rounded-xl bg-white/5 backdrop-blur border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-white/30 hover:scale-105 active:scale-95 overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-br from-purple-500 to-purple-600 opacity-0 group-hover/contact:opacity-10 transition-opacity duration-300" />
                <div className="relative flex items-start gap-3">
                  <Phone size={20} className="mt-0.5 text-purple-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-500 mb-1">Điện Thoại</p>
                    <p className="text-sm text-gray-300">+84 (28) 1234-5678</p>
                  </div>
                </div>
              </a>

              {/* Location */}
              <div className="relative group/contact p-4 rounded-xl bg-white/5 backdrop-blur border border-white/10 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-indigo-500 to-indigo-600 opacity-0 group-hover/contact:opacity-10 transition-opacity duration-300" />
                <div className="relative flex items-start gap-3">
                  <MapPin size={20} className="mt-0.5 text-indigo-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-500 mb-1">Địa Chỉ</p>
                    <p className="text-sm text-gray-300">TP. Hồ Chí Minh, Việt Nam</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom divider */}
        <div className="border-t border-gray-800 pt-8 pb-4">
          <div className="flex flex-col justify-between gap-4 text-sm text-gray-500 sm:flex-row">
            <p className="flex items-center gap-2">
              &copy; {currentYear} 
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400 font-semibold">
                Smart Access Control
              </span>
              • Tất cả quyền được bảo lưu
            </p>
            <p className="flex items-center gap-2">
              Thiết kế và phát triển bằng 
              <span className="animate-pulse text-red-500">❤️</span>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .dark {
          color-scheme: dark;
        }
      `}</style>
    </footer>
  );
}

export default Footer;
