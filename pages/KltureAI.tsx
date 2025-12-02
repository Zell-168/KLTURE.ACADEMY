
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
    <div className="min-h-screen bg-zinc-50/50">
      {/* Hero Section */}
      <div className="relative bg-white border-b border-zinc-100 overflow-hidden">
          <Section className="text-center pt-20 pb-16 relative z-10">
            <div className="inline-flex items-center justify-center p-4 bg-zinc-900 rounded-3xl mb-8 shadow-2xl ring-4 ring-zinc-100">
              <Sparkles size={48} className="text-yellow-400" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-zinc-900">
               {t.ai.title}
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto font-medium leading-relaxed">
              {t.ai.subtitle}
            </p>

            {!user && (
              <div className="mt-8 inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-full px-5 py-2 text-yellow-800 shadow-sm animate-pulse">
                <Lock size={16} />
                <span className="font-bold text-sm">{t.ai.loginRequired}</span>
                <Link to="/signin" className="ml-2 underline font-bold hover:text-yellow-900">Sign In</Link>
              </div>
            )}
          </Section>
          
          {/* Decorative Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-red-100 rounded-full blur-3xl opacity-50"></div>
              <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-100 rounded-full blur-3xl opacity-50"></div>
          </div>
      </div>

      <Section className="pb-24">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tools.map((tool) => (
            <div key={tool.id} className="relative group">
              <Link 
                to={user ? tool.link : '/signin'}
                className={`block h-full p-8 rounded-3xl border-2 transition-all duration-300 transform hover:-translate-y-2 shadow-sm hover:shadow-xl bg-white ${tool.color}`}
              >
                <div className="bg-white w-20 h-20 rounded-2xl flex items-center justify-center mb-8 shadow-lg border border-zinc-100">
                  {tool.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-zinc-900">{tool.title}</h3>
                <p className="text-zinc-600 font-medium leading-relaxed">
                  {tool.desc}
                </p>
                
                <div className="mt-8 flex items-center font-bold text-sm uppercase tracking-wider opacity-60 group-hover:opacity-100 transition-opacity">
                   Launch Tool &rarr;
                </div>
              </Link>
              
              {!user && (
                 <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] rounded-3xl z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-not-allowed">
                     <div className="bg-zinc-900 text-white px-5 py-3 rounded-xl font-bold shadow-2xl flex items-center gap-2">
                        <Lock size={18} /> Login Required
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
    