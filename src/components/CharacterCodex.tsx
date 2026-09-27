import React from 'react';
import { CHARACTERS } from '../data/storyData';
import { Users, Eye, Shield } from 'lucide-react';
import { sound } from '../utils/soundEngine';

export const CharacterCodex: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Editorial Header */}
      <div className="space-y-2 pb-6 border-b border-neutral-800">
        <div className="flex items-center gap-2 text-rose-500 font-mono text-xs">
          <Users className="w-4 h-4 text-rose-500" />
          <span>ملفات الرقعة الفيكتورية</span>
        </div>
        <h2 
          className="text-2xl md:text-3xl font-bold text-neutral-100"
          style={{ fontFamily: 'var(--font-cinzel), serif' }}
        >
          شخصيات رقعة الدم والتروس
        </h2>
        <p className="text-neutral-400 text-xs md:text-sm">
          الأطراف المتنازعة على العقد 0 ومصير الإمبراطورية الصناعية.
        </p>
      </div>

      {/* Grid of Characters */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {CHARACTERS.map(char => (
          <div
            key={char.id}
            onMouseEnter={() => sound.playClockTick()}
            className="rounded-xl bg-neutral-900/70 border border-neutral-800 p-5 space-y-4 hover:border-neutral-700 transition-all hover:shadow-[0_0_20px_rgba(0,0,0,0.4)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-neutral-100">{char.name}</h3>
                <span className="text-xs text-rose-400 font-medium block mt-0.5">{char.title}</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-300">
                {char.status}
              </span>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              {char.description}
            </p>

            <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[11px] font-mono text-neutral-400">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-500" />
                <span>الولاء: {char.allegiance}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span>مستوى الخطورة: {char.suspicionRating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
