import React, { useState, useRef, useEffect } from 'react';
import { ChatBubble } from './components/ChatBubble';
import { KnowledgePanel } from './components/KnowledgePanel';
import { SendIcon, BotIcon, DatabaseIcon } from './components/Icon';
import { sendMessageToGemini } from './services/geminiService';
import { Message, TabView } from './types';
import { DEFAULT_KNOWLEDGE_BASE, WELCOME_MESSAGE } from './constants';

const App: React.FC = () => {

  const [knowledgeBase, setKnowledgeBase] = useState<string>(DEFAULT_KNOWLEDGE_BASE);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', role: 'model', text: WELCOME_MESSAGE, timestamp: Date.now() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabView>(TabView.CHAT);


  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMsgText = inputText.trim();
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: userMsgText,
      timestamp: Date.now()
    };

  
    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const conversationHistory = messages.map(m => ({ role: m.role, text: m.text }));
      
      const responseText = await sendMessageToGemini(
        userMsgText,
        knowledgeBase,
        conversationHistory
      );

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Désolé, une erreur technique est survenue. Vérifiez la clé API ou réessayez.",
        timestamp: Date.now(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:overflow-hidden font-sans selection:bg-emerald-500/30">
      {}
      <header className="h-16 border-b border-slate-700 bg-slate-800/50 backdrop-blur-md flex items-center justify-between px-4 md:px-8 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
             <span className="font-bold text-white text-lg">R</span>
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">Rafiq-AI</h1>
            <p className="text-[10px] text-emerald-400 font-medium uppercase tracking-widest">Overcode Mauritanie</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4 text-xs font-medium text-slate-400">
           <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 rounded-full border border-slate-700">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
             En Ligne
           </span>
           <span>Nuit de l'Info 2025</span>
        </div>
      </header>

      {}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {}
        <div className="md:hidden flex border-b border-slate-700 bg-slate-800">
          <button 
            onClick={() => setActiveTab(TabView.CHAT)}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === TabView.CHAT ? 'text-emerald-400 border-b-2 border-emerald-400 bg-slate-700/50' : 'text-slate-400'}`}
          >
            <BotIcon /> Chat
          </button>
          <button 
            onClick={() => setActiveTab(TabView.KNOWLEDGE)}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === TabView.KNOWLEDGE ? 'text-emerald-400 border-b-2 border-emerald-400 bg-slate-700/50' : 'text-slate-400'}`}
          >
            <DatabaseIcon /> Connaissances
          </button>
        </div>

        {}
        <div className={`
            flex-1 md:flex-[0.4] lg:flex-[0.35] p-4 bg-slate-900 
            ${activeTab === TabView.KNOWLEDGE ? 'flex' : 'hidden md:flex'}
            flex-col border-r border-slate-700 relative z-10
        `}>
          <KnowledgePanel 
            content={knowledgeBase} 
            onChange={setKnowledgeBase} 
          />
        </div>

        {}
        <div
  className={`
    flex-1 flex flex-col relative 
    bg-[url('/maura1.png')]
    bg-cover bg-center bg-no-repeat
  `}
>

          <div className="absolute inset-0 bg-slate-900/90 z-0 pointer-events-none"></div>

          {}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 relative z-10 custom-scrollbar">
             {messages.map((msg) => (
               <ChatBubble key={msg.id} message={msg} />
             ))}
             
             {isLoading && (
               <div className="flex justify-start mb-4 animate-pulse">
                 <div className="flex items-center gap-2 bg-slate-700/50 px-4 py-3 rounded-2xl rounded-tl-none">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms'}}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms'}}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms'}}></div>
                 </div>
               </div>
             )}
             <div ref={messagesEndRef} />
          </div>

          {}
          <div className="p-4 bg-slate-800/80 border-t border-slate-700 backdrop-blur-sm relative z-20">
            <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-3 items-end">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Posez votre question à Rafiq-AI..."
                  className="w-full bg-slate-900 border border-slate-600 text-slate-100 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-500"
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className={`
                  p-3 rounded-xl flex items-center justify-center transition-all duration-300
                  ${isLoading || !inputText.trim() 
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 active:scale-95'}
                `}
              >
                <SendIcon />
              </button>
            </form>
            <p className="text-center text-[10px] text-slate-500 mt-2">
               Rafiq-AI peut faire des erreurs. Vérifiez les informations importantes.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;