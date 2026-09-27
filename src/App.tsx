import React, { useState, useEffect } from 'react';
import { 
  STORY_SCENES, 
  ORIGIN_METADATA, 
  OriginId, 
  Choice, 
  Scene 
} from './data/storyData';
import { TopNav } from './components/TopNav';
import { SystemHUD } from './components/SystemHUD';
import { OriginPicker } from './components/OriginPicker';
import { SceneViewer } from './components/SceneViewer';
import { ContractCodex } from './components/ContractCodex';
import { CharacterCodex } from './components/CharacterCodex';
import { SystemInterrogator } from './components/SystemInterrogator';
import { sound } from './utils/soundEngine';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [activeTab, setActiveTab] = useState<'story' | 'contract' | 'characters' | 'oracle'>('story');
  const [currentOrigin, setCurrentOrigin] = useState<OriginId | null>(null);
  const [currentSceneId, setCurrentSceneId] = useState<string>('abyss_start');
  
  // Core Narrative Hidden Variables
  const [ap, setAp] = useState<number>(3);
  const maxAp = 3;
  const [suspicion, setSuspicion] = useState<number>(15);
  const [trust, setTrust] = useState<number>(25);

  // System Consciousness Alerts & Audio
  const [latestAlert, setLatestAlert] = useState<string | null>(
    "[تنبيه النظام: بدء تتبع الإشارات الحيوية للحاملة فاليريا · التزامن الأثيري: 98%]"
  );
  const [alertHistory, setAlertHistory] = useState<{ time: string; text: string; type: 'warning' | 'alert' | 'info' }[]>([
    {
      time: '00:00:01',
      text: '[تنبيه النظام: بدء تتبع الإشارات الحيوية للحاملة فاليريا · التزامن الأثيري: 98%]',
      type: 'info'
    }
  ]);
  const [isSystemGlitching, setIsSystemGlitching] = useState(false);
  const [shakeIntensity, setShakeIntensity] = useState<'none' | 'light' | 'medium' | 'violent'>('none');
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isAtmosphereActive, setIsAtmosphereActive] = useState(false);

  const triggerShake = (intensity: 'light' | 'medium' | 'violent') => {
    setShakeIntensity(intensity);
    const duration = intensity === 'violent' ? 600 : intensity === 'medium' ? 400 : 300;
    setTimeout(() => setShakeIntensity('none'), duration);
  };

  // Trigger audio on high suspicion
  useEffect(() => {
    if (suspicion >= 75) {
      setIsSystemGlitching(true);
      triggerShake('violent');
      sound.playSystemAlert();
      const timer = setTimeout(() => setIsSystemGlitching(false), 800);
      return () => clearTimeout(timer);
    }
  }, [suspicion]);

  // Log alert helper
  const triggerSystemAlert = (text: string, type: 'warning' | 'alert' | 'info' = 'alert') => {
    setLatestAlert(text);
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    setAlertHistory(prev => [...prev, { time: timeStr, text, type }]);
    sound.playSystemAlert();
  };

  // Select origin
  const handleSelectOrigin = (originId: OriginId) => {
    setCurrentOrigin(originId);
    const originMeta = ORIGIN_METADATA[originId];
    setCurrentSceneId(originMeta.initialSceneId);
    setAp(3);
    setSuspicion(15);
    setTrust(25);
    setActiveTab('story');
    triggerSystemAlert(`[تنبيه النظام: تم تعيين مسار الاستيقاظ: ${originMeta.title} · استقرار الوعي: 100% · رصيد الحركة: 3/3 AP]`);
  };

  // Random Origin (دع القدر يقرر)
  const handleRandomOrigin = () => {
    const originKeys: OriginId[] = ['abyss', 'kitchen', 'sanitarium'];
    const chosen = originKeys[Math.floor(Math.random() * originKeys.length)];
    handleSelectOrigin(chosen);
  };

  // Choice Selection
  const handleSelectChoice = (choice: Choice) => {
    // Deduct AP
    const newAp = Math.max(0, ap - choice.apCost);
    setAp(newAp);

    // Apply Deltas
    const newSuspicion = Math.min(100, Math.max(0, suspicion + choice.suspicionDelta));
    const newTrust = Math.min(100, Math.max(0, trust + choice.trustDelta));
    setSuspicion(newSuspicion);
    setTrust(newTrust);

    // Dynamic Camera Shake based on Suspicion changes
    if (choice.suspicionDelta >= 20 || newSuspicion >= 75) {
      triggerShake('violent');
    } else if (choice.suspicionDelta >= 10) {
      triggerShake('medium');
    } else if (choice.suspicionDelta > 0) {
      triggerShake('light');
    }

    // Log alert if choice has one
    if (choice.systemAlert) {
      triggerSystemAlert(choice.systemAlert, choice.suspicionDelta > 15 ? 'warning' : 'alert');
    }

    // Change scene
    if (choice.nextSceneId === 'intro_selection') {
      setCurrentOrigin(null);
      setCurrentSceneId('abyss_start');
      setAp(3);
      setSuspicion(15);
      setTrust(25);
    } else {
      setCurrentSceneId(choice.nextSceneId);
    }
  };

  // Custom action improvisation / system oracle
  const handleCustomActionSubmit = async (actionText: string) => {
    setIsProcessingAction(true);
    sound.playHeartbeat();

    try {
      const currentScene = STORY_SCENES[currentSceneId];
      const res = await fetch('/api/system-oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerInput: actionText,
          currentScene: {
            title: currentScene?.title || '',
            description: currentScene?.panels?.[0]?.actionDescription || '',
          },
          origin: currentOrigin || 'الهاوية',
          stats: { ap, suspicion, trust },
        }),
      });

      const data = await res.json();
      
      const newAp = Math.max(0, ap + (data.statChanges?.apDelta ?? -1));
      const newSuspicion = Math.min(100, Math.max(0, suspicion + (data.statChanges?.suspicionDelta ?? 10)));
      const newTrust = Math.min(100, Math.max(0, trust + (data.statChanges?.trustDelta ?? -5)));

      setAp(newAp);
      setSuspicion(newSuspicion);
      setTrust(newTrust);

      const suspDelta = data.statChanges?.suspicionDelta ?? 10;
      if (suspDelta >= 20 || newSuspicion >= 75) {
        triggerShake('violent');
      } else if (suspDelta >= 10) {
        triggerShake('medium');
      } else if (suspDelta > 0) {
        triggerShake('light');
      }

      if (data.systemAlert) {
        triggerSystemAlert(data.systemAlert, 'warning');
      }

      // If suggested actions returned, dynamically append or replace next scene options
      if (data.narration) {
        // Create an ephemeral scene for this custom action branch
        const ephemeralSceneId = `custom_${Date.now()}`;
        STORY_SCENES[ephemeralSceneId] = {
          id: ephemeralSceneId,
          chapter: currentScene?.chapter || 'الفصل 0: العقد',
          title: `مناورة مانهوا مرتجلة: «${actionText.slice(0, 30)}...»`,
          cameraDirection: data.cinematicDirection || '[زاوية الكاميرا: تركيز أثيري حاد]',
          image: currentScene?.image || '/src/assets/images/valeria_hero_contract_1790511414037.jpg',
          panels: [
            {
              id: `p_ephem_1`,
              panelNumber: "لوحة مباغتة",
              cameraType: data.cinematicDirection || '[Dynamic Action Angle — زاوية مباغتة حادة]',
              lighting: "وهج أثيري مضطرب، بخار مضغوط يتدفق من صمامات الجدران الحديدية.",
              sfx: "*نبضة أثيرية مباغتة: زوووووم-كلاك!*",
              actionDescription: data.narration,
              image: currentScene?.image || '/src/assets/images/valeria_hero_contract_1790511414037.jpg',
              bubbles: [
                {
                  id: "b_ephem_sys",
                  speaker: "السيستم (The System)",
                  type: "system",
                  text: data.systemVoice || '«لقد سجلنا انحرافك عن المخطط... استعدي للضريبة.»',
                  avatarColor: "border-cyan-400"
                }
              ]
            }
          ],
          choices: (data.suggestedActions && data.suggestedActions.length > 0)
            ? data.suggestedActions.map((act: { id: string; text: string; apCost: number }) => ({
                id: act.id,
                text: act.text,
                apCost: act.apCost || 0,
                suspicionDelta: 5,
                trustDelta: 0,
                nextSceneId: 'clocktower_approach',
                systemAlert: '[تنبيه النظام: استئناف مسار العقد نحو برج الساعة الأثري]'
              }))
            : [
                {
                  id: 'resume_tower',
                  text: 'استعادة الأنفاس والتقدم نحو برج الساعة الأثري',
                  apCost: 0,
                  suspicionDelta: 0,
                  trustDelta: 5,
                  nextSceneId: 'clocktower_approach',
                  systemAlert: '[تنبيه النظام: العودة للمسار الحرج]'
                }
              ]
        };

        setCurrentSceneId(ephemeralSceneId);
      }
    } catch (err) {
      console.error(err);
      triggerSystemAlert('[تنبيه النظام: اضطراب في الاتصال الأثيري · تم خصم 1 AP كضريبة تشويش]', 'warning');
      setAp(prev => Math.max(0, prev - 1));
    } finally {
      setIsProcessingAction(false);
    }
  };

  // Modify Contract Clause
  const handleModifyClause = (clauseNumber: string) => {
    setAp(prev => Math.max(0, prev - 1));
    setSuspicion(prev => Math.min(100, prev + 20));
    setTrust(prev => Math.min(100, prev + 10));
    triggerShake('violent');
    triggerSystemAlert(`[تنبيه النظام: تم تفعيل شذوذ بالدم في ${clauseNumber} · خصم 1 AP · ارتفاع الشك +20%]`, 'warning');
  };

  // Oracle tab result application
  const handleApplyOracleResult = (result: {
    systemAlert: string;
    suspicionDelta: number;
    trustDelta: number;
    apDelta: number;
  }) => {
    setAp(prev => Math.max(0, prev + result.apDelta));
    setSuspicion(prev => Math.min(100, Math.max(0, prev + result.suspicionDelta)));
    setTrust(prev => Math.min(100, Math.max(0, prev + result.trustDelta)));
    triggerSystemAlert(result.systemAlert, result.suspicionDelta > 10 ? 'warning' : 'alert');
  };

  // Restart to origin selection
  const handleRestart = () => {
    setCurrentOrigin(null);
    setCurrentSceneId('abyss_start');
    setAp(3);
    setSuspicion(15);
    setTrust(25);
    setActiveTab('story');
    triggerSystemAlert('[تنبيه النظام: إعادة تشغيل المصفوفة من نقطة الصفر · تم استعادة 3 AP]');
  };

  const currentScene = STORY_SCENES[currentSceneId] || STORY_SCENES['abyss_start'];

  return (
    <div className={`min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-rose-900 selection:text-white ${isSystemGlitching ? 'shake-screen' : ''}`}>
      {/* 1. Header Top Bar Contract */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRestart={handleRestart}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        isAtmosphereActive={isAtmosphereActive}
        setIsAtmosphereActive={setIsAtmosphereActive}
      />

      {/* 2. System Consciousness HUD (Variables & Alerts) */}
      <SystemHUD
        ap={ap}
        maxAp={maxAp}
        suspicion={suspicion}
        trust={trust}
        latestAlert={latestAlert}
        alertHistory={alertHistory}
        isSystemGlitching={isSystemGlitching}
      />

      {/* 3. Main Narrative Work Area */}
      <main className="flex-1 w-full relative">
        {/* Atmospheric Ambient Steam Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900/20 via-neutral-950/80 to-neutral-950 -z-10" />

        {/* Tab Router with Framer Motion transitions */}
        <AnimatePresence mode="wait">
          {activeTab === 'contract' && (
            <motion.div
              key="contract"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <ContractCodex
                ap={ap}
                onModifyClause={handleModifyClause}
              />
            </motion.div>
          )}

          {activeTab === 'characters' && (
            <motion.div
              key="characters"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <CharacterCodex />
            </motion.div>
          )}

          {activeTab === 'oracle' && (
            <motion.div
              key="oracle"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <SystemInterrogator
                currentSceneTitle={currentScene.title}
                currentOrigin={currentOrigin ? ORIGIN_METADATA[currentOrigin]?.title : 'الهاوية'}
                stats={{ ap, suspicion, trust }}
                onApplyOracleResult={handleApplyOracleResult}
              />
            </motion.div>
          )}

          {activeTab === 'story' && (
            <motion.div
              key={currentOrigin === null ? "origin_picker" : `scene_${currentSceneId}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {currentOrigin === null ? (
                <OriginPicker
                  onSelectOrigin={handleSelectOrigin}
                  onRandomOrigin={handleRandomOrigin}
                />
              ) : (
                <SceneViewer
                  scene={currentScene}
                  ap={ap}
                  suspicion={suspicion}
                  trust={trust}
                  shakeIntensity={shakeIntensity}
                  onSelectChoice={handleSelectChoice}
                  onCustomActionSubmit={handleCustomActionSubmit}
                  onRestart={handleRestart}
                  isProcessingAction={isProcessingAction}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 4. Quiet Editorial Footer */}
      <footer className="border-t border-neutral-900/80 py-4 px-6 text-center text-xs text-neutral-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>VALERIA — CHAPTER 0: THE CONTRACT · محرك السرد والرقعة التفاعلية</span>
          <div className="flex items-center gap-4 text-neutral-600">
            <span>إمبراطورية أوربوروس الفيكتورية</span>
            <span>·</span>
            <span>نظام التزامن الأثيري v0.9</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
