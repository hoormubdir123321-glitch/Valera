import React from 'react';
import { ORIGIN_METADATA, OriginId } from '../data/storyData';
import { Dice5, Compass, ArrowLeft } from 'lucide-react';
import { sound } from '../utils/soundEngine';
import { motion } from 'framer-motion';

interface OriginPickerProps {
  onSelectOrigin: (originId: OriginId) => void;
  onRandomOrigin: () => void;
}

export const OriginPicker: React.FC<OriginPickerProps> = ({
  onSelectOrigin,
  onRandomOrigin,
}) => {
  const origins = Object.entries(ORIGIN_METADATA) as [OriginId, typeof ORIGIN_METADATA[OriginId]][];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 md:py-12">
      {/* Editorial Header */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 text-rose-500 font-mono text-xs tracking-wider uppercase mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          <span>بروتوكول الاستيقاظ الأولي · الفصل 0: العقد</span>
        </div>
        <h1 
          className="text-3xl md:text-5xl font-black text-neutral-100 tracking-tight"
          style={{ fontFamily: 'var(--font-cinzel), serif' }}
        >
          أين تستيقظ فاليريا؟
        </h1>
        <p className="text-neutral-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          إمبراطورية فيكتورية صناعية محكومة بسحر الدم ومداخن البخار والتروس الميكانيكية. 
          حدد نقطة انطلاق وعيك، أو اترك رقعة السيستم تقذف بك حيث تشاء الصدفة.
        </p>

        {/* Random Origin & Test Prototype CTA */}
        <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={() => {
              sound.playClockTick();
              onRandomOrigin();
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-700/80 text-rose-200 text-sm font-semibold transition-all duration-200 shadow-[0_0_20px_rgba(225,29,72,0.25)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <Dice5 className="w-4 h-4 text-rose-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>دع القدر يقرر (بداية عشوائية للمغامرة)</span>
          </button>

          <button
            onClick={() => {
              sound.playHeartbeat();
              onSelectOrigin('sanitarium');
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-950/90 hover:bg-cyan-900 border border-cyan-500/80 text-cyan-200 text-sm font-semibold transition-all duration-200 shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>🔬 اختبار مشهد المشرحة المتحرك (Laboratory Motion Prototype)</span>
          </button>
        </div>
      </div>

      {/* 3 Distinct Origin Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {origins.map(([id, meta], idx) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: idx * 0.12 }}
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              sound.playHeartbeat();
              onSelectOrigin(id);
            }}
            className="group cursor-pointer rounded-xl bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800 hover:border-rose-600/70 transition-all duration-300 overflow-hidden flex flex-col justify-between hover:shadow-[0_0_25px_rgba(225,29,72,0.15)]"
          >
            {/* Visual Panel Thumbnail */}
            <div className="relative aspect-video w-full overflow-hidden bg-neutral-950">
              <img
                src={meta.image}
                alt={meta.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent" />
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                {id === 'sanitarium' && (
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-cyan-950/90 border border-cyan-500 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span>MOTION PROTOTYPE</span>
                  </span>
                )}
                <span className="px-2.5 py-1 text-[11px] font-mono font-medium rounded bg-neutral-950/85 border border-neutral-700 text-neutral-300">
                  {meta.badge}
                </span>
              </div>
            </div>

            {/* Content & Camera Directions */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="text-neutral-500 font-mono text-[11px] tracking-wider uppercase">
                  {meta.subtitle}
                </div>
                <h3 className="text-lg font-bold text-neutral-100 group-hover:text-rose-400 transition-colors">
                  {meta.title}
                </h3>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  {meta.description}
                </p>
              </div>

              {/* Cinematic Camera Direction Quote */}
              <div className="pt-2 border-t border-neutral-800/80">
                <div className="text-[11px] font-mono text-cyan-400/90 leading-tight bg-cyan-950/20 border border-cyan-900/40 p-2 rounded">
                  <span className="text-cyan-500 font-bold block mb-1">توجيه الكاميرا:</span>
                  {meta.initialCamera}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 flex items-center justify-between text-xs font-semibold text-rose-400 group-hover:text-rose-300">
                <span className="flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  بدء الاستيقاظ هنا
                </span>
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
