
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, WeatherData } from '../types';
import { chatWithWeatherExpert } from '../services/geminiService';

interface ChatInterfaceProps {
  weather: WeatherData | null;
  onCityUpdate: (city: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ weather, onCityUpdate }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
        role: 'assistant', 
        content: "Hello! I'm SkyCast AI. I can give you live weather updates, travel tips, or clothing advice. What's on your mind?", 
        timestamp: Date.now() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = { role: 'user', content: input, timestamp: Date.now() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const { text, sources, cityToUpdate } = await chatWithWeatherExpert(newMessages, weather);
      
      if (cityToUpdate) {
        onCityUpdate(cityToUpdate);
      }

      const assistantMsg: ChatMessage = { 
        role: 'assistant', 
        content: text, 
        timestamp: Date.now(),
        sources: sources.length > 0 ? sources : undefined
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] glass rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative">
      <div className="bg-white/[0.03] backdrop-blur-2xl p-5 border-b border-white/10 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black shadow-xl shadow-blue-500/20 ring-1 ring-white/20">
              SC
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-[#0f172a] rounded-full"></span>
          </div>
          <div>
            <h3 className="font-bold text-white text-sm tracking-tight">SkyCast AI Assistant</h3>
            <div className="flex items-center gap-1.5">
                <p className="text-[9px] text-blue-400 uppercase tracking-[0.2em] font-black">Vector Analytics Online</p>
            </div>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-hide">
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} group animate-fade-in-up`}>
            <div className={`flex items-end gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`p-4 rounded-[1.5rem] text-sm leading-relaxed shadow-lg ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-none border border-blue-400/20' 
                  : 'bg-white/[0.05] text-slate-100 rounded-tl-none border border-white/10 backdrop-blur-md'
              }`}>
                {msg.content}
                
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Grounding Sources:</p>
                    <div className="flex flex-wrap gap-2">
                      {msg.sources.map((source, idx) => (
                        <a 
                          key={idx} 
                          href={source.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[10px] bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded-xl text-blue-300 transition-all flex items-center gap-1.5 border border-white/5"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          <span className="truncate max-w-[120px]">{source.title}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <span className="text-[9px] text-slate-500 mt-2 font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity px-2">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/10 flex gap-2 items-center">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
              </div>
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] ml-2">Analyzing vectors...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-5 bg-black/40 border-t border-white/5">
        <form onSubmit={handleSend} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the atmosphere..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 pr-14 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm transition-all placeholder-slate-500"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all ${
                !input.trim() || isTyping 
                ? 'bg-white/5 text-slate-600' 
                : 'bg-blue-600 text-white hover:bg-blue-500 active:scale-95 shadow-xl shadow-blue-600/30'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
        <div className="flex justify-center items-center gap-2 mt-3">
          <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
          <p className="text-[9px] text-slate-600 text-center uppercase tracking-[0.2em] font-black">Grounding Enabled</p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
