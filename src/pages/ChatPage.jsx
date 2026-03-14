import { useState, useRef, useEffect } from "react";
import { Send, RotateCcw, Shield, Zap } from "lucide-react";
import { useChat } from "../hooks/useChat";
import ChatBubble from "../components/chat/ChatBubble";

const contohPertanyaan = [
  "Saya dapat pesan WA minta klik link, aman tidak?",
  "Bagaimana cara mengamankan akun Instagram?",
  "Saya sudah terlanjur transfer ke penipu, harus ngapain?",
  "Ciri-ciri toko online palsu itu apa saja?",
];

export default function ChatPage() {
  const { messages, isStreaming, error, kirim, reset } = useChat();
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleKirim() {
    if (!input.trim() || isStreaming) return;
    kirim(input.trim());
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    inputRef.current?.focus();
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleKirim();
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-57px)]">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center">
            <Shield size={18} color="white" />
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-sm">Beneran AI</p>
            <div className="flex items-center gap-1.5">
              <div
                className={`w-1.5 h-1.5 rounded-full ${isStreaming ? "bg-amber-400 animate-pulse" : "bg-emerald-500"}`}
              />
              <p className="text-xs text-slate-400">
                {isStreaming
                  ? "Sedang mengetik..."
                  : "Asisten Keamanan Digital"}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-purple-50 text-purple-600 text-xs font-medium px-2.5 py-1 rounded-full">
            <Zap size={11} />
            Groq Streaming
          </div>
          <button
            onClick={reset}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Reset percakapan"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Area Chat */}
      <div className="flex-1 overflow-y-auto px-4 py-4 bg-slate-50">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}

        {error && (
          <div className="text-center py-2 mb-2">
            <p className="text-xs text-red-500 bg-red-50 inline-block px-3 py-1.5 rounded-lg border border-red-100">
              {error}
            </p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Contoh pertanyaan — muncul hanya di awal */}
      {messages.length <= 1 && !isStreaming && (
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex-shrink-0">
          <p className="text-xs text-slate-400 mb-2 font-medium">
            Pertanyaan umum:
          </p>
          <div className="flex flex-wrap gap-2">
            {contohPertanyaan.map((teks, i) => (
              <button
                key={i}
                onClick={() => kirim(teks)}
                className="text-xs bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-600 px-3 py-1.5 rounded-xl transition-colors"
              >
                {teks}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t border-slate-200 px-4 py-3 flex-shrink-0">
        <div className="flex items-end gap-2 bg-slate-100 rounded-2xl px-4 py-2">
          <textarea
            ref={(el) => {
              inputRef.current = el;
              textareaRef.current = el;
            }}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height =
                Math.min(e.target.scrollHeight, 128) + "px";
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              isStreaming
                ? "Tunggu AI selesai menjawab..."
                : "Tanya seputar keamanan digital..."
            }
            disabled={isStreaming}
            rows={1}
            style={{ resize: "none" }}
            className="flex-1 bg-transparent text-slate-700 text-sm outline-none placeholder-slate-400 py-1.5 max-h-32 overflow-y-auto disabled:opacity-50"
          />
          <button
            onClick={handleKirim}
            disabled={!input.trim() || isStreaming}
            className="w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 flex items-center justify-center transition-colors flex-shrink-0 mb-0.5"
          >
            <Send size={14} color="white" />
          </button>
        </div>
        <p className="text-center text-xs text-slate-400 mt-2">
          Enter untuk kirim • Shift+Enter untuk baris baru
        </p>
      </div>
    </div>
  );
}
