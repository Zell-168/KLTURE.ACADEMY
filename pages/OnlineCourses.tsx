
import React, { useEffect, useState } from 'react';
import { useLang } from '../App';
import Section from '../components/ui/Section';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { DbOnlineCourse } from '../types';
import VideoPlayer from '../components/ui/VideoPlayer';
import BannerCarousel from '../components/ui/BannerCarousel';

const OnlineCourses: React.FC = () => {
  const { t } = useLang();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<DbOnlineCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('courses_online')
          .select('*')
          .order('id', { ascending: true });
        
        if (error) throw error;
        if (data) setCourses(data);
      } catch (err) {
        console.error('Error fetching online courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleEnroll = (courseName: string) => {
    navigate('/contact', { state: { selectedProgram: `Online: ${courseName}` } });
  };

  return (
    <div>
        <Section className="pb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">{t.online.title}</h1>
            <p className="text-center text-zinc-500 max-w-2xl mx-auto mb-8">{t.online.note}</p>

             {/* Banner Carousel */}
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

        {/* Bundle Banner */}
        <Section className="py-0">
            <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-2xl p-8 md:p-12 text-white text-center shadow-lg transform hover:scale-[1.01] transition-transform cursor-pointer" onClick={() => handleEnroll('All 3 Courses Bundle')}>
                <h2 className="text-3xl font-black mb-2">{t.online.bundleTitle}</h2>
                <p className="text-xl md:text-2xl opacity-90 mb-6">{t.online.bundleDesc}</p>
                <span className="bg-white text-red-700 px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wide">Limited Offer</span>
            </div>
        </Section>

        <Section>
            {loading ? (
                <div className="flex justify-center py-12">
                   <Loader2 className="animate-spin text-zinc-400" size={32} />
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {courses.map(course => (
                        <div key={course.id} className="bg-white border border-zinc-200 rounded-xl p-6 hover:shadow-md transition-shadow flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-600">
                                    <PlayCircle size={20} />
                                </div>
                                <span className="font-bold text-lg">{course.price}</span>
                            </div>
                            <h3 className="text-lg font-bold mb-2">{course.title}</h3>
                            
                            {course.video_url && <VideoPlayer url={course.video_url} />}

                            <p className="text-zinc-500 text-sm mb-6 flex-grow mt-2">{course.description}</p>
                            <button 
                                onClick={() => handleEnroll(course.title)}
                                className="w-full py-2 bg-zinc-100 text-zinc-900 rounded-lg font-semibold text-sm hover:bg-zinc-200 transition-colors"
                            >
                                {t.online.btnEnroll}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </Section>
    </div>
  );
};

export default OnlineCourses;
