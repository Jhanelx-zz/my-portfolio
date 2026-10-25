import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Skills",
  description: "Technical skills and IT competencies of Jhunnel C. Carillo",
};

export default function SkillsLayout({ children }: { children: ReactNode }) {
  return children;
}
