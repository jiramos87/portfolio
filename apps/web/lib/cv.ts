/**
 * CV content, the source of truth for the HTML /cv page (EN + ES).
 *
 * Derived from the published PDFs under apps/web/public/cv. Keep this and the
 * PDFs in sync by hand. Honest self-representation only, no fabricated facts.
 */

import { CONTACT_EMAIL } from "@/lib/site";
import type { Lang } from "@/lib/i18n";

export interface CvExperience {
  role: string;
  org: string;
  period: string;
  location: string;
  bullets: string[];
}

export interface CvProject {
  name: string;
  context: string;
  body: string;
}

export interface CvEducation {
  title: string;
  org: string;
  period: string;
  location: string;
}

export interface CvPublication {
  title: string;
  venue: string;
  year: string;
  note: string;
  /** Official publisher page. */
  officialUrl?: string;
  /** Direct PDF (open access). */
  pdfUrl?: string;
}

/** Shared paper links (also surfaced on the About page). */
const PAPER_OFFICIAL = "https://direct.mit.edu/comj/issue/38/4";
const PAPER_PDF =
  "https://repositorio.uc.cl/server/api/core/bitstreams/b1361794-5db9-4f3f-8dc4-fc0b2e2d25d5/content";

export interface CvSkillGroup {
  group: string;
  items: string[];
}

export interface CvLanguageSkill {
  name: string;
  level: string;
}

export interface CvLabels {
  experience: string;
  projects: string;
  education: string;
  publications: string;
  skills: string;
  languages: string;
  downloadPdf: string;
}

export interface CvContent {
  /** Professional title shown under the name. */
  title: string;
  summary: string;
  labels: CvLabels;
  experience: CvExperience[];
  projects: CvProject[];
  education: CvEducation[];
  publications: CvPublication[];
  skills: CvSkillGroup[];
  languages: CvLanguageSkill[];
}

/** Language-invariant header facts (name, location, contacts). */
export const CV_PROFILE = {
  name: "Javier Ramos Humeres",
  location: "Santiago, Chile",
  email: CONTACT_EMAIL,
  github: { label: "github.com/jiramos87", url: "https://github.com/jiramos87" },
  linkedin: {
    label: "linkedin.com/in/javier-ramos-humeres",
    url: "https://www.linkedin.com/in/javier-ramos-humeres/",
  },
} as const;

const EN: CvContent = {
  title: "Software Engineer | Full-Stack, AI Agents & MCP (TypeScript / Node)",
  summary:
    "Full-stack software engineer with 4+ years building production systems end-to-end, from requirements and architecture to backend services, frontend, and cloud. Physics graduate with an AI-native workflow: ships production code daily with AI agents and builds custom agent tooling (Claude Code skills, MCP servers, automated issue-to-PR pipelines). Core stack: Node.js / NestJS, TypeScript, React / Next.js, Python, SQL, GraphQL, MongoDB, AWS, and GCP.",
  labels: {
    experience: "Professional experience",
    projects: "Projects",
    education: "Education",
    publications: "Publications",
    skills: "Skills",
    languages: "Languages",
    downloadPdf: "Download PDF",
  },
  experience: [
    {
      role: "Software Engineer",
      org: "TeselaGen",
      period: "08/2025 – Present",
      location: "Santiago, Chile (Hybrid)",
      bullets: [
        "Led the v1-to-v2 migration of a legacy biotech API to a modern NestJS / TypeScript clean-architecture backend: 58 controllers and 182 REST endpoints shipped to master across 40+ PRs, powering the platform's AI copilot and user-facing biotech tools.",
        "Built the agentic delivery pipeline behind that migration (custom Claude Code skills, a project MCP server, and an automated issue-to-PR workflow with verification), cutting per-controller migration time from a week to a day.",
        "Built a Python client SDK auto-generated from the backend's OpenAPI / Swagger docs, covering 100% of the v2 API surface by design, so scientists and engineers consume the platform's Custom Tools programmatically.",
        "Built backend services and React / Next.js frontend features across multiple user-facing tools, including the REST and GraphQL APIs and the data and integration layers that feed the AI features.",
      ],
    },
    {
      role: "Backend Developer",
      org: "Pinflag",
      period: "05/2022 – 08/2025",
      location: "Santiago, Chile",
      bullets: [
        "Built end-to-end payment integrations (Klap, Transbank, Getnet) for custom Shopify checkouts: confirmation webhooks, reconciliation, refunds, and failure recovery for ~10,000 orders/month.",
        "Built an analytics backend that auto-gathers and pre-aggregates ~10,000 orders/month through hourly and daily cron jobs, with a Chart.js dashboard and Excel / CSV export.",
        "Built event-driven microservices on AWS Lambda and the Serverless Framework (webhooks, SNS / SQS queues) powering payment integrations and customer notifications (~1,000 WhatsApp API messages/month).",
      ],
    },
  ],
  projects: [
    {
      name: "Agentic Dev Kit",
      context: "Open source · since 2026",
      body: "Claude Code skills, an MCP server, and PRD templates for spec-driven agentic delivery.",
    },
    {
      name: "World Music Map",
      context: "Live · since 2026",
      body: "An interactive music-discovery map. Next.js App Router (RSC), TypeScript, Prisma, PostgreSQL, and MapLibre.",
    },
  ],
  education: [
    {
      title: "Diploma in Software Engineering",
      org: "Universidad de Chile",
      period: "04/2025 – 08/2025",
      location: "Santiago, Chile",
    },
    {
      title: "B.Sc Physics",
      org: "Pontificia Universidad Católica de Chile",
      period: "2005 – 2010",
      location: "Santiago, Chile",
    },
    {
      title: "Full Stack Web Development",
      org: "4Geeks Academy",
      period: "2021 – 2022",
      location: "Santiago, Chile",
    },
  ],
  publications: [
    {
      title:
        "Sound Synthesis of a Gaussian Quantum Particle in an Infinite Square Well.",
      venue: "Computer Music Journal (MIT Press)",
      year: "2014",
      note: "Peer-reviewed; physics-based sound synthesis.",
      officialUrl: PAPER_OFFICIAL,
      pdfUrl: PAPER_PDF,
    },
  ],
  skills: [
    { group: "Languages", items: ["JavaScript", "TypeScript", "Python", "C#", "SQL"] },
    {
      group: "AI & Agentic Dev",
      items: [
        "Claude Code (desktop & CLI)",
        "MCP servers & tooling",
        "LLM integration (Anthropic API, OpenAI API)",
        "Agent skill & workflow design",
        "Cursor",
        "GitHub Copilot",
      ],
    },
    {
      group: "Backend",
      items: [
        "Node.js",
        "NestJS",
        "Express",
        "REST APIs",
        "GraphQL",
        "Microservices",
        "Clean architecture",
        "Authentication & encryption",
        "Serverless (AWS Lambda)",
      ],
    },
    { group: "Databases", items: ["PostgreSQL", "MongoDB"] },
    { group: "Frontend", items: ["React (Hooks)", "Next.js", "Tailwind CSS", "Chart.js"] },
    {
      group: "Testing",
      items: [
        "Jest",
        "bun test",
        "Cypress",
        "Playwright",
        "Unit / integration / e2e",
      ],
    },
    {
      group: "Cloud & DevOps",
      items: [
        "AWS (S3, SES, SNS, SQS, Lambda)",
        "GCP",
        "Docker",
        "GitHub Actions",
        "Heroku",
        "Serverless Framework",
        "CI/CD (GitHub / Heroku / AWS)",
      ],
    },
    {
      group: "Specialized",
      items: [
        "Payment gateways (Klap, Transbank, Getnet)",
        "E-commerce (Shopify)",
        "Order management",
        "WhatsApp API",
      ],
    },
  ],
  languages: [
    { name: "Spanish", level: "Native" },
    { name: "English", level: "Fluent" },
    { name: "Portuguese", level: "Conversational" },
  ],
};

const ES: CvContent = {
  title: "Ingeniero de Software | Full-Stack, Agentes de IA y MCP (TypeScript / Node)",
  summary:
    "Ingeniero de software full-stack con más de 4 años construyendo sistemas en producción de extremo a extremo, desde requerimientos y arquitectura hasta servicios backend, frontend y cloud. Licenciado en Física con un flujo de trabajo nativo en IA: escribe código en producción a diario con agentes de IA y construye herramientas de agentes a medida (skills de Claude Code, servidores MCP, pipelines automatizados de issue-a-PR). Stack principal: Node.js / NestJS, TypeScript, React / Next.js, Python, SQL, GraphQL, MongoDB, AWS y GCP.",
  labels: {
    experience: "Experiencia profesional",
    projects: "Proyectos",
    education: "Educación",
    publications: "Publicaciones",
    skills: "Habilidades",
    languages: "Idiomas",
    downloadPdf: "Descargar PDF",
  },
  experience: [
    {
      role: "Software Engineer",
      org: "TeselaGen",
      period: "08/2025 – Presente",
      location: "Santiago, Chile (Híbrido)",
      bullets: [
        "Migré de v1 a v2 una API legada de biotecnología a un backend moderno NestJS / TypeScript con arquitectura CLEAN: 58 controladores y 182 endpoints REST enviados a master en más de 40 PRs, impulsando el copiloto de IA y las herramientas biotech de la plataforma.",
        "Construí el pipeline agéntico detrás de esa migración (skills de Claude Code a medida, un servidor MCP de proyecto y un flujo automatizado de issue-a-PR con verificación), reduciendo el tiempo de migración por controlador de una semana a medio día.",
        "Desarrollé un cliente SDK en Python auto-generado desde la documentación OpenAPI / Swagger del backend NestJS, que cubre por diseño el 100% de la superficie de la API v2 para su consumo programático.",
        "Desarrollé front y back en React / Next.js en múltiples herramientas de usuario, incluyendo las APIs REST y GraphQL y las capas de datos e integración que alimentan las funcionalidades de IA.",
      ],
    },
    {
      role: "Backend Developer",
      org: "Pinflag",
      period: "05/2022 – 08/2025",
      location: "Santiago, Chile (Híbrido)",
      bullets: [
        "Construí integraciones de pago de extremo a extremo (Klap, Transbank, Getnet) para checkouts personalizados de Shopify: webhooks de confirmación, conciliación, reembolsos y recuperación de fallas para ~10.000 pedidos mensuales.",
        "Construí un backend de analítica que recolecta y pre-agrega automáticamente ~10.000 pedidos mensuales mediante cron jobs horarios y diarios, con dashboard en Chart.js y exportación a Excel / CSV.",
        "Construí microservicios event-driven sobre AWS Lambda y Serverless Framework (webhooks, colas SNS / SQS) para integraciones de pago y notificaciones a clientes (~1.000 mensajes mensuales vía API de WhatsApp).",
      ],
    },
  ],
  projects: [
    {
      name: "Agentic Dev Kit",
      context: "Open source · desde 2026",
      body: "Skills de Claude Code, un servidor MCP y plantillas de PRD para entrega agéntica spec-driven.",
    },
    {
      name: "World Music Map",
      context: "En vivo · desde 2026",
      body: "Un mapa interactivo de descubrimiento musical. Next.js App Router (RSC), TypeScript, Prisma, PostgreSQL y MapLibre.",
    },
  ],
  education: [
    {
      title: "Diplomado en Ingeniería de Software",
      org: "Universidad de Chile",
      period: "04/2025 – 08/2025",
      location: "Santiago, Chile",
    },
    {
      title: "Licenciatura en Física",
      org: "Pontificia Universidad Católica de Chile",
      period: "2005 – 2010",
      location: "Santiago, Chile",
    },
    {
      title: "Desarrollo Web Full Stack",
      org: "4Geeks Academy",
      period: "2021 – 2022",
      location: "Santiago, Chile",
    },
  ],
  publications: [
    {
      title:
        "Sound Synthesis of a Gaussian Quantum Particle in an Infinite Square Well.",
      venue: "Computer Music Journal (MIT Press)",
      year: "2014",
      note: "Revisado por pares; síntesis de sonido basada en física.",
      officialUrl: PAPER_OFFICIAL,
      pdfUrl: PAPER_PDF,
    },
  ],
  skills: [
    { group: "Lenguajes", items: ["JavaScript", "TypeScript", "Python", "C#", "SQL"] },
    {
      group: "IA y Desarrollo Agéntico",
      items: [
        "Claude Code (desktop y CLI)",
        "Servidores MCP y tooling",
        "Integración de LLMs (API de Anthropic, API de OpenAI)",
        "Diseño de skills y workflows de agentes",
        "Cursor",
        "GitHub Copilot",
      ],
    },
    {
      group: "Backend",
      items: [
        "Node.js",
        "NestJS",
        "Express",
        "APIs REST",
        "GraphQL",
        "Microservicios",
        "Arquitectura limpia",
        "Autenticación y encriptación",
        "Serverless (AWS Lambda)",
      ],
    },
    { group: "BBDD", items: ["PostgreSQL", "MongoDB"] },
    { group: "Frontend", items: ["React (Hooks)", "Next.js", "Tailwind CSS", "Chart.js"] },
    {
      group: "Testing",
      items: [
        "Jest",
        "bun test",
        "Cypress",
        "Playwright",
        "Unit / integración / e2e",
      ],
    },
    {
      group: "Cloud & DevOps",
      items: [
        "AWS (S3, SES, SNS, SQS, Lambda)",
        "GCP",
        "Docker",
        "GitHub Actions",
        "Heroku",
        "Serverless Framework",
        "CI/CD (GitHub / Heroku / AWS)",
      ],
    },
    {
      group: "Específicos",
      items: [
        "Pasarelas de pago (Klap, Transbank, Getnet)",
        "E-commerce (Shopify)",
        "Gestión de pedidos",
        "API de WhatsApp",
      ],
    },
  ],
  languages: [
    { name: "Español", level: "Nativo" },
    { name: "Inglés", level: "Avanzado" },
    { name: "Portugués", level: "Conversacional" },
  ],
};

export const CV_DATA: Record<Lang, CvContent> = { en: EN, es: ES };
