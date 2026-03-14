function parseMarkdown(teks) {
  return teks
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(
      /`(.*?)`/g,
      '<code class="bg-slate-100 text-slate-700 px-1 rounded text-sm font-mono">$1</code>',
    )
    .replace(
      /^### (.*$)/gm,
      '<p class="font-bold text-slate-800 mt-3 mb-1">$1</p>',
    )
    .replace(/^- (.*$)/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 list-decimal">$1</li>')
    .replace(/\n\n/g, '</p><p class="mt-2">')
    .replace(/\n/g, "<br/>");
}

export default function ChatBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      {/* Avatar AI */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mr-2 mt-1">
          <span className="text-white text-xs font-bold">AI</span>
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-blue-600 text-white rounded-tr-none"
            : "bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm"
        }`}
      >
        {isUser ? (
          <p>{message.content}</p>
        ) : (
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(message.content) }}
          />
        )}
      </div>

      {/* Avatar User */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center flex-shrink-0 ml-2 mt-1">
          <span className="text-slate-600 text-xs font-bold">You</span>
        </div>
      )}
    </div>
  );
}
