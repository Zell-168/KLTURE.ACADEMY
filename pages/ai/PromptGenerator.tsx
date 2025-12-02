
import React, { useState } from 'react';
import { useAuth, useLang } from '../../App';
import Section from '../../components/ui/Section';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, PenTool, CheckCircle, Copy, ShoppingBag } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const PromptGenerator: React.FC = () => {
  const { user } = useAuth();
  const { lang, toggleLang } = useLang(); // Reuse existing lang context, though form allows toggle
  const navigate = useNavigate();
  
  const [formLang, setFormLang] = useState<'en'|'km'>('en');
  const [result, setResult] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  
  const [inputs, setInputs] = useState({
    businessName: '',
    selling: '',
    type: 'product',
    aiTask: '',
    aiTool: ''
  });

  if (!user) {
    navigate('/signin');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setInputs({ ...inputs, [e.target.id]: e.target.value });
  };
  
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, type: e.target.value });
  };

  const generatePrompt = () => {
    const prompt = `Act as an expert ${inputs.type === 'product' ? 'product' : 'service'} consultant for ${inputs.businessName} that specializes in ${inputs.selling}.

I need you to: ${inputs.aiTask}

Please provide a detailed response that:
1. Is tailored specifically for ${inputs.aiTool}
2. Addresses my request comprehensively
3. Provides actionable steps or solutions
4. Includes relevant examples if applicable
5. Is formatted clearly with headings and bullet points

Additional context:
- Business type: ${inputs.type}
- Industry/specialization: ${inputs.selling}
- AI platform being used: ${inputs.aiTool}

Please ensure your response is professional, well-structured, and optimized for best results with ${inputs.aiTool}.`;

    setResult(prompt);
    
    // Save history
    supabase.from('ai_history').insert({
        user_email: user.email,
        tool_type: 'prompt',
        input_context: inputs,
        output_content: prompt
    }).then(({ error }) => {
        if (error) console.error("Failed to save history", error);
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Labels based on formLang
  const labels = {
    businessName: formLang === 'en' ? "What is your business name?" : "តើអាជីវកម្មរបស់អ្នកឈ្មោះអ្វី?",
    selling: formLang === 'en' ? "What do you sell?" : "តើអ្នកលក់អ្វី?",
    type: formLang === 'en' ? "Product or Service?" : "ផលិតផល ឬសេវាកម្ម?",
    task: formLang === 'en' ? "What do you want the AI to do?" : "តើអ្នកចង់អោយ AI ធ្វើអ្វី?",
    tool: formLang === 'en' ? "Which AI are you using?" : "តើអ្នកកំពុងប្រើ AI អ្វី?",
    btn: formLang === 'en' ? "Generate Prompt" : "បង្កើត Prompt"
  };

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900">
      <Section className="py-8">
        <button onClick={() => navigate('/klture-ai')} className="flex items-center text-zinc-500 hover:text-black mb-6">
          <ArrowLeft size={16} className="mr-2" /> Back to Tools
        </button>
        
        <header className="text-center mb-10">
             <div className="font-bold text-2xl text-red-600 mb-2">SEKSA.AI by Zell</div>
             <h1 className="text-4xl font-black mb-4">Master AI Prompt Creation</h1>
             <p className="max-w-2xl mx-auto text-zinc-500">Learn to craft effective prompts for ChatGPT, Gemini, Deepseek and other AI tools to boost your productivity in work, study, and business.</p>
        </header>

        <div className="bg-zinc-900 rounded-2xl p-8 max-w-3xl mx-auto text-white shadow-2xl mb-20">
            <h2 className="text-center text-2xl font-bold mb-8">AI Prompt Generation Tool</h2>
            
            <div className="flex justify-center mb-6">
                <button onClick={() => setFormLang('en')} className={`px-4 py-1 border border-white rounded-l-md ${formLang === 'en' ? 'bg-red-600 border-red-600' : 'bg-transparent'}`}>English</button>
                <button onClick={() => setFormLang('km')} className={`px-4 py-1 border border-white rounded-r-md ${formLang === 'km' ? 'bg-red-600 border-red-600' : 'bg-transparent'}`}>ភាសាខ្មែរ</button>
            </div>

            <div className="space-y-5">
                <div>
                    <label className="block font-medium mb-2">{labels.businessName}</label>
                    <input id="businessName" value={inputs.businessName} onChange={handleChange} className="w-full p-3 rounded bg-white text-black border-none focus:ring-2 focus:ring-red-500" required />
                </div>
                <div>
                    <label className="block font-medium mb-2">{labels.selling}</label>
                    <input id="selling" value={inputs.selling} onChange={handleChange} className="w-full p-3 rounded bg-white text-black border-none focus:ring-2 focus:ring-red-500" required />
                </div>
                <div>
                    <label className="block font-medium mb-2">{labels.type}</label>
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="type" value="product" checked={inputs.type === 'product'} onChange={handleRadioChange} className="accent-red-600 w-5 h-5" />
                            <span>{formLang === 'en' ? 'Product' : 'ផលិតផល'}</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="type" value="service" checked={inputs.type === 'service'} onChange={handleRadioChange} className="accent-red-600 w-5 h-5" />
                            <span>{formLang === 'en' ? 'Service' : 'សេវាកម្ម'}</span>
                        </label>
                    </div>
                </div>
                <div>
                    <label className="block font-medium mb-2">{labels.task}</label>
                    <textarea id="aiTask" rows={3} value={inputs.aiTask} onChange={handleChange} className="w-full p-3 rounded bg-white text-black border-none focus:ring-2 focus:ring-red-500" required></textarea>
                </div>
                <div>
                    <label className="block font-medium mb-2">{labels.tool}</label>
                    <select id="aiTool" value={inputs.aiTool} onChange={handleChange} className="w-full p-3 rounded bg-white text-black border-none focus:ring-2 focus:ring-red-500" required>
                        <option value="">-- Select --</option>
                        <option value="chatgpt">ChatGPT</option>
                        <option value="gemini">Gemini</option>
                        <option value="deepseek">Deepseek</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <button onClick={generatePrompt} className="w-full py-3 bg-red-600 text-white font-bold rounded hover:bg-red-700 transition-colors mt-4">
                    {labels.btn}
                </button>
            </div>

            {result && (
                <div className="mt-8 p-6 bg-black border border-red-600 rounded-lg">
                    <h3 className="font-bold text-lg mb-4 text-white">Your Custom AI Prompt:</h3>
                    <div className="whitespace-pre-wrap text-zinc-300 mb-4 font-mono text-sm bg-zinc-900/50 p-4 rounded">
                        {result}
                    </div>
                    <button onClick={copyToClipboard} className="bg-red-600 text-white px-6 py-2 rounded font-bold hover:bg-red-700 flex items-center gap-2">
                         {copySuccess ? <CheckCircle size={18} /> : <Copy size={18} />}
                         {copySuccess ? "Copied" : "Copy Prompt"}
                    </button>
                </div>
            )}
        </div>

        {/* Fixed Ad Button */}
        <a 
            href="https://www.overread.asia/categories/1216w8p83d895i1" 
            target="_blank" 
            rel="noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-red-600 text-white px-5 py-3 rounded-lg font-bold shadow-2xl hover:bg-red-700 transition-all flex items-center gap-2 hover:scale-105 border-2 border-white max-w-[200px] text-center text-sm"
        >
            <ShoppingBag size={18} className="shrink-0" />
            ទិញសៀរភៅរៀនរកលុយជាមួយ ChatGPT $3/ក្បាល
        </a>
      </Section>
    </div>
  );
};

export default PromptGenerator;
