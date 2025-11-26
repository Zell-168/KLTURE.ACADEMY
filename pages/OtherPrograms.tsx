
import React, { useEffect, useState } from 'react';
import { useLang } from '../App';
import Section from '../components/ui/Section';
import { useNavigate } from 'react-router-dom';
import { Star, Zap, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { DbOtherProgram } from '../types';
import VideoPlayer from '../components/ui/VideoPlayer';
import BannerCarousel from '../components/ui/BannerCarousel';

const OtherPrograms: React.FC = () => {
  const { t } = useLang();
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<DbOtherProgram[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const { data, error } = await supabase
          .from('programs_other')
          .select('*')
          .order('id', { ascending: true });
        
        if (error) throw error;
        if (data) setPrograms(data);
      } catch (err) {
        console.error('Error fetching other programs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  const handleInterest = (prog: string) => {
    navigate('/contact', { state: { selectedProgram: prog } });
  };

  return (
    <div>
      <Section className="pb-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t.other.title}</h1>
          <p className="text-zinc-500 mb-8">{t.other.note}</p>
        </div>

        {/* Banner Carousel */}
        {!loading && programs.some(p => p.image_url) && (
          <div className="px-4">
             <BannerCarousel items={programs.filter(p => p.image_url).map(p => ({
                id: p.id,
                image_url: p.image_url!,
                title: p.title
              }))} />
          </div>
        )}
      </Section>

      {loading ? (
        <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-zinc-400" size={32} />
        </div>
      ) : (
        <Section className="pt-0">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {programs.map((prog, idx) => (
              <div key={prog.id} className={`border border-zinc-200 rounded-2xl p-8 hover:shadow-lg transition-all flex flex-col ${idx % 2 === 0 ? 'bg-white' : 'bg-zinc-50'}`}>
                <div className="mb-6">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${idx % 2 === 0 ? 'bg-zinc-900 text-white' : 'bg-red-600 text-white'}`}>
                      {idx % 2 === 0 ? <Zap size={24} /> : <Star size={24} />}
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{prog.title}</h2>
                  <div className="text-sm font-bold text-zinc-500 mb-2">{prog.trainers_count} • {prog.price}</div>
                  
                  {prog.video_url && <VideoPlayer url={prog.video_url} />}
                  
                  <p className="text-zinc-600 leading-relaxed mt-4">{prog.description}</p>
                </div>
                <div className="mt-auto">
                  <button 
                      onClick={() => handleInterest(prog.title)}
                      className={`w-full py-3 rounded-lg font-bold transition-colors ${idx % 2 === 0 ? 'border border-black hover:bg-black hover:text-white' : 'bg-black text-white hover:bg-zinc-800'}`}
                  >
                      {t.other.interest}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
};

export default OtherPrograms;
