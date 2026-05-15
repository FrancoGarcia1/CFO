/* ═══ Capital Founder Consulting — Identidad visual propia ═══
   Paleta: carbón cálido + bronce + dorado claro + salvia para Tech
   Diferenciada de Capital CFO (que usa gold puro #c8a15a sobre #0a0a0a)
*/

export const CFC_COLORS = {
  bg: '#0e0a07',          // carbón cálido (más warm que el #0a0a0a de CFO)
  bgCard: '#181210',
  border: 'rgba(164, 113, 72, 0.15)',
  borderStrong: 'rgba(164, 113, 72, 0.35)',

  bronze: '#a47148',       // bronce — accent principal
  bronzeLight: '#c89570',  // bronce claro
  bronzeDeep: '#7a543a',   // bronce profundo
  goldFoil: '#d4a574',     // dorado claro (puente con CFO)

  // Acentos por área (3 pilares)
  finanzas: '#9eb8c8',     // azul acero suave (Entender)
  estrategia: '#c89570',   // bronce dorado (Decidir) — se conecta con la marca
  tech: '#7a8e6a',         // verde salvia (Ejecutar)

  ivory: '#f0e9dd',         // ivory más cálido
  muted: 'rgba(240, 233, 221, 0.6)',
  dim: 'rgba(240, 233, 221, 0.35)',
  black: '#0a0705',
};

export const HERO_CONTENT = {
  eyebrow: 'Consultora integral · Lima, Perú',
  titleLine1: 'Decisiones que',
  titleAccent: 'hacen crecer',
  titleLine3: 'negocios.',
  subtitle: 'Combinamos rigor financiero, pensamiento estratégico y tecnología aplicada para llevar tu negocio al siguiente nivel.',
  ctaPrimary: 'Agenda una consulta',
  ctaSecondary: 'Conoce nuestros servicios',
  stats: [
    { label: 'Enfoque', value: 'Integral' },
    { label: 'Áreas', value: '3 pilares' },
    { label: 'Foco', value: 'LatAm' },
  ],
};

export const PROBLEMAS = [
  {
    n: '01',
    icon: 'chart',
    title: 'Falta de claridad financiera',
    body: 'EEFF que no se entienden, decisiones que se toman a ciegas y proyecciones sin sustento real.',
  },
  {
    n: '02',
    icon: 'compass',
    title: 'Dirección estratégica difusa',
    body: 'Sin plan de negocio, sin diferenciación clara, ni hoja de ruta hacia la escala sostenible.',
  },
  {
    n: '03',
    icon: 'cog',
    title: 'Procesos que frenan la escala',
    body: 'Operación manual, sin métricas, dependiente del founder. Cuello de botella para crecer.',
  },
];

export const AREAS = [
  {
    etapa: 'ENTENDER',
    area: 'Finanzas',
    color: 'finanzas' as const,
    subtitle: 'Claridad sobre tus números, tu rentabilidad y tu capacidad de inversión.',
    servicios: [
      'Análisis de Estados Financieros',
      'Proyección y Modelamiento Financiero',
      'Valoración de Empresas',
      'Análisis de Rentabilidad',
      'Gestión de Costos y Presupuesto',
      'Evaluación de Proyectos de Inversión',
      'Estructuración de Inversiones',
      'Búsqueda de Financiamiento',
    ],
  },
  {
    etapa: 'DECIDIR',
    area: 'Estrategia',
    color: 'estrategia' as const,
    subtitle: 'Dirección, posicionamiento y plan de crecimiento basado en datos.',
    servicios: [
      'Planeamiento Estratégico',
      'Diseño y Plan de Negocios',
      'Innovación en Modelos de Negocio',
      'Estrategias de Crecimiento y Escalabilidad',
      'Inteligencia de Mercado',
      'Optimización Operativa',
      'Diseño de Experiencia del Cliente (CX)',
      'Evaluación de Competencia',
    ],
  },
  {
    etapa: 'EJECUTAR',
    area: 'Tech',
    color: 'tech' as const,
    subtitle: 'Tecnología aplicada para automatizar, escalar y medir resultados.',
    servicios: [
      'Desarrollo Web',
      'Automatización con Chatbots e IA Generativa',
      'Digitalización y Automatización de Procesos',
      'Diagnóstico de Calidad de Servicio',
      'Medición de Satisfacción del Cliente',
    ],
  },
];

export const DIFERENCIADORES = [
  {
    title: 'Enfoque integral',
    body: 'No vendemos informes. Acompañamos la transformación real del negocio — finanzas, estrategia y tecnología trabajando como un solo sistema.',
  },
  {
    title: 'Equipo multidisciplinario',
    body: 'Consultores con experiencia en banca, consultoría tier-1, startups y corporaciones. Diversidad de mirada para cada problema.',
  },
  {
    title: 'Visión local, estándares globales',
    body: 'Conocemos LatAm en detalle. Aplicamos metodología McKinsey, BCG y Deloitte adaptada al founder peruano.',
  },
];

export const AUDIENCIAS = [
  {
    n: '01',
    title: 'Empresas en crecimiento',
    body: 'PyMEs medianas con tracción que necesitan profesionalizar finanzas, estrategia y operación para dar el siguiente salto.',
    cta: 'Diagnóstico inicial',
  },
  {
    n: '02',
    title: 'Startups y nuevos negocios',
    body: 'Fundadores con visión que requieren modelo financiero, plan de negocio y arquitectura tecnológica para levantar capital o validar mercado.',
    cta: 'Estructurar proyecto',
  },
  {
    n: '03',
    title: 'Proyectos de inversión',
    body: 'Inversionistas que necesitan valoración, due diligence financiero y evaluación de viabilidad antes de comprometer capital.',
    cta: 'Solicitar evaluación',
  },
];

export const PRODUCTOS = [
  {
    nombre: 'Capital CFO',
    tag: 'CFO Virtual',
    descripcion: 'Dashboard financiero con IA. Registra, analiza y proyecta tus finanzas. P&L automatizado, forecast, simulador y consultor estratégico 24/7.',
    estado: 'available' as const,
    href: '/capital-cfo',
    color: 'estrategia' as const,
    pilar: 'Finanzas',
  },
  {
    nombre: 'Capital Projects',
    tag: 'Project Management',
    descripcion: 'Kick-off estructurado, weekly updates, project close. Gestión de consultorías con metodología McKinsey/Bain.',
    estado: 'soon' as const,
    color: 'finanzas' as const,
    pilar: 'Operación',
  },
  {
    nombre: 'Capital Knowledge',
    tag: 'Knowledge Base',
    descripcion: 'Casos, plantillas y metodologías propietarias centralizadas. Tu firma piensa como una sola.',
    estado: 'soon' as const,
    color: 'tech' as const,
    pilar: 'Conocimiento',
  },
  {
    nombre: 'Capital Talent',
    tag: 'People & Performance',
    descripcion: 'Evaluación 360°, planes de desarrollo individual y carrera up-or-out estilo big-4.',
    estado: 'soon' as const,
    color: 'estrategia' as const,
    pilar: 'Talento',
  },
  {
    nombre: 'Capital CRM',
    tag: 'Sales Pipeline',
    descripcion: 'Pipeline de propuestas, seguimiento de clientes activos y referral program estructurado.',
    estado: 'soon' as const,
    color: 'finanzas' as const,
    pilar: 'Comercial',
  },
  {
    nombre: 'Capital QBR',
    tag: 'Client Reviews',
    descripcion: 'Quarterly Business Review automatizado con dashboard + comparativo + recomendación CFO en PDF.',
    estado: 'soon' as const,
    color: 'tech' as const,
    pilar: 'Cliente',
  },
  {
    nombre: 'Capital Deliverables',
    tag: 'Document System',
    descripcion: 'Plantilla única, versionado, peer review obligatorio. Cada entregable con calidad McKinsey-grade.',
    estado: 'soon' as const,
    color: 'estrategia' as const,
    pilar: 'Calidad',
  },
  {
    nombre: 'Capital Command',
    tag: 'Partner Cockpit',
    descripcion: 'KPIs de la firma, OKRs trimestrales, NPS clientes y proyección de pipeline para el Partner.',
    estado: 'soon' as const,
    color: 'finanzas' as const,
    pilar: 'Gobierno',
  },
];
