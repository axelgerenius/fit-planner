"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const mono: React.CSSProperties = { fontFamily: "var(--font-space-mono), 'Space Mono', monospace" };

const TABS = [
  { href: "/planning", label: "PROGRAMME" },
  { href: "/carnet",   label: "CARNET" },
];

export default function SportTabs() {
  const pathname = usePathname();

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 0, marginBottom: 20, borderBottom: "2px solid #d8d0c4" }}>
      {TABS.map(tab => {
        const isActive = pathname.startsWith(tab.href);
        return (
          <Link key={tab.href} href={tab.href}
            style={{
              ...mono, fontSize: 14, letterSpacing: 2, padding: "12px 24px",
              textDecoration: "none", fontWeight: 700,
              color: isActive ? "#1a1a1a" : "#7a7268",
              borderBottom: isActive ? "3px solid #c0392b" : "3px solid transparent",
              marginBottom: -2,
              transition: "color 0.15s",
            }}>
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
