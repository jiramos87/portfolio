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
  /** Optional per-role technology line (ATS-style keyword list). */
  stack?: string;
}

export interface CvProject {
  name: string;
  context: string;
  body: string;
  /** Optional per-project technology line. */
  stack?: string;
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
  technologies: string;
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
  title: "Full Stack Developer, AI Agents & MCP",
  summary:
    "Fullstack developer with 4+ years building production systems end to end, with the last year focused on generative AI development in corporate environments: language-model (LLM) integration, intelligent agents, and agentic tooling for a US biotech SaaS. Specialized in TypeScript, Node.js / NestJS, React / Next.js, and Python, with REST / GraphQL APIs, microservices, and CI/CD. Cloud experience on AWS and GCP. Looking to contribute to high-impact projects that combine solid full-stack development with generative AI.",
  labels: {
    experience: "Professional experience",
    projects: "Projects",
    education: "Education",
    publications: "Publications",
    skills: "Skills",
    languages: "Languages",
    downloadPdf: "Download PDF",
    technologies: "Technologies",
  },
  experience: [
    {
      role: "Software Engineer",
      org: "TeselaGen",
      period: "08/2025 – Present",
      location: "Santiago, Chile (Hybrid)",
      bullets: [
        "Development for the generative AI platform of a US biotech SaaS: contributed to a specialized AI agent and led the v1-to-v2 migration of the API that feeds the platform's AI copilot (LLM agent) and its Custom Tools: 58 controllers and 182 REST endpoints in NestJS with clean architecture.",
        "Built the tool-chain for the development cycle: Claude Code skills, an MCP server, and issue-to-PR automation, cutting per-controller migration time from ~1 week to ~1 day.",
        "Developed the API's Python client SDK (auto-generated from the OpenAPI / Swagger documentation), covering 100% of the v2 surface by design and exposing it for programmatic consumption.",
        "Developed frontend and backend in React / Next.js and NestJS across multiple user-facing tools, including the data and integration layers that feed generative AI features.",
      ],
      stack:
        "TypeScript, Node.js, NestJS, Python, React, Next.js, PostgreSQL, GraphQL, OpenAPI / Swagger, Claude Code, MCP servers, Anthropic API, LangChain, LangGraph, Docker, GitHub Actions (CI/CD).",
    },
    {
      role: "Backend Developer",
      org: "Pinflag",
      period: "05/2022 – 08/2025",
      location: "Santiago, Chile (Hybrid)",
      bullets: [
        "Built end-to-end payment integrations (Klap, Transbank, Getnet) for custom Shopify checkouts: checkout flows, confirmation webhooks, reconciliation, refunds, and failure recovery for ~10,000 orders/month.",
        "Built an analytics backend that automatically gathers and pre-aggregates ~10,000 orders/month through hourly and daily cron jobs, with a Chart.js dashboard, Python scripts, and Excel / CSV export.",
        "Built event-driven microservices on AWS Lambda and the Serverless Framework (webhooks, SNS / SQS queues) for payment integrations and customer notifications (~1,000 messages/month via the WhatsApp API).",
      ],
      stack:
        "Node.js, Express, TypeScript, React, Python, Django, FastAPI, PostgreSQL, MongoDB, Sequelize, AWS (Lambda, S3, SQS, SNS, SES), Serverless Framework, Docker, CI/CD, Shopify, WhatsApp API.",
    },
  ],
  projects: [
    {
      name: "Chatbot IA (portfolio-app)",
      context: "Live · since 2026",
      body: "An end-to-end LLM conversational agent that can discuss topics relevant to my professional profile as a developer. Deployed in production.",
      stack:
        "Python, LangGraph, Anthropic API, TypeScript, Next.js, PostgreSQL, Railway, Vercel, OpenRouter.",
    },
    {
      name: "Agentic Dev Kit",
      context: "Open source · since 2026",
      body: "Spec-driven Claude Code skills and MCP server.",
    },
    {
      name: "World Music Map",
      context: "since 2026",
      body: "An interactive music-discovery map.",
      stack: "Next.js App Router (RSC), TypeScript, Prisma, PostgreSQL, MapLibre.",
    },
  ],
  education: [
    {
      title: "Software Engineering Diploma",
      org: "Universidad de Chile",
      period: "04/2025 – 08/2025",
      location: "Santiago, Chile",
    },
    {
      title: "B.Sc. in Physics",
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
    { group: "Languages", items: ["TypeScript", "JavaScript", "Python", "C#", "SQL"] },
    {
      group: "AI & Agentic Dev",
      items: [
        "LLM integration (Anthropic API, OpenAI API)",
        "Intelligent agents",
        "MCP servers & tooling",
        "Claude Code (desktop & CLI)",
        "Agent skill & workflow design",
        "Cursor",
      ],
    },
    {
      group: "Backend",
      items: [
        "Node.js",
        "NestJS",
        "Express",
        "Django",
        "FastAPI",
        "Flask",
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
      items: ["Jest", "bun test", "Cypress", "Playwright", "Unit / integration / e2e"],
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
  title: "Desarrollador Full Stack, Agentes de IA y MCP",
  summary:
    "Desarrollador fullstack con más de 4 años de experiencia construyendo sistemas en producción de extremo a extremo, con el último año enfocado en IA generativa en entornos corporativos: integración de modelos de lenguaje (LLMs), agentes inteligentes y tooling agéntico para un SaaS biotech de EE.UU. Especializado en TypeScript, Node.js / NestJS, React / Next.js y Python, con APIs REST / GraphQL, microservicios y CI/CD. Experiencia cloud en AWS y GCP. Busco aportar en proyectos de alto impacto que combinen desarrollo full stack sólido con IA generativa.",
  labels: {
    experience: "Experiencia profesional",
    projects: "Proyectos",
    education: "Educación",
    publications: "Publicaciones",
    skills: "Habilidades",
    languages: "Idiomas",
    downloadPdf: "Descargar PDF",
    technologies: "Tecnologías",
  },
  experience: [
    {
      role: "Software Engineer",
      org: "TeselaGen",
      period: "08/2025 – Presente",
      location: "Santiago, Chile (Híbrido)",
      bullets: [
        "Desarrollo para la plataforma de IA generativa de un SaaS biotech de EE.UU.: participé del desarrollo de un agente de IA especializado y lideré la migración v1 a v2 de la API que alimenta al copiloto de IA (agente LLM) y sus Custom Tools: 58 controladores y 182 endpoints REST en NestJS con arquitectura clean.",
        "Construí el tool-chain para el ciclo de desarrollo: skills de Claude Code, un servidor MCP y automatización issue-a-PR, reduciendo el tiempo de migración por controlador de ~1 semana a ~1 día.",
        "Desarrollé en Python el cliente SDK de la API (auto-generado desde la documentación OpenAPI / Swagger), que cubre por diseño el 100% de la superficie v2 y la expone para consumo programático.",
        "Desarrollé frontend y backend en React / Next.js y NestJS en múltiples herramientas de usuario, incluyendo las capas de datos e integración que alimentan funcionalidades de IA generativa.",
      ],
      stack:
        "TypeScript, Node.js, NestJS, Python, React, Next.js, PostgreSQL, GraphQL, OpenAPI / Swagger, Claude Code, servidores MCP, API de Anthropic, LangChain, LangGraph, Docker, GitHub Actions (CI/CD).",
    },
    {
      role: "Backend Developer",
      org: "Pinflag",
      period: "05/2022 – 08/2025",
      location: "Santiago, Chile (Híbrido)",
      bullets: [
        "Construí integraciones de pago de extremo a extremo (Klap, Transbank, Getnet) para checkouts personalizados de Shopify: flujos de checkout, webhooks de confirmación, conciliación, reembolsos y recuperación de fallas para ~10.000 pedidos mensuales.",
        "Construí un backend de analítica que recolecta y pre-agrega automáticamente ~10.000 pedidos mensuales mediante cron jobs horarios y diarios, con dashboard en Chart.js, scripts en Python y exportación a Excel / CSV.",
        "Construí microservicios event-driven sobre AWS Lambda y Serverless Framework (webhooks, colas SNS / SQS) para integraciones de pago y notificaciones a clientes (~1.000 mensajes mensuales vía API de WhatsApp).",
      ],
      stack:
        "Node.js, Express, TypeScript, React, Python, Django, FastAPI, PostgreSQL, MongoDB, Sequelize, AWS (Lambda, S3, SQS, SNS, SES), Serverless Framework, Docker, CI/CD, Shopify, API de WhatsApp.",
    },
  ],
  projects: [
    {
      name: "Chatbot IA (portfolio-app)",
      context: "En vivo · desde 2026",
      body: "Un agente conversacional LLM desarrollado de extremo a extremo, capaz de conversar sobre temas relevantes a mi perfil profesional como desarrollador. Desplegado en producción.",
      stack:
        "Python, LangGraph, API de Anthropic, TypeScript, Next.js, PostgreSQL, Railway, Vercel, OpenRouter.",
    },
    {
      name: "Agentic Dev Kit",
      context: "Open source · desde 2026",
      body: "Skills spec-driven de Claude Code y servidor MCP.",
    },
    {
      name: "World Music Map",
      context: "desde 2026",
      body: "Un mapa interactivo de descubrimiento musical.",
      stack: "Next.js App Router (RSC), TypeScript, Prisma, PostgreSQL, MapLibre.",
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
    { group: "Lenguajes", items: ["TypeScript", "JavaScript", "Python", "C#", "SQL"] },
    {
      group: "IA y Desarrollo Agéntico",
      items: [
        "Integración de LLMs (API de Anthropic, API de OpenAI)",
        "Agentes inteligentes",
        "Servidores MCP y tooling",
        "Claude Code (desktop y CLI)",
        "Diseño de skills y workflows de agentes",
        "Cursor",
      ],
    },
    {
      group: "Backend",
      items: [
        "Node.js",
        "NestJS",
        "Express",
        "Django",
        "FastAPI",
        "Flask",
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
      items: ["Jest", "bun test", "Cypress", "Playwright", "Unit / integración / e2e"],
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
