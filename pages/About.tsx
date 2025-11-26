import React from 'react';
import { useLang } from '../App';
import Section from '../components/ui/Section';
import { Target, TrendingUp } from 'lucide-react';

const About: React.FC = () => {
  const { t } = useLang();

  return (
    <div>
        <Section>
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">{t.about.title}</h1>
                <div className="prose prose-lg text-zinc-600 space-y-4 mb-12">
                    {t.about.content.map((para, i) => (
                        <p key={i}>{para}</p>
                    ))}
                </div>
                
                <div className="bg-zinc-900 text-white p-8 rounded-2xl shadow-xl mb-16">
                    <Target className="text-red-500 mb-4" size={32} />
                    <p className="text-xl font-medium leading-relaxed font-serif italic">"{t.about.mission}"</p>
                </div>

                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <TrendingUp className="text-red-600" size={28} />
                        <h2 className="text-2xl font-bold">{t.about.visionTitle}</h2>
                    </div>
                    
                    <div className="border-l-2 border-zinc-200 pl-8 space-y-6 relative">
                         {t.about.visionList.map((item, i) => (
                            <div key={i} className="relative">
                                <span className="absolute -left-[39px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-red-500"></span>
                                <p className="text-zinc-800 font-medium">{item}</p>
                            </div>
                         ))}
                    </div>
                </div>
            </div>
        </Section>
    </div>
  );
};

export default About;