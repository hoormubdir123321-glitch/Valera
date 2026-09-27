import React, { useState } from 'react';
import { Scene, Choice, WebtoonPanel } from '../data/storyData';
import { 
  Zap, 
  ArrowLeft, 
  Send, 
  Sparkles, 
  Terminal, 
  Volume2, 
  Eye, 
  Flame, 
  ShieldCheck, 
  RefreshCw,
  Clock,
  Film,
  Palette,
  Sliders
} from 'lucide-react';
import { sound } from '../utils/soundEngine';
import { motion, AnimatePresence } from 'framer-motion';
import { VISUAL_FILTERS, VisualFilterId, detectLightingFilter } from '../utils/visualFilters';
import { ManhwaLiveStage } from './ManhwaLiveStage';
import { SanitariumLiveStage } from './SanitariumLiveStage';

interface SceneViewerProps {
  scene: Scene;
  ap: number;
  suspicion: number;
  trust: number;
  shakeIntensity?: 'none' | 'light' | 'medium' | 'violent';
  onSelectChoice: (choice: Choice) => void;
  onCustomActionSubmit: (actionText: string) => Promise<void>;
  onRestart: () => void;
  isProcessingAction: boolean;
}

export const SceneViewer: React.FC<SceneViewerProps> = ({
  scene,
  ap,
  suspicion,
  trust,
  shakeIntensity = 'none',
  onSelectChoice,
  onCustomActionSubmit,
  onRestart,
  isProcessingAction,
}) => {
  const [customActionText, setCustomActionText] = useState('');
  const [showCustomBox, setShowCustomBox] = useState(false);
  const [selectedPanelIndex, setSelectedPanelIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'live_anime' | 'game_engine' | 'vertical_webtoon' | 'panel_by_panel'>('live_anime');
  const [selectedFilterId, setSelectedFilterId] = useState<VisualFilterId>('auto');

  const shakeClass = shakeIntensity === 'violent'
    ? 'shake-violent'
    : shakeIntensity === 'medium'
    ? 'shake-medium'
    : shakeIntensity === 'light'
    ? 'shake-light'
    : '';

  const handleChoiceClick = (choice: Choice) => {
    if (choice.apCost > ap) {
      sound.playSystemAlert();
      return;
    }
    sound.playHeartbeat();
    onSelectChoice(choice);
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customActionText.trim() || isProcessingAction) return;
    const text = customActionText;
    setCustomActionText('');
    await onCustomActionSubmit(text);
  };

  const playSfxSound = (sfxText?: string) => {
    if (!sfxText) return;
    if (sfxText.includes('كلاك') || sfxText.includes('تكتكة')) {
      sound.playClockTick();
    } else if (sfxText.includes('دوك') || sfxText.includes('نبض') || sfxText.includes('شهقة')) {
      sound.playHeartbeat();
    } else if (sfxText.includes('رنين') || sfxText.includes('بييييب') || sfxText.includes('أثيري')) {
      sound.playSystemAlert();
    } else {
      sound.playBloodSeal();
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto px-3 sm:px-4 py-6 md:py-8 space-y-8 animate-fadeIn ${shakeClass}`}>
      {/* Dynamic Camera Shake Indicator Badge */}
      <AnimatePresence>
        {shakeIntensity !== 'none' && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`sticky top-20 z-50 p-2.5 rounded-xl border text-xs font-mono shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 ${
              shakeIntensity === 'violent'
                ? 'bg-rose-950/95 border-rose-500 text-rose-200 shadow-[0_0_25px_rgba(225,29,72,0.4)]'
                : shakeIntensity === 'medium'
                ? 'bg-amber-950/95 border-amber-500 text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                : 'bg-cyan-950/95 border-cyan-500 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${shakeIntensity === 'violent' ? 'bg-rose-500 animate-ping' : 'bg-amber-400 animate-pulse'}`} />
              <span className="font-bold">
                [ارتجاج الكاميرا السينمائي · قوى الشك: {shakeIntensity === 'violent' ? 'عنيفة (Violent Shake ⚡⚡)' : shakeIntensity === 'medium' ? 'متوسطة (Medium Shake ⚡)' : 'خفيفة (Light Tremor)'}]
              </span>
            </div>
            <span className="text-[10px] text-neutral-400">رد فعل حركي للمنظومة</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Controller: Chapter Title & Reading Mode Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-rose-500" />
          <span className="text-neutral-400 font-semibold">{scene.chapter}</span>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 p-1 rounded-lg flex-wrap">
          <button
            onClick={() => { sound.playClockTick(); setViewMode('live_anime'); }}
            className={`px-3 py-1 rounded text-xs transition-colors flex items-center gap-1.5 ${
              viewMode === 'live_anime' 
                ? 'bg-rose-950 text-rose-300 font-bold border border-rose-800 shadow-[0_0_15px_rgba(225,29,72,0.35)]' 
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <span>🎬 مسلسل مانهوا متحرك (Live Anime Series)</span>
          </button>
          <button
            onClick={() => { sound.playClockTick(); setViewMode('game_engine'); }}
            className={`px-3 py-1 rounded text-xs transition-colors flex items-center gap-1.5 ${
              viewMode === 'game_engine' 
                ? 'bg-rose-950 text-rose-300 font-bold border border-rose-800' 
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <span>🎮 محرك اللعبة (Game Engine)</span>
          </button>
          <button
            onClick={() => { sound.playClockTick(); setViewMode('vertical_webtoon'); }}
            className={`px-3 py-1 rounded text-xs transition-colors ${
              viewMode === 'vertical_webtoon' 
                ? 'bg-rose-950 text-rose-300 font-bold border border-rose-800' 
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            شريط المانهوا (Webtoon)
          </button>
          <button
            onClick={() => { sound.playClockTick(); setViewMode('panel_by_panel'); }}
            className={`px-3 py-1 rounded text-xs transition-colors ${
              viewMode === 'panel_by_panel' 
                ? 'bg-rose-950 text-rose-300 font-bold border border-rose-800' 
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            لوحة بلوحة
          </button>
        </div>
      </div>

      {/* Visual Lighting Filter Control Suite */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2.5 text-xs font-mono">
        <div className="flex items-center gap-2 text-neutral-300">
          <Palette className="w-4 h-4 text-cyan-400" />
          <span className="font-bold">مرشح الإضاءة السينمائي (Manhwa Lighting Filter):</span>
          <span className="text-[11px] text-neutral-500 hidden md:inline">
            {selectedFilterId === 'auto'
              ? '⚡ التزامن التلقائي مع إضاءة كل لوحة مفعّل'
              : `تم التثبيت اليدوي: ${VISUAL_FILTERS[selectedFilterId].nameAr}`}
          </span>
        </div>

        {/* Filter Quick Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {(Object.keys(VISUAL_FILTERS) as VisualFilterId[]).map((fId) => {
            const f = VISUAL_FILTERS[fId];
            const isCurrent = selectedFilterId === fId;
            return (
              <button
                key={fId}
                onClick={() => {
                  sound.playClockTick();
                  setSelectedFilterId(fId);
                }}
                title={f.description}
                className={`px-2 py-0.5 rounded text-[11px] transition-all flex items-center gap-1 ${
                  isCurrent
                    ? 'bg-rose-950 text-rose-200 border border-rose-600 font-bold shadow-[0_0_10px_rgba(225,29,72,0.25)]'
                    : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
                }`}
              >
                <span>{f.nameAr.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ==================== ANIMATED GAME ENGINE / LIVE ANIME SERIES VIEW ==================== */}
      {(viewMode === 'live_anime' || viewMode === 'game_engine') && (() => {
        const engineResolvedFilterId = selectedFilterId === 'auto'
          ? detectLightingFilter(scene.panels?.[0]?.lighting || '')
          : selectedFilterId;
        const activeEngineFilter = VISUAL_FILTERS[engineResolvedFilterId];

        return (
          <div className="space-y-6 animate-fadeIn">
            {/* High-Fidelity Character Motion Prototype (For Sanitarium / Morgue Doctor Scene) */}
            {scene.id.startsWith('sanitarium') ? (
              <SanitariumLiveStage
                imageSrc={scene.panels?.[0]?.image || scene.image}
                panelNumber={scene.panels?.[0]?.panelNumber}
                actionDescription={scene.panels?.[0]?.actionDescription}
                doctorSpeech={scene.panels?.[0]?.bubbles?.[0]?.text}
                onRestart={onRestart}
              />
            ) : (
              /* Live 2.5D Animated Character & Dynamic Camera Series Stage */
              <ManhwaLiveStage
                scene={scene}
                filter={activeEngineFilter}
                trust={trust}
                suspicion={suspicion}
              />
            )}

          {/* 1. 🎥 [CAMERA] Card */}
          <div className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-1.5 font-mono text-xs">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <span>🎥 [CAMERA]:</span>
            </div>
            <p className="text-neutral-200 leading-relaxed pl-2 font-mono text-xs md:text-sm">
              {scene.cameraDirection || 'Camera orbits 360° around Valeria / Fast zoom into glowing crimson eyes / Low-angle tilt to steaming iron spires'}
            </p>
          </div>

          {/* 2. 💃 [ANIMATION] Card */}
          <div className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-1.5 font-mono text-xs">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <span>💃 [ANIMATION]:</span>
            </div>
            <div className="text-neutral-200 leading-relaxed space-y-1 text-xs md:text-sm">
              {scene.panels && scene.panels.map((p, idx) => (
                <div key={idx} className="flex items-start gap-2 border-r-2 border-rose-800 pr-2">
                  <span className="text-rose-500 text-[11px] shrink-0 font-bold">[{p.panelNumber}]:</span>
                  <span>{p.actionDescription}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. 🎵 [SFX & BGM] Card */}
          <div className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-amber-400 font-bold text-sm">🎵 [SFX & BGM]:</span>
              <span className="text-[10px] text-neutral-500">انقر لتشغيل المؤثر</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => sound.playClockTick()}
                className="px-2.5 py-1 rounded bg-neutral-950 border border-neutral-700 text-amber-300 hover:border-amber-500 transition-colors flex items-center gap-1.5 text-xs"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>[BGM: Heavy Industrial Clockwork Drone & Gothic Strings]</span>
              </button>
              {scene.panels && scene.panels.filter(p => p.sfx).map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => playSfxSound(p.sfx)}
                  className="px-2.5 py-1 rounded bg-neutral-950 border border-rose-800/80 text-rose-300 hover:border-rose-500 transition-colors flex items-center gap-1.5 text-xs"
                >
                  <Volume2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>{p.sfx}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. 💬 [DIALOGUE] Card */}
          <div className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-2 font-mono text-xs">
            <div className="text-emerald-400 font-bold text-sm">
              <span>💬 [DIALOGUE]:</span>
            </div>
            <div className="space-y-2 text-xs md:text-sm">
              {scene.panels && scene.panels.flatMap(p => p.bubbles).map((b) => (
                <div
                  key={b.id}
                  className={`p-3 rounded-lg border flex items-start gap-2 ${
                    b.type === 'system'
                      ? 'bg-cyan-950/40 border-cyan-700 text-cyan-200'
                      : b.type === 'whisper'
                      ? 'bg-neutral-950 border-neutral-800 text-neutral-300 italic'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-100'
                  }`}
                >
                  <span className="font-bold text-rose-400 shrink-0">«{b.speaker}»:</span>
                  <span className="font-sans">{b.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 5. ⚙️ [SYSTEM POP-UP] Card */}
          <div className="p-4 rounded-xl bg-cyan-950/30 border-2 border-cyan-500/80 space-y-2 font-mono text-xs shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <div className="flex items-center justify-between text-cyan-400 font-bold text-sm">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-4 h-4" />
                <span>⚙️ [SYSTEM POP-UP]:</span>
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                ACTIVE PROTOCOL
              </span>
            </div>
            <div className="p-3 rounded-lg bg-neutral-950 border border-cyan-900 text-cyan-200 text-xs md:text-sm font-mono space-y-1">
              <div>{scene.systemHologram?.warningVoice || '[تنبيه النظام: رُصد اضطراب أثيري · الحفاظ على سرعة الاستجابة مطلوب]'}</div>
              <div className="text-amber-400 pt-1 text-xs">
                [المتغيرات الحالية: Trust {trust}% | Suspicion {suspicion}% | AP {ap}/3]
              </div>
            </div>
          </div>

          {/* 6. 🔘 [PLAYER CHOICES] Card */}
          <div className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-neutral-200 font-bold text-sm">
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>🔘 [PLAYER CHOICES]:</span>
              </span>
              <span className="text-xs text-amber-400 font-mono">AP: {ap}/3</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {scene.choices.map((choice) => {
                const notEnoughAP = choice.apCost > ap;
                return (
                  <button
                    key={choice.id}
                    onClick={() => handleChoiceClick(choice)}
                    disabled={notEnoughAP}
                    className={`w-full text-right p-3.5 rounded-lg border transition-all flex items-center justify-between gap-3 text-xs md:text-sm ${
                      notEnoughAP
                        ? 'bg-neutral-950/60 border-neutral-900 text-neutral-600 cursor-not-allowed opacity-50'
                        : 'bg-neutral-950 hover:bg-neutral-850 border-neutral-700 hover:border-rose-500 text-neutral-200 hover:text-white shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-sans font-medium">
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                      <span>{choice.text}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 font-mono text-xs">
                      <span className="text-neutral-500">
                        [T: {choice.trustDelta >= 0 ? `+${choice.trustDelta}` : choice.trustDelta}% | S: {choice.suspicionDelta >= 0 ? `+${choice.suspicionDelta}` : choice.suspicionDelta}%]
                      </span>
                      <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800 text-[11px]">
                        {choice.apCost > 0 ? `${choice.apCost} AP` : '0 AP'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        );
      })()}

      {/* ==================== WEBTOON PANELS CONTAINER WITH MOTION ==================== */}
      {viewMode !== 'game_engine' && (
      <div className="space-y-10">
        <AnimatePresence mode="wait">
          {scene.panels && scene.panels.map((panel, pIdx) => {
            // If in panel_by_panel mode, only show current selected
            if (viewMode === 'panel_by_panel' && pIdx !== selectedPanelIndex) {
              return null;
            }

            // Resolve dynamic lighting filter for this specific panel
            const panelResolvedFilterId = selectedFilterId === 'auto'
              ? detectLightingFilter(panel.lighting)
              : selectedFilterId;
            const panelFilter = VISUAL_FILTERS[panelResolvedFilterId];

            return (
              <motion.div
                key={panel.id}
                initial={{ opacity: 0, y: 25, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: viewMode === 'vertical_webtoon' ? pIdx * 0.1 : 0 }}
                className="rounded-2xl border-2 border-neutral-800/90 bg-neutral-950 overflow-hidden shadow-2xl transition-all hover:border-neutral-700/80 group"
              >
                {/* 1. Panel Header: Number, Camera Angle, Lighting & Applied Filter Badge */}
                <div className="bg-neutral-900/95 border-b border-neutral-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-rose-950/80 border border-rose-800 text-rose-400 font-bold">
                      {panel.panelNumber}
                    </span>
                    <span className="text-cyan-400 font-medium">{panel.cameraType}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap text-[11px] text-neutral-400">
                    <span className="text-neutral-500 hidden md:inline">الإضاءة:</span>
                    <span className="italic truncate max-w-xs">{panel.lighting}</span>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-[10px]">
                      <Sliders className="w-3 h-3 text-cyan-400" />
                      <span className="text-neutral-500">المرشح:</span>
                      <span className={`${panelFilter.accentColor} font-bold`}>
                        {selectedFilterId === 'auto' ? '⚡ ' : ''}{panelFilter.nameAr}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Visual Panel Artwork with Letterbox & Vignette & Lighting Filter */}
                <div className="relative aspect-[16/8] sm:aspect-[21/9] w-full overflow-hidden bg-neutral-950">
                  <motion.img
                    src={panel.image || scene.image}
                    alt={panel.panelNumber}
                    referrerPolicy="no-referrer"
                    initial={{ scale: 1.05 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    style={{ filter: panelFilter.filterStyle }}
                    className="w-full h-full object-cover contrast-115 group-hover:scale-105 transition-all duration-700 ease-out"
                  />

                  {/* High-Fidelity Character Keyframe Animation Layers for Sanitarium Doctor & Valeria scene */}
                  {scene.id.startsWith('sanitarium') && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
                      {/* Doctor Head/Torso subtle bobble wrapper */}
                      <div
                        style={{ clipPath: 'polygon(35% 0%, 75% 0%, 80% 65%, 40% 65%)' }}
                        className="absolute inset-0 w-full h-full animate-head-bobble"
                      >
                        <img
                          src={panel.image || scene.image}
                          alt="Doctor Head"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover contrast-115 opacity-80"
                        />
                      </div>

                      {/* Doctor Arm & Scalpel reach toward instrument/neck */}
                      <div
                        style={{ clipPath: 'polygon(50% 30%, 75% 30%, 82% 70%, 48% 68%)', transformOrigin: '70% 35%' }}
                        className="absolute inset-0 w-full h-full animate-arm-reach"
                      >
                        <img
                          src={panel.image || scene.image}
                          alt="Doctor Arm Reach"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover contrast-120"
                        />
                      </div>

                      {/* Valeria Supine Body Breathing Respiration wrapper */}
                      <div
                        style={{ clipPath: 'polygon(15% 45%, 65% 40%, 68% 95%, 10% 95%)', transformOrigin: '40% 75%' }}
                        className="absolute inset-0 w-full h-full animate-breathing"
                      >
                        <img
                          src={panel.image || scene.image}
                          alt="Valeria Breathing"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover contrast-115"
                        />
                      </div>

                      {/* Valeria Natural Eye Blink Occlusion wrapper */}
                      <div className="absolute top-[44%] left-[28%] sm:left-[30%] pointer-events-none z-20">
                        <div className="relative w-5 h-2.5 flex items-center justify-center animate-eye-blink">
                          <div className="w-2 h-2 rounded-full bg-rose-600 shadow-[0_0_8px_#f43f5e] flex items-center justify-center">
                            <div className="w-0.5 h-0.5 rounded-full bg-white animate-pulse" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div 
                    className="absolute inset-0 transition-all duration-700" 
                    style={{ background: panelFilter.overlayGradient }}
                  />
                  <div 
                    className="absolute inset-0 pointer-events-none transition-all duration-700" 
                    style={{ boxShadow: `inset 0 0 100px ${panelFilter.vignetteColor}` }}
                  />

                  {/* SFX Onomatopoeia Tag overlay */}
                  {panel.sfx && (
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => playSfxSound(panel.sfx)}
                      title="انقر لسماع المؤثر الصوتي"
                      className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-neutral-950/85 border border-rose-600/70 text-rose-300 text-xs font-mono font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(225,29,72,0.3)] transition-all"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                      <span>{panel.sfx}</span>
                    </motion.button>
                  )}
                </div>

                {/* 3. Action Description & Body Language (الإخراج السينمائي) */}
                <div className="p-5 sm:p-6 bg-neutral-950 border-t border-neutral-900 space-y-4">
                  <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>توجيه الحركة ولغة الجسد:</span>
                  </div>
                  <p className="text-sm md:text-base text-neutral-200 leading-relaxed font-serif text-justify border-r-2 border-neutral-700 pr-3">
                    {panel.actionDescription}
                  </p>

                  {/* 4. Speech & Thought Bubbles with Manhwa styling */}
                  <div className="space-y-3 pt-3">
                    {panel.bubbles.map((bubble, bIdx) => (
                      <motion.div
                        key={bubble.id}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.35, delay: bIdx * 0.08 }}
                        className={`p-4 rounded-xl border relative font-sans text-sm md:text-base transition-all ${
                          bubble.type === 'system'
                            ? 'bg-cyan-950/30 border-cyan-500/70 text-cyan-200 font-mono shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                            : bubble.type === 'thought'
                            ? 'bg-neutral-900/90 border-neutral-700/80 text-neutral-300 italic font-serif'
                            : bubble.type === 'whisper'
                            ? 'bg-neutral-950 border-dashed border-rose-800/80 text-rose-200 text-xs md:text-sm'
                            : bubble.type === 'shout'
                            ? 'bg-rose-950/40 border-2 border-rose-600 text-white font-extrabold shadow-[0_0_15px_rgba(225,29,72,0.2)]'
                            : 'bg-neutral-900/90 border-neutral-700 text-neutral-100 font-serif'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-mono pb-1 border-b border-neutral-800/80 mb-1.5">
                          <span className="font-bold flex items-center gap-1.5">
                            {bubble.type === 'system' && <Terminal className="w-3.5 h-3.5 text-cyan-400" />}
                            {bubble.speaker}
                          </span>
                          <span className="text-[10px] text-neutral-500 uppercase">
                            {bubble.type === 'thought' ? '[مونولوج داخلي]' : bubble.type === 'system' ? '[بث أثيري]' : '[حوار حي]'}
                          </span>
                        </div>
                        <p className="leading-relaxed">
                          {bubble.text}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Panel-by-panel navigation buttons */}
        {viewMode === 'panel_by_panel' && scene.panels && (
          <div className="flex items-center justify-between pt-2 px-2 text-xs font-mono">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                sound.playClockTick();
                setSelectedPanelIndex(prev => Math.max(0, prev - 1));
              }}
              disabled={selectedPanelIndex === 0}
              className="px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-800"
            >
              اللوحة السابقة
            </motion.button>
            <span className="text-neutral-400">
              لوحة {selectedPanelIndex + 1} من {scene.panels.length}
            </span>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                sound.playClockTick();
                setSelectedPanelIndex(prev => Math.min(scene.panels.length - 1, prev + 1));
              }}
              disabled={selectedPanelIndex === scene.panels.length - 1}
              className="px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-800"
            >
              اللوحة التالية
            </motion.button>
          </div>
        )}
      </div>
      )}

      {/* ==================== 5. HOLOGRAPHIC SYSTEM OVERRIDE WINDOW ==================== */}
      {scene.systemHologram && !scene.isEnding && (
        <div className="relative rounded-2xl bg-cyan-950/30 border-2 border-cyan-500/80 p-5 md:p-6 backdrop-blur-md shadow-[0_0_30px_rgba(6,182,212,0.2)] animate-pulse space-y-3">
          {/* Hologram header */}
          <div className="flex items-center justify-between text-xs font-mono text-cyan-400 pb-2 border-b border-cyan-800/80">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-extrabold uppercase tracking-widest">{scene.systemHologram.title}</span>
            </div>
            <span className="text-[11px] text-cyan-500 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
              {scene.systemHologram.protocolNumber}
            </span>
          </div>

          <p className="text-cyan-200 text-sm md:text-base font-mono leading-relaxed">
            {scene.systemHologram.warningVoice}
          </p>

          {/* Urgency tension bar */}
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>نافذة اتخاذ القرار تحت الضغط الأثيري</span>
              </span>
              <span>حرج للغاية</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-neutral-900 overflow-hidden border border-cyan-900">
              <div className="h-full bg-gradient-to-r from-cyan-400 via-rose-500 to-rose-600 animate-pulse w-full" />
            </div>
          </div>
        </div>
      )}

      {/* ==================== 6. ENDING SCREEN MODAL ==================== */}
      {scene.isEnding && (
        <div className="rounded-2xl p-6 md:p-8 bg-neutral-900/95 border-2 border-rose-700 text-center space-y-5 shadow-[0_0_40px_rgba(225,29,72,0.25)]">
          <div className="inline-flex items-center gap-2 text-rose-400 text-xs font-mono uppercase tracking-widest bg-rose-950/70 px-4 py-1.5 rounded-full border border-rose-800">
            <ShieldCheck className="w-4 h-4" />
            <span>نهاية الفصل 0 · إتمام الرقعة</span>
          </div>
          <h2 
            className="text-2xl sm:text-3xl font-extrabold text-neutral-100"
            style={{ fontFamily: 'var(--font-cinzel), serif' }}
          >
            {scene.endingType}
          </h2>
          <div className="max-w-md mx-auto grid grid-cols-2 gap-4 text-xs font-mono py-3 bg-neutral-950 p-4 rounded-xl border border-neutral-800">
            <div>
              <span className="text-neutral-500 block mb-1">مؤشر الشك النهائي:</span>
              <span className="text-rose-400 font-bold text-lg">{suspicion}%</span>
            </div>
            <div>
              <span className="text-neutral-500 block mb-1">درجة ثقة الكيان:</span>
              <span className="text-cyan-400 font-bold text-lg">{trust}%</span>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClockTick();
              onRestart();
            }}
            className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm transition-all shadow-lg hover:shadow-rose-600/30 flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>إعادة التجربة واختيار مسار مانهوا جديد</span>
          </button>
        </div>
      )}

      {/* ==================== 7. INTERACTIVE CHOICES & TACTICS ==================== */}
      {!scene.isEnding && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400 px-1">
            <span className="flex items-center gap-1.5 text-neutral-200">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>قرارات الرقعة المصيرية (استهلاك نقاط الحركة AP):</span>
            </span>
            <span>الرصيد: <strong className="text-amber-400 font-bold">{ap} AP</strong></span>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {scene.choices.map((choice) => {
              const notEnoughAP = choice.apCost > ap;
              return (
                <motion.button
                  key={choice.id}
                  whileHover={notEnoughAP ? {} : { scale: 1.015, x: -4 }}
                  whileTap={notEnoughAP ? {} : { scale: 0.985 }}
                  onClick={() => handleChoiceClick(choice)}
                  disabled={notEnoughAP}
                  className={`w-full text-right p-4 rounded-xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm ${
                    notEnoughAP
                      ? 'bg-neutral-950/60 border-neutral-900 text-neutral-600 cursor-not-allowed opacity-60'
                      : 'bg-neutral-900/95 hover:bg-neutral-850 border-neutral-800 hover:border-rose-600 text-neutral-200 hover:text-white shadow-sm hover:shadow-[0_0_20px_rgba(225,29,72,0.15)] group'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-neutral-700 group-hover:bg-rose-500 transition-colors shrink-0 mt-1 sm:mt-0" />
                    <div>
                      {choice.tacticType && (
                        <span className="text-[10px] font-mono text-cyan-400/90 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-900 ml-2 inline-block mb-1">
                          {choice.tacticType}
                        </span>
                      )}
                      <span className="font-semibold leading-relaxed font-sans block">{choice.text}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0 text-xs font-mono">
                    <span
                      className={`px-2.5 py-1 rounded border ${
                        choice.apCost === 0
                          ? 'bg-neutral-800 text-neutral-400 border-neutral-700'
                          : notEnoughAP
                          ? 'bg-neutral-900 text-neutral-600 border-neutral-800'
                          : 'bg-amber-950/70 text-amber-300 border-amber-800 font-bold'
                      }`}
                    >
                      {choice.apCost > 0 ? `${choice.apCost} AP` : 'مجاني'}
                    </span>
                    <ArrowLeft className="w-4 h-4 text-neutral-500 group-hover:text-rose-400 transition-transform group-hover:-translate-x-1" />
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* 8. Custom Action Box */}
          <div className="pt-2">
            {!showCustomBox ? (
              <button
                onClick={() => {
                  sound.playClockTick();
                  setShowCustomBox(true);
                }}
                className="w-full py-3 px-4 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-cyan-800 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>أو ارتجل حركة מانهوا حرة (مساومة السيستم / اقتحام مباغت)</span>
              </button>
            ) : (
              <form onSubmit={handleCustomSubmit} className="p-4 rounded-xl bg-neutral-950 border border-cyan-900/70 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>مساومة السيستم المباشرة:</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowCustomBox(false)}
                    className="text-neutral-500 hover:text-neutral-300"
                  >
                    إلغاء
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={customActionText}
                    onChange={(e) => setCustomActionText(e.target.value)}
                    placeholder="مثال: ركل مصباح الزيت نحو غلاية البخار والتراجع في ظلال النفق..."
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-cyan-500 rounded-lg px-3 py-2 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none font-mono"
                  />
                  <button
                    type="submit"
                    disabled={!customActionText.trim() || isProcessingAction}
                    className="absolute left-1.5 top-1.5 px-3 py-1 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 text-cyan-200 text-xs font-mono font-medium disabled:opacity-40 transition-colors flex items-center gap-1"
                  >
                    {isProcessingAction ? (
                      <Sparkles className="w-3 h-3 animate-spin text-cyan-400" />
                    ) : (
                      <Send className="w-3 h-3" />
                    )}
                    <span>تنفيذ</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
