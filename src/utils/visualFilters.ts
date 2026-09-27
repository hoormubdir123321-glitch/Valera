// Suite of Visual Filters for Manhwa Cinematic Aesthetic

export type VisualFilterId = 
  | 'auto' 
  | 'noir' 
  | 'high-contrast' 
  | 'sepia' 
  | 'crimson' 
  | 'moonlight' 
  | 'ember' 
  | 'raw';

export interface VisualFilter {
  id: VisualFilterId;
  nameAr: string;
  nameEn: string;
  description: string;
  filterStyle: string;
  overlayGradient: string;
  vignetteColor: string;
  grainIntensity: number; // 0 to 1
  accentColor: string;
}

export const VISUAL_FILTERS: Record<VisualFilterId, VisualFilter> = {
  auto: {
    id: 'auto',
    nameAr: 'تزامن تلقائي مع الإضاءة',
    nameEn: 'Adaptive Lighting Match',
    description: 'تحليل نص الإضاءة لكل لوحة وتفعيل الفلتر السينمائي الأنسب تلقائياً',
    filterStyle: '',
    overlayGradient: '',
    vignetteColor: 'rgba(0, 0, 0, 0.85)',
    grainIntensity: 0.15,
    accentColor: 'text-cyan-400',
  },
  noir: {
    id: 'noir',
    nameAr: 'نوار فيكتوري مظلم (Noir)',
    nameEn: 'Victorian Film Noir',
    description: 'ظلال فضية فحمية قاتمة مستوحاة من كلاسيكيات التحقيق الفيكتوري والغموض',
    filterStyle: 'grayscale(0.85) contrast(145%) brightness(82%)',
    overlayGradient: 'linear-gradient(to top, rgba(10, 10, 12, 0.95), rgba(18, 18, 22, 0.3), rgba(0, 0, 0, 0.7))',
    vignetteColor: 'rgba(5, 5, 8, 0.92)',
    grainIntensity: 0.28,
    accentColor: 'text-stone-300',
  },
  'high-contrast': {
    id: 'high-contrast',
    nameAr: 'تباين مانهوا صارخ (High Contrast)',
    nameEn: 'Graphic Webtoon Ink',
    description: 'خطوط حبرية حادة وفواصل ضوئية قاسية تزيد من حدة التوتر في مشاهد القتال',
    filterStyle: 'contrast(175%) brightness(92%) saturate(125%)',
    overlayGradient: 'linear-gradient(to top, rgba(8, 8, 10, 0.92), transparent, rgba(0, 0, 0, 0.6))',
    vignetteColor: 'rgba(0, 0, 0, 0.9)',
    grainIntensity: 0.2,
    accentColor: 'text-yellow-400',
  },
  sepia: {
    id: 'sepia',
    nameAr: 'سيبيا التروس العتيقة (Sepia)',
    nameEn: 'Clockwork Sepia & Copper',
    description: 'درجات النحاس والخشب العتيق وأوراق العقود القديمة المحفوظة في الأرشيف',
    filterStyle: 'sepia(0.65) contrast(125%) brightness(88%) hue-rotate(-15deg)',
    overlayGradient: 'linear-gradient(to top, rgba(30, 20, 10, 0.9), rgba(45, 30, 15, 0.2), rgba(20, 10, 5, 0.6))',
    vignetteColor: 'rgba(35, 20, 10, 0.85)',
    grainIntensity: 0.35,
    accentColor: 'text-amber-400',
  },
  crimson: {
    id: 'crimson',
    nameAr: 'قرمزي سحر الدماء (Crimson Aether)',
    nameEn: 'Blood Oath Crimson',
    description: 'توهج أحمر ياقوتي محتدم ينفجر عند شذوذ العقد واستيقاظ عيون فاليريا القرمزية',
    filterStyle: 'contrast(135%) brightness(86%) saturate(175%) hue-rotate(335deg)',
    overlayGradient: 'linear-gradient(to top, rgba(40, 5, 15, 0.95), rgba(70, 10, 25, 0.25), rgba(20, 2, 8, 0.7))',
    vignetteColor: 'rgba(50, 5, 20, 0.88)',
    grainIntensity: 0.22,
    accentColor: 'text-rose-400',
  },
  moonlight: {
    id: 'moonlight',
    nameAr: 'ضوء القمر الكوبالتي (Moonlight)',
    nameEn: 'Sanitarium Cold Cobalt',
    description: 'زرقة باردة وثقيلة كالفورمالين وزنك المشرحة الإمبراطورية',
    filterStyle: 'contrast(138%) brightness(85%) saturate(135%) hue-rotate(185deg)',
    overlayGradient: 'linear-gradient(to top, rgba(8, 20, 35, 0.95), rgba(12, 35, 60, 0.2), rgba(4, 12, 22, 0.7))',
    vignetteColor: 'rgba(5, 20, 38, 0.9)',
    grainIntensity: 0.18,
    accentColor: 'text-sky-400',
  },
  ember: {
    id: 'ember',
    nameAr: 'جمر ومداخن صناعية (Ember & Steam)',
    nameEn: 'Industrial Roaring Ember',
    description: 'حرارة حارقة وألسنة لهب أفران الفحم والمطابخ الحديدية المضغوطة',
    filterStyle: 'contrast(140%) brightness(92%) saturate(180%) hue-rotate(12deg)',
    overlayGradient: 'linear-gradient(to top, rgba(45, 15, 5, 0.92), rgba(65, 25, 8, 0.25), rgba(25, 8, 2, 0.7))',
    vignetteColor: 'rgba(50, 18, 5, 0.85)',
    grainIntensity: 0.25,
    accentColor: 'text-orange-400',
  },
  raw: {
    id: 'raw',
    nameAr: 'بدون معالجة (Original)',
    nameEn: 'Clean Original Art',
    description: 'العرض الأصلي للوحة دون أي مؤثرات لونية إضافية',
    filterStyle: 'none',
    overlayGradient: 'linear-gradient(to top, rgba(0, 0, 0, 0.85), transparent, rgba(0, 0, 0, 0.4))',
    vignetteColor: 'rgba(0, 0, 0, 0.8)',
    grainIntensity: 0.1,
    accentColor: 'text-neutral-400',
  }
};

/**
 * Analyzes the panel's descriptive lighting context and resolves the optimal visual filter
 */
export function detectLightingFilter(lightingDescription: string = ''): VisualFilterId {
  const text = lightingDescription.toLowerCase();

  // 1. Moonlight / Sanitarium / Cold blues
  if (
    text.includes('قمر') || 
    text.includes('أزرق') || 
    text.includes('ثلج') || 
    text.includes('بارد') || 
    text.includes('كوبالت') || 
    text.includes('فورمالين') ||
    text.includes('moonlight') ||
    text.includes('blue') ||
    text.includes('cold')
  ) {
    return 'moonlight';
  }

  // 2. Ember / Fire / Stoves / Coal / Steam heat
  if (
    text.includes('جمر') || 
    text.includes('نار') || 
    text.includes('موقد') || 
    text.includes('برتقالي') || 
    text.includes('حارق') || 
    text.includes('لهب') || 
    text.includes('فحم') ||
    text.includes('غليان') ||
    text.includes('ember') ||
    text.includes('fire') ||
    text.includes('flame')
  ) {
    return 'ember';
  }

  // 3. Crimson / Blood / Red aether / Eye glow
  if (
    text.includes('قرمزي') || 
    text.includes('أحمر') || 
    text.includes('دم') || 
    text.includes('ياقوت') || 
    text.includes('شريان') ||
    text.includes('crimson') ||
    text.includes('blood') ||
    text.includes('ruby')
  ) {
    return 'crimson';
  }

  // 4. Vintage Sepia / Lantern / Brass / Monocle / Clockwork
  if (
    text.includes('فانوس') || 
    text.includes('نحاس') || 
    text.includes('خافت') || 
    text.includes('غليون') || 
    text.includes('عتيق') ||
    text.includes('شمع') ||
    text.includes('كيروسين') ||
    text.includes('lantern') ||
    text.includes('brass') ||
    text.includes('sepia')
  ) {
    return 'sepia';
  }

  // 5. High Contrast / Explosions / Lightning / Glitch
  if (
    text.includes('شرر') || 
    text.includes('انفجار') || 
    text.includes('صاعقة') || 
    text.includes('كهرب') || 
    text.includes('وميض') ||
    text.includes('مباغت') ||
    text.includes('contrast') ||
    text.includes('flash')
  ) {
    return 'high-contrast';
  }

  // 6. Default to Victorian Film Noir
  return 'noir';
}
