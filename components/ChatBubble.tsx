import React from 'react';
import { Message } from '../types';
import { BotIcon } from './Icon';

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in-up`}>
      <div className={`flex max-w-[85%] md:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-emerald-500' : 'bg-blue-600'}`}>
           {isUser ? (
             <span className="text-xs font-bold text-white">MOI</span>
           ) : (
             <BotIcon />
           )}
        </div>

        {}
        <div 
          className={`
            p-3.5 rounded-2xl text-sm leading-relaxed shadow-md
            ${isUser 
              ? 'bg-emerald-600 text-white rounded-tr-none' 
              : 'bg-slate-700 text-slate-100 rounded-tl-none border border-slate-600'
            }
            ${message.isError ? 'border-red-500 bg-red-900/20 text-red-200' : ''}
          `}
        >
          {}
          {message.text.split('\n').map((line, i) => (
            <p key={i} className={`min-h-[1rem] ${line.trim() === '' ? 'h-2' : ''}`}>
               {line.split('**').map((part, index) => 
                  index % 2 === 1 ? <strong key={index} className="font-bold text-emerald-300">{part}</strong> : part
               )}
            </p>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fadeInUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};