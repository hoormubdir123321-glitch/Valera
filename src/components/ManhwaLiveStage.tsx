import React, { useState, useEffect, useRef } from 'react';
import { Scene, WebtoonPanel } from '../data/storyData';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCw, 
  Eye, 
  Compass, 
  Crosshair, 
  Tv, 
  Sparkles, 
  Shield, 
  Zap, 
  Volume2, 
  FastForward,
  Flame,
  Maximize2
} from 'lucide-react';
import { sound } from '../utils/soundEngine';
import { VisualFilter } from '../utils/visualFilters';

export type CameraAngle = 'orbit' | 'macro_eye' | 'dutch_tilt' | 'crane' | 'ots' | 'pov';

export type CharacterAction = 'idle' | 'draw_blade' | 'blood_seal' | 'tactical_dash' | 'combat_ready' | 'eye_flare';

interface ManhwaLiveStageProps {
  scene: Scene;
  filter: VisualFilter;
  onChoiceSelect?: (actionText: string) => void;
  trust: number;
  suspicion: number;
}

export const ManhwaLiveStage: React.FC<ManhwaLiveStageProps> = ({
  scene,
  filter,
  trust,
  suspicion,
}) => {
  const [currentCamera, setCurrentCamera] = useState<CameraAngle>('orbit');
  const [characterAction, setCharacterAction] = useState<CharacterAction>('idle');
  const [isSeriesAutoPlay, setIsSeriesAutoPlay] = useState<boolean>(false);
  const [activePanelIdx, setActivePanelIdx] = useState<number>(0);
  const [activeBubbleIdx, setActiveBubbleIdx] = useState<number>(0);
  const [floatingSfx, setFloatingSfx] = useState<{ text: string; x: number; y: number } | null>(null);
  const [actionCooldown, setActionCooldown] = useState<boolean>(false);

  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const panels = scene.panels || [];
  const currentPanel: WebtoonPanel | undefined = panels[activePanelIdx] || panels[0];
  const bubbles = currentPanel?.bubbles || [];
  const currentBubble = bubbles[activeBubbleIdx] || bubbles[0];

  // Camera presets configurations
  const cameraTransforms: Record<CameraAngle, {
    scale: number;
    rotateX: number;
    rotateY: number;
    rotateZ: number;
    x: number;
    y: number;
    labelAr: string;
    labelEn: string;
    icon: typeof Eye;
  }> = {
    orbit: {
      scale: 1.08,
      rotateX: 4,
      rotateY: -8,
      rotateZ: 0,
      x: 0,
      y: -5,
      labelAr: 'دوران سينمائي 360°',
      labelEn: 'Cinematic Orbit Track',
      icon: RotateCw,
    },
    macro_eye: {
      scale: 1.85,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      x: -40,
      y: 80,
      labelAr: 'تقريب بؤبؤ العين (Macro)',
      labelEn: 'Extreme Iris Close-Up',
      icon: Eye,
    },
    dutch_tilt: {
      scale: 1.22,
      rotateX: 8,
      rotateY: 12,
      rotateZ: -16,
      x: 25,
      y: -15,
      labelAr: 'زاوية مائلة درامية (Dutch Tilt)',
      labelEn: 'High Tension Dutch Tilt',
      icon: Compass,
    },
    crane: {
      scale: 1.15,
      rotateX: -14,
      rotateY: 0,
      rotateZ: 2,
      x: 0,
      y: -40,
      labelAr: 'هبوط الرافعة (Crane Shot)',
      labelEn: 'Top-Down Crane Pan',
      icon: Maximize2,
    },
    ots: {
      scale: 1.25,
      rotateX: 2,
      rotateY: -22,
      rotateZ: 3,
      x: 60,
      y: -10,
      labelAr: 'فوق الكتف (Over-Shoulder)',
      labelEn: 'Over-The-Shoulder Duel',
      icon: Crosshair,
    },
    pov: {
      scale: 1.35,
      rotateX: -2,
      rotateY: 2,
      rotateZ: 0,
      x: -15,
      y: 20,
      labelAr: 'منظور عين فاليريا (POV)',
      labelEn: 'First-Person Combat POV',
      icon: Tv,
    },
  };

  // Switch camera angle with sound
  const handleSelectCamera = (angle: CameraAngle) => {
    sound.playCameraSnap();
    setCurrentCamera(angle);
  };

  // Trigger character physical action
  const triggerAction = (action: CharacterAction) => {
    if (actionCooldown) return;
    setActionCooldown(true);
    setCharacterAction(action);

    // Audio cue & camera coordination
    if (action === 'draw_blade') {
      sound.playBladeSlash();
      triggerSfxOverlay('كرانش! كلاك!', 65, 45);
    } else if (action === 'blood_seal') {
      sound.playBloodSeal();
      triggerSfxOverlay('فششش! نبض أثيري!', 35, 50);
    } else if (action === 'tactical_dash') {
      sound.playDashWhoosh();
      triggerSfxOverlay('وووش! زوووم!', 50, 40);
    } else if (action === 'eye_flare') {
      sound.playSystemAlert();
      setCurrentCamera('macro_eye');
      triggerSfxOverlay('رنين البؤبؤ!', 45, 30);
    } else if (action === 'combat_ready') {
      sound.playHeartbeat();
      triggerSfxOverlay('تأهب قتالي!', 55, 60);
    }

    setTimeout(() => {
      setCharacterAction('idle');
      setActionCooldown(false);
    }, 1800);
  };

  const triggerSfxOverlay = (text: string, x: number, y: number) => {
    setFloatingSfx({ text, x, y });
    setTimeout(() => setFloatingSfx(null), 1400);
  };

  // Series Episode Auto-Director Loop
  useEffect(() => {
    if (!isSeriesAutoPlay) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      return;
    }

    const cameraCycle: CameraAngle[] = ['orbit', 'dutch_tilt', 'macro_eye', 'ots', 'crane'];
    let stepCount = 0;

    autoPlayTimerRef.current = setInterval(() => {
      stepCount++;
      const nextCam = cameraCycle[stepCount % cameraCycle.length];
      setCurrentCamera(nextCam);
      sound.playCameraSnap();

      // Cycle bubbles and panels
      setActiveBubbleIdx((prev) => {
        if (bubbles.length > 0 && prev < bubbles.length - 1) {
          return prev + 1;
        } else {
          setActivePanelIdx((pPrev) => (pPrev + 1) % Math.max(1, panels.length));
          return 0;
        }
      });

      // Random character physical movement during episode playback
      if (stepCount % 2 === 0) {
        const actions: CharacterAction[] = ['draw_blade', 'eye_flare', 'combat_ready', 'tactical_dash'];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        triggerAction(randomAction);
      }
    }, 3800);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isSeriesAutoPlay, bubbles.length, panels.length]);

  const activeTransform = cameraTransforms[currentCamera];

  return (
    <div className="w-full space-y-4">
      {/* 1. Series Director & Camera Control Topbar */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 rounded bg-rose-950/80 border border-rose-800 text-rose-300 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>إخراج المسلسل الحي · LIVE DIRECTOR</span>
          </div>

          {/* Series Episode Auto-Play Button */}
          <button
            onClick={() => {
              sound.playClockTick();
              setIsSeriesAutoPlay(!isSeriesAutoPlay);
            }}
            className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 font-bold ${
              isSeriesAutoPlay
                ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] animate-pulse'
                : 'bg-neutral-850 hover:bg-neutral-800 text-neutral-300 border border-neutral-700'
            }`}
          >
            {isSeriesAutoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isSeriesAutoPlay ? 'إيقاف حلقة المسلسل' : 'تشغيل المسلسل السينمائي تلقائياً'}</span>
          </button>
        </div>

        {/* Dynamic Camera Angle Quick Selector */}
        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-neutral-500 text-[11px] ml-1">زوايا التصوير:</span>
          {(Object.keys(cameraTransforms) as CameraAngle[]).map((camKey) => {
            const cam = cameraTransforms[camKey];
            const Icon = cam.icon;
            const isSelected = currentCamera === camKey;
            return (
              <button
                key={camKey}
                onClick={() => handleSelectCamera(camKey)}
                title={cam.labelAr}
                className={`px-2.5 py-1 rounded-lg text-xs transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500 font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : 'bg-neutral-950 hover:bg-neutral-850 text-neutral-400 border border-neutral-800'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{cam.labelAr.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Main Animated Stage Viewport with 3D Camera Rig */}
      <div 
        className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden border-2 border-rose-900/60 bg-neutral-950 shadow-[0_0_40px_rgba(0,0,0,0.9)] perspective-container"
        style={{ perspective: '1100px' }}
      >
        {/* Dynamic Camera Frame that shifts in 3D Space */}
        <motion.div
          animate={{
            scale: activeTransform.scale,
            rotateX: activeTransform.rotateX,
            rotateY: activeTransform.rotateY,
            rotateZ: activeTransform.rotateZ,
            x: activeTransform.x,
            y: activeTransform.y,
          }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Layer A: Dynamic Environment Background */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <img
              src={currentPanel?.image || scene.image}
              alt={scene.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover filter contrast-125 transition-all duration-700"
              style={{ filter: filter.filterStyle }}
            />
            {/* Ambient Lighting Overlay */}
            <div 
              className="absolute inset-0 transition-all duration-700" 
              style={{ background: filter.overlayGradient }}
            />
            {/* Atmospheric Drifting Smoke / Steam */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-rose-950/20 via-transparent to-neutral-950/80 animate-steam opacity-75" />
          </div>

          {/* Layer B: Animated Character Rig (Valeria) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Live2D / Puppet simulation container */}
            <motion.div
              animate={{
                y: characterAction === 'combat_ready' 
                  ? 25 
                  : characterAction === 'tactical_dash'
                  ? [0, -15, 0]
                  : [0, -7, 0],
                x: characterAction === 'tactical_dash' 
                  ? [-90, 40, 0] 
                  : 0,
                scale: characterAction === 'tactical_dash' ? 1.05 : 1,
                skewX: characterAction === 'tactical_dash' ? [-12, 8, 0] : 0,
              }}
              transition={{
                y: { repeat: Infinity, duration: 3.6, ease: 'easeInOut' },
                x: { duration: 0.6, ease: 'easeOut' },
                skewX: { duration: 0.6, ease: 'easeOut' },
              }}
              className="relative w-72 sm:w-96 h-full flex flex-col items-center justify-end pb-4"
            >
              {/* Dynamic Aura when blood seal is active */}
              {characterAction === 'blood_seal' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: [0.4, 0.9, 0.2], scale: [1, 1.4, 1.6] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-rose-600/30 filter blur-xl pointer-events-none"
                />
              )}

              {/* Character Silhouette / Figure Overlay */}
              <div className="relative w-full h-[85%] flex items-center justify-center">
                {/* Glowing Crimson Eyes Rig */}
                <div className="absolute top-[28%] z-30 flex items-center gap-6">
                  {/* Left Eye */}
                  <motion.div
                    animate={{
                      scaleY: [1, 1, 0.08, 1, 1],
                      filter: characterAction === 'eye_flare'
                        ? 'drop-shadow(0 0 16px #f43f5e) drop-shadow(0 0 30px #f43f5e)'
                        : 'drop-shadow(0 0 8px #f43f5e)',
                    }}
                    transition={{
                      scaleY: { repeat: Infinity, duration: 4.2, times: [0, 0.85, 0.9, 0.95, 1] },
                    }}
                    className="relative w-3.5 h-3.5 rounded-full bg-rose-500 shadow-[0_0_12px_#f43f5e] flex items-center justify-center"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    {/* Aetheric Rune Ring */}
                    <div className="absolute -inset-1 border border-rose-400 rounded-full animate-spin" style={{ animationDuration: '8s' }} />
                  </motion.div>

                  {/* Right Eye */}
                  <motion.div
                    animate={{
                      scaleY: [1, 1, 0.08, 1, 1],
                      filter: characterAction === 'eye_flare'
                        ? 'drop-shadow(0 0 16px #f43f5e) drop-shadow(0 0 30px #f43f5e)'
                        : 'drop-shadow(0 0 8px #f43f5e)',
                    }}
                    transition={{
                      scaleY: { repeat: Infinity, duration: 4.2, times: [0, 0.85, 0.9, 0.95, 1] },
                    }}
                    className="relative w-3.5 h-3.5 rounded-full bg-rose-500 shadow-[0_0_12px_#f43f5e] flex items-center justify-center"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <div className="absolute -inset-1 border border-rose-400 rounded-full animate-spin" style={{ animationDuration: '8s' }} />
                  </motion.div>
                </div>

                {/* Animated Hair Strands Fluttering in the Wind */}
                <motion.div
                  animate={{
                    rotate: [-3, 4, -3],
                    skewX: [-2, 3, -2],
                  }}
                  transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
                  className="absolute top-[18%] w-36 h-28 pointer-events-none"
                >
                  <div className="w-full h-full bg-gradient-to-b from-neutral-900/80 via-neutral-950/60 to-transparent rounded-full filter blur-[1px]" />
                </motion.div>

                {/* Drawn Blade Weapon Rig */}
                <AnimatePresence>
                  {(characterAction === 'draw_blade' || characterAction === 'combat_ready') && (
                    <motion.div
                      initial={{ opacity: 0, x: -60, rotate: -45, scale: 0.6 }}
                      animate={{ opacity: 1, x: 20, rotate: 18, scale: 1 }}
                      exit={{ opacity: 0, x: -30, rotate: -20, scale: 0.8 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="absolute bottom-[20%] right-[-10%] z-40 w-36 h-12 flex items-center pointer-events-none"
                    >
                      {/* Dagger Steel Blade with Glint */}
                      <div className="relative w-32 h-3 bg-gradient-to-r from-neutral-300 via-white to-rose-200 rounded-sm shadow-[0_0_15px_rgba(255,255,255,0.7)] rotate-12">
                        {/* Blade Reflection Glint Wave */}
                        <motion.div
                          animate={{ x: [-20, 120] }}
                          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                          className="absolute inset-0 w-8 bg-white filter blur-[2px] opacity-80"
                        />
                        {/* Hilt and Crossguard */}
                        <div className="absolute -left-3 -top-2 w-4 h-7 bg-amber-700 border border-amber-400 rounded" />
                        <div className="absolute -left-6 -top-1 w-4 h-5 bg-neutral-900 rounded" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Blood Seal Hand Ignition */}
                <AnimatePresence>
                  {characterAction === 'blood_seal' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.4 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      className="absolute bottom-[35%] left-[20%] z-40 w-16 h-16 rounded-full bg-rose-950/90 border-2 border-rose-500 shadow-[0_0_25px_#f43f5e] flex items-center justify-center animate-pulse"
                    >
                      <Sparkles className="w-8 h-8 text-rose-300 animate-spin" style={{ animationDuration: '4s' }} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Floating Onomatopoeia Comic SFX */}
                <AnimatePresence>
                  {floatingSfx && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.4, y: 20 }}
                      animate={{ opacity: 1, scale: 1.25, y: -25, rotate: [-6, 6, -3] }}
                      exit={{ opacity: 0, scale: 1.5, y: -50 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      style={{ top: `${floatingSfx.y}%`, left: `${floatingSfx.x}%` }}
                      className="absolute z-50 px-4 py-2 rounded-xl bg-rose-950/95 border-2 border-rose-500 text-white font-black text-sm md:text-base font-mono shadow-[0_0_30px_rgba(225,29,72,0.8)] pointer-events-none"
                    >
                      {floatingSfx.text}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Layer C: Antagonist Shadow (Crowley / Inquisitor presence) */}
          <div className="absolute inset-y-0 right-4 sm:right-10 flex items-center pointer-events-none opacity-40 hover:opacity-75 transition-opacity">
            <motion.div
              animate={{ y: [0, 5, 0], scale: [1, 1.02, 1] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
              className="w-32 h-64 bg-gradient-to-t from-neutral-950 via-neutral-900/60 to-transparent rounded-t-full filter blur-[2px] border-r border-amber-900/30"
            />
          </div>
        </motion.div>

        {/* 3. Cinematic Film Bars (21:9 Widescreen Letterbox) */}
        <div className="absolute top-0 inset-x-0 h-4 sm:h-6 bg-black/90 border-b border-neutral-900 pointer-events-none z-20 flex items-center justify-between px-4 text-[10px] font-mono text-neutral-500">
          <span>VALERIA : ANIMATED SERIES EDITION</span>
          <span className="text-cyan-400 font-bold">{activeTransform.labelAr}</span>
          <span>FPS: 60 · 4K MASTER</span>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-4 sm:h-6 bg-black/90 border-t border-neutral-900 pointer-events-none z-20" />

        {/* 4. Live Dialogue & Subtitle Teleprompter */}
        <div className="absolute bottom-6 inset-x-3 sm:inset-x-8 z-30 pointer-events-none">
          {currentBubble && (
            <motion.div
              key={currentBubble.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto p-3.5 rounded-xl bg-neutral-950/90 border border-neutral-800 backdrop-blur-md shadow-2xl flex items-start gap-3"
            >
              <div className="px-2 py-0.5 rounded bg-rose-950 border border-rose-800 text-rose-300 font-bold text-xs font-mono shrink-0">
                «{currentBubble.speaker}»
              </div>
              <p className="text-neutral-100 font-serif text-sm md:text-base leading-relaxed">
                {currentBubble.text}
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* 3. Character Physical Movement Action Bar (تحكم بحركات الشخصية الحية) */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-3 space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-400 font-bold">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>أوامر حركات فاليريا الحركية (Physical Character Actions):</span>
          </div>
          <span className="text-[11px] text-neutral-500">انقر لتوجيه الشخصية فورياً</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {/* Action 1: Draw Blade */}
          <button
            onClick={() => triggerAction('draw_blade')}
            disabled={actionCooldown}
            className="p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-850 border border-rose-900/80 hover:border-rose-500 text-rose-300 transition-all flex flex-col items-center gap-1.5 disabled:opacity-50"
          >
            <Shield className="w-4 h-4 text-rose-400" />
            <span className="font-bold">استلال النصل</span>
            <span className="text-[10px] text-neutral-500">[Draw Blade]</span>
          </button>

          {/* Action 2: Blood Seal */}
          <button
            onClick={() => triggerAction('blood_seal')}
            disabled={actionCooldown}
            className="p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-850 border border-red-900/80 hover:border-red-500 text-red-300 transition-all flex flex-col items-center gap-1.5 disabled:opacity-50"
          >
            <Flame className="w-4 h-4 text-red-500 animate-pulse" />
            <span className="font-bold">ختم الدم الأثيري</span>
            <span className="text-[10px] text-neutral-500">[Blood Seal]</span>
          </button>

          {/* Action 3: Tactical Dash */}
          <button
            onClick={() => triggerAction('tactical_dash')}
            disabled={actionCooldown}
            className="p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-850 border border-cyan-900/80 hover:border-cyan-500 text-cyan-300 transition-all flex flex-col items-center gap-1.5 disabled:opacity-50"
          >
            <FastForward className="w-4 h-4 text-cyan-400" />
            <span className="font-bold">تفادي ومناورة</span>
            <span className="text-[10px] text-neutral-500">[Tactical Dash]</span>
          </button>

          {/* Action 4: Eye Flare */}
          <button
            onClick={() => triggerAction('eye_flare')}
            disabled={actionCooldown}
            className="p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-850 border border-amber-900/80 hover:border-amber-500 text-amber-300 transition-all flex flex-col items-center gap-1.5 disabled:opacity-50"
          >
            <Eye className="w-4 h-4 text-amber-400" />
            <span className="font-bold">بؤبؤ العقد (زووم)</span>
            <span className="text-[10px] text-neutral-500">[Iris Macro Flare]</span>
          </button>

          {/* Action 5: Combat Ready */}
          <button
            onClick={() => triggerAction('combat_ready')}
            disabled={actionCooldown}
            className="p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-850 border border-purple-900/80 hover:border-purple-500 text-purple-300 transition-all flex flex-col items-center gap-1.5 disabled:opacity-50 col-span-2 sm:col-span-1"
          >
            <Crosshair className="w-4 h-4 text-purple-400" />
            <span className="font-bold">استعداد قتالي</span>
            <span className="text-[10px] text-neutral-500">[Combat Ready]</span>
          </button>
        </div>
      </div>
    </div>
  );
};
