
import React from 'react';
import { useLang } from '../App';
import { Link } from 'react-router-dom';
import { Send, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useLang();

  return (
    <footer className="bg-zinc-950 text-white py-12 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Brand & Summary */}
          <div>
            <h2 className="text-2xl font-bold mb-2">KLTURE<span className="text-red-600">.</span>ACADEMY</h2>
            <p className="text-zinc-400 text-sm max-w-sm">{t.footer.summary}</p>
            <p className="text-zinc-500 text-xs mt-4">{t.footer.foundedBy}</p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3 md:items-center">
             <div className="flex flex-col gap-3">
                <Link to="/about" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hover:translate-x-1 duration-200 inline-flex">
                   {t.nav.about}
                </Link>
                <Link to="/faq" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hover:translate-x-1 duration-200 inline-flex">
                   {t.nav.faq}
                </Link>
             </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3 md:items-end">
             <a 
              href="https://t.me/Who_1s_meng" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-3 text-zinc-300 hover:text-white transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                <Send size={16} />
              </div>
              <span className="text-sm">Telegram: @Who_1s_meng</span>
            </a>
            <a 
              href="tel:+855889902595" 
              className="flex items-center gap-3 text-zinc-300 hover:text-white transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                <Phone size={16} />
              </div>
              <span className="text-sm">+855 88 990 2595</span>
            </a>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-zinc-900 text-center text-zinc-600 text-xs">
          © {new Date().getFullYear()} KLTURE.ACADEMY. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
