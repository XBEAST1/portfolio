import type { StaticImageData } from "next/image";

import dimitrescuWallpapersGallery1 from "@/app/assets/dimitrescu-wallpapers/1.jpg";
import dimitrescuWallpapersHero from "@/app/assets/dimitrescu-wallpapers/2.jpg";
import dimitrescuWallpapersGallery3 from "@/app/assets/dimitrescu-wallpapers/3.jpg";
import dimitrescuWallpapersGallery4 from "@/app/assets/dimitrescu-wallpapers/4.jpg";
import dreamVeilImage from "@/app/assets/dreamveil.jpg";
import nextPgpManageKeyrings from "@/app/assets/nextpgp/1.jpg";
import nextPgpKeyringDetails from "@/app/assets/nextpgp/2.jpg";
import nextPgpGenerateKeyring from "@/app/assets/nextpgp/3.jpg";
import nextPgpEncrypt from "@/app/assets/nextpgp/4.jpg";
import nextPgpDecrypt from "@/app/assets/nextpgp/5.jpg";
import nextPgpCreateVault from "@/app/assets/nextpgp/6.jpg";
import nextPgpCloudBackup from "@/app/assets/nextpgp/7.jpg";

export interface NavigationLink {
  readonly label: string;
  readonly href: string;
}

export interface Project {
  readonly id: string;
  readonly number: string;
  readonly title: string;
  readonly category: string;
  readonly stack: string;
  readonly image: StaticImageData;
  readonly href: string;
  readonly tagline: string;
  readonly overview: string;
  readonly role: string;
  readonly timeline: string;
  readonly liveDemoLabel: string;
  readonly techStack: readonly string[];
  readonly highlights: readonly string[];
  readonly metrics: readonly ProjectMetric[];
  readonly gallery: readonly StaticImageData[];
}

export interface ProjectMetric {
  readonly label: string;
  readonly value: string;
}

export interface Service {
  readonly number: string;
  readonly title: string;
  readonly description: string;
  readonly tags: readonly string[];
}

export interface Philosophy {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
}

export interface SocialLink {
  readonly label: string;
  readonly href: string;
}

export interface Experience {
  readonly number: string;
  readonly role: string;
  readonly company: string;
  readonly period: string;
  readonly highlights: readonly string[];
}

export const displayName: string = "Muhammad Hamza";
export const navbarBrandName: string = "HAMZA";
export const roleTitle: string = "Full Stack AI Engineer";
export const location: string = "Karachi, PK";

export const heroStackLabel: string = "Stack";

export const heroStackTags: readonly string[] = [
  "Next.js",
  "FastAPI",
  "PostgreSQL",
] as const;

export const emailAddress: string = "muhammadhamzariaz@proton.me";

export const homeHref: string = "/";

export const workSectionHref: string = "/#work";
export const servicesSectionHref: string = "/#services";
export const experienceSectionHref: string = "/#experience";
export const aboutSectionHref: string = "/#about";
export const contactSectionHref: string = "/#contact";

export const resumePdfHref: string = "/Muhammad_Hamza_Riaz_Resume.pdf";

export const emailMailtoHref: string = `mailto:${emailAddress}`;

export const navigationLinks: readonly NavigationLink[] = [
  { label: "Work", href: workSectionHref },
  { label: "Services", href: servicesSectionHref },
  { label: "Experience", href: experienceSectionHref },
  { label: "About", href: aboutSectionHref },
  { label: "Contact", href: contactSectionHref },
] as const;

export const projects: readonly Project[] = [
  {
    id: "dream-veil",
    number: "01",
    title: "DREAM VEIL",
    category: "AI Dream Interpreter",
    stack: "Next.js / FastAPI / pgvector / Gemini",
    image: dreamVeilImage,
    href: "https://dream-veil.vercel.app",
    tagline:
      "An AI dream journal with real-time interpretation, semantic pattern matching, and a zero-knowledge Blind Vault.",
    overview:
      "Dream Veil is an AI-powered dream journaling platform built around contextual interpretation and semantic pattern recognition. Users record dreams, receive streaming psychoanalysis from Gemini 2.5 Flash, and discover thematic links across their history, all while optional E2EE ensures the server never permanently stores plaintext narratives or interpretations.",
    role: "Full stack architecture, E2EE systems, RAG pipeline, AI orchestration",
    timeline: "2026 - Present",
    liveDemoLabel: "View Live Demo",
    techStack: [
      "Next.js",
      "TypeScript",
      "Redux",
      "Tailwind CSS",
      "Web Crypto API",
      "FastAPI",
      "SQLAlchemy 2.0",
      "PostgreSQL",
      "pgvector",
      "Redis",
      "SSE",
      "Gemini 2.5 Flash",
      "Gemini Embedding",
      "Cross-Encoder Rerank",
      "BM25 / RRF",
      "Docker",
      "AWS Lambda",
    ],
    highlights: [
      "Architected the Blind Vault — a 4-phase zero-knowledge E2EE handshake across REST and SSE, with resumable batch migration for large libraries.",
      "Built a 6-phase production RAG pipeline: hybrid pgvector + BM25 retrieval, reciprocal rank fusion, cross-encoder reranking, and grounding guards.",
      "Streamed multimodal AI interpretations in real time via Server-Sent Events, with Redis-backed context caching and intelligent Gemini API key rotation.",
    ],
    metrics: [
      { label: "Architecture", value: "Zero-Knowledge" },
      { label: "Retrieval", value: "Hybrid RAG" },
      { label: "Real-Time", value: "SSE Streaming" },
    ],
    gallery: [dreamVeilImage],
  },
  {
    id: "next-pgp",
    number: "02",
    title: "NEXT PGP",
    category: "Secure Messaging",
    stack: "Next.js / Hero UI / PostgreSQL / OpenPGP",
    image: nextPgpManageKeyrings,
    href: "https://nextpgp.vercel.app",
    tagline:
      "A zero-knowledge PGP Progressive Web App for key generation, keyring management, and end-to-end encrypted cloud vaults — all in the browser.",
    overview:
      "Next PGP is a full-featured cryptographic workstation delivered as a PWA. Users generate keys across modern algorithms (Curve25519, NIST curves, RSA), manage keyrings locally in IndexedDB, encrypt and decrypt messages and files including batch and folder operations and optionally sync encrypted backups through a zero-knowledge cloud vault. Every cryptographic operation runs client-side via the Web Crypto API, vault passwords are never sent to the server, and a dynamic Web Worker pool scales heavy workloads across all CPU cores without blocking the UI.",
    role: "Solo product design, zero-knowledge architecture, full stack engineering, PWA",
    timeline: "2024 - Present",
    liveDemoLabel: "View Live Demo",
    techStack: [
      "Next.js",
      "Hero UI",
      "OpenPGP.js",
      "Web Crypto API",
      "IndexedDB",
      "PostgreSQL",
      "PWA",
      "Web Workers",
      "PBKDF2",
      "AES-256-GCM",
      "TypeScript",
    ],
    highlights: [
      "Designed a zero-knowledge vault with PBKDF2-SHA512 (1M iterations), AES-256-GCM, HMAC integrity checks, and client-side verification ciphers — the server never sees plaintext keys or passwords.",
      "Built a dynamic Web Worker pool that parallelizes encryption and decryption across all CPU cores, keeping the interface responsive during heavy batch and folder operations.",
      "Shipped a cross-platform PWA with offline support, app-password protection, keyserver import/export, and encrypted cloud backup — usable on Windows, macOS, Linux, Android, and iOS.",
    ],
    metrics: [
      { label: "Architecture", value: "Zero-Knowledge" },
      { label: "Performance", value: "Multi-Core" },
      { label: "Surface", value: "PWA" },
    ],
    gallery: [
      nextPgpManageKeyrings,
      nextPgpKeyringDetails,
      nextPgpGenerateKeyring,
      nextPgpEncrypt,
      nextPgpDecrypt,
      nextPgpCreateVault,
      nextPgpCloudBackup,
    ],
  },
  {
    id: "dimitrescu-wallpapers",
    number: "03",
    title: "DIMITRESCU WALLPAPERS",
    category: "Fan Gallery",
    stack: "Next.js / Prisma / GSAP / NextAuth",
    image: dimitrescuWallpapersHero,
    href: "https://dimitrescuwallpapers.vercel.app",
    tagline:
      "A cinematic Resident Evil Village fan gallery with 410+ wallpaper pages, model-viewer SCPs, and scroll-driven motion across every section.",
    overview:
      "Dimitrescu Wallpapers is a large-scale fan gallery and PWA for Bela, Cassandra, and Daniela Dimitrescu from Resident Evil Village. It spans 298 masonry gallery routes and 112 model-viewer variant pages each with portrait and landscape orientations, one-click GLightbox downloads, and per-page OpenGraph, Twitter Card, and JSON-LD metadata. The homepage layers a Framer Motion parallax carousel, GSAP ScrollTrigger sections (featured photos, pinned horizontal story slider, mods, previews), Character.ai and Wattpad integrations, and an authenticated review system backed by NextAuth and PostgreSQL.",
    role: "Full stack architecture, animation systems, SEO, auth & reviews API",
    timeline: "2023 – Present",
    liveDemoLabel: "View Live Demo",
    techStack: [
      "Next.js",
      "React 19",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "NextAuth v5",
      "GSAP",
      "ScrollTrigger",
      "Framer Motion",
      "Lenis",
      "Masonry Layout",
      "GLightbox",
      "Swiper",
      "Sharp",
      "PWA",
      "Google Analytics",
      "Vercel Speed Insights",
      "Bootstrap",
      "Tailwind CSS",
    ],
    highlights: [
      "Built 410+ statically routed gallery and model-viewer pages with automated sitemap generation and per-route SEO metadata across the entire content tree.",
      "Implemented masonry lightbox galleries with GLightbox one-click downloads, dual preloader systems, Lenis smooth scroll, and GSAP ScrollTrigger choreography on desktop and mobile breakpoints.",
      "Shipped an authenticated review system with NextAuth (Google, GitHub, Discord), Prisma persistence, IP-based rate limiting, and malicious-input validation on the reviews API.",
    ],
    metrics: [
      { label: "Pages", value: "410+" },
      { label: "Gallery", value: "Masonry + Lightbox" },
      { label: "Surface", value: "PWA" },
    ],
    gallery: [
      dimitrescuWallpapersGallery1,
      dimitrescuWallpapersHero,
      dimitrescuWallpapersGallery3,
      dimitrescuWallpapersGallery4,
    ],
  },
] as const;

export function getProjectPath(projectId: string): string {
  return `/projects/${projectId}`;
}

export function getProjectById(projectId: string): Project | undefined {
  return projects.find((project: Project): boolean => project.id === projectId);
}

export const services: readonly Service[] = [
  {
    number: "01",
    title: "AI ENGINEERING",
    description:
      "Designing production-grade RAG pipelines with hybrid retrieval, semantic reranking, and LLM orchestration for high-accuracy AI applications.",
    tags: [
      "RAG Pipelines",
      "pgvector",
      "Cross-Encoders",
      "LLM Integrations",
    ],
  },
  {
    number: "02",
    title: "FULL STACK DEVELOPMENT",
    description:
      "Building scalable SaaS platforms with Next.js, FastAPI, and PostgreSQL — from async REST APIs to real-time WebSocket systems.",
    tags: ["Next.js", "FastAPI", "PostgreSQL", "Docker / CI-CD"],
  },
  {
    number: "03",
    title: "SECURITY & CRYPTO",
    description:
      "Implementing zero-knowledge architectures with end-to-end encryption, PGP tooling, and client-side cryptography via the Web Crypto API.",
    tags: ["Zero-Knowledge", "OpenPGP", "E2EE", "Web Crypto API"],
  },
] as const;

export const experiences: readonly Experience[] = [
  {
    number: "01",
    role: "Full Stack AI Engineer",
    company: "Bave Holdings LLC",
    period: "June 2025 – Present",
    highlights: [
      "Implemented core feature sets for enterprise-grade SaaS applications, focusing on delivering high-impact functionality and improving user workflow efficiency.",
      "Designed high-performance full stack applications using Next.js and Node.js, ensuring seamless user experiences for enterprise-grade deployments.",
      "Designed advanced AI-powered RAG pipelines with pgvector and semantic reranking, achieving high retrieval accuracy across complex vector datasets.",
      "Developed the integration of intelligent automation workflows and LLM orchestration, substantially reducing manual data processing overhead.",
      "Streamlined deployment cycles using Docker and CI/CD pipelines, significantly increasing deployment frequency while maintaining stable production environments.",
      "Mentored a cross-functional team of 5+ developers on AI best practices and modern frontend architectures, accelerating feature delivery and improving team efficiency.",
      "Defined the technical roadmap and strategic priorities for AI product lines, aligning engineering initiatives with core business objectives and driving product growth.",
    ],
  },
  {
    number: "02",
    role: "Backend / Full Stack Developer",
    company: "Afryvo Analytics",
    period: "January 2025 – June 2025",
    highlights: [
      "Developed secure authentication and user management systems using FastAPI and SQLAlchemy 2.0 with fully async database logic.",
      "Deployed a JWT-based authentication layer with token rotation and HttpOnly cookie security.",
      "Refined account protection with rate-limited OTP workflows, reducing unauthorized login attempts.",
      "Designed scalable REST APIs optimized for concurrent request handling with sub-100ms latency.",
      "Standardized clean code practices and Alembic migration workflows across the engineering team.",
      "Leveraged the uv package manager to optimize developer environments and ensure dependency parity.",
    ],
  },
  {
    number: "03",
    role: "Full Stack Developer",
    company: "Information Technology Services",
    period: "June 2023 – December 2024",
    highlights: [
      "Built multiple web applications using PHP, improving system performance and user retention through UI/UX refinements.",
      "Maintained specialized medical publication platforms with complex XML-based data structures and abstract indexing.",
      "Implemented feature updates and content management workflows for healthcare-focused web applications.",
      "Collaborated on legacy system maintenance, optimizing XML parsing logic for high-traffic journal repositories.",
    ],
  },
] as const;

export const philosophyItems: readonly Philosophy[] = [
  {
    eyebrow: "01 /// RAG PIPELINES",
    title: "Hybrid\nRetrieval.",
    description:
      "Designing production-grade RAG pipelines with pgvector, hybrid retrieval, and semantic reranking for high-accuracy AI applications.",
  },
  {
    eyebrow: "02 /// FULL STACK SAAS",
    title: "Scalable\nPlatforms.",
    description:
      "Building end-to-end SaaS products with Next.js, FastAPI, and PostgreSQL — from async REST APIs to real-time systems.",
  },
  {
    eyebrow: "03 /// ZERO-KNOWLEDGE",
    title: "Secure\nBy Design.",
    description:
      "Implementing zero-knowledge architectures with E2EE, OpenPGP tooling, and client-side cryptography via the Web Crypto API.",
  },
  {
    eyebrow: "04 /// LLM AGENTS",
    title: "Smart\nAutomation.",
    description:
      "Orchestrating LLM agents and intelligent automation workflows that reduce manual overhead and integrate cleanly with existing products.",
  },
  {
    eyebrow: "05 /// VECTOR SEARCH",
    title: "Precision\nAt Scale.",
    description:
      "Scaling vector search with BM25, cross-encoder reranking, and reciprocal rank fusion for retrieval precision at enterprise scale.",
  },
  {
    eyebrow: "06 /// PRODUCTION",
    title: "Ship\nWith Confidence.",
    description:
      "Shipping production-ready applications with Docker containerization and CI/CD pipelines that keep deployments fast and stable.",
  },
] as const;

export const socialLinks: readonly SocialLink[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/muhammad-hamza-riaz",
  },
  { label: "GitHub", href: "https://github.com/XBEAST1" },
] as const;

export interface HeroStatusSlide {
  readonly headline: string;
  readonly label: string;
}

export const heroStatusSlides: readonly HeroStatusSlide[] = [
  {
    headline: "Building RAG Pipelines...",
    label: "Hybrid Retrieval / pgvector",
  },
  {
    headline: "Crafting Full Stack SaaS...",
    label: "Next.js / FastAPI / PostgreSQL",
  },
  {
    headline: "Securing Zero Knowledge...",
    label: "E2EE / OpenPGP / Web Crypto",
  },
  {
    headline: "Orchestrating LLM Agents...",
    label: "Automation / Integrations",
  },
  {
    headline: "Scaling Vector Search...",
    label: "BM25 / Cross-Encoder Rerank",
  },
  {
    headline: "Shipping Production Apps...",
    label: "Docker / CI-CD",
  },
] as const;

export const marqueeItems: readonly string[] = [
  "RAG Pipelines",
  "Full Stack SaaS",
  "Zero-Knowledge Security",
  "Next.js",
  "FastAPI",
  "PostgreSQL",
] as const;
