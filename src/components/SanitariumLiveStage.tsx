import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Zap } from 'lucide-react';
import { sound } from '../utils/soundEngine';

// Import the separated scene layers from the original high-resolution artwork
import bgLayer from '../assets/layers/background.png';
import doctorBodyLayer from '../assets/layers/doctor_body.png';
import doctorArmLayer from '../assets/layers/doctor_arm.png';
import scalpelLayer from '../assets/layers/scalpel.png';
import valeriaBodyLayer from '../assets/layers/valeria_body.png';
import valeriaHeadLayer from '../assets/layers/valeria_head.png';
import foregroundLayer from '../assets/layers/foreground.png';

/**
 * TECHNICAL BREAKDOWN - SEPARATED SCENE LAYER RIG:
 * 
 * 1. Background layer (bgLayer):
 *    - Sanitarium morgue walls, stone archway, cold moonlight from stained glass,
 *      and zinc table pedestal. Infilled behind moving character regions so no gaps or duplicate ghosts appear.
 * 
 * 2. Doctor character layer (doctorBodyLayer):
 *    - Doctor Julian Von Vane's head, spectacles, shoulders, and lab coat torso.
 *    - Animates with subtle respiration and slight observation head tilt (.animate-doctor-body).
 * 
 * 3. Doctor arm/hand layer (doctorArmLayer):
 *    - Fully separated sleeve, forearm, wrist, and hand.
 *    - Animates with ACTUAL physical reach toward the patient and instrument (.animate-doctor-arm).
 * 
 * 4. Medical instrument/scalpel layer (scalpelLayer):
 *    - Surgical scalpel blade held between the doctor's fingers.
 *    - Articulates alongside wrist angle (.animate-doctor-scalpel).
 * 
 * 5. Main character body layer (valeriaBodyLayer):
 *    - Valeria lying on the operating table, draped in the mortuary shroud.
 *    - Animates with natural breathing rise and fall (.animate-valeria-body).
 * 
 * 6. Main character head layer (valeriaHeadLayer):
 *    - Head, dark hair strands, exposed neck, and natural eyelid blink (.animate-valeria-head & .animate-eye-blink).
 * 
 * 7. Foreground layer (foregroundLayer):
 *    - Lower zinc operating table lip, chemical vials, and ambient shadow depth.
 * 
 * When Animation is OFF:
 *    - All layers sit at static position (transform: none) recreating the exact original artwork.
 */

interface SanitariumLiveStageProps {
  imageSrc?: string;
  panelNumber?: string;
  actionDescription?: string;
  doctorSpeech?: string;
  onRestart?: () => void;
}

export const SanitariumLiveStage: React.FC<SanitariumLiveStageProps> = ({
  panelNumber = "لوحة 01",
  actionDescription = "الكفن الأبيض ينزاح ببطء عن وجه فاليريا. الدكتور فون فاين، رجل عجوز ذو عينين زجاجيتين ومئزر ملطخ بالمواد الكيميائية، يرفع مبضعه متجهاً نحو تجويف رقبتها.",
  doctorSpeech = "«شريان أثيري نقي... لم أرَ تدفقاً دموياً كهذا منذ تشريح الدوق الأكبر. لن تشعري بأي ألم يا آنستي، فالموتى لا يصرخون.»",
  onRestart,
}) => {
  // Simple Animation ON/OFF control as requested
  const [isAnimationActive, setIsAnimationActive] = useState<boolean>(true);
  const [cycleKey, setCycleKey] = useState<number>(0);

  const toggleAnimation = () => {
    sound.playClockTick();
    setIsAnimationActive(!isAnimationActive);
  };

  const handleRestart = () => {
    sound.playClockTick();
    setCycleKey((prev) => prev + 1);
    setIsAnimationActive(true);
    if (onRestart) onRestart();
  };

  return (
    <div className="w-full space-y-4">
      {/* 1. SIMPLE TEST CONTROLLER: Animation ON/OFF & Restart */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-2.5 flex items-center justify-between text-xs font-mono shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-2">
          {/* Main ON / OFF Toggle */}
          <button
            onClick={toggleAnimation}
            className={`px-3 py-1.5 rounded-lg transition-all font-bold flex items-center gap-2 border ${
              isAnimationActive
                ? 'bg-rose-950 text-rose-200 border-rose-600 shadow-[0_0_15px_rgba(225,29,72,0.35)]'
                : 'bg-neutral-950 text-neutral-400 border-neutral-700 hover:text-neutral-200'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${isAnimationActive ? 'text-rose-400 fill-current' : 'text-neutral-500'}`} />
            <span>التحريك (Animation): {isAnimationActive ? 'مفعّل (ON)' : 'معطل (OFF - صورة ثابتة)'}</span>
          </button>

          {/* Status Indicator */}
          <span className="text-[11px] text-neutral-400 hidden sm:inline">
            {isAnimationActive 
              ? '● حركة أطراف الشخصيات الحقيقية نشطة (Actual Character Layer Motion Active)' 
              : '○ الرسم الأصلي الثابت مجمّع (Original Static Artwork)'}
          </span>
        </div>

        {/* Restart Button */}
        <button
          onClick={handleRestart}
          className="px-2.5 py-1.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-neutral-300 border border-neutral-700 transition-all flex items-center gap-1.5"
          title="إعادة ضبط الحركة"
        >
          <RotateCcw className="w-3.5 h-3.5 text-neutral-400" />
          <span>إعادة ضبط (Reset)</span>
        </button>
      </div>

      {/* 2. LAYERED COMPOSITION VIEWPORT (16:9 / 21:9 Widescreen) */}
      <div 
        key={cycleKey}
        className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden border-2 border-neutral-800 bg-neutral-950 shadow-[0_0_40px_rgba(0,0,0,0.9)] select-none"
      >
        {/* Layer 1: Sanitarium Background (Infilled behind characters) */}
        <img
          src={bgLayer}
          alt="Sanitarium Morgue Background"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover filter brightness-[0.92] contrast-[1.15]"
        />

        {/* Layer 2: Valeria Body (Supine body, shroud, chest respiration) */}
        <div
          className={`absolute inset-0 w-full h-full pointer-events-none ${
            isAnimationActive ? 'animate-valeria-body' : ''
          }`}
        >
          <img
            src={valeriaBodyLayer}
            alt="Valeria Body Layer"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter brightness-[0.92] contrast-[1.15]"
          />
        </div>

        {/* Layer 3: Valeria Head & Eyelids (Head on zinc headrest, natural blink) */}
        <div
          className={`absolute inset-0 w-full h-full pointer-events-none ${
            isAnimationActive ? 'animate-valeria-head' : ''
          }`}
        >
          <img
            src={valeriaHeadLayer}
            alt="Valeria Head Layer"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter brightness-[0.92] contrast-[1.15]"
          />

          {/* Natural Eye Blink Occlusion Layer */}
          {isAnimationActive && (
            <div className="absolute top-[44%] left-[28%] sm:left-[30%] pointer-events-none z-20">
              <div className="relative w-5 h-2.5 flex items-center justify-center animate-eye-blink">
                <div className="w-2 h-2 rounded-full bg-rose-600 shadow-[0_0_8px_#f43f5e] flex items-center justify-center">
                  <div className="w-0.5 h-0.5 rounded-full bg-white animate-pulse" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Layer 4: Doctor Julian Von Vane Body (Head, spectacles, torso, coat) */}
        <div
          className={`absolute inset-0 w-full h-full pointer-events-none ${
            isAnimationActive ? 'animate-doctor-body' : ''
          }`}
        >
          <img
            src={doctorBodyLayer}
            alt="Doctor Von Vane Torso & Head Layer"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter brightness-[0.92] contrast-[1.18]"
          />
        </div>

        {/* Layer 5: Doctor Right Arm & Hand (Actual Physical Reach Motion!) */}
        <div
          className={`absolute inset-0 w-full h-full pointer-events-none ${
            isAnimationActive ? 'animate-doctor-arm' : ''
          }`}
        >
          <img
            src={doctorArmLayer}
            alt="Doctor Von Vane Moving Arm Layer"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter brightness-[0.95] contrast-[1.2]"
          />
        </div>

        {/* Layer 6: Scalpel & Surgical Instrument (Wrist articulation) */}
        <div
          className={`absolute inset-0 w-full h-full pointer-events-none ${
            isAnimationActive ? 'animate-doctor-scalpel' : ''
          }`}
        >
          <img
            src={scalpelLayer}
            alt="Surgical Scalpel Instrument Layer"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter brightness-[0.98] contrast-[1.25]"
          />
        </div>

        {/* Layer 7: Foreground (Table rim & vials) */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <img
            src={foregroundLayer}
            alt="Sanitarium Foreground Rim Layer"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter brightness-[0.92] contrast-[1.15]"
          />
        </div>

        {/* Cinematic Widescreen Letterbox Bars */}
        <div className="absolute top-0 inset-x-0 h-4 bg-black/90 border-b border-neutral-900 pointer-events-none z-30 flex items-center justify-between px-3 text-[10px] font-mono text-neutral-400">
          <span>VALERIA : SEPARATED CHARACTER MOTION RIG</span>
          <span className="text-rose-400 font-bold">
            {isAnimationActive ? '● CHARACTER MOTION: ACTIVE' : '○ STATIC COMPOSITION'}
          </span>
          <span className="hidden sm:inline">MULTI-LAYER DECOMPOSITION</span>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-4 bg-black/90 border-t border-neutral-900 pointer-events-none z-30" />

        {/* Subtitle Dialogue */}
        <div className="absolute bottom-5 inset-x-3 sm:inset-x-8 z-30 pointer-events-none">
          <div className="max-w-2xl mx-auto p-3 rounded-xl bg-neutral-950/92 border border-neutral-800 backdrop-blur-md shadow-2xl flex items-start gap-3">
            <div className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-bold text-xs font-mono shrink-0">
              «الدكتور فون فاين»
            </div>
            <p className="text-neutral-200 font-serif text-xs sm:text-sm leading-relaxed">
              {doctorSpeech}
            </p>
          </div>
        </div>
      </div>

      {/* Script Direction Summary */}
      <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-3 font-mono text-xs space-y-1.5">
        <div className="flex items-center justify-between text-neutral-400">
          <span className="font-bold text-cyan-400">[توجيه المشهد السينمائي]:</span>
          <span className="text-[10px] text-neutral-500">{panelNumber}</span>
        </div>
        <p className="text-neutral-300 font-serif text-xs sm:text-sm leading-relaxed">
          {actionDescription}
        </p>
      </div>
    </div>
  );
};
