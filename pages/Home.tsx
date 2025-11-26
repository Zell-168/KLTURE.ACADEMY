
import React, { useEffect, useState } from 'react';
import { useLang, useAuth } from '../App';
import Section from '../components/ui/Section';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Wallet, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Home: React.FC = () => {
  const { t } = useLang();
  const { user } = useAuth();
  const [creditBalance, setCreditBalance] = useState<number>(0);

  // Fetch Credits for CTA
  useEffect(() => {
    if (user?.email) {
      const fetchCredits = async () => {
        const { data } = await supabase
          .from('credit_transactions')
          .select('amount')
          .eq('user_email', user.email);
        
        const total = data?.reduce((sum, tx) => sum + Number(tx.amount), 0) || 0;
        setCreditBalance(total);
      };
      fetchCredits();
    }
  }, [user]);

  return (
    <div>
      {/* Hero */}
      <div className="relative bg-white pt-10 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-zinc-900 mb-6 leading-tight">
            {t.home.heroTitle}
          </h1>
          <p className="text-lg md:text-xl text-zinc-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            {t.home.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/mini"
              className="bg-red-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition-all shadow-xl shadow-red-600/20"
            >
              {t.home.ctaPrimary}
            </Link>
            <Link
              to="/contact"
              className="bg-white text-zinc-900 border-2 border-zinc-200 px-8 py-4 rounded-lg font-bold text-lg hover:border-black transition-all"
            >
              {t.home.ctaSecondary}
            </Link>
          </div>
        </div>
        {/* Decorative bg element */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30 pointer-events-none">
            <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-red-100 rounded-full blur-3xl"></div>
            <div className="absolute top-[20%] -left-[10%] w-[40%] h-[40%] bg-zinc-100 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Credit Top Up CTA - Only for Logged In Users */}
      {user && (
        <Section className="py-8">
           <div className="bg-zinc-900 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-3 mb-2 text-yellow-400">
                          <Wallet size={28} />
                          <span className="font-bold text-lg uppercase tracking-wider">Credit Wallet</span>
                      </div>
                      <h2 className="text-3xl md:text-5xl font-black mb-2">Your Balance: ${creditBalance}</h2>
                      <p className="text-zinc-400 max-w-lg">Top up your credits securely to easily enroll in any course or program instantly.</p>
                  </div>
                  <div>
                      <a 
                          href="https://t.me/Who_1s_meng" 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 bg-yellow-400 text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-colors"
                      >
                          Credit Top Up <ArrowRight size={20} />
                      </a>
                  </div>
              </div>
              
              {/* Bg Patterns */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
           </div>
        </Section>
      )}

      {/* Highlight MINI */}
      <Section className="bg-zinc-50 rounded-3xl my-8">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <span className="inline-block bg-black text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
              RECOMMENDED 2025
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.home.focusTitle}</h2>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-black text-red-600">{t.home.focusPrice}</span>
            </div>
             <p className="text-zinc-600 mb-2 font-medium flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                {t.home.focusSeats}
             </p>
             <p className="text-zinc-500 mb-8">{t.home.introText}</p>
             <Link to="/mini" className="flex items-center gap-2 font-bold text-black hover:text-red-600 transition-colors">
                {t.home.ctaPrimary} <ArrowRight size={20} />
             </Link>
          </div>
          <div className="flex-1 w-full relative">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-zinc-100 relative z-10">
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-4">
                        <span className="font-bold">MINI Weekend</span>
                        <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold">Open</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-4">
                        <span className="font-bold">MINI Night</span>
                        <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold">Open</span>
                    </div>
                </div>
            </div>
            {/* Decoration */}
            <div className="absolute top-4 -right-4 w-full h-full bg-zinc-200 rounded-2xl -z-0"></div>
          </div>
        </div>
      </Section>

      {/* Reasons Grid */}
      <Section>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">{t.home.reasonsTitle}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {t.home.reasons.map((reason, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl border border-zinc-100 hover:shadow-lg transition-shadow">
              <CheckCircle2 className="text-red-600 mb-4" size={32} />
              <p className="font-medium text-zinc-800">{reason}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
            <Link to="/about" className="text-zinc-500 hover:text-black underline underline-offset-4">
                {t.home.seeMore}
            </Link>
        </div>
      </Section>
    </div>
  );
};

export default Home;
