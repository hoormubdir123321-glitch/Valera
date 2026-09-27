import React from 'react';
import { Volume2, VolumeX, Sparkles, BookOpen, Scroll, Users, Radio, RotateCcw } from 'lucide-react';
import { sound } from '../utils/soundEngine';

interface TopNavProps {
  activeTab: 'story' | 'contract' | 'characters' | 'oracle';
  setActiveTab: (tab: 'story' | 'contract' | 'characters' | 'oracle') => void;
  onRestart: () => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  isAtmosphereActive: boolean;
  setIsAtmosphereActive: (active: boolean) => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  setActiveTab,
  onRestart,
  isMuted,
  setIsMuted,
  isAtmosphereActive,
  setIsAtmosphereActive,
}) => {
  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
    if (!next) {
      sound.playClockTick();
    }
  };

  const toggleAmbience = () => {
    sound.playClockTick();
    const active = sound.toggleAtmosphere();
    setIsAtmosphereActive(active);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80 px-4 lg:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab('story')}
            className="text-right text-lg md:text-xl font-bold tracking-tight text-neutral-100 hover:text-rose-400 transition-colors flex items-center gap-2"
            style={{ fontFamily: 'var(--font-cinzel), serif' }}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse inline-block" />
            <span>VALERIA : CHAPTER 0</span>
          </button>
        </div>

        {/* Zone 2: 4 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-400">
          <button
            onClick={() => { sound.playClockTick(); setActiveTab('story'); }}
            className={`flex items-center gap-1.5 transition-colors pb-1 border-b-2 ${
              activeTab === 'story'
                ? 'text-neutral-100 border-rose-600'
                : 'text-neutral-400 border-transparent hover:text-neutral-200'
            }`}
          >
            <BookOpen className="w-4 h-4 text-rose-500" />
            <span>مسار الرواية</span>
          </button>

          <button
            onClick={() => { sound.playClockTick(); setActiveTab('contract'); }}
            className={`flex items-center gap-1.5 transition-colors pb-1 border-b-2 ${
              activeTab === 'contract'
                ? 'text-neutral-100 border-rose-600'
                : 'text-neutral-400 border-transparent hover:text-neutral-200'
            }`}
          >
            <Scroll className="w-4 h-4 text-amber-500" />
            <span>سجل العقد 0</span>
          </button>

          <button
            onClick={() => { sound.playClockTick(); setActiveTab('characters'); }}
            className={`flex items-center gap-1.5 transition-colors pb-1 border-b-2 ${
              activeTab === 'characters'
                ? 'text-neutral-100 border-rose-600'
                : 'text-neutral-400 border-transparent hover:text-neutral-200'
            }`}
          >
            <Users className="w-4 h-4 text-stone-400" />
            <span>سجل الشخصيات</span>
          </button>

          <button
            onClick={() => { sound.playClockTick(); setActiveTab('oracle'); }}
            className={`flex items-center gap-1.5 transition-colors pb-1 border-b-2 ${
              activeTab === 'oracle'
                ? 'text-neutral-100 border-cyan-500'
                : 'text-neutral-400 border-transparent hover:text-cyan-300'
            }`}
          >
            <Radio className="w-4 h-4 text-cyan-400" />
            <span>مستشار السيستم الحي</span>
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2">
          {/* Ambient Dark Victorian Drone */}
          <button
            onClick={toggleAmbience}
            title={isAtmosphereActive ? 'إيقاف ضجيج البخار والتروس' : 'تشغيل الموسيقى الجوية الفيكتورية'}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-md border transition-all flex items-center gap-1.5 whitespace-nowrap ${
              isAtmosphereActive
                ? 'bg-rose-950/60 border-rose-700/70 text-rose-300 shadow-[0_0_12px_rgba(225,29,72,0.25)]'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAtmosphereActive ? 'text-rose-400 animate-spin' : ''}`} />
            <span className="hidden sm:inline">أجواء البخار</span>
          </button>

          {/* Sound Mute */}
          <button
            onClick={toggleMute}
            title={isMuted ? 'تفعيل المؤثرات الصوتية' : 'كتم الصوت'}
            className="p-1.5 text-neutral-400 hover:text-neutral-200 bg-neutral-900 border border-neutral-800 rounded-md transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-rose-400" />}
          </button>

          {/* Restart Origin */}
          <button
            onClick={() => { sound.playClockTick(); onRestart(); }}
            title="إعادة اختيار نقطة البداية"
            className="px-3 py-1.5 text-xs font-medium text-neutral-200 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">بداية جديدة</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub Navigation bar */}
      <div className="flex md:hidden items-center justify-around pt-2.5 mt-2 border-t border-neutral-900 text-xs">
        <button
          onClick={() => { sound.playClockTick(); setActiveTab('story'); }}
          className={`flex items-center gap-1 py-1 ${activeTab === 'story' ? 'text-rose-400 font-bold' : 'text-neutral-400'}`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>السرد</span>
        </button>
        <button
          onClick={() => { sound.playClockTick(); setActiveTab('contract'); }}
          className={`flex items-center gap-1 py-1 ${activeTab === 'contract' ? 'text-amber-400 font-bold' : 'text-neutral-400'}`}
        >
          <Scroll className="w-3.5 h-3.5" />
          <span>العقد</span>
        </button>
        <button
          onClick={() => { sound.playClockTick(); setActiveTab('characters'); }}
          className={`flex items-center gap-1 py-1 ${activeTab === 'characters' ? 'text-neutral-200 font-bold' : 'text-neutral-400'}`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>الشخصيات</span>
        </button>
        <button
          onClick={() => { sound.playClockTick(); setActiveTab('oracle'); }}
          className={`flex items-center gap-1 py-1 ${activeTab === 'oracle' ? 'text-cyan-400 font-bold' : 'text-neutral-400'}`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>السيستم</span>
        </button>
      </div>
    </header>
  );
};
