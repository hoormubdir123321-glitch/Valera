export type OriginId = 'abyss' | 'kitchen' | 'sanitarium';

export interface WebtoonBubble {
  id: string;
  speaker: string;
  type: 'speech' | 'whisper' | 'shout' | 'thought' | 'system';
  text: string;
  avatarColor?: string;
}

export interface WebtoonPanel {
  id: string;
  panelNumber: string;
  cameraType: string;
  cameraIcon?: string;
  lighting: string;
  sfx?: string;
  actionDescription: string;
  image?: string;
  imageFocus?: 'center' | 'top' | 'bottom' | 'zoom-in' | 'dutch-tilt';
  bubbles: WebtoonBubble[];
  ambientVisual?: string;
}

export interface Choice {
  id: string;
  text: string;
  tacticType?: 'دهاء ومناورة' | 'هجوم مباغت' | 'استدعاء سحري' | 'تسلل هادئ';
  apCost: number;
  suspicionDelta: number;
  trustDelta: number;
  nextSceneId: string;
  systemAlert?: string;
  requirement?: {
    minAP?: number;
    maxSuspicion?: number;
    minTrust?: number;
  };
}

export interface Scene {
  id: string;
  originId?: OriginId;
  chapter: string;
  title: string;
  cameraDirection: string;
  image: string;
  panels: WebtoonPanel[];
  systemHologram?: {
    type: 'critical' | 'mandate' | 'warning' | 'override';
    title: string;
    protocolNumber: string;
    warningVoice: string;
    countdownSeconds?: number;
  };
  choices: Choice[];
  isEnding?: boolean;
  endingType?: string;
}

export interface CharacterProfile {
  id: string;
  name: string;
  title: string;
  description: string;
  status: string;
  allegiance: string;
  suspicionRating: string;
}

export interface ContractClause {
  number: string;
  title: string;
  text: string;
  isUnlocked: boolean;
  isAltered: boolean;
}

export const ORIGIN_METADATA: Record<OriginId, {
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  image: string;
  initialSceneId: string;
  initialCamera: string;
}> = {
  abyss: {
    title: "الهاوية وجرف الضباب",
    subtitle: "The Mist Precipice · Chapter 0: Panel 01",
    description: "الاستيقاظ على حافة صخرية عملاقة تشرف على وادي السخام الأسود. سماء فيكتورية رمادية تصرخ فيها صافرات قطارات الفحم الأثيري.",
    badge: "افتتاحية الهاوية والمناورة",
    image: "/src/assets/images/valeria_abyss_chasm_1790511426163.jpg",
    initialSceneId: "abyss_start",
    initialCamera: "[Wide Shot — لقطة واسعة سينمائية من قمة الهاوية نحو هاوية الضباب البنفسجي السحيق]"
  },
  kitchen: {
    title: "سجن ومطبخ القلعة الحديدية",
    subtitle: "The Iron Keep Scullery · Chapter 0: Panel 01",
    description: "الاستيقاظ مقيداً إلى طاولة تقطيع خشبية ثقيلة تلطخها دماء المواشي وشحم المراجل، أمام موقد فحم يزمجر بنيران برونزية وبخار حارق.",
    badge: "افتتاحية الرعب والتسلل",
    image: "/src/assets/images/valeria_prison_kitchen_1790511437527.jpg",
    initialSceneId: "kitchen_start",
    initialCamera: "[Low Angle Dutch Tilt — زاوية مائلة حادة من أسفل طاولة الذبح مع توهج الجمر النحاسي]"
  },
  sanitarium: {
    title: "المشرحة والمستشفى الإمبراطوري",
    subtitle: "Sanitarium Morgue · Chapter 0: Panel 01",
    description: "الاستيقاظ ممدداً تحت كفن أبيض منسدل فوق منضدة تشريح من الزنك البارد، وأمامك مبضع الطبيب الشرعي يلمع تحت ضوء القمر الأزرق.",
    badge: "افتتاحية الذكاء والهروب الطبي",
    image: "/src/assets/images/valeria_sanitarium_morgue_1790511448173.jpg",
    initialSceneId: "sanitarium_start",
    initialCamera: "[POV Extreme Close-up — لقطة من منظور العين الأول: ارتجاف الجفون ورؤية انعكاس المبضع الفضي]"
  }
};

export const CONTRACT_CLAUSES: ContractClause[] = [
  {
    number: "البند 01",
    title: "شرط التزامن الأثيري",
    text: "تلتزم حاملة الدم 'فاليريا' بالاستجابة لكافة نبضات السيستم في حدود نطاق الإمبراطورية الصناعية، وأي تأخير في التنفيذ يُعاقب بخصم نقاط الحركة الحيوية (AP).",
    isUnlocked: true,
    isAltered: false
  },
  {
    number: "البند 02",
    title: "بروتوكول الشك والحصانة",
    text: "إذا تجاوز مؤشر [الشك - Suspicion] حاجز 75%، يحق لكيان السيستم إطلاق صدمة أرجوانية مباشرة على النخاع الشوكي لفرض الانصياع الفوري.",
    isUnlocked: true,
    isAltered: false
  },
  {
    number: "البند 03",
    title: "رهن الروح والتروس",
    text: "كل معلومة سرية تُكشف عن مجلس اللوردات يُقيد نصف ثمنها في رصيد النجاة، بينما يعود النصف الآخر للمُشرف الخفي على الرقعة.",
    isUnlocked: false,
    isAltered: false
  },
  {
    number: "البند 04",
    title: "استبدال التوقيع بالدم",
    text: "لا يُلغى العقد بالموت العضوي، بل يُعاد تدوير الوعي في جسد بديل ضمن منشآت الفحم الأثيري التابعة للتاج.",
    isUnlocked: false,
    isAltered: false
  }
];

export const CHARACTERS: CharacterProfile[] = [
  {
    id: "valeria",
    name: "فاليريا فون كرويل (Valeria)",
    title: "سليلة الدم المنفي وحاملة شريان العقد",
    description: "شابة ذات عينين قرمزيتين حادتين وشعر أسود داكن كالفحم. استيقظت بلا ذاكرة كاملة سوى رنين عقارب الساعة في رأسها وصوت السيستم الذي يملي عليها شروط البقاء.",
    status: "تحت المراقبة الحية",
    allegiance: "غير مستقر / مستقلة",
    suspicionRating: "متوسط (يتصاعد)"
  },
  {
    id: "system_entity",
    name: "الكيان (The System Overseer)",
    title: "العقل الأثيري المشرف على الرقعة",
    description: "كيان واعٍ مجهول الأصل يتحدث بنصوص ونوافذ أثيرية زرقاء وحمراء. يحسب الاحتمالات كآلة شطرنج لا ترحم، ويبدو أنه كان طرفاً في إبرام العقد القديم.",
    status: "حاضر في كل زاوية",
    allegiance: "المنفعة المحضة وحفظ العقد",
    suspicionRating: "مطلق"
  },
  {
    id: "lord_crowley",
    name: "اللورد سيباستيان كرويل",
    title: "وزير التعدين والمطارد الإمبراطوري",
    description: "أرستقراطي فيكتوري قاسي الملامح يرتدي قفازات جلدية سوداء ومونوكل زجاجي يكشف تدفقات السحر المحرم. يبحث عن العقد 0 بكل ما يملك من نفوذ فيلق التروس.",
    status: "في حالة مطاردة نشطة",
    allegiance: "التاج الإمبراطوري ومجلس النبلاء",
    suspicionRating: "عدائي جداً"
  },
  {
    id: "dr_von_vane",
    name: "الدكتور جوليان فون فاين",
    title: "رئيس الجراحين في المشرحة الملكية",
    description: "رجل هزيل يرتدي مئزراً مبللاً بالفورمالين وميكانيكا التقطير الأثيري. مهووس بتشريح سلالات الدم الخفي وعقد الصفقات من خلف الكواليس.",
    status: "مراقب متردد",
    allegiance: "أكاديمية العلوم الخيميائية",
    suspicionRating: "حذر"
  }
];

export const STORY_SCENES: Record<string, Scene> = {
  // ===================== ORIGIN 1: THE ABYSS (MANHWA EPISODE 0) =====================
  abyss_start: {
    id: "abyss_start",
    originId: "abyss",
    chapter: "الفصل 0: العقد · اللوحة الافتتاحية الأولى",
    title: "استيقاظ فوق جرف الموت الأسود",
    cameraDirection: "[Extreme Wide Shot ➔ Slow Zoom-in: الهاوية السحيقة تمتد في الأفق، ثم اقتراب سينمائي نحو أصابع فاليريا المرتجفة فوق الصخر]",
    image: "/src/assets/images/valeria_abyss_chasm_1790511426163.jpg",
    panels: [
      {
        id: "p_ab_1",
        panelNumber: "لوحة 01",
        cameraType: "[Extreme Wide Shot — لقطة بانورامية هائلة]",
        lighting: "سماء رمادية محتقنة، سحب دخان كبريتي تتصاعد من مداخن الأبراج الصناعية الغارقة في الضباب.",
        sfx: "*صفير رياح عاتية: فششششش · ارتطام أمطار لزجة: تيك-تيك-تيك*",
        actionDescription: "الكاميرا تتدلى من الفراغ كعين صقر محلق. نرى جرفاً صخرياً مكسوراً ينتصب كسكين صدئ فوق هوة لا قعر لها. في الأفق البعيد، سكة حديدية معلقة تعبرها قاطرة بخارية تطلق عمود دخان أسود.",
        image: "/src/assets/images/valeria_abyss_chasm_1790511426163.jpg",
        bubbles: [
          {
            id: "b1",
            speaker: "السرد السينمائي",
            type: "thought",
            text: "«هذا ليس موتاً عادياً... الرائحة في الهواء ليست مجرد كبريت. إنها رائحة احتراق أرواح محبوسة في غلايات الضغط الإمبراطوري.»"
          }
        ]
      },
      {
        id: "p_ab_2",
        panelNumber: "لوحة 02",
        cameraType: "[Extreme Close-up — لقطة ماكرو مقربة جداً]",
        lighting: "وميض قرمزي مباغت يشق عتمة المطر، ينعكس على بؤبؤ العين المتسع.",
        sfx: "*نبضة قلب مباغتة: دوك... دوك-دوك!*",
        actionDescription: "انفتاح مفاجئ لجفنين شاحبين. الرموش السوداء مبللة بقطرات المطر. بؤبؤ العين اليسرى بلون ياقوتي متوهج، يتسع ليرصد صخرة تتفتت تحت كعب حذائها الجلدي وتسقط في الهوة بلا صوت يرتد.",
        image: "/src/assets/images/manhwa_valeria_eyes_1790512590343.jpg",
        bubbles: [
          {
            id: "b2",
            speaker: "فاليريا",
            type: "whisper",
            text: "«سحقاً...! إصبع واحد إضافي، وسأكون وليمة للتروس في القاع!»",
            avatarColor: "border-rose-600"
          }
        ]
      },
      {
        id: "p_ab_3",
        panelNumber: "لوحة 03",
        cameraType: "[Over-the-Shoulder / Dutch Tilt — زاوية مائلة حادة من خلف الكتف]",
        lighting: "ظهور شاشة هولوغرامية شبه شفافة باللون الأزرق النيون تتخللها خطوط تداخل كهربي مشوش.",
        sfx: "*طنين أثيري حاد: بيييييب-كلاك*",
        actionDescription: "في راحة يدها اليسرى، يحترق جلدها بوشم دائري على هيئة عقرب ساعة يتحرك عكس عقارب الزمن. فجأة، تنبثق شاشة السيستم في الهواء أمام أنفها مباشرة، متماوجة كسطح ماء مكهرب.",
        image: "/src/assets/images/valeria_hero_contract_1790511414037.jpg",
        bubbles: [
          {
            id: "b3",
            speaker: "السيستم (The System)",
            type: "system",
            text: "«[إشعار استقرار الوعي: 42%] · أهلاً بكِ في الرقعة مجدداً يا فاليريا. نبضك مرتفع بنسبة 74%، والجاذبية في هذا الموضع تسحب جسدك بسرعة 9.8 م/ث² إذا لم تثبتي نقطة ارتكازك خلال خمس ثوانٍ.»",
            avatarColor: "border-cyan-400"
          },
          {
            id: "b4",
            speaker: "فاليريا",
            type: "thought",
            text: "«هذا الشيء في رأسي مجدداً... لا وقت للتساؤل عن هويته الآن، وزني ينزلق نحو حافة الهاوية!»"
          }
        ]
      }
    ],
    systemHologram: {
      type: "critical",
      title: "نافذة التدخل الطارئ للسيستم",
      protocolNumber: "PROTO-09 // BREACH",
      warningVoice: "«الانزلاق وشيك. استهلكي نقاط الحركة لتثبيت التوازن، أو جازفي بسقوط حر نحو شبكة الصرف النحاسية.»",
      countdownSeconds: 10
    },
    choices: [
      {
        id: "abyss_c1",
        tacticType: "دهاء ومناورة",
        text: "غرس الخنجر النحاسي في الشق الصخري للارتكاز والتراجع زحفاً نحو الكهف (استهلاك 1 AP)",
        apCost: 1,
        suspicionDelta: -5,
        trustDelta: 10,
        nextSceneId: "abyss_crevice",
        systemAlert: "[تنبيه النظام: تثبيت نقطة ارتكاز ناجحة · مؤشر النجاة +30% · خُصمت 1 نقطة حركة (AP: 2/3)]"
      },
      {
        id: "abyss_c2",
        tacticType: "استدعاء سحري",
        text: "عض الإبهام لإطلاق قطرة دم واستفزاز شاشة السيستم لفتح ممر أثيري فوري (مخاطرة كبرى)",
        apCost: 1,
        suspicionDelta: 20,
        trustDelta: -5,
        nextSceneId: "abyss_system_call",
        systemAlert: "[تنبيه النظام: تفعيل محظور بالدم! · إطلاق إنذار طاقة للمراقبين · ارتفعت نسبة الشك (+20%)]"
      },
      {
        id: "abyss_c3",
        tacticType: "هجوم مباغت",
        text: "الوقوف بحدة ومسح الأفق لتحديد موقع مدافع الحرس الحديدي في السكة المعلقة",
        apCost: 2,
        suspicionDelta: 10,
        trustDelta: 0,
        nextSceneId: "abyss_shadows",
        systemAlert: "[تنبيه النظام: حركة استعراضية مكشوفة! · استهلاك 2 AP · تم رصد التوقيع الحراري]"
      }
    ]
  },

  abyss_crevice: {
    id: "abyss_crevice",
    originId: "abyss",
    chapter: "الفصل 0: العقد · اللوحة 02",
    title: "مأوى الذئاب والحديد المغلي",
    cameraDirection: "[Medium Low Shot: الكاميرا تتسلل داخل الكهف الصخري المظلم، ترصد أنبوب بخار نحاسي ينبض بنور حارق]",
    image: "/src/assets/images/valeria_abyss_chasm_1790511426163.jpg",
    panels: [
      {
        id: "p_cr_1",
        panelNumber: "لوحة 01",
        cameraType: "[Medium Shot — لقطة متوسطة داخل الشق]",
        lighting: "وهج برتقالي خافت ينبعث من فتحات تصريف البخار في الجدران الصخرية المكسوة بالطحالب.",
        sfx: "*هسهسة بخار ساخن: سسسسسسسسس*",
        actionDescription: "فاليريا تدلف زاحفة إلى داخل تجويف صخري عميق. ملابسها ممزقة عند الكتف الأيمن، وقطرات الماء الأسود تتقاطر من أطراف شعرها الفاحم. أمامها ترقد حقيبة جلدية عسكرية محفورة عليها أختام بيت كرويل.",
        image: "/src/assets/images/valeria_abyss_chasm_1790511426163.jpg",
        bubbles: [
          {
            id: "b_cr1",
            speaker: "فاليريا",
            type: "thought",
            text: "«شعار طائر الرخ ذو الرأسين... حرس كرويل الخاص كانوا هنا قبل ساعات فقط. هل تركوا هذا عمداً؟»"
          }
        ]
      },
      {
        id: "p_cr_2",
        panelNumber: "لوحة 02",
        cameraType: "[Close-up — لقطة مقربة من مدخل الكهف]",
        lighting: "حزمة ضوء مخروطية قادمة من فانوس غازي محمول تمسح مدخل الصخور فجأة.",
        sfx: "*وقع أحذية حديدية ثقيلة: طخ... طخ... طخ! · سحب زناد بندقية: كليك-كلاك!*",
        actionDescription: "ظل ضخم لجندي يرتدي قناعاً نحاسياً يشبه منقار الغراب يتوقف عند عتبة الشق. البندقية الكهرومغناطيسية في يديه تفرغ شحنة استاتيكية زرقاء تضيء ملامحه المتصلبة.",
        image: "/src/assets/images/valeria_hero_contract_1790511414037.jpg",
        bubbles: [
          {
            id: "b_cr2",
            speaker: "حارس فيلق الغربان",
            type: "shout",
            text: "«رائحة الأثير تتصاعد من هذا الشق! تحركوا بسرعة، الدخيلة لن تفلت من قبضة اللورد هذه المرة!»"
          },
          {
            id: "b_cr3",
            speaker: "السيستم (The System)",
            type: "system",
            text: "«[حساب المسافة: 3.2 متر] · سلاح الحارس مشحون بنسبة 80%. أمامك خياران: طعنة في الفجوة الصدرية أو الهروب عبر مجرى البخار الساخن.»",
            avatarColor: "border-cyan-400"
          }
        ]
      }
    ],
    systemHologram: {
      type: "warning",
      title: "بروتوكول المواجهة القريبة",
      protocolNumber: "HOSTILE-ENGAGE // 01",
      warningVoice: "«العدو في نطاق الاشتباك القاتل. أي تردد يعني طلقة كهرومغناطيسية مباشرة في الصدر.»",
      countdownSeconds: 8
    },
    choices: [
      {
        id: "cr_c1",
        tacticType: "هجوم مباغت",
        text: "مباغتة الحارس بقفزة خاطفة وطعن مجرى البخار في خوذته النحاسية (استهلاك 1 AP)",
        apCost: 1,
        suspicionDelta: 15,
        trustDelta: 5,
        nextSceneId: "abyss_combat",
        systemAlert: "[تنبيه النظام: هجوم حاسم مباغت · تحييد الحارس الفوري · تصاعد الشك (+15%)]"
      },
      {
        id: "cr_c2",
        tacticType: "تسلل هادئ",
        text: "انتزاع حقيبة العقد والانزلاق عبر فتحة أنبوب الصرف الساخن نحو برج الساعة (استهلاك 1 AP)",
        apCost: 1,
        suspicionDelta: -10,
        trustDelta: 10,
        nextSceneId: "clocktower_approach",
        systemAlert: "[تنبيه النظام: مناورة تسلل ممتازة · حيازة 'لفافة العقد' وتفادي الرصاص · التوجه لبرج الساعة]"
      }
    ]
  },

  abyss_system_call: {
    id: "abyss_system_call",
    originId: "abyss",
    chapter: "الفصل 0: العقد · اللوحة 03",
    title: "مساومة مع العقل الأثيري",
    cameraDirection: "[Split Screen Manhwa: النصف الأيمن وجه فاليريا الملطخ بالسخام، والنصف الأيسر عين السيستم الهولوغرامية]",
    image: "/src/assets/images/manhwa_valeria_eyes_1790512590343.jpg",
    panels: [
      {
        id: "p_sys_1",
        panelNumber: "لوحة 01",
        cameraType: "[Extreme Macro — لقطة ماكرو لشريان اليد]",
        lighting: "توهج أحمر قاني ينبض تحت الجلد كأنه أسلاك نحاسية مسخنة حتى درجة الذوبان.",
        sfx: "*طنين أثيري يخترق الأذن: ويييييشش*",
        actionDescription: "قطرة دم تتدفق من إبهام فاليريا المعضوض، لا تسقط إلى الأرض بل تطوف في الهواء متحولة إلى سداسي هندسي يدور بسرعة جنونية.",
        image: "/src/assets/images/manhwa_valeria_eyes_1790512590343.jpg",
        bubbles: [
          {
            id: "b_sc1",
            speaker: "فاليريا",
            type: "shout",
            text: "«أجبني أيتها الآلة الملعونة! لماذا تم توقيع هذا العقد باسمي وأنا فاقدة لذاكرتي؟!»",
            avatarColor: "border-rose-600"
          },
          {
            id: "b_sc2",
            speaker: "السيستم (The System)",
            type: "system",
            text: "«[رد الكيان]: الغضب يهدر طاقتك العضوية. أنتِ لم تُجبري على العقد يا فاليريا... أنتِ من طلبتِ توقيعه ليلة احتراق قصر كرويل. نحن لا ننقض الصفقات التي خُتمت بالدم الملكي.»",
            avatarColor: "border-cyan-400"
          }
        ]
      }
    ],
    systemHologram: {
      type: "mandate",
      title: "تحذير البند الأول المباشر",
      protocolNumber: "OVERRIDE // SYSTEM-WILL",
      warningVoice: "«توجهي إلى برج الساعة الأثري فوراً. التردد سيفعّل شحنة الصدمة العقابية.»"
    },
    choices: [
      {
        id: "sc_c1",
        tacticType: "دهاء ومناورة",
        text: "«إذاً أثبت صدقك: امنحني خارطة التدفقات الحرارية للهروب من طوق الحرس الآن!»",
        apCost: 0,
        suspicionDelta: -5,
        trustDelta: 15,
        nextSceneId: "clocktower_approach",
        systemAlert: "[تنبيه النظام: استجابة براغماتية مقبولة · تفعيل رادار الملاحة الأثيري · فتح المسار]"
      },
      {
        id: "sc_c2",
        tacticType: "استدعاء سحري",
        text: "«لن أكون دميتك... سأحطم نواة العقد بيدي حتى لو احترق جسدي بالكامل!»",
        apCost: 1,
        suspicionDelta: 30,
        trustDelta: -20,
        nextSceneId: "clocktower_approach",
        systemAlert: "[تنبيه النظام: تمرد صريح على المنظومة! · تصاعد مؤشر الشك إلى 70% · اضطراب في الأعصاب]"
      }
    ]
  },

  abyss_shadows: {
    id: "abyss_shadows",
    originId: "abyss",
    chapter: "الفصل 0: العقد · اللوحة 04",
    title: "وابل البارود الكهرومغناطيسي",
    cameraDirection: "[Dynamic Dutch Angle: رصاصات كهرومغناطيسية زرقاء تحفر الصخر بجوار قدم فاليريا]",
    image: "/src/assets/images/valeria_abyss_chasm_1790511426163.jpg",
    panels: [
      {
        id: "p_sh_1",
        panelNumber: "لوحة 01",
        cameraType: "[High Action Panel — لقطة حركية فائقة السرعة]",
        lighting: "شعلات الانفجارات النحاسية تخطف الأبصار وسط رذاذ المطر المتطاير.",
        sfx: "*دوي إطلاق قذيفة بخارية: بووووم! · تشظي الصخور: كرااااش!*",
        actionDescription: "فاليريا تنحني برشاقة الفهد الأسود. رصاصة زرقاء تقتلع قطعة من صخرة خلفها لتسقط الشظايا كالمطر فوق ياقة معطفها. في الأعلى، ثلاثة قناصين يعيدون تعبئة أسطوانات البخار في بنادقهم.",
        image: "/src/assets/images/valeria_abyss_chasm_1790511426163.jpg",
        bubbles: [
          {
            id: "b_sh1",
            speaker: "قناص الحرس",
            type: "shout",
            text: "«الهدف محاصر على حافة الشق! لا تدعوها تصل إلى خط السكك الأثرية!»"
          },
          {
            id: "b_sh2",
            speaker: "فاليريا",
            type: "whisper",
            text: "«ثلاث ثوانٍ قبل انتهاء إعادة التعبئة... حان وقت القفزة الانتحارية!»",
            avatarColor: "border-rose-600"
          }
        ]
      }
    ],
    choices: [
      {
        id: "sh_c1",
        tacticType: "دهاء ومناورة",
        text: "القفز والتشبث بكابلات الرافعة المعلقة أسفل الجسر والتأرجح نحو برج الساعة (استهلاك 2 AP)",
        apCost: 2,
        suspicionDelta: 5,
        trustDelta: 10,
        nextSceneId: "clocktower_approach",
        systemAlert: "[تنبيه النظام: مناورة أكروباتية خطيرة · نجاح الإنزال فوق رصيف برج الساعة الأثري]"
      }
    ]
  },

  abyss_combat: {
    id: "abyss_combat",
    originId: "abyss",
    chapter: "الفصل 0: العقد · اللوحة 05",
    title: "نصل في درع الغراب",
    cameraDirection: "[Cinematic Close-up: سقوط خوذة الحارس النحاسية على الأرض وارتطامها بالصخر]",
    image: "/src/assets/images/valeria_hero_contract_1790511414037.jpg",
    panels: [
      {
        id: "p_cb_1",
        panelNumber: "لوحة 01",
        cameraType: "[Impact Freeze Frame — تجميد لقطة الاصطدام]",
        lighting: "شرر كهربائي متطاير من محبس البخار المكسور يضيء ابتسامة فاليريا القاتمة.",
        sfx: "*صوت اختراق النصل: كرانش! · تسرب البخار المضغوط: بيششششش*",
        actionDescription: "نصل خنجر فاليريا يستقر بدقة متناهية في الفراغ العازل بين صمام الرقبة ودرع الكتف. الحارس يترنح، وتسقط بندقيته الفولاذية برنين معدني أجوف.",
        image: "/src/assets/images/valeria_hero_contract_1790511414037.jpg",
        bubbles: [
          {
            id: "b_cb1",
            speaker: "حارس فيلق الغربان",
            type: "whisper",
            text: "«كـ... كرويل... لن... يغفر لكِ...»"
          },
          {
            id: "b_cb2",
            speaker: "فاليريا",
            type: "speech",
            text: "«أخبره بذلك بنفسك حين تلتقيان في الجحيم الصناعي.»",
            avatarColor: "border-rose-600"
          }
        ]
      }
    ],
    choices: [
      {
        id: "cb_c1",
        tacticType: "تسلل هادئ",
        text: "أخذ معطف الحارس وشارة الدخول النحاسية والتوجه نحو بوابات برج الساعة (استهلاك 1 AP)",
        apCost: 1,
        suspicionDelta: -10,
        trustDelta: 10,
        nextSceneId: "clocktower_approach",
        systemAlert: "[تنبيه النظام: ارتداء تنكر الحرس · انخفاض الشك (-10%) · التوجه للمواجهة الحاسمة]"
      }
    ]
  },

  // ===================== ORIGIN 2: THE KITCHEN =====================
  kitchen_start: {
    id: "kitchen_start",
    originId: "kitchen",
    chapter: "الفصل 0: العقد · اللوحة الافتتاحية الثانية",
    title: "أغلال اللحم والدهن المحترق",
    cameraDirection: "[Low Angle Tracking: الكاميرا تتحرك بمحاذاة الأرضية المدهنة، تصعد نحو جزار السجن ممسكاً بساطور صدئ]",
    image: "/src/assets/images/valeria_prison_kitchen_1790511437527.jpg",
    panels: [
      {
        id: "p_kt_1",
        panelNumber: "لوحة 01",
        cameraType: "[Wide Low Angle — لقطة واسعة منخفضة]",
        lighting: "وهج جمر أحمر متقد يتصاعد من موقد حديدي هائل، ودخان الشحم يملأ السقف المكسو بسلاسل التعليق.",
        sfx: "*صوت ضربة ساطور في لوح خشب: ثود! · غليان حساء العظام: بوب-بوب-بوب*",
        actionDescription: "فاليريا مربوطة بحبال جلدية معززة بأسلاك نحاسية إلى منضدة خشبية سميكة. عيناها ترصدان جزار السجن الضخم؛ رجل بذراع ميكانيكية بخارية يقطع لحماً نيئاً بساطور عريض.",
        image: "/src/assets/images/valeria_prison_kitchen_1790511437527.jpg",
        bubbles: [
          {
            id: "b_kt1",
            speaker: "طاهي السجن والجلاد",
            type: "speech",
            text: "«استيقظتِ أخيراً يا قطة كرويل الصغيرة؟ اللورد دفع ثروة ليضمن ألا يغادر وعيك هذه القلعة بقطعة واحدة.»"
          }
        ]
      },
      {
        id: "p_kt_2",
        panelNumber: "لوحة 02",
        cameraType: "[Extreme Close-up — لقطة ماكرو للعين والأصفاد]",
        lighting: "انعكاس وهج النار في العين القرمزية، وملاحظة صمام البخار النحاسي المرتخي خلف كاحلها.",
        sfx: "*صرير سبيكة معدنية تحت الضغط*",
        actionDescription: "أصابع فاليريا تتحسس دبوس شعر فولاذي مخبأ بعناية في طرف طوقها الجلدي. في الوقت ذاته، تظهر شاشة السيستم تومض بتحذير أحمر داكن.",
        image: "/src/assets/images/manhwa_valeria_eyes_1790512590343.jpg",
        bubbles: [
          {
            id: "b_kt2",
            speaker: "السيستم (The System)",
            type: "system",
            text: "«[رصد تهديد وشيك]: ساطور الجلاد مشحون بمادة كاوية للأثير. أمامك 3 ثوانٍ قبل أن يلتفت نحوك.»",
            avatarColor: "border-cyan-400"
          }
        ]
      }
    ],
    systemHologram: {
      type: "critical",
      title: "قيد ميكانيكي نشط",
      protocolNumber: "SHACKLE-ALERT // LEVEL 3",
      warningVoice: "«نسبة الأكسجين تنخفض. أي خطأ في فك القفل سيؤدي إلى بتر طرفي.»"
    },
    choices: [
      {
        id: "kitch_c1",
        tacticType: "دهاء ومناورة",
        text: "فك قفل السلسلة بهدوء باستخدام دبوس الشعر أثناء ضربة الساطور التالية (استهلاك 1 AP)",
        apCost: 1,
        suspicionDelta: -5,
        trustDelta: 5,
        nextSceneId: "kitchen_unlock",
        systemAlert: "[تنبيه النظام: مهارة لص محترفة · كسر القيد دون إثارة صوت · استهلاك 1 AP]"
      },
      {
        id: "kitch_c2",
        tacticType: "هجوم مباغت",
        text: "ركل صمام البخار النحاسي بكل قوتك لإطلاق سحابة حارقة تعمي الجزار (استهلاك 1 AP)",
        apCost: 1,
        suspicionDelta: 15,
        trustDelta: -5,
        nextSceneId: "kitchen_steam_blast",
        systemAlert: "[تنبيه النظام: انفجار بخار عشوائي · ذعر الجلاد وعمى مؤقت · ارتفاع الشك (+15%)]"
      },
      {
        id: "kitch_c3",
        tacticType: "تسلل هادئ",
        text: "كتم الأنفاس والتظاهر بالموت للتنصت على حوار الضابط الواقف عند الباب",
        apCost: 0,
        suspicionDelta: -10,
        trustDelta: 10,
        nextSceneId: "kitchen_eavesdrop",
        systemAlert: "[تنبيه النظام: تنصت استخباراتي ناجح · كشف موقع العقد في برج الساعة]"
      }
    ]
  },

  kitchen_unlock: {
    id: "kitchen_unlock",
    originId: "kitchen",
    chapter: "الفصل 0: العقد · مطبخ القلعة",
    title: "خطوات فوق شحم الموت",
    cameraDirection: "[Close-up tracking: فاليريا ترفع السكين الفولاذي الطويل بحركة انسيابية صامتة]",
    image: "/src/assets/images/valeria_prison_kitchen_1790511437527.jpg",
    panels: [
      {
        id: "p_ku_1",
        panelNumber: "لوحة 01",
        cameraType: "[Silhouette Shot — لقطة ظلية درامية]",
        lighting: "شبح فاليريا يرتفع من على الطاولة كنصل أسود منبثق من الظلال.",
        sfx: "*تسلل بلا صوت: سسسسس*",
        actionDescription: "تنزلق الأصفاد وتستقر في قبضتها بلا صوت. تسحب سكين تقطيع فولاذياً لامعاً، وتلتقط رسالة مختومة من جيب معطف الجزار المعلق على الجدار.",
        image: "/src/assets/images/valeria_prison_kitchen_1790511437527.jpg",
        bubbles: [
          {
            id: "b_ku1",
            speaker: "فاليريا",
            type: "thought",
            text: "«'أمر تسليم الجثة إلى برج الساعة قبل دقات الثانية عشرة'... إذاً كرويل هناك بالفعل ينتظر إتمام العقد!»"
          }
        ]
      }
    ],
    choices: [
      {
        id: "ku_c1",
        tacticType: "تسلل هادئ",
        text: "التسلل عبر مصعد رفع الفحم نحو ساحة البرج الأثري (استهلاك 1 AP)",
        apCost: 1,
        suspicionDelta: -5,
        trustDelta: 10,
        nextSceneId: "clocktower_approach",
        systemAlert: "[تنبيه النظام: الهروب بنجاح · التوجه السري لبرج الساعة]"
      }
    ]
  },

  kitchen_steam_blast: {
    id: "kitchen_steam_blast",
    originId: "kitchen",
    chapter: "الفصل 0: العقد · مطبخ القلعة",
    title: "جحيم المراجل النحاسية",
    cameraDirection: "[Shaky Cam: الكاميرا تهتز بعنف مع انفجار ماسورة البخار والضباب الأبيض يبتلع اللوحة]",
    image: "/src/assets/images/valeria_prison_kitchen_1790511437527.jpg",
    panels: [
      {
        id: "p_ks_1",
        panelNumber: "لوحة 01",
        cameraType: "[Full Smoke Frame — لقطة ضبابية مغمورة بالبخار]",
        lighting: "ألسنة البخار الأبيض الحارق تعكس وهج ألسنة اللهب الأحمر من الموقد.",
        sfx: "*انفجار الصمام: فششششششششششش! · صرخة الجلاد: آآآآآرغ!*",
        actionDescription: "يرتد الجزار ممسكاً بوجهه المحروق وهو يسقط فوق قدور الحساء المغلية. فاليريا تحطم بقية الروابط بقضيب حديدي وتندفع عبر باب الطوارئ الخلفي.",
        image: "/src/assets/images/valeria_prison_kitchen_1790511437527.jpg",
        bubbles: [
          {
            id: "b_ks1",
            speaker: "طاهي السجن",
            type: "shout",
            text: "«أغلقوا البوابات! الشيطانة تفلت من المطبخ!»"
          }
        ]
      }
    ],
    choices: [
      {
        id: "ks_c1",
        tacticType: "هجوم مباغت",
        text: "الاندفاع نحو ممر الأبراج قبل وصول التعزيزات (استهلاك 1 AP)",
        apCost: 1,
        suspicionDelta: 10,
        trustDelta: 5,
        nextSceneId: "clocktower_approach",
        systemAlert: "[تنبيه النظام: اختراق بوابات الخدمة · التوجه المباشر نحو برج الساعة]"
      }
    ]
  },

  kitchen_eavesdrop: {
    id: "kitchen_eavesdrop",
    originId: "kitchen",
    chapter: "الفصل 0: العقد · مطبخ القلعة",
    title: "أسرار في عتمة الشحم",
    cameraDirection: "[Extreme Close-up: عين فاليريا ترصد النقيب كرويل عبر فتحة القناع الجلدي]",
    image: "/src/assets/images/manhwa_valeria_eyes_1790512590343.jpg",
    panels: [
      {
        id: "p_ke_1",
        panelNumber: "لوحة 01",
        cameraType: "[Dutch Tilt Close-up — زاوية مائلة مقربة]",
        lighting: "ضوء مصباح الكيروسين يتأرجح على وجه النقيب كرويل الشاحب ذي الندبة المستعرضة.",
        sfx: "*همس خافت · صرير تبغ الغليون المحترق*",
        actionDescription: "النقيب ينفث دخان غليونه فوق وجه فاليريا المتظاهرة بالإغماء. يتحدث بنبرة مقتضبة وحاسمة مع الجزار.",
        image: "/src/assets/images/manhwa_crowley_confrontation_1790512601057.jpg",
        bubbles: [
          {
            id: "b_ke1",
            speaker: "النقيب كرويل",
            type: "speech",
            text: "«إذا لم توقّع العقد الليلة بدمها، فإن اللورد سيباستيان سيفجر شريان الطاقة في المدينة بأسرها. تأكد من شل أطرافها.»"
          },
          {
            id: "b_ke2",
            speaker: "فاليريا",
            type: "thought",
            text: "«إذاً هم يرتجفون خوفاً من دمي أكثر مما أرتجف أنا من سكاكينهم... حان وقت استرداد السيطرة.»"
          }
        ]
      }
    ],
    choices: [
      {
        id: "ke_c1",
        tacticType: "هجوم مباغت",
        text: "النهوض المباغت وخنق الجزار بالسلسلة بعد خروج النقيب (استهلاك 1 AP)",
        apCost: 1,
        suspicionDelta: -5,
        trustDelta: 15,
        nextSceneId: "kitchen_unlock",
        systemAlert: "[تنبيه النظام: تنفيذ صامت ومميت · إخلاء المطبخ بنجاح]"
      }
    ]
  },

  // ===================== ORIGIN 3: THE SANITARIUM =====================
  sanitarium_start: {
    id: "sanitarium_start",
    originId: "sanitarium",
    chapter: "الفصل 0: العقد · اللوحة الافتتاحية الثالثة",
    title: "برودة الزنك ومبضع المشرحة",
    cameraDirection: "[Point of View Shot: الرؤية ضبابية زرقاء، يظهر فيها وجه الدكتور فون فاين متدلياً فوقك بمبضع جراحي لامع]",
    image: "/src/assets/images/valeria_sanitarium_morgue_1790511448173.jpg",
    panels: [
      {
        id: "p_sn_1",
        panelNumber: "لوحة 01",
        cameraType: "[POV Shot — منظور الرؤية الشخصية]",
        lighting: "ضوء القمر الأزرق يخترق نافذة غوطية ضخمة تكسوها قضبان الحديد والثلج.",
        sfx: "*صوت احتكاك مبضع فضي بصينية معدنية: تشششش-رينغ!*",
        actionDescription: "الكفن الأبيض ينزاح ببطء عن وجه فاليريا. الدكتور فون فاين، رجل عجوز ذو عينين زجاجيتين ومئزر ملطخ بالمواد الكيميائية، يرفع مبضعه متجهاً نحو تجويف رقبتها.",
        image: "/src/assets/images/valeria_sanitarium_morgue_1790511448173.jpg",
        bubbles: [
          {
            id: "b_sn1",
            speaker: "الدكتور فون فاين",
            type: "whisper",
            text: "«شريان أثيري نقي... لم أرَ تدفقاً دموياً كهذا منذ تشريح الدوق الأكبر. لن تشعري بأي ألم يا آنستي، فالموتى لا يصرخون.»"
          }
        ]
      },
      {
        id: "p_sn_2",
        panelNumber: "لوحة 02",
        cameraType: "[Extreme Close-up — لقطة مقربة فائقة للحدقة القرمزية]",
        lighting: "شاشة السيستم تنبثق في الفراغ بين وجه الطبيب والمبضع بوميض ياقوتي شرس.",
        sfx: "*توقف مفاجئ لنبضات جهاز رصد الحياة: بييييييييب!*",
        actionDescription: "فاليريا تفتح عينيها فجأة. التوهج القرمزي في عينيها يضيء عظام وجه الطبيب المذهول، بينما تجمدت يده في منتصف الهواء.",
        image: "/src/assets/images/manhwa_valeria_eyes_1790512590343.jpg",
        bubbles: [
          {
            id: "b_sn2",
            speaker: "السيستم (The System)",
            type: "system",
            text: "«[بروتوكول الشذوذ الأثيري نشط]: تم تخدير جهاز المناعة لـ 60 ثانية. المبضع الفضي يحتوي على نسبة نقاء 92%، مثالي لنقض أختام العقد.»",
            avatarColor: "border-cyan-400"
          }
        ]
      }
    ],
    systemHologram: {
      type: "critical",
      title: "تنبيه تشريح حي",
      protocolNumber: "BIO-HAZARD // MORGUE",
      warningVoice: "«المبضع يقترب من الشريان السباتي. انتزاع السلاح هو الخيار الوحيد لتجنب التلف العصبي.»"
    },
    choices: [
      {
        id: "san_c1",
        tacticType: "هجوم مباغت",
        text: "انتزاع معصم الطبيب ببرود ووضع نصل المبضع تحت حنجرته (استهلاك 1 AP)",
        apCost: 1,
        suspicionDelta: 5,
        trustDelta: 5,
        nextSceneId: "sanitarium_scalpel",
        systemAlert: "[تنبيه النظام: شل حركة الطبيب الشرعي · استرجاع السيطرة على الغرفة]"
      },
      {
        id: "san_c2",
        tacticType: "دهاء ومناورة",
        text: "ركل منضدة الإيثر الكيميائي لإشعال حريق أزرق يعطل الحرس في الردهة (استهلاك 1 AP)",
        apCost: 1,
        suspicionDelta: 15,
        trustDelta: -5,
        nextSceneId: "sanitarium_fire",
        systemAlert: "[تنبيه النظام: حريق كيميائي · تصاعد أعمدة الدخان الأزرق · زيادة الشك (+15%)]"
      },
      {
        id: "san_c3",
        tacticType: "استدعاء سحري",
        text: "محاكاة غيبوبة الموت وإطلاق هالة رعب دموية تجبر الطبيب على التراجع مرتجفاً",
        apCost: 0,
        suspicionDelta: 10,
        trustDelta: 10,
        nextSceneId: "sanitarium_bluff",
        systemAlert: "[تنبيه النظام: ترويع نفسي ناجح · إرباك حرس المشرحة]"
      }
    ]
  },

  sanitarium_scalpel: {
    id: "sanitarium_scalpel",
    originId: "sanitarium",
    chapter: "الفصل 0: العقد · المشرحة",
    title: "مبضع تحت الحنجرة الباردة",
    cameraDirection: "[Extreme Close-up: قطرة دم باردة تنزلق على عنق الدكتور فون فاين تحت ضغط المبضع]",
    image: "/src/assets/images/valeria_sanitarium_morgue_1790511448173.jpg",
    panels: [
      {
        id: "p_sc_1",
        panelNumber: "لوحة 01",
        cameraType: "[Tension Close-up — لقطة توتر مقربة]",
        lighting: "ظلال قاسية تقسم وجه فاليريا إلى نصف مضاء بضوء القمر ونصف غارق في العتمة.",
        sfx: "*شهقة الطبيب المكتومة: غـ... غاه!*",
        actionDescription: "فاليريا تجلس على منضدة الزنك واضعة شفرة المبضع على الشريان السباتي للطبيب. عيناها لا ترمشان، بينما الحارس الواقف عند الباب يرفع مسدسه البخاري بتردد قاتل.",
        image: "/src/assets/images/valeria_sanitarium_morgue_1790511448173.jpg",
        bubbles: [
          {
            id: "b_sc1",
            speaker: "فاليريا",
            type: "speech",
            text: "«حركة واحدة خاطئة من إصبعك على الزناد، وسأفتح شريان طبيبك المفضل كأنه صنبور ماء صدئ. أين نسخة العقد 0؟!»",
            avatarColor: "border-rose-600"
          },
          {
            id: "b_sc2",
            speaker: "الدكتور فون فاين",
            type: "whisper",
            text: "«في... في حقيبة اللورد في برج الساعة الأثري! أقسم بروح الإمبراطور أنني كنت أنفذ الأوامر فقط!»"
          }
        ]
      }
    ],
    choices: [
      {
        id: "sc_c1",
        tacticType: "تسلل هادئ",
        text: "أخذ معطف الطبيب الأبيض وتجريد الحارس من سلاحه، ثم التسلل لبرج الساعة (استهلاك 1 AP)",
        apCost: 1,
        suspicionDelta: -10,
        trustDelta: 15,
        nextSceneId: "clocktower_approach",
        systemAlert: "[تنبيه النظام: تنكر طبي ناجح · الحصول على 'مبضع فضي أثيري' · التوجه لبرج الساعة]"
      }
    ]
  },

  sanitarium_fire: {
    id: "sanitarium_fire",
    originId: "sanitarium",
    chapter: "الفصل 0: العقد · المشرحة",
    title: "ألسنة الأثير الأزرق",
    cameraDirection: "[Wide Angle Action: فاليريا تقفز عبر الزجاج المكسور وسط ألسنة لهب أزرق كيميائي]",
    image: "/src/assets/images/valeria_sanitarium_morgue_1790511448173.jpg",
    panels: [
      {
        id: "p_sf_1",
        panelNumber: "لوحة 01",
        cameraType: "[Action Jump Shot — قفزة حركية درامية]",
        lighting: "انفجار كيميائي يملأ الغرفة بلهب أزرق كوبالتي، وشظايا الزجاج تتطاير كالمطر.",
        sfx: "*انفجار كيميائي: فوااااش! · تحطم زجاج النافذة: كرااااش!*",
        actionDescription: "تتحطم قوارير الإيثر وتشتعل الأرضية برداء ناري أزرق. فاليريا تخترق النافذة الغوطية بركلة حاسمة وتقفز نحو سطح المبنى المجاور تحت المطر الليلي.",
        image: "/src/assets/images/valeria_sanitarium_morgue_1790511448173.jpg",
        bubbles: [
          {
            id: "b_sf1",
            speaker: "حرس المشرحة",
            type: "shout",
            text: "«المشرحة تحترق! أطلقوا صافرات الطوارئ نحو برج المراقبة!»"
          }
        ]
      }
    ],
    choices: [
      {
        id: "sf_c1",
        tacticType: "دهاء ومناورة",
        text: "الركض عبر أسطح القرميد المبللة باتجاه عقارب برج الساعة العملاقة (استهلاك 1 AP)",
        apCost: 1,
        suspicionDelta: 10,
        trustDelta: 5,
        nextSceneId: "clocktower_approach",
        systemAlert: "[تنبيه النظام: هروب بهلواني فوق الأسطح الفيكتورية · الاقتراب من برج الساعة]"
      }
    ]
  },

  sanitarium_bluff: {
    id: "sanitarium_bluff",
    originId: "sanitarium",
    chapter: "الفصل 0: العقد · المشرحة",
    title: "شبح الدم المحرم",
    cameraDirection: "[Extreme Close-up: عينا فاليريا تشتعلان باللون القرمزي والدكتور يرتعش ويسقط على ركبتيه]",
    image: "/src/assets/images/manhwa_valeria_eyes_1790512590343.jpg",
    panels: [
      {
        id: "p_sb_1",
        panelNumber: "لوحة 01",
        cameraType: "[Horror Chiaroscuro — إضاءة رعب تباينية]",
        lighting: "ظلال الغرفة تطول كأذرع وحوش، وضوء العينين يشق الظلام بلون الدم الطازج.",
        sfx: "*صرير عظام يتصلب · صدمة ورعب: شهقة!*",
        actionDescription: "فاليريا تنهض ببطء مخيف كأن جسدها يطفو. رائحة الأثير المركز تملأ القاعة، وحراس المشرحة يتراجعون مرتجفين ظناً منهم أنها تحولت إلى طفرة دموية خالدة.",
        image: "/src/assets/images/manhwa_valeria_eyes_1790512590343.jpg",
        bubbles: [
          {
            id: "b_sb1",
            speaker: "الدكتور فون فاين",
            type: "shout",
            text: "«إنها... إنها سلالة الأفعى الملكية! النجدة! لا تقتربوا منها!»"
          }
        ]
      }
    ],
    choices: [
      {
        id: "sb_c1",
        tacticType: "تسلل هادئ",
        text: "استغلال ذعرهم والخروج من الباب الرئيسي نحو عربة الخيل المتجهة لبرج الساعة (استهلاك 1 AP)",
        apCost: 1,
        suspicionDelta: -5,
        trustDelta: 10,
        nextSceneId: "clocktower_approach",
        systemAlert: "[تنبيه النظام: ترويع نفسي متقن · استقلال عربة كرويل نحو برج الساعة]"
      }
    ]
  },

  // ===================== CONVERGENCE: THE CLOCKTOWER CONFRONTATION =====================
  clocktower_approach: {
    id: "clocktower_approach",
    chapter: "الفصل 0: العقد · ملتقى التروس والعقارب",
    title: "المواجهة الكبرى أمام برج الساعة الأثري",
    cameraDirection: "[Extreme High Angle ➔ Low Angle Pan: الكاميرا تهبط من قمة عقارب الساعة العملاقة لتستقر أمام وجه اللورد سيباستيان كرويل]",
    image: "/src/assets/images/manhwa_crowley_confrontation_1790512601057.jpg",
    panels: [
      {
        id: "p_cl_1",
        panelNumber: "لوحة 01",
        cameraType: "[Monumental Wide Angle — لقطة واسعة معمارية مهيبة]",
        lighting: "برج حديدي أسود يرتفع لمئات الأمتار وسط الضباب. عقارب الساعة العملاقة من البرونز تئز بصوت كئيب، وتدور للخلف بدقة الثواني.",
        sfx: "*تكتكة التروس الضخمة: دونغ... كلاك... دونغ! · هسهسة غلايات البرج: فشششش*",
        actionDescription: "أمام مدخل البرج الحديدي المزخرف بنقوش الأفاعي والتروس، يقف اللورد سيباستيان كرويل. معطفه الصوفي الأسود مبلل بالأمطار، ويرتدي مونوكلاً نحاسياً يلمع فيه وميض أزرق كاشف للأثير. حوله أربعة من حراس النخبة المشحونين بالبخار.",
        image: "/src/assets/images/manhwa_crowley_confrontation_1790512601057.jpg",
        bubbles: [
          {
            id: "b_cl1",
            speaker: "اللورد سيباستيان كرويل",
            type: "speech",
            text: "«أهنئكِ يا فاليريا... تجاوزتِ الفخاخ الثلاثة كما توقعت تماماً. لكن لا فائدة من الهرب بعد الآن. طاولة العقد أمامكِ، ودمكِ هو المفتاح الوحيد لتشغيل آلة أوربوروس.»"
          }
        ]
      },
      {
        id: "p_cl_2",
        panelNumber: "لوحة 02",
        cameraType: "[Medium Shot — لقطة متوسطة لمنضدة العقد]",
        lighting: "منضدة حجرية سوداء يتوسطها رق جلدي قديم ينبض بنقوش محفورة بحبر ياقوتي سحري.",
        sfx: "*نبض شرياني سحري: زوووم... زوووم*",
        actionDescription: "على المنضدة الحجرية، ترقد رقعة 'العقد 0'. شفرة فولاذية صغيرة مغروسة بجانبها لسحب الدم. في سقف البرج، تدور تروس الساعة الرئيسية متصلة بكابلات نحاسية ضخمة تشع حرارة هائلة.",
        image: "/src/assets/images/valeria_hero_contract_1790511414037.jpg",
        bubbles: [
          {
            id: "b_cl2",
            speaker: "السيستم (The System)",
            type: "system",
            text: "«[تنبيه بروتوكول مصيري]: اللورد كرويل يحمل كود التعطيل. توقيع العقد يمنحك البقاء ولكن يستعبدك كوكيل رسمي. تدمير الترس يعني الفوضى التامة... وإعادة صياغة البند الرابع تتطلب دمج دمكِ في قلب المحرك مباشرة.»",
            avatarColor: "border-cyan-400"
          },
          {
            id: "b_cl3",
            speaker: "فاليريا",
            type: "thought",
            text: "«هذه اللحظة التي استيقظت لأجلها... إما أن أكون خادمة لمجلس اللوردات، أو متمردة طريدة، أو سيدة لهذه الإمبراطورية اللعينة بأكملها!»"
          }
        ]
      }
    ],
    systemHologram: {
      type: "mandate",
      title: "نافذة القرار الحاسم — العقد 0",
      protocolNumber: "CONVERGENCE // FINAL STAGE",
      warningVoice: "«الوقت ينفد. عقارب الساعة تقترب من منتصف الليل. اختاري مصيركِ الآن!»",
      countdownSeconds: 15
    },
    choices: [
      {
        id: "converg_sign",
        tacticType: "دهاء ومناورة",
        text: "توقيع العقد 0 بدمك كما يطلب كرويل (مسار الخضوع الإستراتيجي والولاء للتاج)",
        apCost: 1,
        suspicionDelta: -30,
        trustDelta: 40,
        nextSceneId: "ending_thrall",
        systemAlert: "[تنبيه النظام: توقيع العقد رسمياً · ارتفاع نسبة الثقة (+40%) · انخفاض الشك (-30%)]"
      },
      {
        id: "converg_rebel",
        tacticType: "هجوم مباغت",
        text: "إلقاء الخنجر الفضي في قلب ترس الساعة الأثري وتفجير صمام البخار (مسار التمرد الصامت)",
        apCost: 2,
        suspicionDelta: 40,
        trustDelta: -20,
        nextSceneId: "ending_heretic",
        systemAlert: "[تنبيه النظام: إعلان تمرد مباشر! · انهيار مصفوفة الانضباط · ارتفاع الشك (+40%)]"
      },
      {
        id: "converg_hack",
        tacticType: "استدعاء سحري",
        text: "سكب الدم في غرفة احتراق التروس ودمج طاقة السيستم لاحتلال البرج بالكامل (مسار سيدة التروس)",
        apCost: 3,
        suspicionDelta: 20,
        trustDelta: 25,
        nextSceneId: "ending_mastermind",
        requirement: { minAP: 2 },
        systemAlert: "[تنبيه النظام: استيلاء سيادي أعلى! · تعديل بنود العقد وتحويل السيستم لخادم مطلق!]"
      }
    ]
  },

  // ===================== MANHWA CLIMAX ENDINGS =====================
  ending_thrall: {
    id: "ending_thrall",
    chapter: "الفصل 0: الخاتمة · اللوحة الأخيرة (المسار أ)",
    title: "الخاتمة: العبدة المختارة (The Chosen Thrall)",
    cameraDirection: "[Slow Zoom Out: فاليريا تقف بجانب كرويل وترتدي خاتم الذهب الأسود، وخلفهما برج الساعة يضيء بالأزرق الملكي]",
    image: "/src/assets/images/valeria_hero_contract_1790511414037.jpg",
    panels: [
      {
        id: "p_th_1",
        panelNumber: "لوحة النهاية 01",
        cameraType: "[Regal Chiaroscuro — لقطة أرستقراطية تباينية]",
        lighting: "وهج أزرق ملكي بارد يغمر منصة العقد، وشاشات السيستم تصفق بنبضات هادئة متسقة.",
        sfx: "*توقيع العقد: صرير ريشة فضية مبللة بالدم*",
        actionDescription: "فاليريا تغمس إصبعها في الحبر الياقوتي وتختم الرق الأسود. اللورد كرويل ينحني برأسه مبتسماً ببرود مميت. وشم معصمها يتحول من اللون الأحمر إلى اللون الذهبي المعتم.",
        image: "/src/assets/images/valeria_hero_contract_1790511414037.jpg",
        bubbles: [
          {
            id: "b_th1",
            speaker: "اللورد سيباستيان كرويل",
            type: "speech",
            text: "«أحسنتِ الاختيار يا ابنتي... الآن أصبحتِ سيف التاج الخفي في عتمة المصانع.»"
          },
          {
            id: "b_th2",
            speaker: "السيستم (The System)",
            type: "system",
            text: "«[تمت المصادقة]: الوكيل فاليريا مسجلة الآن تحت إشراف وزارة التعدين. استعدي... الفصل الأول سيبدأ مع بزوغ أول شعاع شمس كيميائي.»",
            avatarColor: "border-cyan-400"
          }
        ]
      }
    ],
    isEnding: true,
    endingType: "النهاية الرسمية: العبدة المختارة (Trust Dominance)",
    choices: [
      {
        id: "restart_a",
        text: "إعادة التجربة واستكشاف مسار مانهوا بديل (الهاوية / المشرحة / المطبخ)",
        apCost: 0,
        suspicionDelta: 0,
        trustDelta: 0,
        nextSceneId: "intro_selection"
      }
    ]
  },

  ending_heretic: {
    id: "ending_heretic",
    chapter: "الفصل 0: الخاتمة · اللوحة الأخيرة (المسار ب)",
    title: "الخاتمة: المتمردة الصامتة (The Silent Heretic)",
    cameraDirection: "[Dynamic Explosion Shot: شظايا التروس البرونزية تتطاير في الهواء كالمطر الناري، وفاليريا تركض نحو الظلال]",
    image: "/src/assets/images/valeria_abyss_chasm_1790511426163.jpg",
    panels: [
      {
        id: "p_he_1",
        panelNumber: "لوحة النهاية 02",
        cameraType: "[Chaos Wide Action — لقطة فوضى حركية واسعة]",
        lighting: "لهب برتقالي حارق وانفجار غازي يضيء أفق المدينة الصناعية بأكملها.",
        sfx: "*تحطم قلب الساعة الأثرية: كراااااش-بووووم! · رنين شظايا البرونز*",
        actionDescription: "الخنجر الفضي يخترق قلب الترس الأكبر. تتوقف عقارب الساعة للمرة الأولى منذ قرن كامل، وتتصاعد أعمدة البخار لتغطي هروب فاليريا نحو أزقة العاصمة. في يدها، شظية ممزقة من العقد 0 تحمل توقيعها غير المكتمل.",
        image: "/src/assets/images/valeria_abyss_chasm_1790511426163.jpg",
        bubbles: [
          {
            id: "b_he1",
            speaker: "اللورد كرويل",
            type: "shout",
            text: "«اللعنة عليها! قتلت قلب الإمبراطورية! أحرقوا المدينة بأكملها ولا تدعوها تعيش!»"
          },
          {
            id: "b_he2",
            speaker: "السيستم (The System)",
            type: "system",
            text: "«[حالة شذوذ كبرى]: رُصدت خيانة كاملة للبروتوكول. مؤشر الشك: 100%. أنتِ الآن العدوة رقم 0 في سجلات التاج... ولتكن المطاردة دموية يا فاليريا.»",
            avatarColor: "border-rose-600"
          }
        ]
      }
    ],
    isEnding: true,
    endingType: "النهاية المتمردة: المتمردة الصامتة (High Suspicion & Anomaly)",
    choices: [
      {
        id: "restart_b",
        text: "إعادة التجربة وخوض اختبارات القدر المختلفة",
        apCost: 0,
        suspicionDelta: 0,
        trustDelta: 0,
        nextSceneId: "intro_selection"
      }
    ]
  },

  ending_mastermind: {
    id: "ending_mastermind",
    chapter: "الفصل 0: الخاتمة · اللوحة الأخيرة (المسار ج)",
    title: "الخاتمة الكبرى: سيدة الدماء والتروس (Lady of Blood & Cogs)",
    cameraDirection: "[Epic Low Angle Hero Shot: فاليريا تقف فوق قمة منصة الساعة وعيونها تتوهج بوهج أثيري مطلق، والجميع يركعون]",
    image: "/src/assets/images/manhwa_valeria_eyes_1790512590343.jpg",
    panels: [
      {
        id: "p_mm_1",
        panelNumber: "لوحة النهاية 03",
        cameraType: "[Epic Sovereign Frame — لقطة سيادية ملحمية]",
        lighting: "أشعة هولوغرامية قرمزية تغطي قبة السماء الفيكتورية، وكل أضواء المدينة تخضع لنبض شريان فاليريا.",
        sfx: "*هدير آلاف التروس الخاضعة: زوووووم-كليك! · سقوط أسلحة الحرس*",
        actionDescription: "دم فاليريا يتدفق مباشرة في حجرة التقطير الأثيرية. التروس تعيد تشغيل نفسها ولكن في الاتجاه المعاكس. السيستم ينهار برمجياً ثم يعيد بناء نفسه بلون أحمر ملكي مهيب. اللورد كرويل يسقط على ركبتيه شاحباً كالموتى عاجزاً عن الحراك تحت وطأة الضغط الأثيري.",
        image: "/src/assets/images/manhwa_valeria_eyes_1790512590343.jpg",
        bubbles: [
          {
            id: "b_mm1",
            speaker: "السيستم (The System)",
            type: "system",
            text: "«[إعادة ضبط الإشراف السيادي]: تم مسح صلاحيات مجلس اللوردات. المضيفة 'فاليريا' هي المشرفة العليا الوحيدة على رقعة أوربوروس. نحن نأتمر بأمركِ يا مولاتي.»",
            avatarColor: "border-rose-500"
          },
          {
            id: "b_mm2",
            speaker: "فاليريا",
            type: "speech",
            text: "«ارفع رأسك يا كرويل... عقارب الساعة لا تدور لمصلحتك بعد الآن. أنا هي العقد، وأنا هي الإمبراطورية.»",
            avatarColor: "border-rose-600"
          }
        ]
      }
    ],
    isEnding: true,
    endingType: "النهاية الكبرى: سيدة الدماء والتروس (Sovereign Mastermind Ending)",
    choices: [
      {
        id: "restart_c",
        text: "إعادة التجربة واستكشاف البدايات الأخرى",
        apCost: 0,
        suspicionDelta: 0,
        trustDelta: 0,
        nextSceneId: "intro_selection"
      }
    ]
  }
};
