
import React, { useState } from 'react';
import { useAuth } from '../../App';
import Section from '../../components/ui/Section';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Video, ExternalLink } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const TikTokGenerator: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [inputs, setInputs] = useState({
    pageName: '',
    tiktokUrl: '',
    contentType: '',
    audience: ''
  });

  if (!user) {
    navigate('/signin');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setInputs({ ...inputs, [e.target.id]: e.target.value });
  };

  const generateMockIdeas = () => {
     return [
        {
            title: `${inputs.pageName} ${inputs.contentType} Challenge`,
            description: `Engage your ${inputs.audience} with this trending challenge format`,
            creation_instructions: `Film in vertical format, use trending audio, add engaging captions and hashtags relevant to ${inputs.contentType}`,
            hook: `"You won't believe what happened when I tried this ${inputs.contentType} challenge!"`,
            script: `[0-3s] Surprised reaction to challenge\n[3-10s] Explain the challenge rules\n[10-25s] Show the actual challenge attempt\n[25-30s] Final result and call to action for viewers to try`
        },
        {
            title: `Behind the Scenes: ${inputs.pageName}`,
            description: `Show the real personality behind ${inputs.pageName}`,
            creation_instructions: `Use casual filming style, natural lighting, share authentic moments that resonate with ${inputs.audience}`,
            hook: `"This is what my day REALLY looks like behind the camera..."`,
            script: `[0-5s] Quick intro showing "perfect" vs "real" life\n[5-15s] Morning routine and setup\n[15-25s] Behind scenes of content creation\n[25-30s] Personal reflection and connection with audience`
        },
        {
            title: `${inputs.contentType} Tips & Tricks`,
            description: `Educational content that provides value to ${inputs.audience}`,
            creation_instructions: `Create quick tutorial format, use text overlays, demonstrate practical skills related to ${inputs.contentType}`,
            hook: `"Stop making this common ${inputs.contentType} mistake! Here's the right way..."`,
            script: `[0-3s] Show the WRONG way dramatically\n[3-8s] Reveal this is a common mistake\n[8-20s] Demonstrate the RIGHT way step by step\n[20-30s] Additional pro tips and results`
        }
    ];
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setIdeas([]);
    setErrorMsg(null);

    const DEEPSEEK_API_KEY = 'sk-ce3ebc71f1bb464da568d16149fb7970';
    const MODEL_NAME = 'deepseek-chat';

    try {
        let generatedIdeas = [];

        // Check if using provided key
        if (!DEEPSEEK_API_KEY) {
             generatedIdeas = generateMockIdeas();
        } else {
             const prompt = `You are an expert TikTok content strategist. Based on the following details:
- Page name: ${inputs.pageName}
- TikTok URL: ${inputs.tiktokUrl}
- Content type: ${inputs.contentType}
- Audience: ${inputs.audience}

Generate 5 highly relevant TikTok video content ideas in JSON format with fields: title, description, creation_instructions, hook, script.

Return ONLY valid JSON array with exactly 5 objects, no additional text. Each object should have: title, description, creation_instructions, hook, script.

For "hook": Provide an attention-grabbing opening line or concept that will hook viewers in the first 3 seconds.
For "script": Provide a draft script outline or key talking points for the video content.`;

             try {
                const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
                    },
                    body: JSON.stringify({
                        model: MODEL_NAME,
                        messages: [{ role: 'user', content: prompt }],
                        temperature: 0.8,
                        max_tokens: 3000
                    })
                });

                if (!response.ok) throw new Error("API Request Failed");
                const data = await response.json();
                const content = data.choices[0].message.content;
                
                // Extract JSON
                const jsonMatch = content.match(/\[[\s\S]*\]/);
                if (jsonMatch) {
                    generatedIdeas = JSON.parse(jsonMatch[0]);
                } else {
                    throw new Error("Invalid format");
                }
             } catch (apiErr) {
                 console.warn("API Failed, using mock", apiErr);
                 generatedIdeas = generateMockIdeas();
             }
        }

        setIdeas(generatedIdeas);

        // Save History
        await supabase.from('ai_history').insert({
            user_email: user.email,
            tool_type: 'tiktok',
            input_context: inputs,
            output_content: JSON.stringify(generatedIdeas)
        });

    } catch (err) {
        console.error(err);
        setErrorMsg("Something went wrong generating ideas.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
      <Section className="py-8">
        <button onClick={() => navigate('/klture-ai')} className="flex items-center text-zinc-500 hover:text-black mb-6">
          <ArrowLeft size={16} className="mr-2" /> Back to Tools
        </button>

        <header className="text-center mb-10 bg-white p-8 rounded-3xl shadow-sm relative overflow-hidden">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-500 mb-2">
                ធ្វេី TikTok ជាមួយ AI by Zell
            </h1>
            <p className="text-zinc-500 mb-6">Free AI tool to generate TikTok content ideas based on your current page and audience.</p>
            
            <a 
                href="https://www.overread.asia/categories/1216w8p83d895i1" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-blue-500 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
            >
                <ExternalLink size={18} />
                សៀវភៅច្រករកលុយតាម AI ទាំង ៣០ ចំនុច
            </a>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm h-fit">
                <h2 className="text-2xl font-bold mb-6 text-zinc-800">Generate Your Content Ideas</h2>
                <form onSubmit={handleGenerate} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold mb-2">Your page name</label>
                        <input id="pageName" value={inputs.pageName} onChange={handleChange} required className="w-full p-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:outline-none" placeholder="Ex: Zell Official" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">Provide URL to your TikTok account</label>
                        <input id="tiktokUrl" value={inputs.tiktokUrl} onChange={handleChange} required type="url" className="w-full p-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:outline-none" placeholder="Ex: https://www.tiktok.com/@yourusername" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">What type of contents you want to do?</label>
                        <select id="contentType" value={inputs.contentType} onChange={handleChange} required className="w-full p-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:outline-none bg-white">
                            <option value="">Select content type</option>
                            <option value="Street Interview">Street Interview</option>
                            <option value="Podcast">Podcast</option>
                            <option value="Daily Vlog">Daily Vlog</option>
                            <option value="Short Film">Short Film</option>
                            <option value="Q&A">Q&A</option>
                            <option value="Talking & Sharing">Talking & Sharing</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">Describe your audience</label>
                        <textarea id="audience" value={inputs.audience} onChange={handleChange} required className="w-full p-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:outline-none" rows={3} placeholder="Ex: Cambodian Gen Z who love marketing tips..."></textarea>
                    </div>
                    
                    <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-pink-500 to-cyan-500 text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                        {loading ? <Loader2 className="animate-spin" /> : <Video />}
                        {loading ? "Generating Ideas..." : "Generate Content Ideas"}
                    </button>
                </form>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm min-h-[500px]">
                <h2 className="text-2xl font-bold mb-6 text-zinc-800">Content Ideas</h2>
                
                {loading && (
                    <div className="flex flex-col items-center justify-center h-64 text-zinc-400">
                        <Loader2 className="animate-spin mb-4 text-cyan-500" size={48} />
                        <p>Generating creative ideas...</p>
                    </div>
                )}

                {errorMsg && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
                        {errorMsg}
                    </div>
                )}

                {!loading && ideas.length > 0 && (
                    <div className="space-y-6">
                        {ideas.map((idea, idx) => (
                            <div key={idx} className="border border-zinc-100 rounded-xl p-5 hover:shadow-md transition-shadow bg-zinc-50">
                                <h3 className="font-bold text-lg mb-2 text-zinc-900">{idea.title}</h3>
                                <p className="text-sm text-zinc-600 mb-3">{idea.description}</p>
                                
                                <div className="space-y-3">
                                    <div className="bg-white p-3 rounded-lg border-l-4 border-pink-500">
                                        <span className="text-xs font-bold uppercase text-pink-500 block mb-1">Hook</span>
                                        <p className="text-sm font-medium italic">"{idea.hook}"</p>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg border-l-4 border-cyan-500">
                                        <span className="text-xs font-bold uppercase text-cyan-500 block mb-1">Script Outline</span>
                                        <p className="text-xs text-zinc-600 whitespace-pre-line">{idea.script}</p>
                                    </div>
                                    <div className="text-xs text-zinc-400 mt-2">
                                        <span className="font-bold">Instructions:</span> {idea.creation_instructions}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && ideas.length === 0 && !errorMsg && (
                    <div className="flex flex-col items-center justify-center h-64 text-zinc-300 text-center">
                        <Video size={64} className="mb-4" />
                        <p>Fill out the form to get ideas.</p>
                    </div>
                )}
            </div>
        </div>
      </Section>
    </div>
  );
};

export default TikTokGenerator;
