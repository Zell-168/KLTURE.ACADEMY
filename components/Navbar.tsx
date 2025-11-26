import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLang, useAuth } from '../App';
import { Menu, X, Globe, User, LogOut, LogIn, Wallet } from 'lucide-react';
import { useCreditBalance } from '../lib/hooks';

const Navbar: React.FC = () => {
  const { t, lang, toggleLang } = useLang();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { balance: creditBalance, loading: creditLoading } = useCreditBalance();

  const handleNav = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const navLinks = [
    { name: t.nav.home, path: '/' },
    { name: t.nav.mini, path: '/mini' },
    { name: t.nav.other, path: '/other' },
    { name: t.nav.online, path: '/online' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-zinc-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center" onClick={() => setIsOpen(false)}>
             <span className="font-black text-2xl tracking-tighter text-zinc-900">
                KLTURE<span className="text-red-600">.</span>ACADEMY
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm font-medium text-zinc-600 hover:text-black transition-colors"
              >
                {link.name}
              </Link>
            ))}
            
            <button 
              onClick={toggleLang}
              className="flex items-center gap-1 text-sm font-semibold text-zinc-500 hover:text-black border border-zinc-200 px-2 py-1 rounded"
            >
              <Globe size={14} />
              {lang === 'en' ? 'KH' : 'EN'}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                 {/* Credit Balance Badge */}
                 {!creditLoading && (
                   <div className="flex items-center gap-1.5 text-zinc-700 font-bold text-sm bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-md">
                     <Wallet size={16} className="text-green-600" />
                     ${creditBalance}
                   </div>
                 )}

                 <Link
                  to="/profile"
                  className="flex items-center gap-2 text-zinc-700 hover:text-black font-semibold text-sm border border-zinc-200 px-4 py-2 rounded-md transition-colors"
                >
                  <User size={16} />
                  {t.nav.profile}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold text-sm border border-red-100 px-3 py-2 rounded-md hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  {t.nav.signOut}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/signin"
                  className="text-zinc-700 hover:text-black font-bold text-sm px-3 py-2"
                >
                  {t.nav.signIn}
                </Link>
                <Link
                  to="/contact"
                  className="bg-red-600 text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
                >
                  {t.nav.register}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
             <button 
              onClick={toggleLang}
              className="text-sm font-bold text-zinc-600"
            >
              {lang === 'en' ? 'KH' : 'EN'}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-zinc-900">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-zinc-100 absolute w-full h-screen left-0 top-20 px-4 py-6 flex flex-col gap-6 overflow-y-auto pb-32">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNav(link.path)}
              className="text-left text-xl font-medium text-zinc-800"
            >
              {link.name}
            </button>
          ))}
          
          <div className="flex flex-col gap-4 mt-2">
             <button
              onClick={() => handleNav('/about')}
              className="text-left text-xl font-medium text-zinc-500"
            >
              {t.nav.about}
            </button>
             <button
              onClick={() => handleNav('/faq')}
              className="text-left text-xl font-medium text-zinc-500"
            >
              {t.nav.faq}
            </button>
          </div>

          <div className="h-px bg-zinc-100 my-2"></div>
          
          {user ? (
            <div className="flex flex-col gap-3">
               {/* Mobile Credit Balance */}
               {!creditLoading && (
                 <div className="flex items-center justify-between px-4 py-3 bg-zinc-50 rounded-lg border border-zinc-200">
                    <span className="text-zinc-600 font-medium">Your Credits</span>
                    <span className="flex items-center gap-2 font-bold text-lg">
                      <Wallet size={20} className="text-green-600" />
                      ${creditBalance}
                    </span>
                 </div>
               )}

              <button
                onClick={() => handleNav('/profile')}
                className="flex items-center justify-center gap-2 w-full py-4 border border-zinc-300 rounded-lg text-lg font-bold"
              >
                <User size={20} />
                {t.nav.profile}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full py-4 bg-zinc-100 text-red-600 rounded-lg text-lg font-bold"
              >
                <LogOut size={20} />
                {t.nav.signOut}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleNav('/signin')}
                className="flex items-center justify-center gap-2 w-full py-4 border border-zinc-300 rounded-lg text-lg font-bold"
              >
                <LogIn size={20} />
                {t.nav.signIn}
              </button>
              <button
                onClick={() => handleNav('/contact')}
                className="bg-red-600 text-white w-full py-4 rounded-lg text-lg font-bold text-center shadow-xl shadow-red-600/20"
              >
                {t.nav.register}
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;