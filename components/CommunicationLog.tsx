import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { Send, MessageSquare, Bot, Minimize2, Radio } from 'lucide-react';
import { generateChatReply } from '../services/geminiService';

interface CommunicationLogProps {
  messages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
}

const CommunicationLog: React.FC<CommunicationLogProps> = ({ messages, addMessage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'Director',
      role: 'Manager',
      text: input,
      timestamp: new Date()
    };
    addMessage(userMsg);
    setInput('');
    setIsTyping(true);

    // AI Response logic
    const history = messages.slice(-5).map(m => `${m.role}: ${m.text}`);
    const replyText = await generateChatReply(history, userMsg.text);
    
    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'System AI',
      role: 'AI',
      text: replyText,
      timestamp: new Date()
    };
    
    setIsTyping(false);
    addMessage(aiMsg);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="absolute bottom-8 right-8 bg-stone-900 hover:bg-black text-amber-50 p-4 rounded-full shadow-2xl shadow-stone-900/40 transition-all hover:scale-105 flex items-center gap-3 z-50 border border-stone-700"
      >
        <MessageSquare size={20} />
        <span className="font-bold text-xs uppercase tracking-widest hidden md:inline text-amber-500">Comms Link</span>
        {messages.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                {messages.length}
            </span>
        )}
      </button>
    );
  }

  return (
    <div className="absolute bottom-8 right-8 w-80 md:w-96 bg-white rounded-sm shadow-2xl border border-stone-200 flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300 ring-1 ring-black/5" style={{ height: '540px' }}>
      {/* Header */}
      <div className="p-4 bg-stone-900 text-white flex justify-between items-center border-b border-stone-800">
        <div>
           <h3 className="font-bold text-sm uppercase tracking-widest flex items-center gap-2 text-amber-500">
             <Radio size={14} className="animate-pulse" /> Live Log
           </h3>
           <span className="text-[10px] text-stone-400 block mt-0.5">Secure Channel • Encrypted</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-stone-500 hover:text-white transition-colors">
          <Minimize2 size={16} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-stone-50" ref={scrollRef}>
        {messages.map((msg) => {
           const isAI = msg.role === 'AI';
           const isMe = msg.role === 'Manager';
           
           return (
             <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] rounded-lg px-4 py-3 text-sm shadow-sm border ${
                    isMe ? 'bg-stone-800 text-white border-stone-700 rounded-br-none' : 
                    isAI ? 'bg-white border-stone-200 text-stone-700 rounded-bl-none' :
                    'bg-stone-200 text-stone-800 border-transparent'
                }`}>
                   <p className="leading-relaxed">{msg.text}</p>
                </div>
                <div className="flex items-center gap-1.5 mt-1.5 px-1">
                   {isAI && <Bot size={10} className="text-amber-600"/>}
                   <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider">
                     {isAI ? 'System AI' : msg.sender} • {msg.timestamp.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                   </span>
                </div>
             </div>
           );
        })}
        {isTyping && (
           <div className="flex items-center gap-2 text-xs text-amber-600 pl-2 font-mono">
              <Bot size={12} className="animate-bounce" /> Processing Intelligence...
           </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-stone-100 flex gap-3">
        <input 
          className="flex-1 bg-stone-50 border border-stone-200 rounded-sm px-4 py-2 text-sm focus:ring-1 focus:ring-amber-500 focus:bg-white outline-none transition-all placeholder:text-stone-400 font-medium"
          placeholder="Transmit message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button 
          onClick={handleSend}
          className="bg-stone-900 text-amber-500 p-2.5 rounded-sm hover:bg-black transition-colors shadow-sm"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

export default CommunicationLog;