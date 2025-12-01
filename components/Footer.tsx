
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
          <div className="flex flex-col gap-6 md:items-end">
             {/* Meng */}
             <div className="flex flex-col gap-1 md:items-end">
                <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Support (Meng)</span>
                <div className="flex flex-col md:items-end gap-1">
                  <a 
                    href="https://t.me/Who_1s_meng" 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors text-sm"
                  >
                    <Send size={14} className="text-blue-400" /> Telegram: @Who_1s_meng
                  </a>
                  <a 
                    href="tel:+855889902595" 
                    className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors text-sm"
                  >
                    <Phone size={14} className="text-green-400" /> +855 88 990 2595
                  </a>
                </div>
             </div>

             {/* Kimly */}
             <div className="flex flex-col gap-1 md:items-end">
                <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Support (Kimly)</span>
                <div className="flex flex-col md:items-end gap-1">
                  <a 
                    href="https://t.me/Kimly_yy" 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors text-sm"
                  >
                    <Send size={14} className="text-blue-400" /> Telegram: @Kimly_yy
                  </a>
                  <a 
                    href="tel:+85516859826" 
                    className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors text-sm"
                  >
                    <Phone size={14} className="text-green-400" /> +855 16 859 826
                  </a>
                </div>
             </div>

             {/* Sopheng */}
             <div className="flex flex-col gap-1 md:items-end">
                <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Support (Sopheng)</span>
                <div className="flex flex-col md:items-end gap-1">
                  <a 
                    href="https://t.me/chan_sopheng" 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors text-sm"
                  >
                    <Send size={14} className="text-blue-400" /> Telegram: @chan_sopheng
                  </a>
                  <a 
                    href="tel:+85570397080" 
                    className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors text-sm"
                  >
                    <Phone size={14} className="text-green-400" /> +855 70 397 080
                  </a>
                </div>
             </div>
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
