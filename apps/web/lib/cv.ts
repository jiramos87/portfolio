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
    url: "https://linkedin.com/in/javier-ramos-humeres",
  },
} as const;

const EN: CvContent = {
  title: "Software Engineer | Full-Stack & AI-Augmented Development",
  summary:
    "Full-stack software engineer with 4+ years building production systems end to end, from requirements and architecture to backend services, frontend, and cloud. Physics graduate who pairs strong fundamentals with an AI-augmented workflow: ships production code daily with AI coding agents, applying spec-driven and test-driven development, and builds custom agent tooling (Claude Code skills, MCP servers, automated issue-to-PR pipelines) adopted by the team. Core stack: Node.js / NestJS, TypeScript, React / Next.js, SQL, and AWS.",
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
        "Led a full legacy-API migration to a modern NestJS clean-architecture (v2) backend in TypeScript, modernizing the services that power TeselaGen's consumer-facing biotech tools.",
        "Build backend services and React / Next.js frontend features across multiple consumer tools, including the data and integration layers that serve the AI copilot.",
        "Built an agentic-development toolchain: custom Claude Code skills, MCP tools and servers, and automated ticket-to-PR workflows that speed up delivery across the team.",
        "Own authentication, security, and infrastructure concerns across the v2 services.",
      ],
    },
    {
      role: "Backend Developer",
      org: "Pinflag",
      period: "05/2022 – 08/2025",
      location: "Santiago, Chile",
      bullets: [
        "Built end-to-end payment integrations (Klap, Transbank): checkout flows, confirmation webhooks, reconciliation, refunds, and failure recovery.",
        "Developed order-management and fulfillment automation across the full order lifecycle for e-commerce clients.",
        "Designed and built a large-dataset analytics backend and its Chart.js dashboard frontend, with reporting and Excel / CSV data exports.",
        "Shipped customer-notification integrations (WhatsApp API) on Node.js / Express and AWS (S3, SES, SNS, Lambda).",
      ],
    },
  ],
  projects: [
    {
      name: "Isometric City-Builder (Unity, C#)",
      context: "Personal Project",
      body: "An end-to-end testbed for agentic development. Built a project-scoped MCP server, multi-agent and PRD-driven workflows, and a library of custom Claude Code skills and subagents that drive automated implement-and-verify loops from written specs.",
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
      group: "Backend",
      items: [
        "Node.js",
        "NestJS",
        "Express",
        "REST APIs",
        "Authentication & encryption",
        "Serverless (AWS Lambda)",
        "Sequelize",
        "TypeORM",
      ],
    },
    { group: "Databases", items: ["PostgreSQL", "MongoDB"] },
    { group: "Frontend", items: ["React (Hooks)", "Next.js", "Tailwind CSS", "Chart.js"] },
    { group: "Testing", items: ["Jest", "Test-Driven Development (TDD)"] },
    {
      group: "Cloud & DevOps",
      items: [
        "AWS (S3, SES, SNS, CloudWatch, Lambda)",
        "GCP",
        "GitHub Actions",
        "Heroku",
        "Serverless Framework",
        "CI/CD (GitHub / Heroku / AWS)",
      ],
    },
    {
      group: "AI & Agentic Dev",
      items: [
        "Claude Code (desktop & CLI)",
        "MCP tool and server authoring",
        "Agent skill & workflow design",
        "Spec-Driven Development (SDD)",
        "Cursor",
        "GitHub Copilot",
      ],
    },
    {
      group: "Specialized",
      items: [
        "Payment gateways (Klap, Transbank)",
        "E-commerce (Shopify, WooCommerce)",
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
  title: "Ingeniero de Software | Full-Stack y Desarrollo Aumentado con IA",
  summary:
    "Ingeniero de software full-stack con más de 4 años construyendo sistemas en producción de extremo a extremo, desde requerimientos y arquitectura hasta servicios backend, frontend y cloud. Licenciado en Física que combina fundamentos sólidos con un flujo de trabajo aumentado con IA: escribe código en producción a diario con agentes de IA, aplicando desarrollo guiado por especificaciones y por pruebas, y construye herramientas de agentes a medida (skills de Claude Code, servidores MCP, pipelines automatizados de issue-a-PR) adoptadas por el equipo. Stack principal: Node.js / NestJS, TypeScript, React / Next.js, SQL y AWS.",
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
        "Lideré una migración completa de la API legada a un backend moderno en TypeScript con NestJS y arquitectura limpia (v2), modernizando los servicios que impulsan las herramientas biotech de TeselaGen orientadas al usuario.",
        "Desarrollo servicios backend y funcionalidades frontend en React / Next.js en múltiples herramientas de usuario, incluyendo las capas de datos e integración que alimentan el copiloto de IA.",
        "Construí un toolchain de desarrollo agéntico: skills de Claude Code a medida, herramientas y servidores MCP, y flujos automatizados de ticket-a-PR que aceleran la entrega en todo el equipo.",
        "Responsable de autenticación, seguridad e infraestructura en los servicios v2.",
      ],
    },
    {
      role: "Backend Developer",
      org: "Pinflag",
      period: "05/2022 – 08/2025",
      location: "Santiago, Chile (Híbrido)",
      bullets: [
        "Construí integraciones de pago de extremo a extremo (Klap, Transbank, Getnet): flujos de checkout, webhooks de confirmación, conciliación, reembolsos y recuperación ante fallos.",
        "Automaticé la gestión y el fulfillment de pedidos para clientes de e-commerce.",
        "Desarrollé un backend de analítica para grandes volúmenes de datos y su dashboard frontend en Chart.js, con exportación de datos a Excel / CSV.",
        "Integré notificaciones a clientes (API de WhatsApp) en Node.js / Express y AWS (S3, SES, SNS, Lambda).",
      ],
    },
  ],
  projects: [
    {
      name: "Constructor de Ciudad Isométrico (Unity, C#)",
      context: "Proyecto Personal",
      body: "Banco de pruebas de extremo a extremo para desarrollo agéntico. Construí un servidor MCP a nivel de proyecto, flujos de trabajo multi-agente y dirigidos por PRD, y una librería de skills y subagentes de Claude Code a medida que ejecutan ciclos automatizados de implementar-y-verificar a partir de especificaciones escritas.",
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
      group: "Backend",
      items: [
        "Node.js",
        "NestJS",
        "Express",
        "REST APIs",
        "Autenticación y encriptación",
        "Serverless (AWS Lambda)",
        "Sequelize",
        "TypeORM",
      ],
    },
    { group: "BBDD", items: ["PostgreSQL", "MongoDB"] },
    { group: "Frontend", items: ["React (Hooks)", "Next.js", "Tailwind CSS", "Chart.js"] },
    { group: "Testing", items: ["Jest", "Desarrollo guiado por pruebas (TDD)"] },
    {
      group: "Cloud & DevOps",
      items: [
        "AWS (S3, SES, SNS, CloudWatch, Lambda)",
        "GCP",
        "GitHub Actions",
        "Heroku",
        "Serverless",
        "CI/CD (GitHub / Heroku / AWS)",
      ],
    },
    {
      group: "AI & Agentic Dev",
      items: [
        "Claude Code (desktop y CLI)",
        "Creación de herramientas y servidores MCP",
        "Diseño de skills y workflows de agentes",
        "Desarrollo guiado por especificaciones (SDD)",
        "Cursor",
        "GitHub Copilot",
      ],
    },
    {
      group: "Específicos",
      items: [
        "Pasarelas de pago (Klap, Transbank, Getnet)",
        "E-commerce (Shopify, WooCommerce)",
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
