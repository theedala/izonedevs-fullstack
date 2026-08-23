import React, { useState } from 'react';
import { ChevronDownIcon } from '../ui/icons';
interface FAQItem {
  question: string;
  answer: string;
}
interface FAQProps {
  items: FAQItem[];
  className?: string;
}
const FAQ: React.FC<FAQProps> = ({
  items,
  className = ''
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  return <div className={`bg-dark-lighter rounded-lg border border-neutral/20 overflow-hidden ${className}`}>
      <div className="p-6 border-b border-slate/20">
        <h3 className="text-2xl font-bold">Frequently Asked Questions</h3>
      </div>
      <div className="divide-y divide-neutral/20">
        {items.map((item, index) => <div key={index} className="cursor-pointer">
            <div className="flex justify-between items-center p-6 hover:bg-dark-light" onClick={() => toggleItem(index)}>
              <h4 className="text-lg font-medium">{item.question}</h4>
              <ChevronDownIcon size={20} className={`transition-transform duration-300 ${openIndex === index ? 'transform rotate-180' : ''}`} />
            </div>
            {openIndex === index && <div className="p-6 pt-0 text-slate-500 bg-slate-50">
                <p>{item.answer}</p>
              </div>}
          </div>)}
      </div>
    </div>;
};
export default FAQ;