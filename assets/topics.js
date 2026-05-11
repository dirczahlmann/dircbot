// ============== TOPICS & SUGGESTED QUESTIONS ==============
// Each topic has:
// - id (matches KB context)
// - icon (SVG path)
// - name (3 langs)
// - intro (3 langs - shown when topic clicked)
// - suggestions (4 items, 3 langs each)

const TOPICS = [
  {
    id: 'sales',
    icon: 'M3 3h18v18H3z M7 17l4-4 3 3 5-6',
    color: '#e8420a',
    name: {
      en: 'Sales & Closing',
      de: 'Vertrieb & Closing',
      es: 'Ventas & Cierre'
    },
    intro: {
      en: 'Sales is decision architecture. Pick a question — let\'s go.',
      de: 'Vertrieb ist Entscheidungs-Architektur. Wähl eine Frage — los geht\'s.',
      es: 'Las ventas son arquitectura de decisión. Elige una pregunta — empecemos.'
    },
    suggestions: [
      {
        en: 'My prospect said "I need to think about it." What now?',
        de: 'Mein Interessent sagt "Ich muss nachdenken." Was tun?',
        es: 'Mi prospecto dijo "Necesito pensarlo". ¿Qué hago?'
      },
      {
        en: 'How do I structure a closing script that actually works?',
        de: 'Wie strukturiere ich ein Closing-Script das wirklich funktioniert?',
        es: '¿Cómo estructuro un guión de cierre que realmente funcione?'
      },
      {
        en: 'The top 3 objections in sales and how to handle them',
        de: 'Die Top 3 Einwände im Vertrieb und wie ich sie löse',
        es: 'Las 3 objeciones principales en ventas y cómo resolverlas'
      },
      {
        en: 'Explain the 3-list method for sales pipeline',
        de: 'Erklär mir die 3-Listen-Methode für meine Pipeline',
        es: 'Explícame el método de 3 listas para mi pipeline'
      }
    ]
  },
  {
    id: 'crypto',
    icon: 'M12 1v22 M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6',
    color: '#f7931a',
    name: {
      en: 'Crypto & Blockchain',
      de: 'Crypto & Blockchain',
      es: 'Crypto & Blockchain'
    },
    intro: {
      en: 'Crypto without the noise. Frameworks I actually use.',
      de: 'Crypto ohne den Lärm. Frameworks die ich wirklich nutze.',
      es: 'Crypto sin el ruido. Frameworks que realmente uso.'
    },
    suggestions: [
      {
        en: 'Should I DCA into Bitcoin at this level?',
        de: 'Soll ich auf diesem Level in Bitcoin DCA-en?',
        es: '¿Debería hacer DCA en Bitcoin a este nivel?'
      },
      {
        en: 'Explain the 3-layer DCA strategy',
        de: 'Erklär die 3-Layer DCA-Strategie',
        es: 'Explica la estrategia DCA de 3 capas'
      },
      {
        en: 'How do I read crypto market cycles?',
        de: 'Wie lese ich Crypto-Markt-Zyklen?',
        es: '¿Cómo leo los ciclos del mercado crypto?'
      },
      {
        en: 'Crypto taxes in Switzerland — what do I need to know?',
        de: 'Crypto-Steuern in der Schweiz — was muss ich wissen?',
        es: 'Impuestos crypto en Suiza — ¿qué debo saber?'
      }
    ]
  },
  {
    id: 'wealth',
    icon: 'M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5',
    color: '#c9a84c',
    name: {
      en: 'Wealth & Family Office',
      de: 'Wealth & Family Office',
      es: 'Patrimonio & Family Office'
    },
    intro: {
      en: 'Wealth that lasts generations. Real strategies, not slogans.',
      de: 'Wealth der über Generationen hält. Echte Strategien, keine Slogans.',
      es: 'Patrimonio que dura generaciones. Estrategias reales, no eslóganes.'
    },
    suggestions: [
      {
        en: 'How do I structure my asset allocation?',
        de: 'Wie strukturiere ich meine Asset-Allocation?',
        es: '¿Cómo estructuro mi asignación de activos?'
      },
      {
        en: 'When do I actually need a family office?',
        de: 'Ab wann brauche ich wirklich ein Family Office?',
        es: '¿Cuándo necesito realmente una family office?'
      },
      {
        en: 'Explain the 4-quadrant wealth method',
        de: 'Erklär mir die 4-Quadranten-Methode',
        es: 'Explícame el método de 4 cuadrantes'
      },
      {
        en: 'Asset protection: where do I start?',
        de: 'Vermögen schützen: Wo fange ich an?',
        es: 'Protección de activos: ¿por dónde empiezo?'
      }
    ]
  },
  {
    id: 'network',
    icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
    color: '#3a78b8',
    name: {
      en: 'Network Marketing',
      de: 'Network Marketing',
      es: 'Network Marketing'
    },
    intro: {
      en: 'Network marketing done right. Sustainable, not pyramid-shaped.',
      de: 'Network Marketing richtig gemacht. Nachhaltig, kein Schneeballsystem.',
      es: 'Network marketing bien hecho. Sostenible, no piramidal.'
    },
    suggestions: [
      {
        en: 'How do I build a sustainable team that stays?',
        de: 'Wie baue ich ein nachhaltiges Team auf das bleibt?',
        es: '¿Cómo construyo un equipo sostenible que se quede?'
      },
      {
        en: 'Recruiting: what actually works in 2026?',
        de: 'Recruiting: Was funktioniert wirklich in 2026?',
        es: 'Reclutamiento: ¿qué funciona realmente en 2026?'
      },
      {
        en: 'MLM recovery: how to restart after a stall',
        de: 'MLM-Recovery: Wie startet man nach Stillstand neu?',
        es: 'Recuperación MLM: cómo reiniciar tras un estancamiento'
      },
      {
        en: 'The 3-list method for network marketing',
        de: 'Die 3-Listen-Methode für Network Marketing',
        es: 'El método de 3 listas para network marketing'
      }
    ]
  },
  {
    id: 'tokenization',
    icon: 'M12 2L4 6v6c0 5 4 9 8 10 4-1 8-5 8-10V6l-8-4z M9 12l2 2 4-4',
    color: '#8b5cf6',
    name: {
      en: 'Tokenization',
      de: 'Tokenisierung',
      es: 'Tokenización'
    },
    intro: {
      en: 'Tokenization is eating finance. Here\'s where to position yourself.',
      de: 'Tokenisierung frisst Finance. Hier ist wie du dich positionierst.',
      es: 'La tokenización se está comiendo las finanzas. Aquí dónde posicionarte.'
    },
    suggestions: [
      {
        en: 'What is Real-World Asset (RWA) tokenization?',
        de: 'Was ist Real-World Asset (RWA) Tokenisierung?',
        es: '¿Qué es la tokenización de activos del mundo real (RWA)?'
      },
      {
        en: 'How do I tokenize real estate properly?',
        de: 'Wie tokenisiere ich Immobilien richtig?',
        es: '¿Cómo tokenizo bienes raíces correctamente?'
      },
      {
        en: 'Swiss legal framework for tokenization',
        de: 'Schweizer Legal Framework für Tokenisierung',
        es: 'Marco legal suizo para la tokenización'
      },
      {
        en: 'First steps to launching a token project',
        de: 'Erste Schritte für ein Token-Projekt',
        es: 'Primeros pasos para lanzar un proyecto token'
      }
    ]
  },
  {
    id: 'mindset',
    icon: 'M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5z M12 8v4 M12 16h.01',
    color: '#10b981',
    name: {
      en: 'Mindset & Leadership',
      de: 'Mindset & Leadership',
      es: 'Mentalidad & Liderazgo'
    },
    intro: {
      en: 'Your mindset is the operating system. Let\'s upgrade it.',
      de: 'Dein Mindset ist das Betriebssystem. Lass uns upgraden.',
      es: 'Tu mentalidad es el sistema operativo. Vamos a actualizarlo.'
    },
    suggestions: [
      {
        en: 'Build me a Decision-Making OS for entrepreneurs',
        de: 'Bau mir ein Decision-Making OS für Entrepreneure',
        es: 'Constrúyeme un OS de toma de decisiones para emprendedores'
      },
      {
        en: 'How do I break out of a business plateau?',
        de: 'Wie durchbreche ich einen Business-Stillstand?',
        es: '¿Cómo rompo una meseta empresarial?'
      },
      {
        en: 'Self-leadership in crisis moments',
        de: 'Selbstführung in Krisen-Momenten',
        es: 'Autoliderazgo en momentos de crisis'
      },
      {
        en: 'Mental models I use for scaling decisions',
        de: 'Mental Models die ich für Scaling-Entscheidungen nutze',
        es: 'Modelos mentales que uso para decisiones de escalado'
      }
    ]
  },
  {
    id: 'scaling',
    icon: 'M3 3v18h18 M7 15l4-4 4 4 6-6',
    color: '#f59e0b',
    name: {
      en: 'Business Build & Scale',
      de: 'Business Build & Scale',
      es: 'Construir & Escalar'
    },
    intro: {
      en: 'How I built 8 unicorns. The exact stages and triggers.',
      de: 'Wie ich 8 Unicorns gebaut habe. Die exakten Stufen und Trigger.',
      es: 'Cómo construí 8 unicornios. Las etapas y disparadores exactos.'
    },
    suggestions: [
      {
        en: 'Walk me through the 4 unicorn stages',
        de: 'Führ mich durch die 4 Unicorn-Stages',
        es: 'Guíame a través de las 4 etapas del unicornio'
      },
      {
        en: 'When is my business ready to scale?',
        de: 'Wann ist mein Business ready zum Skalieren?',
        es: '¿Cuándo está mi negocio listo para escalar?'
      },
      {
        en: 'Building a team for the next level',
        de: 'Team-Aufbau für die nächste Stufe',
        es: 'Construir un equipo para el siguiente nivel'
      },
      {
        en: 'Finding operational leverage points',
        de: 'Operative Hebel-Punkte finden',
        es: 'Encontrar puntos de apalancamiento operativo'
      }
    ]
  },
  {
    id: 'coaching',
    icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    color: '#ec4899',
    name: {
      en: 'Personal Coaching',
      de: 'Persönliches Coaching',
      es: 'Coaching Personal'
    },
    intro: {
      en: 'Where are you stuck? Let\'s find the exact next move.',
      de: 'Wo hängst du fest? Lass uns den genauen nächsten Move finden.',
      es: '¿Dónde estás atascado? Encontremos el próximo movimiento exacto.'
    },
    suggestions: [
      {
        en: 'Help me do an honest situation analysis',
        de: 'Hilf mir bei einer ehrlichen Standortbestimmung',
        es: 'Ayúdame a hacer un análisis honesto de mi situación'
      },
      {
        en: 'Translate my vision into a 90-day plan',
        de: 'Übersetz meine Vision in einen 90-Tage-Plan',
        es: 'Traduce mi visión a un plan de 90 días'
      },
      {
        en: 'Energy management for high-performers',
        de: 'Energie-Management für High-Performer',
        es: 'Gestión de energía para alto rendimiento'
      },
      {
        en: 'My first million: realistic roadmap',
        de: 'Meine erste Million: realistische Roadmap',
        es: 'Mi primer millón: hoja de ruta realista'
      }
    ]
  }
];

// ============== TESTER CODES (Variant A — frontend-only) ==============
// Each grants 500 messages stored in localStorage
// Easy to rotate — just edit this list and redeploy
const VALID_TESTER_CODES = [
  'DIRC500',           // Universal master code
  'DIRCBETA',          // Beta wave
  'DIRCINSIDER',       // Inner circle
  'LAUNCH2026',        // Launch campaign
  'UNICORN8',          // Inspired by Dirc's 8 unicorns
  'SALESGENT',         // Sales Gentleman reference
  'CRYPTO2011',        // Year Dirc started in crypto
  'TOKEN500',          // Tokenization theme
  'DZACADEMY',         // Academy reference
  'PRESALE500'         // Presale connection
];

const TESTER_MESSAGE_QUOTA = 500;
const FREE_MESSAGE_QUOTA = 3;
