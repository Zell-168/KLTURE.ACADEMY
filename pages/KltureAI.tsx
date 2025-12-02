
import React from 'react';
import { useLang, useAuth } from '../App';
import Section from '../components/ui/Section';
import { Link } from 'react-router-dom';
import { Sparkles, MessageSquare, Video, PenTool, Lock } from 'lucide-react';

const KltureAI: React.FC = () => {
  const { t } = useLang();
  const { user } = useAuth();

  const tools = [
    {
      id: 'caption',
      title: t.ai.tools.caption,
      desc: t.ai.tools.captionDesc,
      icon: <MessageSquare size={32} className="text-red-500" />,
      link: '/klture-ai/caption',
      color: 'border-red-200 hover:border-red-500 bg-red-50'
    },
    {
      id: 'tiktok',
      title: t.ai.tools.tiktok,
      desc: t.ai.tools.tiktokDesc,
      icon: <Video size={32} className="text-cyan-500" />,
      link: '/klture-ai/tiktok',
      color: 'border-cyan-200 hover:border-cyan-500 bg-cyan-50'
    },
    {
      id: 'prompt',
      title: t.ai.tools.prompt,
      desc: t.ai.tools.promptDesc,
      icon: <PenTool size={32} className="text-purple-500" />,
      link: '/klture-ai/prompt',
      color: 'border-purple-200 hover:border-purple-500 bg-purple-50'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Section className="text-center pt-16 pb-8">
        <div className="inline-flex items-center justify-center p-3 bg-zinc-900 rounded-2xl mb-6 shadow-xl">
           <Sparkles size={40} className="text-yellow-400" />
        </div>
        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-purple-600 pb-2">
          {t.ai.title}
        </h1>
        <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto mb-8">
          {t.ai.subtitle}
        </p>

        {!user && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 max-w-md mx-auto mb-12 flex items-center gap-3 text-yellow-800">
            <Lock size={20} />
            <span className="font-bold text-sm">{t.ai.loginRequired}</span>
            <Link to="/signin" className="ml-auto underline font-bold">Sign In</Link>
          </div>
        )}
      </Section>

      <Section className="py-0 pb-24">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tools.map((tool) => (
            <div key={tool.id} className="relative group">
              <Link 
                to={user ? tool.link : '/signin'}
                className={`block h-full p-8 rounded-3xl border-2 transition-all duration-300 transform hover:-translate-y-2 shadow-sm hover:shadow-xl ${tool.color}`}
              >
                <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-md">
                  {tool.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-zinc-900">{tool.title}</h3>
                <p className="text-zinc-600 font-medium leading-relaxed">
                  {tool.desc}
                </p>
                
                <div className="mt-8 flex items-center font-bold text-sm uppercase tracking-wider opacity-60 group-hover:opacity-100 transition-opacity">
                   Launch Tool &rarr;
                </div>
              </Link>
              
              {!user && (
                 <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] rounded-3xl z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-not-allowed">
                     <div className="bg-black text-white px-4 py-2 rounded-lg font-bold shadow-lg flex items-center gap-2">
                        <Lock size={16} /> Login Required
                     </div>
                 </div>
              )}
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default KltureAI;
