import { useState, useEffect } from 'react';
import { Send, Mic, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Assistant() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [engine, setEngine] = useState('gpt');

  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

  const handleInput = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { from: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    const res = await fetch('/api/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: input, engine })
    });

    const data = await res.json();
    const reply = data.reply.trim();
    setMessages([...newMessages, { from: 'assistant', text: reply }]);
    speak(reply);
    setLoading(false);
  };

  const speak = (text) => {
    if (!synth) return;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
  };

  const handleVoice = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.start();
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col">
      <header className="text-2xl font-bold mb-4 flex justify-between items-center">
        <div>Fazal AI Assistant</div>
        <select value={engine} onChange={e => setEngine(e.target.value)} className="bg-gray-800 p-2 rounded">
          <option value="gpt">GPT-4</option>
          <option value="gemini">Gemini Pro</option>
        </select>
      </header>

      <div className="flex-1 overflow-y-auto space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`p-3 rounded-xl max-w-[75%] ${msg.from === 'user' ? 'bg-blue-700 self-end text-right ml-auto' : 'bg-gray-700 self-start text-left mr-auto'}`}>
            {msg.text}
          </div>
        ))}
        {loading && (
          <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="text-center text-gray-400">
            <Loader className="animate-spin inline-block" /> Thinking...
          </motion.div>
        )}
      </div>

      <div className="mt-4 flex gap-2 items-center">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." className="flex-1 p-2 rounded bg-gray-800" />
        <button onClick={handleInput} className="p-2 bg-blue-600 rounded"><Send /></button>
        <button onClick={handleVoice} className="p-2 bg-green-600 rounded"><Mic /></button>
      </div>
    </div>
  );
}