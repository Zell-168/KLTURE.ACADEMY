
import React, { useState, useEffect } from 'react';
import { useLang } from '../App';
import Section from '../components/ui/Section';
import { useLocation, Link } from 'react-router-dom';
import { Send, CheckCircle, Loader2, AlertCircle, Wallet, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../App';
import { useCreditBalance } from '../lib/hooks';

const Contact: React.FC = () => {
  const { t } = useLang();
  const { user } = useAuth();
  const location = useLocation();
  const { balance: creditBalance, refreshBalance } = useCreditBalance();
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingPrograms, setFetchingPrograms] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Dynamic Options
  const [priceMap, setPriceMap] = useState<Record<string, number>>({});
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({}); // Maps Program Title -> Category (MINI, OTHER, ONLINE)
  
  // Form State
  const [formData, setFormData] = useState({
    name: user?.full_name || '',
    phone: user?.phone_number || '',
    telegram: user?.telegram_username || '',
    email: user?.email || '',
    password: '', 
    program: '', 
    date: '',
    message: ''
  });

  // Calculate Price and Sufficiency
  const currentPrice = priceMap[formData.program] || 0; 
  const hasSufficientCredits = user ? creditBalance >= currentPrice : false;
  const missingAmount = currentPrice - creditBalance;

  // Fetch available programs and prices
  useEffect(() => {
    const fetchPrograms = async () => {
        try {
            const [mini, other, online] = await Promise.all([
                supabase.from('programs_mini').select('title, price'),
                supabase.from('programs_other').select('title, price'),
                supabase.from('online_courses_management').select('title, price')
            ]);

            const prices: Record<string, number> = {};
            const categories: Record<string, string> = {};

            const parsePrice = (p: string) => {
              if (!p) return 0;
              const num = parseFloat(p.replace(/[^0-9.]/g, ''));
              return isNaN(num) ? 0 : num;
            }
            
            // Process MINI Programs
            mini.data?.forEach(p => {
                prices[p.title] = parsePrice(p.price);
                categories[p.title] = 'MINI';
            });

            // Process OTHER Programs
            other.data?.forEach(p => {
                prices[p.title] = parsePrice(p.price);
                categories[p.title] = 'OTHER';
            });

            // Process ONLINE Courses
            online.data?.forEach(p => {
                const title = `Online: ${p.title}`;
                prices[title] = parsePrice(p.price);
                categories[title] = 'ONLINE';
            });
            
            // Bundle
            const bundleTitle = 'Online: All 3 Courses Bundle';
            prices[bundleTitle] = 35;
            categories[bundleTitle] = 'BUNDLE';

            setPriceMap(prices);
            setCategoryMap(categories);

        } catch (err) {
            console.error("Failed to load program options", err);
        } finally {
            setFetchingPrograms(false);
        }
    };
    fetchPrograms();
  }, []);

  // Update selection from navigation state (e.g. clicking "Register" on a specific course)
  useEffect(() => {
    if (location.state && location.state.selectedProgram) {
        const prog = location.state.selectedProgram;
        setFormData(prev => ({ 
            ...prev, 
            program: prog,
            date: 'Immediate / Online' // Default date for online purchases
        }));
    }
  }, [location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    // Sanitize data
    const payload = {
        full_name: formData.name.trim(),
        phone_number: formData.phone.trim(),
        telegram_username: formData.telegram.trim() || null,
        email: formData.email.trim(),
        // Only send password if user is not logged in (new registration)
        ...( !user ? { password: formData.password.trim() } : {}),
        program: formData.program || 'General Member', // Default to General Member if no program selected
        preferred_date: formData.date.trim() || null,
        message: formData.message.trim()
    };

    try {
      if (user && formData.program) {
        // Enforce Credit Payment ONLY if a program is selected
        if (creditBalance < currentPrice) {
            throw new Error(`Insufficient credits. You need ${currentPrice} but have ${creditBalance}. Please top up.`);
        }
      }

      // 1. Insert Registration
      const { error: regError } = await supabase
        .from('registrations')
        .insert([payload]);

      if (regError) throw regError;

      // 2. Handle Payment Logic (If logged in & Paid & Program Selected)
      if (user && formData.program && currentPrice > 0) {
        
        // A. Deduct Credits
        const { error: txError } = await supabase
            .from('credit_transactions')
            .insert([{
                user_email: user.email,
                type: 'spend',
                amount: -currentPrice,
                note: `Payment for ${formData.program}`
            }]);
        
        if (txError) console.error("Failed to record transaction", txError);

        // B. Record Sales Ledger (New)
        const category = categoryMap[formData.program] || 'OTHER';
        const { error: salesError } = await supabase
            .from('sales_ledger')
            .insert([{
                user_email: user.email,
                program_title: formData.program,
                category: category,
                amount: currentPrice,
                note: 'Paid via Credit Wallet'
            }]);

        if (salesError) console.error("Failed to record sale ledger", salesError);
        
        await refreshBalance();
      }

      console.log("Form Data Submitted to Supabase:", payload);
      setSubmitted(true);
      window.scrollTo(0, 0);
    } catch (err: any) {
      console.error('Error submitting form:', err);
      setErrorMsg(err.message || 'Something went wrong. Please check your connection or try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
        <Section className="min-h-[60vh] flex items-center justify-center text-center">
            <div className="max-w-md mx-auto p-8">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} />
                </div>
                <h2 className="text-2xl font-bold mb-4">Registration Successful!</h2>
                <p className="text-zinc-600 mb-8">{t.contact.success}</p>
                {user && currentPrice > 0 && (
                    <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 mb-8">
                        <p className="text-zinc-500 text-sm mb-2">Payment Summary</p>
                        <div className="flex justify-between items-center text-sm font-medium mb-1">
                            <span>Program Cost:</span>
                            <span>{currentPrice} Credits</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold text-green-600">
                            <span>Remaining Balance:</span>
                            <span>{creditBalance} Credits</span>
                        </div>
                    </div>
                )}
                <button 
                    onClick={() => {
                      setSubmitted(false);
                      window.location.reload(); 
                    }}
                    className="text-red-600 font-bold hover:underline"
                >
                    Back to Home
                </button>
            </div>
        </Section>
    )
  }

  return (
    <Section>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
        {/* Info Column (Payment Terminal) */}
        <div className="order-2 md:order-1">
            <h1 className="text-4xl font-bold mb-8">Checkout & Payment</h1>
            
            {/* 1. If User Not Logged In */}
            {!user && (
                <div className="bg-zinc-50 border border-zinc-200 p-8 rounded-2xl mb-8">
                    <h3 className="font-bold text-xl mb-2">Have an account?</h3>
                    <p className="text-zinc-600 mb-6">Log in to use your Credit Wallet for payment.</p>
                    <Link to="/signin" className="inline-block bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-zinc-800 transition-colors">
                        Sign In to Pay
                    </Link>
                </div>
            )}

            {/* 2. Wallet Status (Logged In) */}
            {user && (
                <div className="bg-white border border-zinc-200 shadow-lg rounded-2xl p-6 mb-8 overflow-hidden relative">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <Wallet size={20} />
                        </div>
                        <div>
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Your Credit Balance</p>
                            <p className="text-2xl font-black">${creditBalance.toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="border-t border-zinc-100 pt-6">
                        {formData.program ? (
                            <>
                                <div className="mb-4 bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                                    <p className="text-xs text-zinc-400 font-bold uppercase mb-1">Buying:</p>
                                    <p className="font-bold text-zinc-900">{formData.program}</p>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-zinc-600">Program Cost:</span>
                                    <span className="font-bold text-lg">${currentPrice.toFixed(2)}</span>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-2 text-zinc-500 italic mb-2">
                                <AlertCircle size={16} />
                                <span>General Registration (No Cost)</span>
                            </div>
                        )}
                        
                        {formData.program ? (
                            hasSufficientCredits ? (
                                <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 mt-4 font-medium">
                                    <CheckCircle size={18} />
                                    <span>Balance sufficient for payment.</span>
                                </div>
                            ) : (
                                <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mt-4">
                                    <div className="flex items-center gap-2 font-bold mb-1">
                                        <XCircle size={18} />
                                        <span>Insufficient Funds</span>
                                    </div>
                                    <p className="text-sm mb-3">You need ${missingAmount.toFixed(2)} more to register. Contact Sales to Top Up:</p>
                                    <div className="flex flex-col gap-2">
                                    <a href="https://t.me/Who_1s_meng" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm bg-white border border-red-200 text-red-700 px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors font-medium">
                                        <Send size={14} /> Contact Meng
                                    </a>
                                    <a href="https://t.me/Kimly_yy" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm bg-white border border-red-200 text-red-700 px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors font-medium">
                                        <Send size={14} /> Contact Kimly
                                    </a>
                                    <a href="https://t.me/chan_sopheng" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm bg-white border border-red-200 text-red-700 px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors font-medium">
                                        <Send size={14} /> Contact Sopheng
                                    </a>
                                    </div>
                                </div>
                            )
                        ) : null}
                    </div>
                </div>
            )}

            {/* Contact Info */}
            <div className="space-y-4">
                <p className="font-bold text-zinc-900 mb-2">Need help?</p>
                {/* Meng */}
                <a href="https://t.me/Who_1s_meng" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 border border-zinc-200 rounded-xl hover:border-blue-400 transition-colors group bg-white">
                    <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <Send size={20} />
                    </div>
                    <div>
                        <p className="font-bold">Contact Meng</p>
                        <p className="text-zinc-500 text-sm">@Who_1s_meng | 088 990 2595</p>
                    </div>
                </a>
                {/* Kimly */}
                <a href="https://t.me/Kimly_yy" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 border border-zinc-200 rounded-xl hover:border-blue-400 transition-colors group bg-white">
                    <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <Send size={20} />
                    </div>
                    <div>
                        <p className="font-bold">Contact Kimly</p>
                        <p className="text-zinc-500 text-sm">@Kimly_yy | 016 859 826</p>
                    </div>
                </a>
                {/* Sopheng */}
                <a href="https://t.me/chan_sopheng" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 border border-zinc-200 rounded-xl hover:border-blue-400 transition-colors group bg-white">
                    <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <Send size={20} />
                    </div>
                    <div>
                        <p className="font-bold">Contact Sopheng</p>
                        <p className="text-zinc-500 text-sm">@chan_sopheng | 070 397 080</p>
                    </div>
                </a>
            </div>
        </div>

        {/* Form Column */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-zinc-100 h-fit order-1 md:order-2">
            <h2 className="text-2xl font-bold mb-6">Registration Details</h2>
            
            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700">
                <AlertCircle className="shrink-0 mt-0.5" size={20} />
                <p className="text-sm font-medium">{errorMsg}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Removed Choose Program and Schedule fields as requested */}

                {/* Personal Details */}
                <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-1">{t.contact.formName} *</label>
                    <input 
                        required
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-1">{t.contact.formPhone} *</label>
                    <input 
                        required
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
                    />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-zinc-700 mb-1">{t.contact.formTelegram}</label>
                        <input 
                            type="text" 
                            name="telegram"
                            value={formData.telegram}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-zinc-700 mb-1">{t.contact.formEmail} *</label>
                        <input 
                            required
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            readOnly={!!user} // Locked for logged in users
                            className={`w-full px-4 py-3 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all ${user ? 'bg-zinc-100 text-zinc-500 cursor-not-allowed' : 'bg-zinc-50 focus:bg-white'}`}
                        />
                    </div>
                </div>

                {!user && (
                    <div>
                        <label className="block text-sm font-bold text-zinc-700 mb-1">{t.contact.formPassword} *</label>
                        <input 
                            required
                            type="password" 
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
                        />
                    </div>
                )}

                {/* Submit Button Area */}
                <div className="pt-4">
                    {user ? (
                        <button 
                            type="submit"
                            // If a program is selected, ensure we have sufficient credits. If no program (just updating/contacting), allow.
                            disabled={loading || fetchingPrograms || (formData.program ? !hasSufficientCredits : false)}
                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2 
                                ${(formData.program && !hasSufficientCredits)
                                    ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed' 
                                    : 'bg-black text-white hover:bg-zinc-800'
                                }`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} /> Processing...
                                </>
                            ) : (formData.program && !hasSufficientCredits) ? (
                                "Insufficient Credits"
                            ) : (
                                formData.program ? `Pay ${currentPrice} Credits & Enroll` : "Create Account"
                            )}
                        </button>
                    ) : (
                        <button 
                            type="submit"
                            disabled={loading || fetchingPrograms}
                            className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-red-600/20"
                        >
                            {loading ? "Processing..." : "Create Account"}
                        </button>
                    )}
                    
                    {!user && (
                         <p className="text-xs text-center text-zinc-500 mt-4">
                            Note: For new accounts, please pay via Sales Team after submitting, or log in if you already have credits.
                         </p>
                    )}
                </div>
            </form>
        </div>
      </div>
    </Section>
  );
};

export default Contact;
