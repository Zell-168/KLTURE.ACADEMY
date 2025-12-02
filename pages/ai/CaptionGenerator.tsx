
import React, { useState } from 'react';
import { useLang, useAuth } from '../../App';
import Section from '../../components/ui/Section';
import { useNavigate } from 'react-router-dom';
import { Loader2, Copy, Sparkles, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';

// Fallback templates
const CAPTION_TEMPLATES: Record<string, string[]> = {
  professional: [
    "📢 {business} បានត្រលប់មកវិញជាមួយនឹងការផ្តល់ជូនពិសេស!\n\nផលិតផល: {product}\nប្រូម៉ូសិន: {promotion}\n\n{special}\n\nទាក់ទងឥឡូវនេះដើម្បីទទួលបានការផ្តល់ជូន!",
    "✨ {business} សូមណែនាំអំពី {product}!\n\n{special}\n\nការផ្តល់ជូន: {promotion}\n\nកុំអាលអស់សារ!",
    "🏆 ឱកាសមាសមុនគេពី {business}!\n\n{product} ឥឡូវនេះមាន {promotion}\n\n{special}\n\nរហ័ស! កំណត់ហេតុឥឡូវនេះ!"
  ],
  funny: [
    "អូយ៎!! {business} មកដល់ហើយជាមួយ {product} ដែលអ្នកមិនអាចធន់ទ្រាំបាន! 😂\n\n{special}\n\nហើយយើងមាន {promotion} សម្រាប់តែអ្នកដែលគិតថាខ្លួនឯងឆ្លាត!",
    "អារម្មណ៍ថាអ្នកខ្វះអ្វីមួយ? វាគឺ {product} ពី {business}! 🤪\n\n{special}\n\n{promotion} - ព្រោះយើងស្រឡាញ់អ្នក!",
    "អ្នកអាចទិញ {product} ពី {business} ឬក៏អាចអង្គុយយំដោយសារខកខាន! 😭\n\n{special}\n\n{promotion} - អស់ពីមុនអស់ពីក្រោយ!"
  ],
  genz: [
    "YO {business} DROP ថ្មីមកដល់ហើយ! 🚀\n\n{product} - {promotion}\n\n{special}\n\nអស់ហើយសម្រាប់អ្នកដែលចង់ដឹងចង់ឃើញ 😏 #NoCap",
    "អត់លក់អត់ខ្វល់ តែបើលក់អស់ អ្នកខ្វល់! 😤\n\n{product} ពី {business}\n{special}\n\n{promotion}\n\nទិញឥឡូវ ឬស៊យទៅណាមិនដឹងខ្លួន!",
    "អូនកំពុង FIND {product} ត្រង់នេះ! 👀\n\n{business} បាន BRING {promotion}\n\n{special}\n\nFOMO មែនទែន កុំឲ្យខកខាន! 💯"
  ]
};

const CaptionGenerator: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [inputs, setInputs] = useState({
    business: '',
    product: '',
    promotion: '',
    special: '',
    tone: 'genz'
  });
  const [copySuccess, setCopySuccess] = useState(false);

  // Redirect if not logged in
  if (!user) {
    navigate('/signin');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const generateWithTemplate = () => {
    const tone = inputs.tone as keyof typeof CAPTION_TEMPLATES;
    const templates = CAPTION_TEMPLATES[tone] || CAPTION_TEMPLATES.genz;
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    
    return randomTemplate
        .replace(/{business}/g, inputs.business)
        .replace(/{product}/g, inputs.product)
        .replace(/{promotion}/g, inputs.promotion)
        .replace(/{special}/g, inputs.special);
  };

  const handleGenerate = async () => {
    if (!inputs.business || !inputs.product || !inputs.promotion) {
      alert("Please fill in the required fields.");
      return;
    }

    setLoading(true);
    let finalCaption = '';

    try {
      // API Logic adapted from prompt
      // Note: In a real app, do NOT expose keys on client. This is per user request.
      const prompt = `អ្នកជាអ្នកសរសេរអត្ថបទកាត់ខ្លីៗសម្រាប់ការលក់ដ៏អស្ចារ្យបំផុតនៅកម្ពុជា។ សរសេរអត្ថបទកាត់ខ្លីៗសម្រាប់ប្រូម៉ូហ្សិននេះដោយប្រើសំដី${inputs.tone === 'professional' ? 'ផ្លូវការ' : inputs.tone === 'funny' ? 'កំប្លែង' : 'Gen Z ទាន់សម័យ'}។

ព័ត៌មានសំខាន់៖
- អាជីវកម្ម៖ ${inputs.business}
- ផលិតផល៖ ${inputs.product}
- ប្រូម៉ូហ្សិន៖ ${inputs.promotion}
- ពិសេស៖ ${inputs.special}

សរសេរអត្ថបទកាត់ខ្លីៗដែលមានតែ 3-4 ឃ្លាប៉ុណ្ណោះ ដោយប្រើអារម្មណ៍ខ្លាំងៗ និងអំពើដែលអាចធ្វើឲ្យអ្នកអានចង់ទិញភ្លាមៗ! ប្រើ emoji ដើម្បីធ្វើឲ្យវាកាន់តែគួរឲ្យចាប់អារម្មណ៍។`;

      try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer sk-cc7dfa8bd02b48929129417d19c17c4f'
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                max_tokens: 300
            })
        });

        if (!response.ok) throw new Error("API Error");
        const data = await response.json();
        finalCaption = data.choices[0].message.content;

      } catch (apiErr) {
        console.warn("API failed, using fallback", apiErr);
        finalCaption = generateWithTemplate() + "\n\n(AI unavailable, generated using template)";
      }

      setResult(finalCaption);

      // Save to History
      await supabase.from('ai_history').insert({
        user_email: user.email,
        tool_type: 'caption',
        input_context: inputs,
        output_content: finalCaption
      });

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <Section className="py-8">
        <button onClick={() => navigate('/klture-ai')} className="flex items-center text-zinc-500 hover:text-black mb-6">
          <ArrowLeft size={16} className="mr-2" /> Back to Tools
        </button>

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-red-600 mb-2">KHAPTION.AI</h1>
            <p className="text-lg font-medium text-red-500">បង្កើតអត្ថបទកាត់ខ្លីៗដែលធ្វើឲ្យលក់ដាច់ដូចកាត់ទឹក! 🔥</p>
          </div>

          <div className="bg-zinc-50 p-6 md:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
            <div>
              <label className="block text-red-600 font-bold mb-2">1. ឈ្មោះអាជីវកម្មរបស់អ្នក:</label>
              <input 
                name="business" 
                value={inputs.business} 
                onChange={handleChange} 
                className="w-full p-3 border-2 border-red-200 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                placeholder="ឧទាហរណ៍: Zell Fashion" 
              />
            </div>
            
            <div>
              <label className="block text-red-600 font-bold mb-2">2. អ្នកលក់អ្វី?</label>
              <input 
                name="product" 
                value={inputs.product} 
                onChange={handleChange}
                className="w-full p-3 border-2 border-red-200 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                placeholder="ឧទាហរណ៍: អាវយឺតគុណភាពខ្ពស់" 
              />
            </div>

            <div>
              <label className="block text-red-600 font-bold mb-2">3. ប្រូម៉ូហ្សិននេះមានអ្វីពិសេស?</label>
              <textarea 
                name="promotion" 
                value={inputs.promotion} 
                onChange={handleChange}
                rows={3}
                className="w-full p-3 border-2 border-red-200 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                placeholder="ឧទាហរណ៍: បញ្ចុះតម្លៃ 30% សម្រាប់តែ 3 ថ្ងៃប៉ុណ្ណោះ"
              ></textarea>
            </div>

            <div>
              <label className="block text-red-600 font-bold mb-2">4. តើមានអ្វីពិសេសក្នុងយុទ្ធនាការនេះ?</label>
              <textarea 
                name="special" 
                value={inputs.special} 
                onChange={handleChange}
                rows={3}
                className="w-full p-3 border-2 border-red-200 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                placeholder="ឧទាហរណ៍: បើកដាក់តែមួយគត់សម្រាប់អតិថិជន VIP"
              ></textarea>
            </div>

            <div>
              <label className="block text-red-600 font-bold mb-2">5. សរសេរបែបណា?</label>
              <select 
                name="tone" 
                value={inputs.tone} 
                onChange={handleChange}
                className="w-full p-3 border-2 border-red-200 rounded-lg focus:outline-none focus:border-red-500 transition-colors bg-white"
              >
                <option value="professional">របៀបផ្លូវការ (Professional)</option>
                <option value="funny">របៀបរីករាយ (Funny)</option>
                <option value="genz">របៀប Gen Z (Trendy & Playful)</option>
              </select>
            </div>

            <button 
              onClick={handleGenerate} 
              disabled={loading}
              className="w-full bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-all transform hover:-translate-y-1 shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
              {loading ? "កំពុងបង្កើត..." : "បង្កើតអត្ថបទកាត់ខ្លីៗឥឡូវនេះ! 🚀"}
            </button>
          </div>

          {result && (
            <div className="mt-8 p-6 border-2 border-dashed border-red-300 bg-red-50 rounded-2xl relative animate-fade-in">
              <h3 className="font-bold text-red-800 mb-4">លទ្ធផលរបស់អ្នក:</h3>
              <p className="whitespace-pre-line text-lg leading-relaxed">{result}</p>
              
              <button 
                onClick={copyToClipboard}
                className="mt-6 bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-zinc-800 transition-colors flex items-center gap-2"
              >
                {copySuccess ? <CheckCircle className="text-green-400" size={18} /> : <Copy size={18} />}
                {copySuccess ? "ចម្លងរួចរាល់!" : "ចម្លងអត្ថបទ"}
              </button>
            </div>
          )}
          
          <div className="text-center mt-12 text-zinc-400 text-sm">
             ផលិតដោយ Zell [ប្រើប្រាស់ AI 100%] | KLTURE.MEDIA
          </div>
        </div>
      </Section>
    </div>
  );
};

// Add check circle icon manually since it wasn't imported
import { CheckCircle } from 'lucide-react';

export default CaptionGenerator;
