import React, { useState } from 'react';
import { CONTRACT_CLAUSES, ContractClause } from '../data/storyData';
import { Scroll, Feather, Lock, CheckCircle2, ShieldAlert } from 'lucide-react';
import { sound } from '../utils/soundEngine';

interface ContractCodexProps {
  ap: number;
  onModifyClause: (clauseNumber: string) => void;
}

export const ContractCodex: React.FC<ContractCodexProps> = ({
  ap,
  onModifyClause,
}) => {
  const [clauses, setClauses] = useState<ContractClause[]>(CONTRACT_CLAUSES);
  const [selectedClause, setSelectedClause] = useState<ContractClause>(CONTRACT_CLAUSES[0]);
  const [tamperMessage, setTamperMessage] = useState<string | null>(null);

  const handleAlter = (clause: ContractClause) => {
    if (ap < 1) {
      sound.playSystemAlert();
      setTamperMessage("لا تملك نقاط حركة كافية (AP) لتحمل ضريبة تحوير العقد الأثيري.");
      return;
    }
    sound.playBloodSeal();
    setClauses(prev => prev.map(c => {
      if (c.number === clause.number) {
        return {
          ...c,
          isAltered: true,
          text: `[نص محوّر بدم فاليريا]: يتم تحييد سلطة مجلس اللوردات ويُمنح الحامل حق نقض أي أمر أثيري يتجاوز حدود الحفاظ على الحياة العضوية.`
        };
      }
      return c;
    }));
    onModifyClause(clause.number);
    setTamperMessage(`[تنبيه النظام: تم اختراق ${clause.number} وإعادة ضبطه بدم فاليريا · خصم 1 AP · ارتفاع الشك +20%]`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-rose-500 font-mono text-xs mb-1">
            <Scroll className="w-4 h-4 text-rose-500" />
            <span>المخطوطة الأثيرية المحرمة</span>
          </div>
          <h2 
            className="text-2xl md:text-3xl font-bold text-neutral-100"
            style={{ fontFamily: 'var(--font-cinzel), serif' }}
          >
            سجل العقد 0: ميثاق الظل والتروس
          </h2>
          <p className="text-neutral-400 text-xs md:text-sm mt-1">
            الوثيقة القديمة التي تربط روح فاليريا بآلة التروس الإمبراطورية وشبكة السيستم الواعي.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono bg-neutral-900 border border-neutral-800 px-3 py-2 rounded-lg text-neutral-300">
          <span>نقاط التدخل المتاحة:</span>
          <span className="font-bold text-amber-400">{ap} AP</span>
        </div>
      </div>

      {/* Alert Banner if any */}
      {tamperMessage && (
        <div className="mt-4 p-3 rounded bg-rose-950/40 border border-rose-800 text-rose-200 text-xs font-mono flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{tamperMessage}</span>
        </div>
      )}

      {/* Contract Layout */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left List of Clauses */}
        <div className="space-y-3">
          {clauses.map(clause => (
            <button
              key={clause.number}
              onClick={() => {
                sound.playClockTick();
                setSelectedClause(clause);
              }}
              className={`w-full text-right p-3.5 rounded-lg border transition-all flex flex-col gap-1.5 ${
                selectedClause.number === clause.number
                  ? 'bg-neutral-900 border-rose-600 shadow-[0_0_15px_rgba(225,29,72,0.15)] text-neutral-100'
                  : 'bg-neutral-950/80 border-neutral-800/80 hover:bg-neutral-900/60 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className={clause.isAltered ? 'text-cyan-400 font-bold' : 'text-rose-400'}>
                  {clause.number}
                </span>
                {clause.isAltered ? (
                  <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800">
                    محوّر بالدم
                  </span>
                ) : clause.isUnlocked ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-neutral-500" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-neutral-600" />
                )}
              </div>
              <div className="text-sm font-semibold">{clause.title}</div>
            </button>
          ))}
        </div>

        {/* Right Preview - Parchment Presentation */}
        <div className="md:col-span-2 rounded-xl bg-neutral-900/70 border border-neutral-800 p-6 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Watermark seal */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none text-9xl font-serif">
            ⚔
          </div>

          <div className="space-y-5 relative z-10">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div>
                <span className="text-xs font-mono text-rose-500 block">{selectedClause.number}</span>
                <h3 className="text-xl font-bold text-neutral-100">{selectedClause.title}</h3>
              </div>
              <div className="font-mono text-xs text-neutral-500">
                {selectedClause.isAltered ? 'حالة البند: شذوذ أثيري' : 'حالة البند: ساري المفعول'}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-neutral-950/80 border border-neutral-800/80 text-sm md:text-base leading-relaxed text-neutral-300 font-serif">
              {selectedClause.text}
            </div>

            <div className="text-xs text-neutral-400 space-y-1">
              <span className="text-neutral-500 font-mono block">الأثر على المنظومة:</span>
              <p>
                {selectedClause.isAltered 
                  ? 'تم كسر القيد الميكانيكي. السيستم يراقبك بحذر متزايد ولكن نفوذ اللورد تراجع.'
                  : 'خضوع كامل لبنود العقد يزيد من ثقة المشرف لكنه يقلص هامش حريتك في اتخاذ قرارات مصيرية.'
                }
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-6 mt-6 border-t border-neutral-800 flex items-center justify-between relative z-10">
            <span className="text-xs font-mono text-neutral-500">
              تكلفة التحوير: 1 AP + مخاطرة الشك
            </span>
            <button
              onClick={() => handleAlter(selectedClause)}
              disabled={selectedClause.isAltered}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                selectedClause.isAltered
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700'
                  : 'bg-rose-950 hover:bg-rose-900 border border-rose-700 text-rose-200 shadow-[0_0_15px_rgba(225,29,72,0.2)]'
              }`}
            >
              <Feather className="w-3.5 h-3.5 text-rose-400" />
              <span>{selectedClause.isAltered ? 'تم التعديل بالدم' : 'إعادة كتابة البند بالدم (1 AP)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
