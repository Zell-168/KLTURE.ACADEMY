import React, { useEffect, useState } from 'react';
import { useLang, useAuth } from '../App';
import Section from '../components/ui/Section';
import { useNavigate } from 'react-router-dom';
import { Phone, Mail, LogOut, CheckCircle, Calendar, Loader2, BookOpen, Video, Star, Zap, Search, Wallet, TrendingUp, Plus, PlayCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CreditTransaction } from '../types';
import { useCreditBalance } from '../lib/hooks';

// Helper to merge distinct table data into a unified dashboard shape
interface DashboardItem {
  id: string | number;
  title: string;
  type: string;
  price: string;
  icon: React.ReactNode;
  description: string;
  isEnrolled: boolean;
  enrollmentData: any | null;
  videoUrl?: string; // New: For playing course content
}

const Profile: React.FC = () => {
  const { t } = useLang();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { balance: creditBalance } = useCreditBalance();
  
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [dashboardItems, setDashboardItems] = useState<DashboardItem[]>([]);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Fetch User Enrollments
        const { data: enrollData } = await supabase
          .from('registrations')
          .select('*')
          .eq('email', user.email)
          .order('created_at', { ascending: false });

        const myEnrollments = enrollData || [];
        setEnrollments(myEnrollments);

        // 2. Fetch User Credit Transactions (History only, balance is from hook)
        const { data: creditData } = await supabase
          .from('credit_transactions')
          .select('*')
          .eq('user_email', user.email)
          .order('created_at', { ascending: false });
        
        const myTransactions = creditData as CreditTransaction[] || [];
        setTransactions(myTransactions);

        // 3. Fetch All Available Programs (MINI, OTHER, ONLINE, FREE)
        const [miniRes, otherRes, onlineRes, freeRes] = await Promise.all([
            supabase.from('programs_mini').select('*'),
            supabase.from('programs_other').select('*'),
            supabase.from('courses_online').select('*'),
            supabase.from('courses_free').select('*')
        ]);

        const miniData = miniRes.data || [];
        const otherData = otherRes.data || [];
        const onlineData = onlineRes.data || [];
        const freeData = freeRes.data || [];

        // 4. Normalize them into DashboardItem shape
        const allOfferings: DashboardItem[] = [];

        // Process MINI
        miniData.forEach(p => {
            allOfferings.push({
                id: `mini-${p.id}`,
                title: p.title,
                type: 'Live Class',
                price: p.price,
                icon: p.title.includes('Night') ? <Star className="text-blue-500" /> : <Star className="text-yellow-500" />,
                description: p.description || 'Intensive Workshop',
                isEnrolled: false,
                enrollmentData: null,
                videoUrl: p.video_url
            });
        });

        // Process OTHER
        otherData.forEach(p => {
            allOfferings.push({
                id: `other-${p.id}`,
                title: p.title,
                type: 'Live Class',
                price: p.price,
                icon: p.title.includes('VIP') ? <Star className="text-red-500" fill="currentColor" /> : <Zap className="text-purple-500" />,
                description: p.description || 'Advanced Program',
                isEnrolled: false,
                enrollmentData: null,
                videoUrl: p.video_url
            });
        });

        // Process ONLINE
        onlineData.forEach(p => {
            allOfferings.push({
                id: `online-${p.id}`,
                title: `Online: ${p.title}`,
                type: 'Online Course',
                price: p.price,
                icon: <Video className="text-emerald-500" />,
                description: p.description || 'Self-paced course',
                isEnrolled: false,
                enrollmentData: null,
                videoUrl: p.video_url
            });
        });

        // Process FREE
        freeData.forEach(p => {
            allOfferings.push({
                id: `free-${p.id}`,
                title: p.title,
                type: 'Free Course',
                price: 'Free',
                icon: <PlayCircle className="text-blue-500" />,
                description: p.description || 'Free training video',
                isEnrolled: false,
                enrollmentData: null,
                videoUrl: p.video_url // Critical for free courses
            });
        });

        // Add the Bundle manually
        allOfferings.push({
            id: 'bundle',
            title: 'Online: All 3 Courses Bundle',
            type: 'Online Course',
            price: '$35',
            icon: <Video className="text-emerald-600" />,
            description: 'Get all 3 online courses for a discounted price.',
            isEnrolled: false,
            enrollmentData: null
        });

        // 5. Map Enrollments to Offerings
        const finalDashboard = allOfferings.map(offering => {
            const match = myEnrollments.find(e => 
                e.program === offering.title || 
                (e.program && offering.title && e.program.trim().toLowerCase() === offering.title.trim().toLowerCase())
            );

            return {
                ...offering,
                isEnrolled: !!match,
                enrollmentData: match || null
            };
        });

        // 6. Filter & Sort
        const filtered = finalDashboard.filter(i => i.isEnrolled);
        
        filtered.sort((a, b) => {
            const dateA = a.enrollmentData ? new Date(a.enrollmentData.created_at).getTime() : 0;
            const dateB = b.enrollmentData ? new Date(b.enrollmentData.created_at).getTime() : 0;
            return dateB - dateA;
        });

        setDashboardItems(filtered);

      } catch (err) {
        console.error("Error building dashboard", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleStartLearning = (item: DashboardItem) => {
    // Navigate to dedicated classroom page
    navigate(`/learning/${item.id}`);
  };

  if (!user) return null;

  return (
    <Section className="min-h-screen bg-zinc-50/50">
      <div className="max-w-6xl mx-auto">
        
        {/* Profile Header */}
        <div className="bg-white rounded-3xl p-8 mb-8 border border-zinc-200 shadow-sm flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 bg-zinc-900 text-white rounded-full flex items-center justify-center text-4xl font-bold border-4 border-zinc-100 shadow-inner">
              {user.full_name.charAt(0).toUpperCase()}
            </div>
            <div className="text-center md:text-left flex-grow">
                <h1 className="text-3xl font-bold text-zinc-900">{user.full_name}</h1>
                <div className="flex flex-col md:flex-row gap-4 mt-2 text-zinc-500 text-sm font-medium justify-center md:justify-start">
                    <span className="flex items-center gap-1.5"><Mail size={16}/> {user.email}</span>
                    <span className="flex items-center gap-1.5"><Phone size={16}/> {user.phone_number}</span>
                </div>
            </div>
            <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="flex items-center gap-2 text-red-600 font-bold bg-red-50 hover:bg-red-100 px-5 py-3 rounded-xl transition-colors"
              >
                <LogOut size={18} />
                {t.nav.signOut}
            </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN: WALLET */}
            <div className="lg:col-span-1 space-y-8">
                {/* Wallet Balance Card */}
                <div className="bg-zinc-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-zinc-400 mb-2">
                            <Wallet size={20} />
                            <span className="font-bold text-sm uppercase tracking-wider">Credit Balance</span>
                        </div>
                        <p className="text-4xl font-black mb-6">${creditBalance.toFixed(2)}</p>
                        
                        <a 
                            href="https://t.me/Who_1s_meng" 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors"
                        >
                            <Plus size={18} /> Top Up Credits
                        </a>
                    </div>
                    {/* Deco */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-800 rounded-full blur-3xl translate-x-10 -translate-y-10"></div>
                </div>

                {/* Transaction History */}
                <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <TrendingUp size={18} className="text-zinc-500" />
                        Transaction History
                    </h3>
                    
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                        {transactions.length > 0 ? transactions.map(tx => (
                            <div key={tx.id} className="flex justify-between items-start pb-4 border-b border-zinc-50 last:border-0 last:pb-0">
                                <div>
                                    <p className="font-bold text-sm text-zinc-900">
                                        {tx.type === 'topup' ? 'Top Up' : tx.type === 'spend' ? 'Payment' : 'Adjustment'}
                                    </p>
                                    <p className="text-xs text-zinc-400">
                                        {new Date(tx.created_at).toLocaleDateString()}
                                    </p>
                                    {tx.note && <p className="text-xs text-zinc-500 mt-0.5">{tx.note}</p>}
                                </div>
                                <span className={`font-bold text-sm ${Number(tx.amount) > 0 ? 'text-green-600' : 'text-zinc-900'}`}>
                                    {Number(tx.amount) > 0 ? '+' : ''}{Number(tx.amount).toFixed(2)}
                                </span>
                            </div>
                        )) : (
                            <p className="text-sm text-zinc-400 italic">No transactions yet.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: TRAINING DASHBOARD */}
            <div className="lg:col-span-2">
                <div className="mb-6 flex items-center gap-3">
                    <BookOpen className="text-zinc-900" />
                    <h2 className="text-2xl font-bold">My Training Dashboard</h2>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="animate-spin text-zinc-400" size={32} />
                    </div>
                ) : dashboardItems.length > 0 ? (
                    <div className="grid sm:grid-cols-2 gap-6">
                        {dashboardItems.map((item, idx) => (
                            <div 
                                key={idx} 
                                className="relative flex flex-col p-6 rounded-2xl border transition-all duration-200 bg-white border-green-200 shadow-sm ring-1 ring-green-100"
                            >
                                {/* Status Badge */}
                                <div className="absolute top-4 right-4">
                                    <span className="flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                        <CheckCircle size={12} /> Enrolled
                                    </span>
                                </div>

                                {/* Icon & Title */}
                                <div className="mb-4 mt-2">
                                    <div className="w-12 h-12 rounded-xl bg-zinc-50 flex items-center justify-center mb-4 text-2xl">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-lg font-bold leading-tight min-h-[3rem] flex items-center">{item.title}</h3>
                                    <p className="text-xs text-zinc-400 font-bold uppercase mt-1">{item.type}</p>
                                </div>

                                {/* Description */}
                                <p className="text-zinc-500 text-sm mb-6 flex-grow">{item.description}</p>

                                {/* Enrolled Details */}
                                <div className="mt-auto pt-4 border-t border-zinc-50">
                                    <div className="bg-green-50/50 rounded-lg p-3 mb-3">
                                        <p className="text-xs text-green-800 font-semibold mb-1 flex items-center gap-2">
                                            <Calendar size={12} />
                                            Enrolled:
                                        </p>
                                        <p className="text-sm font-bold text-zinc-800">
                                            {new Date(item.enrollmentData?.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    
                                    {/* Action Button: Start Learning */}
                                    {item.videoUrl && (
                                      <button 
                                        onClick={() => handleStartLearning(item)}
                                        className="w-full bg-zinc-900 text-white py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-black transition-colors"
                                      >
                                        <PlayCircle size={16} /> Start Learning
                                      </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="bg-white border border-zinc-200 rounded-3xl p-12 text-center h-full flex flex-col justify-center">
                        <div className="w-20 h-20 bg-zinc-100 text-zinc-400 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-900 mb-2">No active enrollments found</h3>
                        <p className="text-zinc-500 max-w-md mx-auto mb-8">
                            You haven't registered for any programs yet. Explore our courses to get started.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button 
                                onClick={() => navigate('/mini')}
                                className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
                            >
                                View MINI Programs
                            </button>
                            <button 
                                onClick={() => navigate('/free')}
                                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                            >
                                Free Courses
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </Section>
  );
};

export default Profile;