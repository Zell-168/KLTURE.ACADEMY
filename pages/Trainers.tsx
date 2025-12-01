import React, { useState, useEffect } from 'react';
import { useLang } from '../App';
import Section from '../components/ui/Section';
import { supabase } from '../lib/supabase';
import { DbTrainer } from '../types';
import { TRAINERS } from '../constants';
import { Loader2, LayoutGrid, AlertCircle } from 'lucide-react';

const Trainers: React.FC = () => {
  const { t } = useLang();
  const [trainers, setTrainers] = useState<DbTrainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 1. Fetch Global Trainers
  const fetchTrainers = async () => {
    try {
      const { data, error } = await supabase
        .from('trainers')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) throw error;
      setTrainers(data || []);
      setErrorMsg(null);
    } catch (err: any) {
      console.error('Error fetching trainers:', err.message || err);
      // Fallback
      const staticFallback: DbTrainer[] = TRAINERS.map((t, i) => ({
        id: i,
        name: t.name,
        role: t.role,
        image_url: t.image,
        description: "Expert trainer (Static)",
        created_at: new Date().toISOString()
      }));
      setTrainers(staticFallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  return (
    <div className="bg-zinc-50 min-h-screen">
      <Section>
        <div className="text-center mb-12">
           <h1 className="text-4xl font-black mb-4 flex items-center justify-center gap-3">
             <LayoutGrid size={40} className="text-red-600" />
             {t.trainers.title}
           </h1>
           <p className="text-zinc-500 max-w-2xl mx-auto text-lg">{t.trainers.subtitle}</p>
        </div>

        {errorMsg && (
            <div className="max-w-2xl mx-auto mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3 text-yellow-800">
                <AlertCircle className="shrink-0 mt-0.5" size={20} />
                <p className="text-sm font-medium">{errorMsg}</p>
            </div>
        )}

        {/* Trainers Display Grid */}
        {loading ? (
            <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-zinc-400" size={40} />
            </div>
        ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {trainers.map(trainer => (
                    <div key={trainer.id} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-zinc-100 flex flex-col group hover:-translate-y-1 transition-transform duration-300">
                        <div className="h-64 overflow-hidden relative">
                             <img 
                                src={trainer.image_url} 
                                alt={trainer.name} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                             />
                             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                             <div className="absolute bottom-4 left-4 text-white">
                                <h3 className="text-xl font-bold">{trainer.name}</h3>
                                <p className="text-sm font-medium opacity-90">{trainer.role}</p>
                             </div>
                        </div>
                        <div className="p-6 flex-grow flex flex-col">
                            <p className="text-zinc-600 leading-relaxed flex-grow text-sm">
                                {trainer.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </Section>
    </div>
  );
};

export default Trainers;