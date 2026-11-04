import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  RefreshCw,
  Copy,
  Check,
  Bot,
  MessageSquare,
  Wand2,
  Lightbulb,
  FileText,
  Sliders,
} from 'lucide-react';
import { ClientProfile } from '../types';

interface AiStudioViewProps {
  client: ClientProfile;
}

interface MessageItem {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AiStudioView: React.FC<AiStudioViewProps> = ({ client }) => {
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: '1',
      sender: 'assistant',
      text: `أهلاً بك! أنا مساعد الذكاء الاصطناعي المتخصص في استراتيجيات المحتوى والسوشيال ميديا المصرية لشركة "${client.companyName || 'شركتكم'}".\n\nكيف يمكنني مساعدتك اليوم؟ يمكنك أن تطلب مني:\n• ابتكار حملة إعلانية لموسم معين (مثل رمضان، أو الجمعة البيضاء، أو الصيف).\n• إعادة صياغة كابشن بنبرة مصرية خاصة (مثل لهجة شبابية تريند أو رسمية).\n• صياغة برومبت صورة سينمائي لمنتج جديد في Midjourney أو Gemini.\n• اقتراح أفكار تفاعلية ومسابقات لزيادة التفاعل على فيسبوك وإنستجرام.`,
      timestamp: 'الآن',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const quickPrompts = [
    'اقترح لي فكرة حملة رمضانية ذكية لشركتنا في مصر',
    'اكتب لي 3 كوابشن قصيرة وخطافة لعرض الجمعة البيضاء',
    'صيغ برومبت Midjourney سينمائي فاخر لمنتجنا الأساسي',
    'اقترح 5 أسئلة تفاعلية ومسابقات تجذب تعليقات العملاء',
  ];

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: MessageItem = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/generate-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayNumber: 0,
          date: 'مخصص',
          occasion: 'طلب استشاري خاص',
          idea: text,
          clientProfile: client,
        }),
      });

      const data = await response.json();
      const botReply: MessageItem = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: data.caption || 'تمت المعالجة بنجاح.',
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      const errorReply: MessageItem = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: 'عذراً، حدث خطأ أثناء الاتصال بمحرك الذكاء الاصطناعي. يرجى المحاولة مرة أخرى.',
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Studio Header */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-6 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-pink-900/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>استوديو الذكاء الاصطناعي التفاعلي (Gemini 3.8 Flash)</span>
            </h2>
            <p className="text-xs text-slate-400">
              مساعد تسويقي ذكي مدمج مع هوية شركة: <strong className="text-cyan-300">{client.companyName}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Quick Prompt Suggestions */}
      <div className="flex flex-wrap gap-2">
        {quickPrompts.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={isLoading}
            className="text-xs px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700/80 hover:border-indigo-500 transition disabled:opacity-50"
          >
            ⚡ {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Box */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl h-[520px] flex flex-col justify-between">
        <div className="overflow-y-auto space-y-4 flex-1 pr-2 scrollbar-thin scrollbar-thumb-slate-700">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse text-left' : 'flex-row text-right'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gradient-to-tr from-pink-500 to-amber-500 text-slate-950 font-bold'
                }`}
              >
                {msg.sender === 'user' ? <MessageSquare className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-800 border border-slate-700 text-slate-200'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div
                  className={`flex items-center justify-between text-[10px] mt-2 pt-1 border-t ${
                    msg.sender === 'user'
                      ? 'border-indigo-500/50 text-indigo-200'
                      : 'border-slate-700 text-slate-400'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'assistant' && (
                    <button
                      onClick={() => copyToClipboard(msg.text, msg.id)}
                      className="hover:text-white flex items-center gap-1"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">تم النسخ</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>نسخ الرد</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 text-right">
              <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0 border border-pink-500/30">
                <RefreshCw className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 text-xs text-slate-400 flex items-center gap-2">
                <span>جاري توليد الرد الإبداعي بواسطة Gemini...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="pt-4 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="اطلب فكرة محتوى، أو كابشن، أو تحسين برومبت لشركتك..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-50 shadow-md shadow-indigo-600/30 shrink-0"
            >
              <span>إرسال</span>
              <Send className="w-4 h-4 rotate-180" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
