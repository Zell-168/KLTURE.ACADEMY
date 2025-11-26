import React, { useState, useEffect } from 'react';
import { useLang } from '../App';
import Section from '../components/ui/Section';
import { useLocation, Link } from 'react-router-dom';
import { Send, Phone, CheckCircle, Loader2, AlertCircle, Wallet, ArrowRight, XCircle } from 'lucide-react';
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
  const [programOptions, setProgramOptions] = useState<string[]>([]);
  const [scheduleMap, setScheduleMap] = useState<Record<string, string[]>>({});
  const [priceMap, setPriceMap] = useState<Record<string, number>>({});
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  
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

  // Fetch available programs and schedules
  useEffect(() => {
    const fetchPrograms = async () => {
        try {
            const [mini, other, online] = await Promise.all([
                supabase.from('programs_mini').select('title, available_dates, price'),
                supabase.from('programs_other').select('title, available_dates, price'),
                supabase.from('courses_online').select('title, price')
            ]);

            const options: string[] = [];
            const schedules: Record<string, string[]> = {};
            const prices: Record<string, number> = {};

            const parsePrice = (p: string) => {
              if (!p) return 0;
              const num = parseFloat(p.replace(/[^0-9.]/g, ''));
              return isNaN(num) ? 0 : num;
            }
            
            // Process MINI Programs
            mini.data?.forEach(p => {
                options.push(p.title);
                prices[p.title] = parsePrice(p.price);
                if (p.available_dates && p.available_dates.length > 0) {
                    schedules[p.title] = p.available_dates;
                }
            });

            // Process OTHER Programs
            other.data?.forEach(p => {
                options.push(p.title);
                prices[p.title] = parsePrice(p.price);
                if (p.available_dates && p.available_dates.length > 0) {
                    schedules[p.title] = p.available_dates;
                }
            });

            // Process ONLINE Courses
            online.data?.forEach(p => {
                const title = `Online: ${p.title}`;
                options.push(title);
                prices[title] = parsePrice(p.price);
                schedules[title] = ['Immediate Access / Self-Paced'];
            });
            
            // Bundle
            const bundleTitle = 'Online: All 3 Courses Bundle';
            options.push(bundleTitle);
            prices[bundleTitle] = 35;
            schedules[bundleTitle] = ['Immediate Access / Self-Paced'];

            setProgramOptions(options);
            setScheduleMap(schedules);
            setPriceMap(prices);
            
            // Set default program if none selected
            if (!formData.program && options.length > 0) {
                 const defaultProgram = options[0];
                 setFormData(prev => ({ 
                     ...prev, 
                     program: defaultProgram,
                     date: schedules[defaultProgram]?.[0] || ''
                 }));
            }

        } catch (err) {
            console.error("Failed to load program options", err);
        } finally {
            setFetchingPrograms(false);
        }
    };
    fetchPrograms();
  }, [formData.program]);

  // Update selection from navigation state (e.g. clicking "Register" on a specific course)
  useEffect(() => {
    if (location.state && location.state.selectedProgram) {
        const prog = location.state.selectedProgram;
        setFormData(prev => ({ 
            ...prev, 
            program: prog
        }));
    }
  }, [location]);

  // Update available dates when program changes
  useEffect(() => {
    if (formData.program && scheduleMap[formData.program]) {
        const dates = scheduleMap[formData.program];
        setAvailableDates(dates);
        // Default to first option
        if (dates.length > 0) {
            setFormData(prev => ({ ...prev, date: dates[0] }));
        } else {
            setFormData(prev => ({ ...prev, date: '' }));
        }
    } else {
        setAvailableDates([]);
        setFormData(prev => ({ ...prev, date: '' }));
    }
  }, [formData.program, scheduleMap]);

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
        program: formData.program,
        preferred_date: formData.date.trim(),
        message: formData.message.trim()
    };

    try {
      if (user) {
        // Enforce Credit Payment
        if (creditBalance < currentPrice) {
            throw new Error(`Insufficient credits. You need ${currentPrice} but have ${creditBalance}. Please top up.`);
        }
      }

      // 1. Insert Registration
      const { error: regError } = await supabase
        .from('registrations')
        .insert([payload]);

      if (regError) throw regError;

      // 2. Deduct Credits (Only if logged in and it's a paid program)
      if (user && currentPrice > 0) {
        const { error: txError } = await supabase
            .from('credit_transactions')
            .insert([{
                user_email: user.email,
                type: 'spend',
                amount: -currentPrice,
                note: `Payment for ${formData.program}`
            }]);
        
        if (txError) {
            console.error("Failed to record transaction", txError);
            // Warning: Transaction mismatch possible here, but acceptable for this scope.
        }
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
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-zinc-600">Program Cost:</span>
                            <span className="font-bold text-lg">${currentPrice.toFixed(2)}</span>
                        </div>
                        
                        {hasSufficientCredits ? (
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
                                <p className="text-sm mb-3">You need ${missingAmount.toFixed(2)} more to register.</p>
                                <a 
                                    href="https://t.me/Who_1s_meng" 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="inline-flex items-center gap-1 text-sm bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 transition-colors"
                                >
                                    Contact Sales to Top Up <ArrowRight size={14} />
                                </a>
                             </div>
                        )}
                    </div>
                </div>
            )}

            {/* Contact Info */}
            <div className="space-y-4">
                <p className="font-bold text-zinc-900 mb-2">Need help?</p>
                <a href="https://t.me/Who_1s_meng" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 border border-zinc-200 rounded-xl hover:border-blue-400 transition-colors group bg-white">
                    <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <Send size={20} />
                    </div>
                    <div>
                        <p className="font-bold">Telegram Support</p>
                        <p className="text-zinc-500 text-sm">@Who_1s_meng</p>
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
                {/* Program Selection - Prominent */}
                <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                    <label className="block text-sm font-bold text-zinc-700 mb-2">{t.contact.formProgram} *</label>
                    <div className="relative">
                        <select 
                            name="program"
                            value={formData.program}
                            onChange={handleChange}
                            disabled={fetchingPrograms}
                            className="w-full px-4 py-3 rounded-lg bg-white border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all appearance-none font-medium"
                        >
                            {fetchingPrograms ? (
                                <option>Loading available programs...</option>
                            ) : (
                                programOptions.map((opt, i) => (
                                    <option key={i} value={opt}>{opt}</option>
                                ))
                            )}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                             {fetchingPrograms ? <Loader2 className="animate-spin" size={16}/> : '▼'}
                        </div>
                    </div>
                </div>

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

                <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-1">{t.contact.formDate}</label>
                    {availableDates.length > 0 ? (
                        <div className="relative">
                            <select 
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all appearance-none"
                            >
                                {availableDates.map((d, i) => (
                                    <option key={i} value={d}>{d}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                                ▼
                            </div>
                        </div>
                    ) : (
                         <input 
                            type="text" 
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            placeholder="Immediate Access"
                            readOnly
                            className="w-full px-4 py-3 rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-500 cursor-not-allowed"
                        />
                    )}
                </div>

                {/* Submit Button Area */}
                <div className="pt-4">
                    {user ? (
                        <button 
                            type="submit"
                            disabled={loading || fetchingPrograms || !hasSufficientCredits}
                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2 
                                ${!hasSufficientCredits 
                                    ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed' 
                                    : 'bg-black text-white hover:bg-zinc-800'
                                }`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} /> Processing...
                                </>
                            ) : !hasSufficientCredits ? (
                                "Insufficient Credits"
                            ) : (
                                `Pay ${currentPrice} Credits & Register`
                            )}
                        </button>
                    ) : (
                        <button 
                            type="submit"
                            disabled={loading || fetchingPrograms}
                            className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-red-600/20"
                        >
                            {loading ? "Processing..." : "Create Account & Register"}
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