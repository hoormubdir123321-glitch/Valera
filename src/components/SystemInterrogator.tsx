import React, { useState } from 'react';
import { Terminal, Send, Sparkles, AlertCircle, CornerDownLeft } from 'lucide-react';
import { sound } from '../utils/soundEngine';

interface SystemInterrogatorProps {
  currentSceneTitle: string;
  currentOrigin: string;
  stats: { ap: number; suspicion: number; trust: number };
  onApplyOracleResult: (result: {
    systemAlert: string;
    suspicionDelta: number;
    trustDelta: number;
    apDelta: number;
  }) => void;
}

export const SystemInterrogator: React.FC<SystemInterrogatorProps> = ({
  currentSceneTitle,
  currentOrigin,
  stats,
  onApplyOracleResult,
}) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [oracleLog, setOracleLog] = useState<{
    query: string;
    cinematicDirection: string;
    narration: string;
    systemVoice: string;
    systemAlert: string;
    statChanges: { suspicionDelta: number; trustDelta: number; apDelta: number };
    suggestedActions?: { id: string; text: string; apCost: number }[];
  } | null>(null);

  const handleQuery = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);
    sound.playHeartbeat();

    try {
      const res = await fetch('/api/system-oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerInput: input,
          currentScene: { title: currentSceneTitle },
          origin: currentOrigin,
          stats: stats,
        }),
      });

      const data = await res.json();
      setOracleLog({
        query: input,
        cinematicDirection: data.cinematicDirection || '[زاوية الكاميرا: تركيز أثيري مباشر]',
        narration: data.narration || '',
        systemVoice: data.systemVoice || '',
        systemAlert: data.systemAlert || '[تنبيه النظام: استجابة غير محددة]',
        statChanges: data.statChanges || { suspicionDelta: 0, trustDelta: 0, apDelta: 0 },
        suggestedActions: data.suggestedActions || [],
      });

      sound.playSystemAlert();
      onApplyOracleResult({
        systemAlert: data.systemAlert,
        suspicionDelta: data.statChanges?.suspicionDelta || 0,
        trustDelta: data.statChanges?.trustDelta || 0,
        apDelta: data.statChanges?.apDelta || 0,
      });

      setInput('');
    } catch {
      sound.playSystemAlert();
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    "من هو كاتب العقد الأصلي وما هو الثمن الذي دفعه أبي؟",
    "أريد اختراق التردد اللاسلكي لحراس كرويل لتشتيت انتباههم.",
    "أطالب السيستم بتفعيل بروتوكول الطوارئ بموجب البند الأول.",
    "أبحث في جيوبي عن أي أداة أو مفتاح خبأته قبل فقدان الوعي."
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="pb-6 border-b border-neutral-800 space-y-2">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span>قناة الاتصال الأثيرية المباشرة · NODE INTERFACE</span>
        </div>
        <h2 
          className="text-2xl md:text-3xl font-bold text-neutral-100"
          style={{ fontFamily: 'var(--font-cinzel), serif' }}
        >
          مستشار السيستم الواعي
        </h2>
        <p className="text-neutral-400 text-xs md:text-sm">
          تحدث مباشرة إلى الكيان المشرف، أو اقترح فعلاً مخصصاً خارج الخيارات المحددة ليقوم محرك الذكاء والقصة بتفسيره وسرد عواقبه السينمائية.
        </p>
      </div>

      {/* Suggested Fast Prompts */}
      <div className="mt-4 flex flex-wrap gap-2">
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => {
              sound.playClockTick();
              setInput(p);
            }}
            className="text-[11px] font-mono px-3 py-1.5 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Query Input Box */}
      <form onSubmit={handleQuery} className="mt-4 relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="اكتب فعلك الحر، مساومتك مع السيستم، أو سؤالك المشؤوم هنا..."
          rows={3}
          className="w-full bg-neutral-950/90 border border-neutral-800 focus:border-cyan-500 rounded-xl p-4 text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none transition-colors font-mono resize-none"
        />
        <div className="absolute left-3 bottom-3 flex items-center gap-2">
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-4 py-2 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 text-cyan-200 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(6,182,212,0.2)]"
          >
            {loading ? (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                <span>السيستم يحلل التدفق...</span>
              </>
            ) : (
              <>
                <span>إرسال النبضة</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Live Result Output Panel */}
      {oracleLog && (
        <div className="mt-8 rounded-xl bg-neutral-900/80 border border-cyan-900/60 p-6 space-y-5 animate-fadeIn">
          {/* Query Header */}
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800 text-xs font-mono">
            <span className="text-neutral-500">إجراء اللاعب المرسل:</span>
            <span className="text-neutral-300 font-semibold text-right">«{oracleLog.query}»</span>
          </div>

          {/* Camera Direction */}
          <div className="text-xs font-mono text-cyan-400/90 bg-cyan-950/30 border border-cyan-900/50 p-2.5 rounded-lg">
            <span className="font-bold block text-cyan-400 mb-0.5">توجيه الكاميرا والمشهد:</span>
            {oracleLog.cinematicDirection}
          </div>

          {/* Cinematic Narration */}
          <div className="text-neutral-200 text-sm md:text-base leading-relaxed font-serif">
            {oracleLog.narration}
          </div>

          {/* System Voice */}
          {oracleLog.systemVoice && (
            <div className="p-4 rounded-lg bg-neutral-950 border-r-4 border-cyan-500 text-cyan-200 text-sm font-mono leading-relaxed">
              <span className="text-[11px] text-cyan-500 font-bold block mb-1">صوت السيستم المشرف:</span>
              {oracleLog.systemVoice}
            </div>
          )}

          {/* System Alert Result */}
          <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-900/60 text-rose-300 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-bold">{oracleLog.systemAlert}</span>
          </div>

          {/* Stat deltas breakdown */}
          <div className="flex items-center gap-4 text-xs font-mono text-neutral-400 pt-2 border-t border-neutral-800">
            <span>تأثير النبضة:</span>
            <span className={oracleLog.statChanges.suspicionDelta > 0 ? 'text-rose-400' : 'text-neutral-400'}>
              الشك: {oracleLog.statChanges.suspicionDelta > 0 ? `+${oracleLog.statChanges.suspicionDelta}%` : `${oracleLog.statChanges.suspicionDelta}%`}
            </span>
            <span className={oracleLog.statChanges.trustDelta > 0 ? 'text-cyan-400' : 'text-neutral-400'}>
              الثقة: {oracleLog.statChanges.trustDelta > 0 ? `+${oracleLog.statChanges.trustDelta}%` : `${oracleLog.statChanges.trustDelta}%`}
            </span>
            <span className="text-amber-400">
              نقاط الحركة: {oracleLog.statChanges.apDelta} AP
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
