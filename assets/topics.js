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
  },
  {
    id: 'ai',
    icon: 'M12 3l3 6 6 3-6 3-3 6-3-6-6-3 6-3z M19 2v3 M20.5 3.5h-3 M19 19v3 M20.5 20.5h-3',
    color: '#06b6d4',
    name: {
      en: 'AI for Business',
      de: 'KI fürs Business',
      es: 'IA para Negocios'
    },
    intro: {
      en: 'AI is a layer you build on, not a tool you use. Let\'s talk leverage.',
      de: 'KI ist eine Schicht auf der du baust, kein Tool das du nutzt. Lass uns über Hebel reden.',
      es: 'La IA es una capa sobre la que construyes, no una herramienta que usas. Hablemos de apalancamiento.'
    },
    suggestions: [
      {
        en: 'Which AI tools should I actually use in 2026?',
        de: 'Welche AI-Tools sollte ich 2026 wirklich nutzen?',
        es: '¿Qué herramientas de IA debo usar en 2026?'
      },
      {
        en: 'How do I use AI to 10x my sales output?',
        de: 'Wie 10xe ich meinen Sales-Output mit AI?',
        es: '¿Cómo uso IA para 10x mi output de ventas?'
      },
      {
        en: 'How do entrepreneurs make money with AI in 2026?',
        de: 'Wie verdienen Entrepreneure 2026 Geld mit AI?',
        es: '¿Cómo ganan dinero los emprendedores con IA en 2026?'
      },
      {
        en: 'What\'s the 4-step framework to plug AI into my business?',
        de: 'Was ist das 4-Schritte-Framework um AI in mein Business zu bauen?',
        es: '¿Cuál es el framework de 4 pasos para integrar IA en mi negocio?'
      }
    ]
  },
  {
    id: 'agentic',
    icon: 'M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M8.59 10.51l6.83-3.98 M15.41 17.49l-6.82-3.98',
    color: '#a855f7',
    name: {
      en: 'Agentic AI',
      de: 'Agentic AI',
      es: 'IA Agéntica'
    },
    intro: {
      en: 'ChatGPT answers. Agents act. The biggest opportunity since the internet.',
      de: 'ChatGPT antwortet. Agents handeln. Die größte Chance seit dem Internet.',
      es: 'ChatGPT responde. Los agentes actúan. La mayor oportunidad desde internet.'
    },
    suggestions: [
      {
        en: 'Which agentic AI framework should I pick (CrewAI, LangGraph, AutoGen)?',
        de: 'Welches Agentic-Framework passt zu mir (CrewAI, LangGraph, AutoGen)?',
        es: '¿Qué framework agéntico elijo (CrewAI, LangGraph, AutoGen)?'
      },
      {
        en: 'How do I build my first AI agent in 30 days?',
        de: 'Wie baue ich meinen ersten AI-Agent in 30 Tagen?',
        es: '¿Cómo construyo mi primer agente de IA en 30 días?'
      },
      {
        en: 'Best 7 business models to monetize AI agents',
        de: 'Die 7 besten Business-Modelle um AI-Agents zu monetarisieren',
        es: 'Los 7 mejores modelos de negocio para monetizar agentes IA'
      },
      {
        en: 'What is MCP (Model Context Protocol) and why does it matter?',
        de: 'Was ist MCP (Model Context Protocol) und warum ist das wichtig?',
        es: '¿Qué es MCP (Model Context Protocol) y por qué importa?'
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


// ============== DAILY TIPS (rotated per topic) ==============
// 7 tips per topic = one for each day of the week
// Date-hash chooses which tip shows, so same day = same tip
const DAILY_TIPS = {
  sales: [
    {
      en: { tip: "Closing isn't pushing. It's removing the last 5% of doubt.", action: "Pick one open lead. Ask: 'What would have to be true for you to say yes today?'" },
      de: { tip: "Closing ist kein Drücken. Es ist das Entfernen der letzten 5% Zweifel.", action: "Pick einen offenen Lead. Frag: 'Was müsste wahr sein, damit du heute zusagst?'" },
      es: { tip: "Cerrar no es presionar. Es eliminar el último 5% de duda.", action: "Elige un lead abierto. Pregunta: '¿Qué tendría que ser cierto para que digas sí hoy?'" }
    },
    {
      en: { tip: "Silence after the price is gold. Don't fill it.", action: "Today: say the price, then shut up. Count to 10 in your head." },
      de: { tip: "Stille nach dem Preis ist Gold. Füll sie nicht.", action: "Heute: Sag den Preis, dann schweig. Zähl im Kopf bis 10." },
      es: { tip: "El silencio después del precio es oro. No lo llenes.", action: "Hoy: di el precio, luego cállate. Cuenta hasta 10 mentalmente." }
    },
    {
      en: { tip: "Objections aren't rejection. They're data.", action: "List your top 3 objections. Write the perfect 30-sec answer to each." },
      de: { tip: "Einwände sind keine Ablehnung. Sie sind Daten.", action: "List deine Top-3 Einwände. Schreib die perfekte 30-Sek-Antwort zu jedem." },
      es: { tip: "Las objeciones no son rechazo. Son datos.", action: "Lista tus top 3 objeciones. Escribe la respuesta perfecta de 30 seg." }
    },
    {
      en: { tip: "Your follow-up rhythm wins more than your pitch.", action: "Check your pipeline. Anyone you haven't touched in 7+ days? Touch today." },
      de: { tip: "Dein Follow-up-Rhythmus gewinnt mehr als dein Pitch.", action: "Check deine Pipeline. Wen hast du 7+ Tage nicht erreicht? Heute touchen." },
      es: { tip: "Tu ritmo de seguimiento gana más que tu pitch.", action: "Revisa tu pipeline. ¿Alguien sin contacto 7+ días? Toca hoy." }
    },
    {
      en: { tip: "The 3-list method: hot, warm, cold. Work them differently every day.", action: "Spend 60min on hot list, 30min on warm, 15min on cold. Track it." },
      de: { tip: "3-Listen-Methode: heiß, warm, kalt. Arbeite sie täglich verschieden.", action: "60min auf heißer Liste, 30min warm, 15min kalt. Track es." },
      es: { tip: "Método 3 listas: caliente, tibia, fría. Trabájalas diferente cada día.", action: "60min lista caliente, 30min tibia, 15min fría. Mide." }
    },
    {
      en: { tip: "If you can't say it in 10 seconds, you don't know it yet.", action: "Write your offer in one sentence. Read it aloud. Cut half the words." },
      de: { tip: "Wenn du's nicht in 10 Sekunden sagen kannst, kennst du's nicht.", action: "Schreib dein Angebot in einem Satz. Lies laut. Streich die Hälfte." },
      es: { tip: "Si no puedes decirlo en 10 segundos, aún no lo conoces.", action: "Escribe tu oferta en una frase. Léela en voz alta. Corta la mitad." }
    },
    {
      en: { tip: "Energy sells. Tired sellers close zero.", action: "Today: 20 min walk before first sales call. Watch your conversion shift." },
      de: { tip: "Energie verkauft. Müde Verkäufer closen null.", action: "Heute: 20min Walk vor erstem Sales-Call. Watch wie sich die Conversion shift't." },
      es: { tip: "La energía vende. Vendedores cansados cierran cero.", action: "Hoy: 20min caminata antes de la primera llamada. Mira el cambio." }
    }
  ],
  crypto: [
    {
      en: { tip: "Position sizing kills more accounts than bad picks.", action: "Review your largest position. Is it >20% of portfolio? Trim today." },
      de: { tip: "Position Sizing killt mehr Accounts als schlechte Picks.", action: "Review deine größte Position. >20% vom Portfolio? Heute trim." },
      es: { tip: "El sizing de posición mata más cuentas que las malas elecciones.", action: "Revisa tu mayor posición. ¿>20% del portfolio? Reduce hoy." }
    },
    {
      en: { tip: "DCA doesn't mean weekly. It means consistent.", action: "Set up automatic Bitcoin buy. Even $50/week. Set it. Forget it." },
      de: { tip: "DCA heißt nicht wöchentlich. Es heißt konsistent.", action: "Setup automatischen BTC-Kauf. Sogar 50€/Woche. Setup, vergessen." },
      es: { tip: "DCA no significa semanal. Significa consistente.", action: "Configura compra automática de BTC. Hasta 50€/sem. Olvídalo." }
    },
    {
      en: { tip: "Market cycles are 4 years. Don't time the bottom. Stack through it.", action: "Where are we in the cycle? Write down your thesis. Test it monthly." },
      de: { tip: "Marktzyklen sind 4 Jahre. Time nicht den Boden. Stack durch.", action: "Wo sind wir im Zyklus? Schreib deine These auf. Test sie monatlich." },
      es: { tip: "Los ciclos son de 4 años. No cronometrice el fondo. Acumula." }
    },
    {
      en: { tip: "Tokenization is eating real estate next.", action: "Pick one RWA project. Study its legal framework for 30 min. Take notes." },
      de: { tip: "Tokenisierung frisst als nächstes Real Estate.", action: "Pick ein RWA-Projekt. Study Legal-Framework 30min. Notiz machen." },
      es: { tip: "La tokenización se comerá los bienes raíces.", action: "Elige un proyecto RWA. Estudia su marco legal 30min." }
    },
    {
      en: { tip: "Self-custody is paranoid until it isn't.", action: "Hardware wallet check: Are your seed words still where they belong?" },
      de: { tip: "Self-Custody ist paranoid bis es nicht mehr ist.", action: "Hardware-Wallet Check: Sind deine Seed-Words noch wo sie hingehören?" },
      es: { tip: "La autocustodia es paranoia hasta que no lo es.", action: "Check de wallet: ¿Tus seed words están donde deben?" }
    },
    {
      en: { tip: "Swiss legal framework leads the world for tokenization.", action: "If you're building: explore Swiss DLT Act. 30 min reading today." },
      de: { tip: "Schweizer Legal-Framework führt weltweit bei Tokenisierung.", action: "Wenn du baust: explorer das DLT-Gesetz. 30min Reading heute." },
      es: { tip: "El marco legal suizo lidera el mundo en tokenización.", action: "Si construyes: explora la Ley DLT suiza. 30min de lectura." }
    },
    {
      en: { tip: "Tax compliance now beats panic later.", action: "Track all your crypto trades in a spreadsheet today. Just 15 min." },
      de: { tip: "Tax-Compliance jetzt schlägt Panik später.", action: "Track alle Crypto-Trades in einem Spreadsheet heute. 15min." },
      es: { tip: "Cumplimiento fiscal ahora supera pánico después.", action: "Registra todos tus trades en una hoja hoy. 15min." }
    }
  ],
  wealth: [
    {
      en: { tip: "Wealth is built in 4 quadrants. Most stay stuck in one.", action: "Map your assets across: cash, business, market, real estate." },
      de: { tip: "Wealth wird in 4 Quadranten gebaut. Die meisten bleiben in einem.", action: "Map deine Assets: Cash, Business, Markt, Real Estate." },
      es: { tip: "La riqueza se construye en 4 cuadrantes. La mayoría se atasca en uno.", action: "Mapea tus activos: cash, negocio, mercado, inmuebles." }
    },
    {
      en: { tip: "Lifestyle creep is the #1 wealth killer.", action: "Review last 30 days of spending. Find one recurring charge to cancel." },
      de: { tip: "Lifestyle-Creep ist der #1 Wealth-Killer.", action: "Review letzte 30 Tage Spending. Find eine recurring charge zum killen." },
      es: { tip: "La inflación del estilo de vida es el asesino #1 de riqueza.", action: "Revisa últimos 30 días. Encuentra un cargo recurrente a cancelar." }
    },
    {
      en: { tip: "Family office isn't about money. It's about systems.", action: "Document your top 5 financial processes. Even on paper." },
      de: { tip: "Family Office ist nicht über Geld. Es geht um Systeme.", action: "Dokumentier deine Top-5 Finanz-Prozesse. Sogar auf Papier." },
      es: { tip: "La family office no es sobre dinero. Es sobre sistemas.", action: "Documenta tus 5 procesos financieros. Incluso en papel." }
    },
    {
      en: { tip: "Asset protection starts before you need it.", action: "List potential liabilities. Which assets are at risk? Plan structure." },
      de: { tip: "Asset Protection startet bevor du sie brauchst.", action: "List potenzielle Liabilities. Welche Assets at risk? Plan Struktur." },
      es: { tip: "La protección de activos empieza antes de necesitarla.", action: "Lista pasivos. ¿Qué activos en riesgo? Planifica estructura." }
    },
    {
      en: { tip: "Diversification without strategy is just dilution.", action: "Define your wealth thesis in one sentence. Test allocations against it." },
      de: { tip: "Diversifikation ohne Strategie ist nur Verdünnung.", action: "Define deine Wealth-These in einem Satz. Test Allocations dagegen." },
      es: { tip: "Diversificar sin estrategia es solo diluir.", action: "Define tu tesis de patrimonio en una frase. Prueba asignaciones." }
    },
    {
      en: { tip: "Real wealth compounds in private markets, not public ones.", action: "Identify one private investment opportunity in your network this week." },
      de: { tip: "Echte Wealth compoundet in Private Markets, nicht Public.", action: "Identifizier diese Woche eine Private-Investment-Chance im Netzwerk." },
      es: { tip: "La riqueza real se compone en mercados privados.", action: "Identifica una oportunidad privada en tu red esta semana." }
    },
    {
      en: { tip: "Generational wealth requires generational thinking.", action: "Write a one-page wealth plan for the next 20 years. Just draft." },
      de: { tip: "Generational Wealth braucht generational Thinking.", action: "Schreib einen 1-Seiten Wealth-Plan für die nächsten 20 Jahre." },
      es: { tip: "La riqueza generacional requiere pensamiento generacional.", action: "Escribe plan de 1 página para los próximos 20 años." }
    }
  ],
  network: [
    {
      en: { tip: "Recruiting in 2026 is content-driven. Stop cold-pitching.", action: "Post one piece of value content today. No pitch. Just value." },
      de: { tip: "Recruiting in 2026 ist content-driven. Stop Cold-Pitching.", action: "Post heute ein Stück Value-Content. Kein Pitch. Nur Value." },
      es: { tip: "El reclutamiento en 2026 es por contenido. Para de cold-pitching.", action: "Postea contenido de valor hoy. Sin pitch. Solo valor." }
    },
    {
      en: { tip: "Your team retention is your real income.", action: "Check in on your top 3 team members today. No agenda. Just connect." },
      de: { tip: "Team-Retention ist dein echtes Einkommen.", action: "Check-in bei deinen Top-3 Team-Members heute. Keine Agenda." },
      es: { tip: "La retención de tu equipo es tu ingreso real.", action: "Conecta con tus top 3 hoy. Sin agenda. Solo conectar." }
    },
    {
      en: { tip: "Network marketing fails when you pitch products, not problems.", action: "Rewrite your pitch from 'features' to 'pains solved'." },
      de: { tip: "Network Marketing scheitert wenn du Produkte pitchst statt Probleme.", action: "Rewrite deinen Pitch von 'Features' zu 'Pains solved'." },
      es: { tip: "Network falla cuando vendes productos, no problemas.", action: "Reescribe tu pitch de 'features' a 'dolores resueltos'." }
    },
    {
      en: { tip: "The 3-list method works in MLM too: hot, warm, cold.", action: "Sort your contacts into 3 lists today. Action plan per list." },
      de: { tip: "Die 3-Listen-Methode funktioniert auch in MLM: heiß, warm, kalt.", action: "Sortier deine Kontakte heute in 3 Listen. Action-Plan pro Liste." },
      es: { tip: "El método 3 listas también en MLM: caliente, tibia, fría.", action: "Ordena contactos en 3 listas. Plan por lista." }
    },
    {
      en: { tip: "Duplication beats charisma every time.", action: "Document one process your team can replicate without you." },
      de: { tip: "Duplikation schlägt Charisma jedes Mal.", action: "Dokumentier einen Prozess den dein Team ohne dich replizieren kann." },
      es: { tip: "La duplicación gana al carisma siempre.", action: "Documenta un proceso que tu equipo replique sin ti." }
    },
    {
      en: { tip: "MLM recovery starts with brutal honesty about what stopped working.", action: "Write down 3 things that stopped working. Don't sugarcoat." },
      de: { tip: "MLM-Recovery startet mit brutaler Ehrlichkeit über was nicht mehr funktioniert.", action: "Schreib 3 Dinge auf die nicht mehr funktionieren. Keine Schönfärberei." },
      es: { tip: "La recuperación MLM empieza con honestidad brutal.", action: "Escribe 3 cosas que dejaron de funcionar. Sin endulzar." }
    },
    {
      en: { tip: "Personal brand > company brand in network marketing.", action: "Audit your last 5 posts. Are they about you or your company? Shift it." },
      de: { tip: "Persönliche Marke > Firmen-Marke im Network Marketing.", action: "Audit deine letzten 5 Posts. Über dich oder Firma? Shift es." },
      es: { tip: "Marca personal > marca de compañía en network.", action: "Audita tus 5 últimos posts. ¿Sobre ti o la empresa? Cambia." }
    }
  ],
  tokenization: [
    {
      en: { tip: "RWA tokenization is the biggest opportunity since the internet.", action: "Read one RWA whitepaper today. Take 3 notes. Build pattern recognition." },
      de: { tip: "RWA-Tokenisierung ist die größte Chance seit dem Internet.", action: "Lies heute ein RWA-Whitepaper. Mach 3 Notizen." },
      es: { tip: "La tokenización RWA es la mayor oportunidad desde internet.", action: "Lee un whitepaper RWA hoy. 3 notas." }
    },
    {
      en: { tip: "Tokenize what's illiquid: real estate, fine art, private equity.", action: "Pick one asset class. Map 3 ways tokenization could transform it." },
      de: { tip: "Tokenisier was illiquide ist: Real Estate, Fine Art, Private Equity.", action: "Pick eine Asset-Klasse. Map 3 Wege wie Tokenisierung sie transformiert." },
      es: { tip: "Tokeniza lo ilíquido: inmuebles, arte, private equity.", action: "Elige una clase de activo. Mapea 3 transformaciones." }
    },
    {
      en: { tip: "Switzerland leads tokenization regulation. Other jurisdictions follow.", action: "Spend 30 min reading the Swiss DLT Act. Identify what's portable." },
      de: { tip: "Schweiz führt bei Tokenisierungs-Regulation. Andere folgen.", action: "30min Reading DLT-Gesetz. Identifizier was portable ist." },
      es: { tip: "Suiza lidera regulación tokenización. Otros siguen.", action: "30min Ley DLT suiza. Identifica qué es portable." }
    },
    {
      en: { tip: "Compliance first. Tech second. Project third.", action: "Before building: identify legal jurisdiction + applicable regulations." },
      de: { tip: "Compliance first. Tech second. Projekt third.", action: "Vor Build: identifizier Jurisdiktion + applicable Regulations." },
      es: { tip: "Compliance primero. Tech segundo. Proyecto tercero.", action: "Antes de construir: identifica jurisdicción + regulaciones." }
    },
    {
      en: { tip: "Liquidity is what makes tokenization valuable. Not blockchain.", action: "How will your token achieve liquidity? Write that strategy first." },
      de: { tip: "Liquidität ist was Tokenisierung wertvoll macht. Nicht Blockchain.", action: "Wie erreicht dein Token Liquidität? Schreib die Strategie zuerst." },
      es: { tip: "La liquidez hace valiosa la tokenización. No blockchain.", action: "¿Cómo logrará tu token liquidez? Escribe esa estrategia." }
    },
    {
      en: { tip: "The best tokenization projects solve real friction, not novel tech.", action: "What real-world friction does your project remove? One sentence." },
      de: { tip: "Die besten Tokenisierungs-Projekte lösen echte Friktion, keine neue Tech.", action: "Welche Real-World-Friktion entfernt dein Projekt? Ein Satz." },
      es: { tip: "Los mejores proyectos resuelven fricción real, no tech novedosa.", action: "¿Qué fricción real elimina tu proyecto? Una frase." }
    },
    {
      en: { tip: "Token economics matter more than token marketing.", action: "Sketch your tokenomics on one page. Test with one critical friend." },
      de: { tip: "Token-Economics matter mehr als Token-Marketing.", action: "Sketch deine Tokenomics auf einer Seite. Test mit kritischem Freund." },
      es: { tip: "Tokenomics importa más que marketing.", action: "Esboza tus tokenomics en una página. Pruébalo con un amigo crítico." }
    }
  ],
  mindset: [
    {
      en: { tip: "Decision-making OS: write your filters down before you need them.", action: "Define 3 criteria for any 'yes' to opportunities. Test on today's choices." },
      de: { tip: "Decision-Making OS: schreib deine Filter auf bevor du sie brauchst.", action: "Define 3 Kriterien für 'Ja' zu Opportunities. Test heute." },
      es: { tip: "OS de decisiones: escribe filtros antes de necesitarlos.", action: "Define 3 criterios para decir 'sí'. Prueba hoy." }
    },
    {
      en: { tip: "Plateaus are data, not destiny.", action: "Where are you stuck? Name 3 reasons. Pick the smallest one to attack." },
      de: { tip: "Plateaus sind Daten, kein Schicksal.", action: "Wo hängst du? Nenn 3 Gründe. Attackier den kleinsten." },
      es: { tip: "Las mesetas son datos, no destino.", action: "¿Dónde estás atascado? 3 razones. Ataca la más pequeña." }
    },
    {
      en: { tip: "Self-leadership = doing the thing when no one watches.", action: "Pick one habit you've been skipping. Do it today. Just today." },
      de: { tip: "Selbstführung = die Sache machen wenn niemand zuschaut.", action: "Pick eine Habit die du skipst. Mach sie heute. Nur heute." },
      es: { tip: "Autoliderazgo = hacer lo correcto cuando nadie mira.", action: "Elige una rutina abandonada. Hazla hoy. Solo hoy." }
    },
    {
      en: { tip: "Mental models compound. One a week is enough.", action: "Pick one mental model today. Use it in 3 decisions." },
      de: { tip: "Mental Models compounden. Eines pro Woche reicht.", action: "Pick heute ein Mental Model. Nutz es in 3 Entscheidungen." },
      es: { tip: "Los modelos mentales se componen. Uno por semana basta.", action: "Elige un modelo mental hoy. Úsalo en 3 decisiones." }
    },
    {
      en: { tip: "Crisis reveals your operating system. Use it as feedback.", action: "Last hard moment: what did you do? What should you have done?" },
      de: { tip: "Krise zeigt dein Operating System. Nutz sie als Feedback.", action: "Letzter harter Moment: was hast du gemacht? Was hättest du sollen?" },
      es: { tip: "La crisis revela tu sistema operativo. Úsala como feedback.", action: "Último momento difícil: ¿qué hiciste? ¿Qué debiste hacer?" }
    },
    {
      en: { tip: "Read less, apply more. One framework > ten books.", action: "Pick one framework you've learned. Apply it in 3 places today." },
      de: { tip: "Lies weniger, apply mehr. Ein Framework > zehn Bücher.", action: "Pick ein Framework das du gelernt hast. Apply es heute 3 mal." },
      es: { tip: "Lee menos, aplica más. Un framework > diez libros.", action: "Elige un framework. Aplícalo en 3 lugares hoy." }
    },
    {
      en: { tip: "Energy management beats time management.", action: "When are you sharpest? Block that hour for your hardest task tomorrow." },
      de: { tip: "Energie-Management schlägt Zeit-Management.", action: "Wann bist du am schärfsten? Block die Stunde morgen für die härteste Task." },
      es: { tip: "Gestión de energía gana a gestión de tiempo.", action: "¿Cuándo eres más agudo? Reserva esa hora para tu tarea más difícil." }
    }
  ],
  scaling: [
    {
      en: { tip: "Unicorns are built in 4 stages. Most stall at stage 2.", action: "Identify which stage you're in. Name the next milestone clearly." },
      de: { tip: "Unicorns werden in 4 Stages gebaut. Die meisten stallen bei Stage 2.", action: "Identifizier deine Stage. Nenn den nächsten Milestone klar." },
      es: { tip: "Unicornios se construyen en 4 etapas. La mayoría se atasca en 2.", action: "Identifica tu etapa. Nombra el próximo hito." }
    },
    {
      en: { tip: "Scaling without systems is just bigger chaos.", action: "List your top 3 manual processes. Which can be automated this week?" },
      de: { tip: "Skalierung ohne Systeme ist nur größeres Chaos.", action: "List Top-3 manuelle Prozesse. Was automatisierst du diese Woche?" },
      es: { tip: "Escalar sin sistemas es solo más caos.", action: "Lista 3 procesos manuales. ¿Cuál automatizar esta semana?" }
    },
    {
      en: { tip: "Hire ahead of pain, not after.", action: "What pain will hit you in 3 months? Start hiring for it now." },
      de: { tip: "Hire vor dem Schmerz, nicht nach ihm.", action: "Welcher Schmerz trifft dich in 3 Monaten? Hire jetzt dafür." },
      es: { tip: "Contrata antes del dolor, no después.", action: "¿Qué dolor te golpeará en 3 meses? Contrata ahora." }
    },
    {
      en: { tip: "Your bottleneck is always you. Until it's not.", action: "What's the one thing only you do? Document it for delegation." },
      de: { tip: "Dein Bottleneck bist immer du. Bis du es nicht mehr bist.", action: "Was machst nur du? Dokumentier für Delegation." },
      es: { tip: "Tu cuello de botella eres tú. Hasta que no.", action: "¿Qué cosa solo tú haces? Documenta para delegar." }
    },
    {
      en: { tip: "Scaling = doing less, better.", action: "Cut one project, customer, or activity this week. Free the bandwidth." },
      de: { tip: "Scaling = weniger machen, besser.", action: "Cut diese Woche ein Projekt, Kunden, oder Aktivität. Free Bandwidth." },
      es: { tip: "Escalar = hacer menos, mejor.", action: "Corta un proyecto, cliente o actividad esta semana." }
    },
    {
      en: { tip: "Cash flow beats revenue. Every time.", action: "Map your cash flow weekly. Where's the friction? Fix one today." },
      de: { tip: "Cashflow schlägt Revenue. Jedes Mal.", action: "Map deinen Cashflow wöchentlich. Wo Friktion? Fix einen heute." },
      es: { tip: "El cash flow gana al revenue. Siempre.", action: "Mapea cash flow semanal. ¿Dónde fricción? Arregla una hoy." }
    },
    {
      en: { tip: "Build for the second milestone, not the first.", action: "Imagine you're already at next milestone. What did you build to get there?" },
      de: { tip: "Build für den zweiten Milestone, nicht den ersten.", action: "Imagine du bist beim nächsten Milestone. Was hast du gebaut?" },
      es: { tip: "Construye para el segundo hito, no el primero.", action: "Imagina ya estás en el siguiente hito. ¿Qué construiste?" }
    }
  ],
  coaching: [
    {
      en: { tip: "Honest situation analysis beats optimistic planning.", action: "Write what's actually happening — no spin. Read it tomorrow." },
      de: { tip: "Ehrliche Standortbestimmung schlägt optimistische Planung.", action: "Schreib was wirklich passiert — kein Spin. Lies es morgen." },
      es: { tip: "Análisis honesto supera planificación optimista.", action: "Escribe lo que realmente pasa — sin filtros. Léelo mañana." }
    },
    {
      en: { tip: "Vision without 90-day plan is hallucination.", action: "Pick your top vision item. Define 3 actions for next 90 days." },
      de: { tip: "Vision ohne 90-Tage-Plan ist Halluzination.", action: "Pick dein Top-Vision-Item. Definier 3 Actions für 90 Tage." },
      es: { tip: "Visión sin plan de 90 días es alucinación.", action: "Elige tu top visión. Define 3 acciones para 90 días." }
    },
    {
      en: { tip: "Your first million is a roadmap problem, not a luck problem.", action: "Reverse-engineer your first €1M. What needs to be true monthly?" },
      de: { tip: "Deine erste Million ist ein Roadmap-Problem, kein Glücks-Problem.", action: "Reverse-engineer deine erste 1M€. Was muss monatlich wahr sein?" },
      es: { tip: "Tu primer millón es un problema de ruta, no de suerte.", action: "Ingeniería inversa tu primer 1M€. ¿Qué mensualmente?" }
    },
    {
      en: { tip: "Coaching yourself starts with brutal questions.", action: "Ask: 'If I gave myself advice, what would I say I'm avoiding?'" },
      de: { tip: "Sich selbst coachen startet mit brutalen Fragen.", action: "Frag: 'Wenn ich mir Rat geben würde, was vermeide ich?'" },
      es: { tip: "Autocoachearse empieza con preguntas brutales.", action: "Pregunta: 'Si me aconsejara, ¿qué evito?'" }
    },
    {
      en: { tip: "Most plateaus are skill gaps, not motivation gaps.", action: "What skill would unlock your next level? Start learning it today." },
      de: { tip: "Die meisten Plateaus sind Skill-Lücken, keine Motivations-Lücken.", action: "Welcher Skill unlockt dein nächstes Level? Lern ihn heute." },
      es: { tip: "Mesetas son brechas de habilidad, no de motivación.", action: "¿Qué habilidad desbloquea tu próximo nivel? Aprende hoy." }
    },
    {
      en: { tip: "Track 3 metrics weekly. Everything else is noise.", action: "Pick 3 metrics that prove progress. Track them every Sunday." },
      de: { tip: "Track 3 Metriken wöchentlich. Alles andere ist Rauschen.", action: "Pick 3 Metriken die Progress beweisen. Track jeden Sonntag." },
      es: { tip: "Mide 3 métricas semanales. El resto es ruido.", action: "Elige 3 métricas. Mídelas cada domingo." }
    },
    {
      en: { tip: "Compound conversations beat coffee meetings.", action: "Have one deep 60-min conversation this week. Skip 5 small ones." },
      de: { tip: "Compound-Gespräche schlagen Kaffee-Meetings.", action: "Hab diese Woche ein 60-min tiefes Gespräch. Skip 5 kleine." },
      es: { tip: "Conversaciones profundas ganan a cafés.", action: "Ten una conversación profunda de 60min. Salta 5 pequeñas." }
    }
  ],
  ai: [
    {
      en: { tip: "AI in 2026 isn't a tool. It's a layer you build on.", action: "List 3 weekly tasks AI could handle for you. Pick one — automate it this week." },
      de: { tip: "KI ist 2026 kein Tool. Es ist eine Schicht auf der du baust.", action: "List 3 wöchentliche Aufgaben die AI für dich übernehmen kann. Pick eine — automatisier sie diese Woche." },
      es: { tip: "La IA en 2026 no es una herramienta. Es una capa sobre la que construyes.", action: "Lista 3 tareas semanales que la IA podría manejar. Elige una — automatízala esta semana." }
    },
    {
      en: { tip: "Don't collect tools. Ship workflows.", action: "Cancel 2 AI subscriptions you don't use. Master the 3 you keep." },
      de: { tip: "Sammel keine Tools. Ship Workflows.", action: "Kündig 2 AI-Subscriptions die du nicht nutzt. Master die 3 die du behältst." },
      es: { tip: "No colecciones herramientas. Lanza workflows.", action: "Cancela 2 suscripciones de IA que no usas. Domina las 3 que mantienes." }
    },
    {
      en: { tip: "Use Claude + GPT + Gemini in parallel. Different LLMs for different jobs.", action: "Same prompt to all 3 today. Compare outputs. Pick the best for that job type going forward." },
      de: { tip: "Nutz Claude + GPT + Gemini parallel. Verschiedene LLMs für verschiedene Jobs.", action: "Gleicher Prompt an alle 3 heute. Vergleich die Outputs. Pick den besten für den Job-Typ." },
      es: { tip: "Usa Claude + GPT + Gemini en paralelo. LLMs distintos para trabajos distintos.", action: "Mismo prompt a los 3 hoy. Compara outputs. Elige el mejor para ese tipo de trabajo." }
    },
    {
      en: { tip: "The bleeding-wound test: automate where pain is biggest, not where it's easiest.", action: "Identify your most painful weekly process. AI-augment that one first." },
      de: { tip: "Der Bleeding-Wound-Test: automatisier wo der Schmerz am größten ist, nicht wo's am einfachsten ist.", action: "Identifizier deinen schmerzhaftesten Wochenprozess. AI-augmentier den zuerst." },
      es: { tip: "Test de herida sangrante: automatiza donde el dolor es mayor, no donde es más fácil.", action: "Identifica tu proceso semanal más doloroso. Aumenta ese primero con IA." }
    },
    {
      en: { tip: "Sales AI stack 2026: Apollo + Clay + HeyReach + Gong. Stop overthinking.", action: "Pick ONE from that stack today. Set it up. Run a test campaign in 48h." },
      de: { tip: "Sales-AI-Stack 2026: Apollo + Clay + HeyReach + Gong. Stop Overthinking.", action: "Pick EINS aus dem Stack heute. Setup. Test-Kampagne in 48h." },
      es: { tip: "Stack de ventas IA 2026: Apollo + Clay + HeyReach + Gong. Deja de pensar tanto.", action: "Elige UNO hoy. Configúralo. Lanza campaña de prueba en 48h." }
    },
    {
      en: { tip: "AI replaces low-skill digital work. It amplifies high-value outcome work.", action: "What's the highest-value outcome you sell? Stack AI to do everything below that line." },
      de: { tip: "KI ersetzt low-skill Digital-Arbeit. Sie verstärkt high-value Outcome-Arbeit.", action: "Was ist dein höchstwertiger Outcome? Stack AI für alles darunter." },
      es: { tip: "La IA reemplaza trabajo digital de baja habilidad. Amplifica trabajo de alto valor.", action: "¿Cuál es tu resultado de mayor valor? Apila IA para todo lo demás." }
    },
    {
      en: { tip: "Sell outcomes with AI, not hours. Charge for the result.", action: "Reformulate one service: instead of 'I'll build X' say 'I'll cut your Y by Z% in 90 days'." },
      de: { tip: "Verkauf Outcomes mit AI, keine Stunden. Charge für das Resultat.", action: "Reformulier einen Service: statt 'ich baue X' sag 'ich reduzier dein Y um Z% in 90 Tagen'." },
      es: { tip: "Vende resultados con IA, no horas. Cobra por el resultado.", action: "Reformula un servicio: en vez de 'construiré X' di 'reduciré tu Y en Z% en 90 días'." }
    }
  ],
  agentic: [
    {
      en: { tip: "Chatbots answer. Agents act. Build for action, not conversation.", action: "Pick one task you'd want to NEVER do again. Sketch the agent that takes it over." },
      de: { tip: "Chatbots antworten. Agents handeln. Bau für Action, nicht Conversation.", action: "Pick eine Task die du NIE wieder machen willst. Sketch den Agent der sie übernimmt." },
      es: { tip: "Los chatbots responden. Los agentes actúan. Construye para acción, no conversación.", action: "Elige una tarea que NUNCA quieres hacer de nuevo. Esboza el agente que la asume." }
    },
    {
      en: { tip: "The 7 business models for agents: Automation Agency, Custom Builds, Vertical SaaS, AI Worker-as-Service, Outcome-Based Services, Internal Operator, Education+Tools.", action: "Pick ONE of the 7. Outline what your first offer looks like." },
      de: { tip: "Die 7 Business-Modelle für Agents: Automation Agency, Custom Builds, Vertical SaaS, AI-Worker-as-Service, Outcome-Based Services, Internal Operator, Education+Tools.", action: "Pick EINS der 7. Skizzier wie dein erstes Angebot aussieht." },
      es: { tip: "Los 7 modelos de negocio para agentes: Agencia de Automatización, Builds Custom, SaaS Vertical, Worker-as-Service, Servicios por Resultados, Operador Interno, Educación+Tools.", action: "Elige UNO de los 7. Esboza cómo se ve tu primera oferta." }
    },
    {
      en: { tip: "CrewAI for beginners. LangGraph for serious builds. AutoGen for multi-agent conversations. Don't overthink it.", action: "Try CrewAI today. Build the simplest 2-agent system. Just to feel it." },
      de: { tip: "CrewAI für Beginner. LangGraph für ernsthafte Builds. AutoGen für Multi-Agent-Conversations. Don't overthink it.", action: "Probier CrewAI heute. Bau das simpelste 2-Agent-System. Nur um's zu spüren." },
      es: { tip: "CrewAI para principiantes. LangGraph para builds serios. AutoGen para conversaciones multi-agente. No lo compliques.", action: "Prueba CrewAI hoy. Construye el sistema más simple de 2 agentes. Solo para sentirlo." }
    },
    {
      en: { tip: "MCP (Model Context Protocol) is the USB-C of AI. Learn it now.", action: "Read Anthropic's MCP docs for 30 min today. Identify one tool you'd want your agents to access." },
      de: { tip: "MCP (Model Context Protocol) ist der USB-C von AI. Lern es jetzt.", action: "Lies heute 30min Anthropic's MCP-Docs. Identifizier ein Tool das deine Agents nutzen sollten." },
      es: { tip: "MCP (Model Context Protocol) es el USB-C de la IA. Apréndelo ahora.", action: "Lee 30min de los docs MCP de Anthropic hoy. Identifica una herramienta que tus agentes deberían usar." }
    },
    {
      en: { tip: "Vertical beats horizontal. Specialized agents for ONE industry win in 2026.", action: "Pick one industry you know well. What's the agent that would save them 20+ hours/week?" },
      de: { tip: "Vertical schlägt horizontal. Spezialisierte Agents für EINE Industrie gewinnen 2026.", action: "Pick eine Industrie die du gut kennst. Welcher Agent würde ihnen 20+ Stunden/Woche sparen?" },
      es: { tip: "Vertical gana a horizontal. Los agentes especializados para UNA industria ganan en 2026.", action: "Elige una industria que conozcas. ¿Qué agente les ahorraría 20+ horas/semana?" }
    },
    {
      en: { tip: "Human-in-the-loop is not a weakness — it's how you sell.", action: "Position your agent as '70-80% autonomous with human review for edge cases'. Customers buy that. Not 'fully autonomous'." },
      de: { tip: "Human-in-the-loop ist keine Schwäche — es ist wie du verkaufst.", action: "Positionier deinen Agent als '70-80% autonom mit Human-Review für Edge-Cases'. Das kaufen Kunden. Nicht 'fully autonomous'." },
      es: { tip: "Human-in-the-loop no es debilidad — es cómo vendes.", action: "Posiciona tu agente como '70-80% autónomo con revisión humana'. Eso compran los clientes. No 'fully autonomous'." }
    },
    {
      en: { tip: "40% of agentic AI deployments will be canceled by 2027 due to cost + unclear value. Don't be in that 40%.", action: "Define your agent's measurable ROI BEFORE you build. Hours saved? Conversion lifted? Cost cut?" },
      de: { tip: "40% der Agentic-AI-Deployments werden bis 2027 gekillt wegen Kosten + unklarem Wert. Sei nicht in den 40%.", action: "Definier den messbaren ROI deines Agents BEVOR du baust. Stunden gespart? Conversion gehoben? Kosten gecuttet?" },
      es: { tip: "40% de los despliegues agénticos serán cancelados para 2027 por costo + valor poco claro. No estés en ese 40%.", action: "Define el ROI medible de tu agente ANTES de construir. ¿Horas ahorradas? ¿Conversión? ¿Costo?" }
    }
  ]
};

// Get today's tip for a topic, based on day-of-year hash
function getDailyTip(topicId, lang) {
  const tips = DAILY_TIPS[topicId];
  if (!tips || tips.length === 0) return null;
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  const idx = dayOfYear % tips.length;
  return tips[idx][lang] || tips[idx].en;
}
