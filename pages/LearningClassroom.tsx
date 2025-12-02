
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import Section from '../components/ui/Section';
import VideoPlayer from '../components/ui/VideoPlayer';
import { supabase } from '../lib/supabase';
import { Loader2, ArrowLeft, AlertCircle, BookOpen, CheckCircle, Play, ListVideo } from 'lucide-react';
import { DbCourseVideo } from '../types';

interface CourseData {
  title: string;
  description: string;
  type_label: string;
}

const LearningClassroom: React.FC = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<CourseData | null>(null);
  const [videos, setVideos] = useState<DbCourseVideo[]>([]);
  const [currentVideo, setCurrentVideo] = useState<DbCourseVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    const fetchCourseContent = async () => {
      setLoading(true);
      setError(null);

      if (!courseId) {
          setError("Course ID missing");
          setLoading(false);
          return;
      }

      try {
        const [type, idStr] = courseId.split('-');
        const id = parseInt(idStr);
        
        if (!type || isNaN(id)) {
            throw new Error("Invalid course link.");
        }

        let mainTable = '';
        let typeLabel = '';

        // Determine main table
        switch (type) {
            case 'mini':
                mainTable = 'programs_mini';
                typeLabel = 'Mini Program';
                break;
            case 'other':
                mainTable = 'programs_other';
                typeLabel = 'Advanced Program';
                break;
            case 'online':
                mainTable = 'online_courses_management';
                typeLabel = 'Online Course';
                break;
            case 'free':
                mainTable = 'courses_free';
                typeLabel = 'Free Course';
                break;
            default:
                throw new Error("Unknown course type.");
        }

        // 1. Fetch Course Metadata
        const { data: courseData, error: dbError } = await supabase
            .from(mainTable)
            .select('title, description, video_url') // Select video_url as fallback
            .eq('id', id)
            .single();

        if (dbError || !courseData) {
            throw new Error("Could not find course details.");
        }

        setCourse({
            title: courseData.title,
            description: courseData.description || 'No description provided.',
            type_label: typeLabel
        });

        // 2. Fetch Videos (Curriculum)
        // If type is 'online', we check the new child table `online_course_videos`
        let fetchedVideos: DbCourseVideo[] = [];

        if (type === 'online') {
            const { data: videoData, error: videoError } = await supabase
                .from('online_course_videos')
                .select('*')
                .eq('course_id', id)
                .order('display_order', { ascending: true });
            
            if (!videoError && videoData && videoData.length > 0) {
                fetchedVideos = videoData;
            }
        }

        // Fallback: If no videos found in child table (or it's not an online course),
        // use the main table's `video_url` as a single lesson.
        if (fetchedVideos.length === 0 && courseData.video_url) {
            fetchedVideos.push({
                id: 0,
                course_id: id,
                title: 'Main Class Video',
                description: 'Full course recording',
                video_url: courseData.video_url,
                image_url: '',
                display_order: 1
            });
        }

        if (fetchedVideos.length === 0) {
            throw new Error("No video content uploaded for this course yet.");
        }

        setVideos(fetchedVideos);
        setCurrentVideo(fetchedVideos[0]); // Default to first video

      } catch (err: any) {
        console.error("Error loading classroom:", err);
        setError(err.message || "Failed to load course content.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseContent();
  }, [courseId, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
        <div className="text-center">
            <Loader2 className="animate-spin mx-auto mb-4 text-red-600" size={48} />
            <p className="text-zinc-500 font-medium">Loading classroom...</p>
        </div>
      </div>
    );
  }

  if (error || !course || !currentVideo) {
    return (
      <Section className="min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
             <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={32} />
             </div>
             <h2 className="text-2xl font-bold mb-2">Unable to Load Course</h2>
             <p className="text-zinc-500 mb-8">{error}</p>
             <button 
                onClick={() => navigate('/profile')}
                className="bg-black text-white px-6 py-3 rounded-xl font-bold"
             >
                Back to Dashboard
             </button>
        </div>
      </Section>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
       {/* Simple Header */}
       <header className="bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
           <div className="flex items-center gap-4">
               <button 
                  onClick={() => navigate('/profile')}
                  className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-600 hover:text-black"
                  title="Back to Dashboard"
               >
                  <ArrowLeft size={24} />
               </button>
               <div>
                   <h1 className="font-bold text-lg leading-none text-zinc-900 line-clamp-1">{course.title}</h1>
                   <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{course.type_label}</span>
               </div>
           </div>
           
           <div className="hidden md:flex items-center gap-2 text-sm font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
               <CheckCircle size={16} /> Enrolled Student
           </div>
       </header>

       {/* Main Content */}
       <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid lg:grid-cols-3 gap-8">
                
                {/* Video Column (Main) */}
                <div className="lg:col-span-2">
                    <div className="mb-6">
                         <VideoPlayer url={currentVideo.video_url} className="shadow-2xl rounded-2xl" />
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm">
                        <h2 className="text-2xl font-bold mb-2">{currentVideo.title}</h2>
                        <p className="text-zinc-600 whitespace-pre-wrap">{currentVideo.description || course.description}</p>
                    </div>
                </div>

                {/* Playlist / Info Column */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm h-full flex flex-col overflow-hidden">
                        <div className="p-5 border-b border-zinc-100 bg-zinc-50">
                             <div className="flex items-center gap-2 text-zinc-900 font-bold">
                                 <ListVideo size={20} />
                                 <span>Course Curriculum</span>
                                 <span className="ml-auto bg-black text-white text-xs px-2 py-0.5 rounded-full">{videos.length} videos</span>
                             </div>
                        </div>
                        
                        <div className="flex-grow overflow-y-auto max-h-[600px] p-2 space-y-1">
                            {videos.map((vid, idx) => {
                                const isActive = currentVideo.id === vid.id;
                                return (
                                    <button 
                                        key={vid.id}
                                        onClick={() => setCurrentVideo(vid)}
                                        className={`w-full text-left p-3 rounded-xl transition-all flex gap-3 group ${
                                            isActive ? 'bg-red-50 border border-red-100' : 'hover:bg-zinc-50 border border-transparent'
                                        }`}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${
                                            isActive ? 'bg-red-600 text-white' : 'bg-zinc-200 text-zinc-500 group-hover:bg-zinc-300'
                                        }`}>
                                            {isActive ? <Play size={12} fill="currentColor" /> : idx + 1}
                                        </div>
                                        <div>
                                            <p className={`text-sm font-bold line-clamp-1 ${isActive ? 'text-red-900' : 'text-zinc-800'}`}>
                                                {vid.title}
                                            </p>
                                            <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">
                                                {vid.description || "Video Lesson"}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Sticky Help Footer */}
                        <div className="p-4 border-t border-zinc-100 bg-zinc-50 text-center">
                            <p className="text-xs text-zinc-400 font-medium">
                                Need help? Contact support via Telegram.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
       </div>
    </div>
  );
};

export default LearningClassroom;
