export type Language = 'en' | 'es';

export interface ArticleReference {
  authors: string;
  year?: string;
  title: string;
  publication: string;
}

export interface ArticleData {
  id: string;
  slug: string;
  title: { en: string; es: string };
  date: { en: string; es: string };
  authorLine: { en: string; es: string };
  excerpt: { en: string; es: string };
  references: ArticleReference[];
}

export const MIAMI_OPEN_IMG = '/miamiopen.jpg';
export const BIG4_IMG = '/images/big4.jpeg';
export const CAJA_MAGICA_IMG = '/images/caja-magica.jpeg';

export const UI_TEXT = {
  en: {
    brandName: 'Gabriel Vasquez',
    underConstruction: 'Website is still under construction',
    heroTitlePrefix: 'Welcome to my ',
    heroTitleAccent: 'Tennis Portfolio',
    heroSubtitle: 'Serving up articles, video breakdowns, analysis, and fresh perspectives from across the court.',
    aboutMeBtn: 'About Me',
    readBlogBtn: 'Read Blog',
    tennisToolsBtn: 'Tennis Tools',
    backToPortfolio: '← Back to Portfolio',
    returnToPortfolio: 'Return to Portfolio',
    backToBlog: '← Back to Blog',
    backToTools: '← Back to Tools',
    blogBannerTitle: 'Tennis Articles',
    toolsTitle: 'Tennis Tools Hub',
    toolsSubtitle: 'Interactive web tools built to organize tournaments, manage club programs, and track performance data cleanly.',
    scorekeeperTitle: 'Scorekeeper Pro',
    scorekeeperDesc: 'Umpire side tracking app for point matches. Choose between direct game-state logs or advanced stroke metric logging.',
    simpleMvpBtn: 'Simple MVP',
    advancedStatsBtn: 'Advanced Stats',
    leagueOrganizerTitle: 'League Organizer',
    leagueOrganizerDesc: 'A custom engine to draw dynamic match trees, manage bracket seedings, generate rotation match lists, and calculate league stand tables.',
    academyManagerTitle: 'Academy Manager',
    academyManagerDesc: 'Administrative coordination panel tracking program lesson timetables, court rotation reservations, and training lists.',
    underDevelopmentBtn: 'Under Construction',
    referencesHeading: 'References',
    copyright: '© 2026 Gabriel Vasquez. All rights reserved.',
    langToggleLabel: 'ES · Español',
    navHome: 'Home',
    navBlog: 'Blog',
    navTools: 'Tennis Tools'
  },
  es: {
    brandName: 'Gabriel Vasquez',
    underConstruction: 'El sitio web sigue en construcción',
    heroTitlePrefix: 'Bienvenido a mi ',
    heroTitleAccent: 'Portafolio de Tenis',
    heroSubtitle: 'Compartiendo artículos, análisis en video, biomecánica y nuevas perspectivas desde la cancha.',
    aboutMeBtn: 'Sobre Mí',
    readBlogBtn: 'Leer Blog',
    tennisToolsBtn: 'Herramientas de Tenis',
    backToPortfolio: '← Volver al Portafolio',
    returnToPortfolio: 'Volver al Portafolio',
    backToBlog: '← Volver al Blog',
    backToTools: '← Volver a Herramientas',
    blogBannerTitle: 'Artículos de Tenis',
    toolsTitle: 'Centro de Herramientas de Tenis',
    toolsSubtitle: 'Herramientas web interactivas diseñadas para organizar torneos, gestionar programas de clubes y registrar estadísticas de rendimiento.',
    scorekeeperTitle: 'Scorekeeper Pro',
    scorekeeperDesc: 'Aplicación de seguimiento arbitral punto por punto. Elige entre registro directo del marcador o seguimiento avanzado de métricas de golpeo.',
    simpleMvpBtn: 'MVP Simple',
    advancedStatsBtn: 'Estadísticas Avanzadas',
    leagueOrganizerTitle: 'Organizador de Ligas',
    leagueOrganizerDesc: 'Un motor personalizado para generar cuadros dinámicos, gestionar siembras, crear listas de rotación de partidos y calcular tablas de posiciones.',
    academyManagerTitle: 'Gestor de Academia',
    academyManagerDesc: 'Panel de coordinación administrativa para horarios de clases, reservas de rotación de canchas y listas de entrenamiento.',
    underDevelopmentBtn: 'En Construcción',
    referencesHeading: 'Referencias',
    copyright: '© 2026 Gabriel Vasquez. Todos los derechos reservados.',
    langToggleLabel: 'EN · English',
    navHome: 'Inicio',
    navBlog: 'Artículos',
    navTools: 'Herramientas'
  }
};

export const ARTICLES: ArticleData[] = [
  {
    id: 'split-step-misconception',
    slug: 'split-step-misconception',
    title: {
      en: 'Beyond the Metronome: Why Modern Tennis Has Outgrown the "Bounce-Hit" Drill',
      es: 'Más Allá del Metrónomo: Por Qué el Tenis Moderno Ha Superado el Ejercicio "Bote-Golpe"'
    },
    date: {
      en: 'June 26, 2026',
      es: '26 de junio de 2026'
    },
    authorLine: {
      en: 'By Gabriel Vasquez · Published June 21, 2026',
      es: 'Por Gabriel Vasquez · Publicado el 21 de junio de 2026'
    },
    excerpt: {
      en: 'For decades, tennis coaches have relied on the "Bounce-Hit" drill to teach tracking and timing. But as baseline ball speeds have skyrocketed, sport science reveals why treating the game like a steady metronome might be holding your footwork back...',
      es: 'Durante décadas, los entrenadores de tenis han confiado en el ejercicio "Bote-Golpe" para enseñar seguimiento visual y ritmo. Pero a medida que la velocidad de bola desde el fondo se ha disparado, la ciencia del deporte revela por qué tratar el juego como un metrónomo fijo puede estar frenando tu juego de pies...'
    },
    references: [
      {
        authors: 'International Tennis Performance Association (ITPA).',
        title: 'Tennis Performance Trainer (TPT) Certification Manual',
        publication: 'Section 5.9: "Split Step Misconception" (Biomechanical Frameworks for Advanced Agility and Movement Efficiency).'
      },
      {
        authors: 'Nieminen, V., et al.',
        year: '2014',
        title: '"Effects of neuromuscular function and split step on reaction speed in the simulated tennis response."',
        publication: 'European Journal of Sports Science, Vol. 14, No. 4, 318-326.'
      }
    ]
  },
  {
    id: 'slower-tennis-balls',
    slug: 'slower-tennis-balls',
    title: {
      en: 'Why Slower Tennis Balls Are Not Just for Kids',
      es: 'Por Qué las Pelotas de Tenis Más Lentas No Son Solo para Niños'
    },
    date: {
      en: 'June 21, 2026',
      es: '21 de junio de 2026'
    },
    authorLine: {
      en: 'By Gabriel Vasquez · Published June 21, 2026',
      es: 'Por Gabriel Vasquez · Publicado el 21 de junio de 2026'
    },
    excerpt: {
      en: 'When people see slower tennis balls—red, orange, or green dot—they often think those balls are only for kids. But this is one of the biggest misconceptions in tennis development...',
      es: 'Cuando la gente ve pelotas de tenis más lentas —rojas, naranjas o de punto verde—, suele pensar que son solo para niños. Sin embargo, este es uno de los mayores mitos en el desarrollo del tenis...'
    },
    references: [
      {
        authors: 'Kachel, K., Buszard, T., & Farrow, D.',
        year: '2014',
        title: 'The effect of modified tennis balls on baseline rally success and technical proficiency in adult introductory players.',
        publication: 'International Journal of Sports Science & Coaching, 9(5), 1145-1154.'
      },
      {
        authors: 'Fitzpatrick, A., Davids, K., & Stone, J. A.',
        year: '2017',
        title: 'Effects of scaling equipment on tennis performance and task completion in children and adults.',
        publication: 'Journal of Sports Sciences, 35(19), 1951-1958.'
      }
    ]
  },
  {
    id: 'faster-tennis-balls',
    slug: 'faster-tennis-balls',
    title: {
      en: 'When Is a Player Ready to Use Faster Tennis Balls?',
      es: '¿Cuándo Está Listo un Jugador para Usar Pelotas de Tenis Más Rápidas?'
    },
    date: {
      en: 'June 3, 2026',
      es: '3 de junio de 2026'
    },
    authorLine: {
      en: 'By Gabriel Vasquez · Published June 21, 2026',
      es: 'Por Gabriel Vasquez · Publicado el 21 de junio de 2026'
    },
    excerpt: {
      en: 'Many players think they should move to faster tennis balls based on age. But the truth is, players should move forward based on skill and comfort, not age...',
      es: 'Muchos jugadores creen que deben avanzar a pelotas más rápidas según la edad. Pero la realidad es que la progresión debe basarse en la habilidad técnica y el control, nunca en la edad cronológica...'
    },
    references: [
      {
        authors: 'International Tennis Federation (ITF).',
        year: '2012',
        title: 'ITF Play and Stay Campaign Guidelines: Architectural Rules for Under-10 Tennis Competitions.',
        publication: 'ITF Coaching & Sport Science.'
      },
      {
        authors: 'Buszard, T., Farrow, D., Reid, M., & Masters, R. S.',
        year: '2014',
        title: "Scaling the equipment and play environment in children's sport to improve implicit learning.",
        publication: 'Nonlinear Dynamics, Psychology, and Life Sciences, 18(2), 213-232.'
      }
    ]
  },
  {
    id: 'importance-of-repetition',
    slug: 'importance-of-repetition',
    title: {
      en: 'The Importance of Repetition in Sports and Learning',
      es: 'La Importancia de la Repetición en el Deporte y el Aprendizaje'
    },
    date: {
      en: 'April 28, 2026',
      es: '28 de abril de 2026'
    },
    authorLine: {
      en: 'By Gabriel Vasquez · Published April 28, 2026',
      es: 'Por Gabriel Vasquez · Publicado el 28 de abril de 2026'
    },
    excerpt: {
      en: 'Repetition is one of the most important elements of improvement, both in sports and in academics. It is through repeating actions that true progress happens...',
      es: 'La repetición es uno de los elementos más importantes de la mejora, tanto en el deporte como en el ámbito académico. Es a través de la repetición deliberada que ocurre el verdadero progreso...'
    },
    references: [
      {
        authors: 'Draganski, B., Gaser, C., Busch, V., Schuierer, G., Bogdahn, U., & May, A.',
        year: '2004',
        title: 'Neuroplasticity: Changes in grey matter induced by training.',
        publication: 'Nature, 427(6972), 311-312.'
      },
      {
        authors: 'Ericsson, K. A., Krampe, R. T., & Tesch-Römer, C.',
        year: '1993',
        title: 'The role of deliberate practice in the acquisition of expert performance.',
        publication: 'Psychological Review, 100(3), 363-406.'
      }
    ]
  },
  {
    id: 'color-of-competition',
    slug: 'color-of-competition',
    title: {
      en: 'The Colors of Competition: Mapping Court Sizes, Ball Progressions, and True Skill Mastery',
      es: 'Los Colores de la Competición: Mapeo de Tamaños de Cancha, Progresión de Pelotas y Dominio Técnico'
    },
    date: {
      en: 'February 11, 2026',
      es: '11 de febrero de 2026'
    },
    authorLine: {
      en: 'By Gabriel Vasquez · Published February 11, 2026',
      es: 'Por Gabriel Vasquez · Publicado el 11 de febrero de 2026'
    },
    excerpt: {
      en: 'To the untrained eye, youth tennis looks like a chaotic, multi-colored festival. Discover the biomechanics and spatial mathematics behind court scaling, and why ball colors depend on skill rather than age...',
      es: 'Para el ojo no entrenado, el tenis juvenil parece un festival caótico y multicolor. Descubre la biomecánica y la matemática espacial detrás del escalado de canchas, y por qué el color de la pelota depende de la habilidad y no de la edad...'
    },
    references: [
      {
        authors: 'International Tennis Federation (ITF).',
        year: '2012',
        title: 'Rules of Tennis - Appendix VII: Official Specifications for Stage 1, 2, and 3 Slower Balls.',
        publication: 'ITF Technical Publications.'
      },
      {
        authors: 'United States Tennis Association (USTA).',
        year: '2016',
        title: 'Junior Red, Orange, and Green Ball Tennis Regulations & Court Formatting Layouts.',
        publication: 'USTA Player Development.'
      },
      {
        authors: 'Buszard, T., Farrow, D., Reid, M., & Masters, R. S.',
        year: '2014',
        title: "Scaling the equipment and play environment in children's sport to improve implicit learning.",
        publication: 'Nonlinear Dynamics, Psychology, and Life Sciences, 18(2), 213-232.'
      }
    ]
  }
];
