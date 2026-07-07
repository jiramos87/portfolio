/**
 * About-page content (EN + ES). First-person, honest, no fabricated facts.
 * Authored fresh (not derived from the CV); the CV holds the structured facts.
 */

import type { Lang } from "@/lib/i18n";

export interface AboutSection {
  heading: string;
  paragraphs: string[];
}

export type MusicPlatform =
  | "spotify"
  | "appleMusic"
  | "youtube"
  | "instagram"
  | "facebook"
  | "bandcamp";

export interface MusicLink {
  platform: MusicPlatform;
  url: string;
}

export interface MusicImage {
  src: string;
  alt: string;
}

export interface MusicProject {
  name: string;
  /** Short era/role line, e.g. "My main band". */
  tagline: string;
  blurb: string;
  accent: "magenta" | "amber";
  /** Hero image. `contain` (e.g. a square EP cover) sits on a tinted backdrop. */
  image: string;
  imageAlt: string;
  imageFit: "cover" | "contain";
  /** Optional small badge (band logo) shown beside the name. */
  logo?: string;
  /** Optional extra thumbnails. */
  gallery?: MusicImage[];
  links: MusicLink[];
}

export interface Publication {
  title: string;
  venue: string;
  year: string;
  note: string;
  officialUrl: string;
  pdfUrl: string;
}

export interface AboutContent {
  eyebrow: string;
  heroHeadline: string;
  heroBlurb: string;
  headshotAlt: string;
  careerHeading: string;
  careerParagraphs: string[];
  howIWork: AboutSection;
  methodologyCta: string;
  beyondWork: AboutSection;
  musicHeading: string;
  musicBlurb: string;
  /** Personal musician profile line (e.g. "I play trombone. Follow along:"). */
  musicPersonalLabel: string;
  music: MusicProject[];
  publicationHeading: string;
  publication: Publication;
  closing: { text: string; cvCta: string; contactCta: string };
}

// Links found via search; Bacayo defaults to the "Bacayo Brass Band" identity
// tied to the EP "Bacayo Brass Band 1". Confirm/correct before launch.
const MORAL_LINKS: MusicLink[] = [
  { platform: "spotify", url: "https://open.spotify.com/artist/4IdI1p8OrVpot6dbdCl3wv" },
  { platform: "appleMusic", url: "https://music.apple.com/cl/artist/moral-distraida/852393789" },
  { platform: "youtube", url: "https://music.youtube.com/channel/UC-ZSGrc9CN9MZhBPL6UwdJw" },
  { platform: "instagram", url: "https://www.instagram.com/moraldistraida/" },
  { platform: "facebook", url: "https://www.facebook.com/lamoraldistraida/" },
];

const BACAYO_LINKS: MusicLink[] = [
  { platform: "spotify", url: "https://open.spotify.com/artist/2QgMocp3OtfF84ggSItadn" },
  { platform: "appleMusic", url: "https://music.apple.com/us/artist/bacayo-brass-band/1567986859" },
];

/** Javier's own musician profile (trombone). */
export const JAVI_INSTAGRAM = {
  handle: "@javi.trombon",
  url: "https://www.instagram.com/javi.trombon/",
} as const;

const MORAL_IMG = "/about/music/javier-ramos-trombone-moral-distraida.webp";
const MORAL_LOGO = "/about/music/moral-distraida-logo.webp";
const MORAL_GALLERY: MusicImage[] = [
  { src: "/about/music/moral-distraida-2.webp", alt: "Moral Distraída live" },
  { src: "/about/music/moral-distraida-3.webp", alt: "Moral Distraída live" },
];
const BACAYO_IMG = "/about/music/bacayo-brass-band.webp";

const PAPER = {
  title:
    "Sound Synthesis of a Gaussian Quantum Particle in an Infinite Square Well.",
  venue: "Computer Music Journal 38:4 (MIT Press)",
  year: "2014",
  officialUrl: "https://direct.mit.edu/comj/issue/38/4",
  pdfUrl:
    "https://repositorio.uc.cl/server/api/core/bitstreams/b1361794-5db9-4f3f-8dc4-fc0b2e2d25d5/content",
} as const;

const EN: AboutContent = {
  eyebrow: "ABOUT",
  heroHeadline: "I build production systems with agentic tools.",
  heroBlurb:
    "Full-stack software engineer with 4+ years shipping end to end, from requirements and architecture to backend, frontend, and cloud. Physics graduate, now building with AI coding agents.",
  headshotAlt: "Javier Ramos Humeres",
  careerHeading: "My path",
  careerParagraphs: [
    "I started in Astronomy and then moved to physics. A B.Sc from Universidad Católica taught me to model messy systems, basic programming, electronics and audio technology, and also to trust fundamentals over hand-waving. Somewhere along the way I found I cared more about building than running the experiments.",
    "So I went full-stack. At Pinflag I spent three years on the load-bearing parts of e-commerce: payment integrations, reconciliation, order fulfillment, analytics backends. I learned what production at scale really costs.",
    "At TeselaGen I lead a legacy-API migration to a modern NestJS clean-architecture backend, build the REST and GraphQL APIs and data layers behind an AI copilot for biotech tools, and wrote a Python client SDK that turns the backend's OpenAPI docs into a programmatic client. Around that work I started building an agentic-development toolchain, custom Claude Code skills, MCP servers, and ticket-to-PR workflows.",
  ],
  howIWork: {
    heading: "How I work",
    paragraphs: [
      "I ship production code daily with AI coding agents, using spec-driven and test-driven development. I also pair with teammates on system design and on the urgent, unglamorous issues that keep a product healthy. Every feature starts as a written PRD, is implemented against it, and ships only when CI is green and a peer has approved it.",
      "After shipping, I fold the lessons back into the toolchain: the repo context, the skills, and the agent's memory, so the next session starts better prepared. This portfolio is exhibit number one, built in public with that exact loop. Right now I'm experimenting with autonomous loop workflows to push throughput and quality further.",
    ],
  },
  methodologyCta: "See the methodology",
  beyondWork: {
    heading: "Beyond work",
    paragraphs: [
      "Outside the editor I'm a physics graduate and a former working musician, so I have a soft spot for where math, code, sound, and craft overlap. I build isometric city-builders for fun and use them as testbeds for agentic workflows. I also make sure to go to the gym for some strength training so I can keep lifting my two kids.",
      "I'm based in Santiago, Chile, work in English and Spanish, and care a lot about leaving systems more honest than I found them.",
    ],
  },
  musicHeading: "Music",
  musicBlurb: "Music had its own chapter. Two projects I'm proud of:",
  musicPersonalLabel: "I play trombone. Follow along:",
  music: [
    {
      name: "Moral Distraída",
      tagline: "Trombone, my main band",
      blurb:
        "A Chilean tropical and urban-fusion act, reggaetón and Cuban timba over cumbia, that grew to a big live following and hundreds of thousands of listeners.",
      accent: "magenta",
      image: MORAL_IMG,
      imageAlt: "Javier Ramos playing trombone with Moral Distraída",
      imageFit: "cover",
      logo: MORAL_LOGO,
      gallery: MORAL_GALLERY,
      links: MORAL_LINKS,
    },
    {
      name: "Bacayo Brass",
      tagline: "My own project, released an EP",
      blurb:
        "A brass-driven project of my own that wrote, recorded, and released its own EP.",
      accent: "amber",
      image: BACAYO_IMG,
      imageAlt: "Bacayo Brass EP cover",
      imageFit: "contain",
      links: BACAYO_LINKS,
    },
  ],
  publicationHeading: "Publication",
  publication: { ...PAPER, note: "Peer-reviewed. Physics-based sound synthesis." },
  closing: {
    text: "Want the facts? The CV has them. Want to talk? I'm one message away.",
    cvCta: "Read the CV",
    contactCta: "Get in touch",
  },
};

const ES: AboutContent = {
  eyebrow: "SOBRE MÍ",
  heroHeadline: "Construyo sistemas en producción con herramientas agénticas.",
  heroBlurb:
    "Ingeniero de software full-stack con más de 4 años entregando de extremo a extremo, desde requerimientos y arquitectura hasta backend, frontend y cloud. Licenciado en física, ahora construyendo con agentes de IA.",
  headshotAlt: "Javier Ramos Humeres",
  careerHeading: "Mi camino",
  careerParagraphs: [
    "Empecé en Astronomía y luego me pasé a la física. Una licenciatura en la Universidad Católica me enseñó a modelar sistemas complejos, programación básica, electrónica y tecnología del audio, y también a confiar en los fundamentos antes que en la intuición. En algún momento descubrí que me importaba más construir que correr los experimentos.",
    "Así que me fui al desarrollo full-stack. En Pinflag pasé tres años en las partes críticas del e-commerce: integraciones de pago, conciliación, fulfillment de pedidos, backends de analítica. Aprendí lo que de verdad cuesta la producción a escala.",
    "En TeselaGen lidero la migración de una API legada a un backend moderno con NestJS y arquitectura limpia, construyo las APIs REST y GraphQL y las capas de datos detrás de un copiloto de IA para herramientas biotech, y escribí un SDK cliente en Python que convierte la documentación OpenAPI del backend en un cliente programático. Alrededor de ese trabajo empecé a construir un toolchain de desarrollo agéntico, skills de Claude Code a medida, servidores MCP y flujos de ticket-a-PR.",
  ],
  howIWork: {
    heading: "Cómo trabajo",
    paragraphs: [
      "Escribo código en producción a diario con agentes de IA, con desarrollo guiado por especificaciones y por pruebas. También trabajo en pareja con colegas en diseño de sistemas y en los problemas urgentes y poco glamorosos que mantienen sano un producto. Cada funcionalidad parte como un PRD escrito, se implementa contra él y solo se entrega cuando el CI está en verde y un par la aprobó.",
      "Después de entregar, devuelvo las lecciones al toolchain: el contexto del repo, las skills y la memoria del agente, para que la próxima sesión parta mejor preparada. Este portafolio es el exhibit número uno, construido en público con ese mismo ciclo. Hoy estoy experimentando con flujos de loop autónomo para subir aún más el ritmo y la calidad.",
    ],
  },
  methodologyCta: "Ver la metodología",
  beyondWork: {
    heading: "Más allá del trabajo",
    paragraphs: [
      "Fuera del editor soy licenciado en física y fui músico de oficio, así que tengo debilidad por el cruce entre matemáticas, código, sonido y oficio. Construyo constructores de ciudades isométricos por diversión y los uso como banco de pruebas para flujos agénticos. También me aseguro de ir al gimnasio a hacer algo de fuerza para poder seguir levantando a mis dos hijos.",
      "Vivo en Santiago de Chile, trabajo en español e inglés, y me importa dejar los sistemas más honestos de como los encontré.",
    ],
  },
  musicHeading: "Música",
  musicBlurb: "La música tuvo su propio capítulo. Dos proyectos de los que estoy orgulloso:",
  musicPersonalLabel: "Toco trombón. Sígueme:",
  music: [
    {
      name: "Moral Distraída",
      tagline: "Trombón, mi banda principal",
      blurb:
        "Una banda chilena de fusión tropical y urbana, reggaetón y timba cubana sobre cumbia, que llegó a un gran público en vivo y a cientos de miles de oyentes.",
      accent: "magenta",
      image: MORAL_IMG,
      imageAlt: "Javier Ramos tocando trombón con Moral Distraída",
      imageFit: "cover",
      logo: MORAL_LOGO,
      gallery: MORAL_GALLERY,
      links: MORAL_LINKS,
    },
    {
      name: "Bacayo Brass",
      tagline: "Proyecto propio, publicó un EP",
      blurb:
        "Un proyecto propio con sonido de bronces que compuso, grabó y publicó su propio EP.",
      accent: "amber",
      image: BACAYO_IMG,
      imageAlt: "Portada del EP de Bacayo Brass",
      imageFit: "contain",
      links: BACAYO_LINKS,
    },
  ],
  publicationHeading: "Publicación",
  publication: { ...PAPER, note: "Revisado por pares. Síntesis de sonido basada en física." },
  closing: {
    text: "¿Quieres los hechos? El CV los tiene. ¿Quieres conversar? Estoy a un mensaje de distancia.",
    cvCta: "Leer el CV",
    contactCta: "Hablemos",
  },
};

export const ABOUT_DATA: Record<Lang, AboutContent> = { en: EN, es: ES };
