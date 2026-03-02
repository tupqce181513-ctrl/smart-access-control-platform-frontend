import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import HeroSection from '../components/home/HeroSection';
import FeaturesGrid from '../components/home/FeaturesGrid';
import BenefitsCard from '../components/home/BenefitsCard';
import StepsSection from '../components/home/StepsSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import Footer from '../components/home/Footer';
import ChatWidget from '../components/home/ChatWidget';

function HomePage() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('homethemeDark') === 'true';
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('homethemeDark', isDark.toString());
  }, [isDark]);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} ${isDark ? 'dark' : ''}`}>
      {/* Theme toggle */}
      <button
        onClick={() => setIsDark(!isDark)}
        className="fixed top-6 right-6 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition shadow-md"
        aria-label="Toggle theme"
      >
        {isDark ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-gray-600" />}
      </button>

      <HeroSection />
      <FeaturesGrid />
      <BenefitsCard />
      <StepsSection />
      <TestimonialsSection />
      <Footer />
      <ChatWidget />
    </div>
  );
}

export default HomePage;
