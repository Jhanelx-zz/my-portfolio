// src/app/data/projects.ts

export interface Screenshot {
  url: string;
  caption: string;
}

export interface Project {
  slug: string;
  name: string;
  category: string;
  status: string;
  shortDescription: string;
  fullDescription: string;
  problem: string;
  solution: string;
  role: string;
  stack: string[];
  features: string[];
  lessonsLearned: string[];
  coverImage: string | null;
  screenshots: Screenshot[];
  githubUrl?: string;
  demoUrl?: string;
  isFeatured?: boolean;
}

export const projectsData: Project[] = [
  {
    slug: "mendoza-store-system",
    name: "Mendoza's Feeds and Rice Store POS & Inventory System",
    category: "Business Management System",
    status: "In Progress",
    coverImage: "/images/mendoza-store.png",
    screenshots: [
      {
        url: "/images/mendoza-store.png",
        caption: "POS Cashier Terminal — Wholesale & Retail Checkout Interface",
      },
      {
        url: "/images/mndoza-dashboard.png",
        caption: "Inventory Stock Levels & Rice/Feeds Category Management",
      },
      {
        url: "/images/mendoza-credit.png",
        caption: "Customer Debt & Payment Record Ledger",
      },
      {
        url: "/images/mendoza-reports.png",
        caption: "Daily Sales Summary & Transaction Logs",
      },
    ],
    shortDescription:
      "A tailored Point-of-Sale (POS) and inventory management application customized for wholesale and retail sales of rice and feeds at Mendoza's Store in Pinagbirayan Malaki, Paracale.",
    fullDescription:
      "A custom-built business management system built for Mendoza's Store in Paracale, Camarines Norte. It streamlines daily sales transactions, converts wholesale units (bags) into retail quantities (kilograms), tracks customer credit records, and alerts managers when stock levels run low.",
    problem:
      "Manual ledger logging and paper receipts caused inventory discrepancies, delayed cashier transaction times, and made tracking customer debt difficult across high-volume wholesale and retail orders.",
    solution:
      "Engineered a streamlined POS application focused strictly on rice and feeds categories, featuring rapid barcode/manual item lookup, dual pricing rules, real-time stock deductions, and digital ledger tracking.",
    role: "Full-Stack Developer (Database Schema Design, Backend PHP Logic, and UI/UX Layout)",
    stack: ["PHP", "PostgreSQL", "MySQL", "JavaScript", "HTML5", "Tailwind CSS"],
    features: [
      "Wholesale and retail unit conversions (bags to kilograms)",
      "Automated stock level threshold warnings for rice varieties and feeds",
      "Customer debt ledger logging and payment history tracking",
      "Printable receipt formatting and end-of-day sales auditing",
    ],
    lessonsLearned: [
      "Designing relational database schemas for complex product unit conversions",
      "Structuring clean SQL queries for stock deduction and accurate financial reports",
      "Building accessible user interfaces for non-technical retail operators",
    ],
    githubUrl: "https://github.com/Jhanelx-zz/mendoza-store-pos",
  },
  {
    slug: "iskalawihao-portal",
    name: "iSKalawihao — Youth Council Budget Transparency Portal",
    category: "Web Application",
    status: "Completed",
    coverImage: "/images/iskalawihao.jpg",
    screenshots: [
      {
        url: "/images/iskalawihao.jpg",
        caption: "Public Budget Transparency Overview & Disbursement Charts",
      },
      {
        url: "/images/iskalawihao-admin.jpeg",
        caption: "Admin Panel for Project Expenses & Document File Uploads",
      },
      {
        url: "/images/iskalawihao-reports.jpeg",
        caption: "Categorized Financial Report Archive & Public Downloads",
      },
    ],
    shortDescription:
      "A web-based budget tracking and document transparency system designed and developed for the Sangguniang Kabataan of Barangay Alawihao.",
    fullDescription:
      "A community transparency web platform enabling youth council officials to post public budget allocations, document project expenditures, and allow local youth constituents to review official financial disbursements.",
    problem:
      "Lack of centralized digital platforms for barangay youth council records hindered public transparency, making document retrieval slow and inefficient.",
    solution:
      "Built a secure web portal where administrators upload verified expense receipts and project documents while community members view interactive budget breakdown visualizers.",
    role: "Backend & Database Developer",
    stack: ["PHP", "MySQL", "JavaScript", "HTML5", "Bootstrap"],
    features: [
      "Secure admin portal for document uploads and project budget entries",
      "Public transparency overview dashboard with expense breakdowns",
      "Categorized financial record filtering and PDF report access",
    ],
    lessonsLearned: [
      "Implementing user authentication and session management in PHP",
      "Managing secure file uploads and organizing relational database tables",
    ],
    githubUrl: "https://github.com/Jhanelx-zz/iskalawihao-portal",
  },
  {
    slug: "daet-tourism-alert-system",
    name: "Daet Tourism Crisis Communication & Emergency Alert System",
    category: "Academic Capstone Concept",
    status: "Academic Concept",
    coverImage: "/images/daet-tourism.png",
    screenshots: [
      {
        url: "/images/daet-tourism.png",
        caption: "Emergency Crisis Advisory Broadcasting Dashboard",
      },
      {
        url: "/images/daet-map.png",
        caption: "Interactive Tourist Emergency Map & Spot Safety Advisories",
      },
      {
        url: "/images/daet-guide.png",
        caption: "Mobile Tourist Safety Guidelines & Emergency Hotline Directory",
      },
    ],
    shortDescription:
      "A proposed crisis communication platform to disseminate urgent alerts and emergency updates to tourists and local municipal authorities.",
    fullDescription:
      "An academic capstone concept aimed at strengthening disaster and crisis communication within Daet, Camarines Norte. The system outlines automated emergency broadcasting, municipal admin dashboards, and tourist safety guide management.",
    problem:
      "Tourists visiting local coastal and eco-tourism spots during unexpected weather conditions often lack immediate access to verified municipal advisories.",
    solution:
      "Conceptualized a centralized admin dashboard for local government units to broadcast real-time safety alerts and maintain accessible emergency hotline directories.",
    role: "Lead Concept Developer & UI/UX Wireframer",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Figma"],
    features: [
      "Real-time crisis advisory broadcasting dashboard",
      "Tourist guide and safety resource directory",
      "Emergency contact routing for municipal emergency responders",
    ],
    lessonsLearned: [
      "Designing responsive layouts optimized for fast mobile viewing during emergencies",
      "Structuring public safety communication workflows for local government units",
    ],
    githubUrl: "https://github.com/Jhanelx-zz/daet-tourism-alert",
  },
];