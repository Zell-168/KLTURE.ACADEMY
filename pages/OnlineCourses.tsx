
import React, { useEffect, useState } from 'react';
import { useLang, useAuth } from '../App';
import Section from '../components/ui/Section';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, Loader2, Wallet, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { DbOnlineCourse, DbTrainer } from '../types';
import { TRAINERS } from '../constants';
import VideoPlayer from '../components/ui/VideoPlayer';
import BannerCarousel from '../components/ui/BannerCarousel';

const OnlineCourses: React.FC = () => {
  const { t } = useLang();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<DbOnlineCourse[]>([]);
  const [allTrainers, setAllTrainers] = useState<DbTrainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolledCourseTitles, setEnrolledCourseTitles] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Courses from the new management table
        // We removed the complex join logic to keep it simple as requested
        const { data, error } = await supabase
          .from('online_courses_management')
          .select('*')
          .order('id', { ascending: true });
        
        if (error) throw error;
        if (data) setCourses(data);

        // 2. Fetch User Registrations to check enrollment
        if (user?.email) {
            const { data: regData } = await supabase
                .from('registrations')
                .select('program')
                .eq('email', user.email);
            
            if (regData) {
                const titles = regData.map(r => r.program);
                setEnrolledCourseTitles(titles);
            }
        }

        // 3. Fetch Trainers Fallback (Since we aren't joining tables anymore)
        const { data: trainerData } = await supabase.from('trainers').select('*');
        if (trainerData && trainerData.length > 0) {
            setAllTrainers(trainerData);
        } else {
             const staticFallback: DbTrainer[] = TRAINERS.map((t, i) => ({
                id: i,
                name: t.name,
                role: t.role,
                image_url: t.image,
                description: "Expert Trainer",
                created_at: new Date().toISOString()
            }));
            setAllTrainers(staticFallback);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleEnroll = (courseName: string) => {
    navigate('/contact', { state: { selectedProgram: `Online: ${courseName}` } });
  };

  const handleWatch = (courseId: number) => {
    navigate(`/learning/online-${courseId}`);
  };

  // Check if user has the Bundle
  const hasBundle = enrolledCourseTitles.some(t => t.includes('Bundle') || t.includes('All 3 Courses'));

  return (
    <div>
        <Section className="pb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">{t.online.title}</h1>
            <p className="text-center text-zinc-500 max-w-2xl mx-auto mb-8">{t.online.note}</p>

             {/* Banner Carousel - Shows course banners */}
            {!loading && courses.some(c => c.image_url) && (
              <div className="px-4">
                <BannerCarousel items={courses.filter(c => c.image_url).map(c => ({
                  id: c.id,
                  image_url: c.image_url!,
                  title: c.title
                }))} />
              </div>
            )}
        </Section>

        {/* Bundle Offer Section */}
        <Section className="py-0">
            <div 
                onClick={() => !hasBundle && handleEnroll('All 3 Courses Bundle')}
                className={`bg-gradient-to-r from-red-600 to-red-800 rounded-2xl p-8 md:p-12 text-white text-center shadow-lg transform transition-all ${!hasBundle ? 'hover:scale-[1.01] cursor-pointer' : ''}`}
            >
                <h2 className="text-3xl font-black mb-2">{t.online.bundleTitle}</h2>
                <p className="text-xl md:text-2xl opacity-90 mb-6">{t.online.bundleDesc}</p>
                
                {hasBundle ? (
                    <div className="inline-flex items-center gap-2 bg-white text-green-700 px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wide">
                        <CheckCircle size={16} />
                        <span>You Own The Bundle</span>
                    </div>
                ) : (
                    <div className="inline-flex items-center gap-2 bg-white text-red-700 px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wide">
                        <Wallet size={16} />
                        <span>Buy Bundle Now</span>
                    </div>
                )}
            </div>
        </Section>

        <Section>
            {loading ? (
                <div className="flex justify-center py-12">
                   <Loader2 className="animate-spin text-zinc-400" size={32} />
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {courses.map(course => {
                        // Check if enrolled in this specific course OR the bundle
                        const isEnrolled = enrolledCourseTitles.includes(course.title) || 
                                           enrolledCourseTitles.includes(`Online: ${course.title}`) || 
                                           hasBundle;

                        return (
                            <div key={course.id} className="bg-white border border-zinc-200 rounded-xl p-6 hover:shadow-md transition-shadow flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isEnrolled ? 'bg-green-100 text-green-600' : 'bg-zinc-100 text-zinc-600'}`}>
                                        {isEnrolled ? <CheckCircle size={20} /> : <PlayCircle size={20} />}
                                    </div>
                                    <span className="font-bold text-lg">{isEnrolled ? 'Owned' : course.price}</span>
                                </div>
                                <h3 className="text-lg font-bold mb-2">{course.title}</h3>
                                
                                {/* Video Preview (Only show if not enrolled, or show thumbnail logic if desired. Using VideoPlayer for now) */}
                                {course.video_url && !isEnrolled && (
                                     <div className="mb-4">
                                         <VideoPlayer url={course.video_url} />
                                     </div>
                                )}
                                
                                {isEnrolled && course.image_url && (
                                    <div className="mb-4 rounded-lg overflow-hidden aspect-video">
                                        <img src={course.image_url} alt={course.title} className="w-full h-full object-cover" />
                                    </div>
                                )}

                                <p className="text-zinc-500 text-sm mb-6 flex-grow mt-2">{course.description}</p>
                                
                                {/* Meet The Trainers Section (Fallback to all trainers since we simplified the DB) */}
                                <div className="mb-6 border-t border-zinc-100 pt-4">
                                    <p className="text-xs font-bold text-zinc-500 mb-3 uppercase">Meet The Trainers</p>
                                    <div className="flex flex-wrap gap-2">
                                        {allTrainers.slice(0, 3).map((tr, i) => (
                                            <div key={i} title={tr.name}>
                                                <img 
                                                    src={tr.image_url} 
                                                    alt={tr.name} 
                                                    className="w-10 h-10 rounded-full object-cover border border-zinc-200"
                                                />
                                            </div>
                                        ))}
                                        {allTrainers.length > 3 && (
                                            <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-500">
                                                +{allTrainers.length - 3}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {isEnrolled ? (
                                    <button 
                                        onClick={() => handleWatch(course.id)}
                                        className="w-full py-2.5 bg-green-600 text-white rounded-lg font-bold text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-600/20"
                                    >
                                        <PlayCircle size={16} />
                                        Watch Now
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => handleEnroll(course.title)}
                                        className="w-full py-2.5 bg-zinc-900 text-white rounded-lg font-bold text-sm hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-lg shadow-zinc-900/10"
                                    >
                                        <Wallet size={16} />
                                        {t.online.btnEnroll}
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </Section>
    </div>
  );
};

export default OnlineCourses;
