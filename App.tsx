
import React, { useState, createContext, useContext, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { TranslationData, Language, User } from './types';
import { TRANSLATIONS } from './constants';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import MiniProgram from './pages/MiniProgram';
import OtherPrograms from './pages/OtherPrograms';
import OnlineCourses from './pages/OnlineCourses';
import FreeCourses from './pages/FreeCourses';
import Community from './pages/Community';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import SignIn from './pages/SignIn';
import Profile from './pages/Profile';
import Trainers from './pages/Trainers';
import LearningClassroom from './pages/LearningClassroom';
import KltureAI from './pages/KltureAI';
import CaptionGenerator from './pages/ai/CaptionGenerator';
import TikTokGenerator from './pages/ai/TikTokGenerator';
import PromptGenerator from './pages/ai/PromptGenerator';
import { User as UserIcon } from 'lucide-react';

// Language Context
interface LangContextType {
  lang: Language;
  t: TranslationData;
  toggleLang: () => void;
}

const LangContext = createContext<LangContextType | undefined>(undefined);

export const useLang = () => {
  const context = useContext(LangContext);
  if (!context) throw new Error('useLang must be used within a LangProvider');
  return context;
};

// Auth Context
interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [user, setUser] = useState<User | null>(null);

  // Check local storage for user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('klture_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem('klture_user');
      }
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('klture_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('klture_user');
  };

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'kh' : 'en');
  };

  const t = TRANSLATIONS[lang];

  return (
    <LangContext.Provider value={{ lang, t, toggleLang }}>
      <AuthContext.Provider value={{ user, login, logout }}>
        <HashRouter>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen font-sans bg-white text-zinc-900">
            <Navbar />
            <main className="flex-grow pt-16">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/mini" element={<MiniProgram />} />
                <Route path="/other" element={<OtherPrograms />} />
                <Route path="/online" element={<OnlineCourses />} />
                <Route path="/free" element={<FreeCourses />} />
                <Route path="/community" element={<Community />} />
                <Route path="/trainers" element={<Trainers />} />
                <Route path="/about" element={<About />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/learning/:courseId" element={<LearningClassroom />} />
                
                {/* AI Tools */}
                <Route path="/klture-ai" element={<KltureAI />} />
                <Route path="/klture-ai/caption" element={<CaptionGenerator />} />
                <Route path="/klture-ai/tiktok" element={<TikTokGenerator />} />
                <Route path="/klture-ai/prompt" element={<PromptGenerator />} />
              </Routes>
            </main>
            <Footer />
            
            {/* Fixed "Our Trainers" Button */}
            <Link 
              to="/trainers" 
              className="fixed bottom-6 right-6 z-50 bg-red-600 text-white px-6 py-3 rounded-full font-bold shadow-2xl hover:bg-red-700 transition-all flex items-center gap-2 hover:scale-105 border-2 border-white group"
            >
              <UserIcon size={20} className="group-hover:animate-bounce" />
              {t.trainers.title}
            </Link>
          </div>
        </HashRouter>
      </AuthContext.Provider>
    </LangContext.Provider>
  );
};

export default App;
