/**
 * About-page content (EN + ES). First-person, honest, no fabricated facts.
 * Authored fresh (not derived from the CV); the CV holds the structured facts.
 */

import type { Lang } from "@/lib/i18n";

export interface AboutSection {
  heading: string;
  paragraphs: string[];
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
  closing: { text: string; cvCta: string; contactCta: string };
}

const EN: AboutContent = {
  eyebrow: "ABOUT",
  heroHeadline: "I build production systems, and the agent tooling that ships them.",
  heroBlurb:
    "Full-stack software engineer with 4+ years shipping end to end, from requirements and architecture to backend, frontend, and cloud. Physics graduate, now building in public with AI coding agents.",
  headshotAlt: "Javier Ramos Humeres",
  careerHeading: "My path",
  careerParagraphs: [
    "I started in physics. A B.Sc from Universidad Católica taught me to model messy systems and trust fundamentals over hand-waving, and somewhere along the way I found I cared more about building the tools than running the experiments.",
    "So I went full-stack. At Pinflag I spent three years on the unglamorous, load-bearing parts of e-commerce: payment integrations, reconciliation, order fulfillment, analytics backends, the notifications nobody notices until they break. I learned what production really costs.",
    "At TeselaGen I lead a legacy-API migration to a modern NestJS clean-architecture backend, and build the data and integration layers behind an AI copilot for biotech tools. Around that work I started building an agentic-development toolchain, custom Claude Code skills, MCP servers, and ticket-to-PR workflows, that the whole team now uses.",
  ],
  howIWork: {
    heading: "How I work",
    paragraphs: [
      "I ship production code daily with AI coding agents, but the leverage isn't the autocomplete, it's the loop. Every feature starts as a written PRD, gets implemented against it, and only ships once a verify gate (typecheck, lint, build, Lighthouse, CI) closes green.",
      "Then a reconcile step diffs the spec against what actually shipped and updates the doc, so the PRD stays honest instead of drifting. This portfolio is exhibit number one: built in public, dogfooding that exact loop.",
    ],
  },
  methodologyCta: "See the methodology",
  beyondWork: {
    heading: "Beyond work",
    paragraphs: [
      "Outside the editor I'm a physics graduate who once published a paper on synthesizing sound from a quantum particle in a box, so I have a soft spot for the place where math, code, and craft overlap. I build isometric city-builders for fun and use them as testbeds for agentic workflows.",
      "I'm based in Santiago, Chile, work in English and Spanish, and care a lot about leaving systems more honest than I found them.",
    ],
  },
  closing: {
    text: "Want the facts? The CV has them. Want to talk? I'm one message away.",
    cvCta: "Read the CV",
    contactCta: "Get in touch",
  },
};

const ES: AboutContent = {
  eyebrow: "SOBRE MÍ",
  heroHeadline:
    "Construyo sistemas en producción, y las herramientas de agentes que los entregan.",
  heroBlurb:
    "Ingeniero de software full-stack con más de 4 años entregando de extremo a extremo, desde requerimientos y arquitectura hasta backend, frontend y cloud. Licenciado en física, ahora construyendo en público con agentes de IA.",
  headshotAlt: "Javier Ramos Humeres",
  careerHeading: "Mi camino",
  careerParagraphs: [
    "Empecé en la física. Una licenciatura en la Universidad Católica me enseñó a modelar sistemas complejos y a confiar en los fundamentos antes que en la intuición, y en algún momento descubrí que me importaba más construir las herramientas que correr los experimentos.",
    "Así que me fui al desarrollo full-stack. En Pinflag pasé tres años en las partes poco glamorosas pero críticas del e-commerce: integraciones de pago, conciliación, fulfillment de pedidos, backends de analítica y las notificaciones que nadie nota hasta que fallan. Aprendí lo que de verdad cuesta la palabra producción.",
    "En TeselaGen lidero la migración de una API legada a un backend moderno con NestJS y arquitectura limpia, y construyo las capas de datos e integración detrás de un copiloto de IA para herramientas biotech. Alrededor de ese trabajo empecé a construir un toolchain de desarrollo agéntico, skills de Claude Code a medida, servidores MCP y flujos de ticket-a-PR, que hoy usa todo el equipo.",
  ],
  howIWork: {
    heading: "Cómo trabajo",
    paragraphs: [
      "Escribo código en producción a diario con agentes de IA, pero la ventaja no está en el autocompletado, está en el ciclo. Cada funcionalidad parte como un PRD escrito, se implementa contra él y solo se entrega cuando la verificación (tipos, lint, build, Lighthouse, CI) cierra en verde.",
      "Después, un paso de reconciliación compara la especificación con lo que realmente se entregó y actualiza el documento, para que el PRD siga siendo honesto en lugar de quedar desactualizado. Este portafolio es el exhibit número uno: construido en público, haciendo dogfooding de ese mismo ciclo.",
    ],
  },
  methodologyCta: "Ver la metodología",
  beyondWork: {
    heading: "Más allá del trabajo",
    paragraphs: [
      "Fuera del editor soy un licenciado en física que alguna vez publicó un paper sobre sintetizar sonido a partir de una partícula cuántica en una caja, así que tengo debilidad por el cruce entre matemáticas, código y oficio. Construyo constructores de ciudades isométricos por diversión y los uso como banco de pruebas para flujos agénticos.",
      "Vivo en Santiago de Chile, trabajo en español e inglés, y me importa dejar los sistemas más honestos de como los encontré.",
    ],
  },
  closing: {
    text: "¿Quieres los hechos? El CV los tiene. ¿Quieres conversar? Estoy a un mensaje de distancia.",
    cvCta: "Leer el CV",
    contactCta: "Hablemos",
  },
};

export const ABOUT_DATA: Record<Lang, AboutContent> = { en: EN, es: ES };
