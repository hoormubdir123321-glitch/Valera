import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// API endpoint for interactive System query / custom player action
app.post('/api/system-oracle', async (req, res) => {
  try {
    const { playerInput, currentScene, stats, origin, characterNotes } = req.body;

    if (!ai) {
      // Deterministic atmospheric fallback if no API key is present
      const fallbackResponses = [
        {
          cinematicDirection: "[زاوية الكاميرا: انحدار مائل (Dutch Angle) مع اقتراب بطيء نحو نظرات فاليريا المرتجفة]",
          narration: `ترتد أصداء كلماتك في تجاويف الهواء المشبع ببخار الزيت والفحم. يرتجف ضوء المصباح الغازي وتتشتت الظلال حولك كأصابع نحاسية ممتدة. تشعر بثقلٍ مفاجئ في الصدر، وكأن ثمة عيناً هائلة وغير مرئية قد انفتحت في باطن الجدار الفولاذي، تحدق مباشرة في روحك المسلوبة.`,
          systemVoice: `«محاولة غير مسجلة في بنود البروتوكول. لقد قمت بتحريك رقعة الشطرنج خارج ترتيب الأدوار. لن يمر هذا دون ثمن أثيري.»`,
          systemAlert: `[تنبيه النظام: رُصد انحراف في التسلسل الزمني · ارتفعت نسبة الشك (+12%) · خُصمت 1 نقطة حركة]`,
          statChanges: { suspicionDelta: 12, trustDelta: -5, apDelta: -1 },
          suggestedActions: [
            { id: 'act_brace', text: 'تثبيت الأقدام على الأرض المبتلة والتحديق في الفراغ بتحدٍ صامت', apCost: 1 },
            { id: 'act_feign', text: 'التظاهر بالخضوع واستعادة التنفس المنتظم لتضليل مجسات السيستم', apCost: 0 }
          ]
        },
        {
          cinematicDirection: "[زاوية الكاميرا: تركيز عدسة ماكرو على بؤبؤ العين وتمدد الأوردة القرمزية تحت الجلد الشاحب]",
          narration: `تتجمد قطرات المطر الأسود المتساقطة من السقف في منتصف الهواء لبرهة خاطفة. الهواء يتحول إلى شفرة حادة من الصقيع، ورائحة الكبريت والدم المتخثر تملأ خياشيمك. الرقعة من حولك تتنفس، وعقارب الساعة المعلقة تدور للخلف ثلاث درجات كاملة.`,
          systemVoice: `«أنت تختبر حدود القفص يا فاليريا. تذكرِ أن الروح التي رهنتِها ليست ملككِ حتى يُنجز العقد الأخير.»`,
          systemAlert: `[تنبيه النظام: الكيان يستجيب · انخفاض استقرار العقل (-8) · زيادة نسبة الشك (+8%)]`,
          statChanges: { suspicionDelta: 8, trustDelta: 0, apDelta: -1 },
          suggestedActions: [
            { id: 'act_inquire', text: 'سؤال السيستم عن هوية "المشرف" المذكور في الهامش', apCost: 1 },
            { id: 'act_retreat', text: 'كتم الأنفاس والتراجع نحو الظلال العميقة', apCost: 0 }
          ]
        }
      ];

      const chosen = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      return res.json(chosen);
    }

    const prompt = `
أنت مصمم قصص وأنظمة ألعاب درامية وسوداوية (Dark Fantasy Narrative Designer) ومحرك السرد لرواية وتطبيق: "VALERIA — CHAPTER 0: THE CONTRACT".
العالم: إمبراطورية فيكتورية صناعية سوداوية (Victorian Industrial Dark Fantasy)، بخار مسموم، تروس نحاسية، أرستقراطية فاسدة، سحر دماء غامض.
الأسلوب الفني: مانهوا كورية / ويبتون سينمائي مظلم (Dark Manhwa)، زاويات كاميرا سينمائية محددة، لغة جسد دقيقة، توتر عالي جداً وسوداوية.
السيستم (System): كيان واعٍ متعالٍ، بارد، يحسب المتغيرات، يراقب اللاعب ويهدده بنبرة آمرة أو ساخرة بهدوء قاتل.

سياق المشهد الحالي:
- مكان الاستيقاظ / الأصل: ${origin || 'غير محدد'}
- عنوان المشهد الحالي: ${currentScene?.title || 'مجهول'}
- ملخص الموقف: ${currentScene?.description || 'لا يوجد'}
- الإحصائيات الحالية: الشك: ${stats?.suspicion || 0}%، الثقة: ${stats?.trust || 0}%، نقاط الحركة AP: ${stats?.ap || 0}/3.
- مدخلات وإجراء اللاعب: "${playerInput}"

المطلوب:
أجب بتنسيق JSON حصرياً كالتالي:
{
  "cinematicDirection": "[حركة الكاميرا ولغة الإخراج البصري مثل زاوية منخفضة / تكبير بطيء / إضاءة تباين حاد]",
  "narration": "نص سردي سينمائي مانهواوي مشوق باللغة العربية يصف رد الفعل البصري والجسدي والبيئي الفيكتوري والتوتر الداكن (بين 60 إلى 120 كلمة)",
  "systemVoice": "«كلمات مباشرة وحادة ينطق بها السيستم الواعي ككيان حي يراقب ويحذر»",
  "systemAlert": "[تنبيه النظام: صيغة حاسمة توضح التغيرات بالضبط]",
  "statChanges": {
    "suspicionDelta": 5, // رقم صحيح بين -15 و +25
    "trustDelta": -5, // رقم صحيح بين -20 و +20
    "apDelta": -1 // رقم صحيح بين -2 و 0
  },
  "suggestedActions": [
    { "id": "custom_opt_1", "text": "خيار تفاعلي درامي أول", "apCost": 1 },
    { "id": "custom_opt_2", "text": "خيار تفاعلي درامي بديل", "apCost": 0 }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.8,
      },
    });

    const text = response.text || '';
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (err: any) {
    console.error('System Oracle Error:', err);
    return res.status(200).json({
      cinematicDirection: "[زاوية الكاميرا: لقطة مقربة من خلف الكتف مع اهتزاز مفاجئ للكاميرا]",
      narration: `تصدع الهواء للحظة، وانطفأت كل ألسنة اللهب في الغرفة لتتركك في عتمة مطلقة تتنفس فيها رائحة النحاس المحترق. ثم اشتعلت شاشة السيستم فجأة بلون أحمر قاني كشريان منفجر.`,
      systemVoice: `«انتبه! إرادتك تقاوم التزامن العصبي. استمرارك في هذا المسار سيؤدي إلى تفكك العقد.»`,
      systemAlert: `[تنبيه النظام: اضطراب في مصفوفة الإدراك · ارتفعت نسبة الشك (+10%)]`,
      statChanges: { suspicionDelta: 10, trustDelta: -5, apDelta: -1 },
      suggestedActions: [
        { id: 'rec_recover', text: 'استعادة الاتزان والعودة لمسار العقد الأساسي', apCost: 0 }
      ]
    });
  }
});

// Setup Vite in development or static serve in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Valeria narrative engine listening on http://localhost:${PORT}`);
  });
}

startServer();
