import React, { useState } from 'react';
import { ShieldAlert, Zap, Eye, Bell, ChevronDown, ChevronUp, Terminal } from 'lucide-react';

interface SystemHUDProps {
  ap: number;
  maxAp: number;
  suspicion: number;
  trust: number;
  latestAlert: string | null;
  alertHistory: { time: string; text: string; type: 'warning' | 'alert' | 'info' }[];
  isSystemGlitching?: boolean;
}

export const SystemHUD: React.FC<SystemHUDProps> = ({
  ap,
  maxAp,
  suspicion,
  trust,
  latestAlert,
  alertHistory,
  isSystemGlitching,
}) => {
  const [showHistory, setShowHistory] = useState(false);

  // Suspicion indicator color
  const suspicionColor = suspicion >= 75
    ? 'text-rose-500'
    : suspicion >= 50
    ? 'text-amber-500'
    : 'text-stone-400';

  // Trust indicator color
  const trustColor = trust >= 60
    ? 'text-cyan-400'
    : trust >= 30
    ? 'text-blue-400'
    : 'text-stone-400';

  return (
    <div className="w-full bg-neutral-900/90 border-b border-neutral-800 backdrop-blur-sm px-4 lg:px-8 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left Side: System Consciousness Node Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-neutral-400 font-mono">
            <span className={`w-2 h-2 rounded-full ${isSystemGlitching ? 'bg-rose-500 animate-ping' : 'bg-cyan-500 animate-pulse'}`} />
            <span className="font-semibold tracking-wider text-neutral-300">نظام المراقبة الأثيري</span>
            <span className="text-neutral-600 hidden sm:inline">·</span>
            <span className="text-neutral-500 hidden sm:inline font-mono">NODE 09: V-PROTO</span>
          </div>
        </div>

        {/* Center: The Core Hidden Variables (Synchronized through alerts) */}
        <div className="flex items-center gap-5 sm:gap-8 font-mono">
          {/* Action Points (AP) */}
          <div className="flex items-center gap-1.5">
            <Zap className={`w-3.5 h-3.5 ${ap > 0 ? 'text-amber-400' : 'text-neutral-600'}`} />
            <span className="text-neutral-400">نقاط الحركة</span>
            <div className="flex items-center gap-1 mr-1">
              {Array.from({ length: maxAp }).map((_, i) => (
                <span
                  key={i}
                  className={`w-2.5 h-2.5 rounded-sm transition-all duration-300 ${
                    i < ap
                      ? 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]'
                      : 'bg-neutral-800 border border-neutral-700'
                  }`}
                />
              ))}
            </div>
            <span className="tabular-nums font-bold text-neutral-200">
              {ap}/{maxAp}
            </span>
          </div>

          {/* Suspicion (الشك) */}
          <div className="flex items-center gap-1.5">
            <Eye className={`w-3.5 h-3.5 ${suspicionColor}`} />
            <span className="text-neutral-400">مؤشر الشك:</span>
            <span className={`tabular-nums font-bold ${suspicionColor}`}>
              {Math.min(100, Math.max(0, suspicion))}%
            </span>
          </div>

          {/* Trust (الثقة) */}
          <div className="flex items-center gap-1.5">
            <ShieldAlert className={`w-3.5 h-3.5 ${trustColor}`} />
            <span className="text-neutral-400">درجة الثقة:</span>
            <span className={`tabular-nums font-bold ${trustColor}`}>
              {Math.min(100, Math.max(0, trust))}%
            </span>
          </div>
        </div>

        {/* Right Side: Alert History Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-1.5 px-2 py-1 rounded bg-neutral-800/80 hover:bg-neutral-700/80 border border-neutral-700 text-neutral-300 transition-colors text-[11px]"
            title="سجل تنبيهات النظام"
          >
            <Bell className="w-3 h-3 text-cyan-400" />
            <span className="hidden sm:inline">سجل التنبيهات</span>
            <span className="bg-neutral-900 text-cyan-400 px-1 rounded text-[10px] font-mono">
              {alertHistory.length}
            </span>
            {showHistory ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Dynamic Latest Alert Banner */}
      {latestAlert && (
        <div className="mt-2 max-w-7xl mx-auto px-3 py-1.5 rounded bg-cyan-950/40 border border-cyan-800/60 text-cyan-200 text-xs flex items-center justify-between gap-2 animate-fadeIn">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <Terminal className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="font-mono font-medium">{latestAlert}</span>
          </div>
          <span className="text-[10px] text-cyan-500/80 font-mono shrink-0">مباشر الآن</span>
        </div>
      )}

      {/* Collapsible History Drawer */}
      {showHistory && (
        <div className="mt-2.5 max-w-7xl mx-auto p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-xs space-y-2 max-h-48 overflow-y-auto">
          <div className="flex items-center justify-between text-neutral-400 font-mono text-[11px] pb-1 border-b border-neutral-800">
            <span>سجل إشارات السيستم الأثيرية</span>
            <span>آخر التعديلات على المتغيرات الحيوية</span>
          </div>
          {alertHistory.length === 0 ? (
            <p className="text-neutral-500 text-center py-2 font-mono">لا توجد تنبيهات سابقة بعد.</p>
          ) : (
            alertHistory.slice().reverse().map((item, idx) => (
              <div key={idx} className="flex items-start justify-between gap-3 text-neutral-300 font-mono py-1 border-b border-neutral-900/60 last:border-none">
                <span className="text-cyan-400 text-right">{item.text}</span>
                <span className="text-neutral-600 text-[10px] shrink-0">{item.time}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
