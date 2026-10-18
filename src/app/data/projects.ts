// src/app/data/projects.ts

export interface Project {
  slug: string;
  name: string;
  category: string;
  status: "Completed" | "In Progress" | "Academic Concept";
  shortDescription: string;
  fullDescription: string;
  problem: string;
  solution: string;
  role: string;
  stack: string[];
  features: string[];
  lessonsLearned: string[];
  githubUrl?: string;
  demoUrl?: string;
}

export const projectsData: Project[] = [
  {
    slug: "mendoza-store-system",
    name: "Mendoza's Feeds and Rice Store POS & Inventory System",
    category: "Business Management System",
    status: "In Progress",
    shortDescription:
      "A tailored Point-of-Sale (POS) and inventory management web application for wholesale and retail rice and feed store operations.",
    fullDescription:
      "A custom-built business management application designed specifically for Mendoza's Store in Paracale, Camarines Norte. It streamlines daily sales transactions, tracks inventory levels for rice and animal feeds, and provides real-time stock notifications.",
    problem:
      "Manual ledger tracking and paper receipts caused inventory discrepancies, delayed transaction times, and difficulties tracking customer credit/debts for wholesale and retail sales.",
    solution:
      "Developed a streamlined web interface focused strictly on rice and feeds categories, featuring rapid barcode/manual lookup, dual wholesale and retail pricing models, stock level warnings, and receipt generation.",
    role: "Full-Stack Developer (Database design, backend logic, and user interface design)",
    stack: ["PHP", "PostgreSQL", "JavaScript", "HTML5", "CSS3", "Tailwind CSS"],
    features: [
      "Wholesale and retail unit conversions (e.g., bags to kilograms)",
      "Stock level alerts for fast-moving rice and feed varieties",
      "Customer credit/debt tracking and payment record logging",
      "Printable receipts and daily transaction summaries",
    ],
    lessonsLearned: [
      "Designing relational schemas for flexible product units and sales categories",
      "Structuring clean SQL queries for accurate stock deduction and reporting",
      "Balancing simple user interfaces for non-technical retail operators",
    ],
  },
  {
    slug: "daet-tourism-alert-system",
    name: "Daet Tourism Crisis Communication & Emergency Alert System",
    category: "Academic Capstone Concept",
    status: "Academic Concept",
    shortDescription:
      "A proposed crisis communication platform to disseminate urgent alerts and emergency updates to tourists and local authorities.",
    fullDescription:
      "An academic capstone concept aimed at strengthening disaster and crisis communication within Daet, Camarines Norte. The system outlines automated emergency messaging, administrator dashboards, and tourist safety guide management.",
    problem:
      "Tourists visiting local spots during unexpected weather conditions or emergencies often lack immediate access to verified safety announcements and localized advisory updates.",
    solution:
      "Conceptualized a centralized admin dashboard for local government units to publish real-time alerts, broadcast emergency advisories, and maintain visible safety guidelines.",
    role: "Lead Concept Developer & UI/UX Wireframer",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Figma"],
    features: [
      "Real-time crisis advisory broadcasting dashboard",
      "Tourist guide and safety resource directory",
      "Emergency contact routing for local authorities",
      "Offline communication guidance during power or network outages",
    ],
    lessonsLearned: [
      "Designing responsive layouts tailored for quick mobile viewing during emergencies",
      "Structuring crisis communication workflows for public safety personnel",
    ],
  },
  {
    slug: "iskalawihao-portal",
    name: "iSKalawihao - Youth Council Budget Transparency Portal",
    category: "Web Application",
    status: "Completed",
    shortDescription:
      "A web-based budget tracking and document upload transparency system built for the Sangguniang Kabataan of Barangay Alawihao.",
    fullDescription:
      "A community transparency portal enabling youth council officers to post public budget allocations, document financial disbursements, and allow community members to view local SK projects and expenditures.",
    problem:
      "Lack of centralized digital platforms for youth council budget records hindered public transparency and manual documentation was slow to access.",
    solution:
      "Built a web portal where administrators can upload verified expense records, log project funds, and display interactive budget breakdown charts to the public.",
    role: "Backend & Database Developer",
    stack: ["PHP", "MySQL", "JavaScript", "HTML5", "Bootstrap"],
    features: [
      "Admin portal for document uploads and project budget entries",
      "Public transparency overview dashboard",
      "Categorized financial report filtering",
    ],
    lessonsLearned: [
      "Implementing user role authentication and secure session management in PHP",
      "Managing file uploads and organizing database record relationships",
    ],
  },
];