import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { Bot, X, Send, Sparkles } from "lucide-react";

export default function AIChatWidget() {
  const { user, token } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "ai", text: "¡Hola! Soy el asistente virtual de TurnoFlex. ¿En qué puedo ayudarte hoy?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userQuestion = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { from: "user", text: userQuestion }]);
    setLoading(true);

    try {
      const res = await api.askAI(token, userQuestion);
      setMessages((prev) => [...prev, { from: "ai", text: res.reply }]);
    } catch {
      setMessages((prev) => [...prev, { from: "ai", text: "Disculpá, hubo un problema al procesar tu consulta." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 border border-indigo-400/30 transition transform hover:scale-105"
        >
          <Bot className="w-6 h-6" />
          <span className="text-xs font-bold hidden sm:inline">Asistente IA</span>
        </button>
      )}

      {isOpen && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl w-80 sm:w-96 h-[480px] shadow-2xl flex flex-col overflow-hidden">
          <div className="bg-slate-800/80 px-5 py-4 border-b border-slate-700/80 flex justify-between items-center">
            <div className="flex items-center gap-2 text-indigo-400">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span className="font-bold text-sm text-white">IA de TurnoFlex</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl max-w-[85%] whitespace-pre-line ${
                  m.from === "user"
                    ? "bg-indigo-600 text-white ml-auto rounded-tr-none shadow"
                    : "bg-slate-800 text-slate-200 border border-slate-700/60 rounded-tl-none"
                }`}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="bg-slate-800 text-slate-400 p-3 rounded-2xl max-w-[85%] rounded-tl-none border border-slate-700/60 animate-pulse">
                Pensando respuesta...
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Preguntá sobre precios, turnos..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-xl transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
