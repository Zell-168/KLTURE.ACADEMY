import React, { useState } from 'react';
import { useLang } from '../App';
import Section from '../components/ui/Section';
import { FAQS } from '../constants';
import { ChevronDown, AlertTriangle } from 'lucide-react';

const FAQ: React.FC = () => {
  const { t } = useLang();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <Section>
      <h1 className="text-3xl font-bold text-center mb-12">{t.faq.title}</h1>

      {/* Policy Box */}
      <div className="max-w-3xl mx-auto bg-red-50 border border-red-100 p-8 rounded-2xl mb-12">
        <div className="flex items-start gap-4">
            <AlertTriangle className="text-red-600 shrink-0 mt-1" />
            <div>
                <h2 className="text-xl font-bold text-red-800 mb-4">{t.faq.refundTitle}</h2>
                <ul className="space-y-2 list-disc pl-5 text-red-900 mb-4">
                    {t.faq.refundPolicy.map((line, i) => (
                        <li key={i}>{line}</li>
                    ))}
                </ul>
                <p className="text-sm font-bold text-red-700">{t.faq.refundNote}</p>
            </div>
        </div>
      </div>

      {/* Accordion */}
      <div className="max-w-3xl mx-auto space-y-4">
        {FAQS.map((faq, idx) => (
            <div key={idx} className="border border-zinc-200 rounded-lg overflow-hidden">
                <button 
                    onClick={() => toggle(idx)}
                    className="w-full flex justify-between items-center p-6 bg-white hover:bg-zinc-50 transition-colors text-left"
                >
                    <span className="font-bold text-zinc-900">{faq.question}</span>
                    <ChevronDown className={`transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`} />
                </button>
                <div 
                    className={`overflow-hidden transition-all duration-300 ${openIndex === idx ? 'max-h-48' : 'max-h-0'}`}
                >
                    <div className="p-6 pt-0 text-zinc-600 bg-white">
                        {faq.answer}
                    </div>
                </div>
            </div>
        ))}
      </div>
    </Section>
  );
};

export default FAQ;