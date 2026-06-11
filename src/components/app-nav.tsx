"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mono: React.CSSProperties = { fontFamily: "var(--font-space-mono), 'Space Mono', monospace" };
const display: React.CSSProperties = { fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif" };

const SPORT_SUBNAV = [
  { href: "/planning", label: "Programme" },
  { href: "/carnet",   label: "Carnet" },
];

const PRIMARY_NAV = [
  { href: "/dashboard", label: "Accueil",    icon: "🏠",  sub: null },
  { href: "/planning",  label: "Sport",      icon: "🏋️",  sub: SPORT_SUBNAV, also: ["/carnet"] },
  { href: "/nutrition", label: "Nutrition",  icon: "🥗",  sub: null, also: ["/courses"] },
  { href: "/habitudes", label: "Habitudes",  icon: "✅",  sub: null },
];

const DESKTOP_EXTRA = [
  { href: "/historique", label: "Statistiques" },
];

const MORE_NAV = [
  { href: "/historique", label: "Statistiques", icon: "📊", desc: "Évolution, poids, habitudes, exercices" },
];

export default function AppNav({ user }: { user: { name: string; email: string } }) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sportSubOpen, setSportSubOpen] = useState(false);

  const initials = user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const isMoreActive = MORE_NAV.some(l => pathname.startsWith(l.href));
  const isSportActive = pathname.startsWith("/planning") || pathname.startsWith("/carnet");

  function isNavActive(nav: typeof PRIMARY_NAV[0]) {
    return pathname.startsWith(nav.href) || (nav.also?.some(a => pathname.startsWith(a)) ?? false);
  }

  return (
    <>
      {/* ─── TOP BAR ─────────────────────────────────────────────────────── */}
      <header className="bg-background sticky top-0 z-10" style={{ borderBottom: "2px solid #1a1a1a" }}>
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard"
              style={{ ...display, fontSize: "22px", letterSpacing: "2px", color: "#1a1a1a", textDecoration: "none" }}>
              VITA<span style={{ color: "#c0392b" }}>LOOP</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-0">
              {PRIMARY_NAV.map(link => {
                const active = isNavActive(link);
                if (link.sub) {
                  // Dropdown Sport
                  return (
                    <div key={link.href} style={{ position: "relative" }}
                      onMouseEnter={() => setSportSubOpen(true)}
                      onMouseLeave={() => setSportSubOpen(false)}>
                      <Link href={link.href}
                        className={`px-3 py-1.5 text-sm font-medium transition-colors flex items-center gap-1 ${active ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}>
                        {link.label}
                        <span style={{ fontSize: 10, opacity: 0.6 }}>▾</span>
                        {active && <span className="block h-0.5 bg-primary mt-0.5" />}
                      </Link>
                      {sportSubOpen && (
                        <div style={{
                          position: "absolute", top: "100%", left: 0,
                          background: "#fff", border: "1px solid #d8d0c4",
                          borderTop: "2px solid #c0392b", borderRadius: "0 0 4px 4px",
                          minWidth: 160, zIndex: 20,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}>
                          {link.sub.map(sub => (
                            <Link key={sub.href} href={sub.href}
                              style={{
                                display: "block", padding: "10px 16px",
                                textDecoration: "none", fontSize: 13,
                                fontWeight: pathname.startsWith(sub.href) ? 700 : 400,
                                color: pathname.startsWith(sub.href) ? "#c0392b" : "#1a1a1a",
                                background: pathname.startsWith(sub.href) ? "#fff5f5" : "#fff",
                                borderBottom: "1px solid #f5f0e8",
                              }}>
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <Link key={link.href} href={link.href}
                    className={`px-3 py-1.5 text-sm font-medium transition-colors ${active ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}>
                    {link.label}
                    {active && <span className="block h-0.5 bg-primary mt-0.5" />}
                  </Link>
                );
              })}
              {DESKTOP_EXTRA.map(link => {
                const active = pathname.startsWith(link.href);
                return (
                  <Link key={link.href} href={link.href}
                    className={`px-3 py-1.5 text-sm font-medium transition-colors ${active ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}>
                    {link.label}
                    {active && <span className="block h-0.5 bg-primary mt-0.5" />}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Avatar */}
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs font-bold"
                  style={{ background: "#1a1a1a", color: "#f5f0e8", fontFamily: "var(--font-space-mono)" }}>
                  {initials}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-2 py-1.5 text-sm">
                <p className="font-semibold">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem render={<Link href="/profil" />}>Mon profil</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" style={{ color: "#c0392b" }}
                onClick={() => signOut({ callbackUrl: "/login" })}>
                Se déconnecter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* ─── SOUS-NAV SPORT (mobile, visible quand Sport est actif) ────────── */}
      {isSportActive && (
        <div className="md:hidden sticky top-14 z-10"
          style={{ background: "#fff", borderBottom: "1px solid #d8d0c4" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {SPORT_SUBNAV.map(sub => {
              const isActive = pathname.startsWith(sub.href);
              return (
                <Link key={sub.href} href={sub.href}
                  style={{
                    ...mono, fontSize: 12, letterSpacing: 2, padding: "10px 28px",
                    textDecoration: "none", fontWeight: 700,
                    color: isActive ? "#1a1a1a" : "#7a7268",
                    borderBottom: isActive ? "3px solid #c0392b" : "3px solid transparent",
                  }}>
                  {sub.label.toUpperCase()}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── BOTTOM NAV (mobile) ──────────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20"
        style={{ background: "#fff", borderTop: "2px solid #1a1a1a" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", height: 60 }}>
          {PRIMARY_NAV.map(link => {
            const isActive = isNavActive(link);
            return (
              <Link key={link.href} href={link.href}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  justifyContent: "center", gap: 2, textDecoration: "none",
                  borderTop: isActive ? "3px solid #c0392b" : "3px solid transparent",
                  background: isActive ? "#fff5f5" : "transparent",
                }}>
                <span style={{ fontSize: 18, lineHeight: 1 }}>{link.icon}</span>
                <span style={{ ...mono, fontSize: 8, letterSpacing: 0.5,
                  color: isActive ? "#c0392b" : "#7a7268", fontWeight: isActive ? 700 : 400 }}>
                  {link.label.toUpperCase()}
                </span>
              </Link>
            );
          })}

          {/* Plus */}
          <button onClick={() => setDrawerOpen(true)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", gap: 2, border: "none", cursor: "pointer",
              borderTop: isMoreActive ? "3px solid #c0392b" : "3px solid transparent",
              background: isMoreActive ? "#fff5f5" : "transparent",
            }}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>⋯</span>
            <span style={{ ...mono, fontSize: 8, letterSpacing: 0.5,
              color: isMoreActive ? "#c0392b" : "#7a7268", fontWeight: isMoreActive ? 700 : 400 }}>
              PLUS
            </span>
          </button>
        </div>
      </nav>

      {/* ─── DRAWER "PLUS" ────────────────────────────────────────────────── */}
      {drawerOpen && (
        <>
          <div onClick={() => setDrawerOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 30 }} />
          <div style={{
            position: "fixed", bottom: 60, left: 0, right: 0, zIndex: 40,
            background: "#fff", borderRadius: "16px 16px 0 0",
            boxShadow: "0 -4px 24px rgba(0,0,0,0.15)",
          }}>
            <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
              <div style={{ width: 40, height: 4, borderRadius: 2, background: "#d8d0c4" }} />
            </div>
            <div style={{ padding: "4px 0 16px" }}>
              {MORE_NAV.map(link => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link key={link.href} href={link.href} onClick={() => setDrawerOpen(false)}
                    style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "14px 20px", textDecoration: "none",
                      background: isActive ? "#fff5f5" : "transparent",
                      borderLeft: isActive ? "3px solid #c0392b" : "3px solid transparent",
                    }}>
                    <span style={{ fontSize: 24 }}>{link.icon}</span>
                    <div>
                      <p style={{ ...mono, fontSize: 12, letterSpacing: 1, fontWeight: 700,
                        color: isActive ? "#c0392b" : "#1a1a1a" }}>{link.label.toUpperCase()}</p>
                      <p style={{ fontSize: 12, color: "#7a7268", marginTop: 1 }}>{link.desc}</p>
                    </div>
                  </Link>
                );
              })}
              <div style={{ borderTop: "1px solid #ede8df", margin: "8px 20px 0" }} />
              <Link href="/profil" onClick={() => setDrawerOpen(false)}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", textDecoration: "none" }}>
                <span style={{ fontSize: 24 }}>👤</span>
                <p style={{ ...mono, fontSize: 12, letterSpacing: 1, fontWeight: 700, color: "#1a1a1a" }}>MON PROFIL</p>
              </Link>
              <button onClick={() => { signOut({ callbackUrl: "/login" }); setDrawerOpen(false); }}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", background: "none", border: "none", cursor: "pointer", width: "100%" }}>
                <span style={{ fontSize: 24 }}>🚪</span>
                <p style={{ ...mono, fontSize: 12, letterSpacing: 1, fontWeight: 700, color: "#c0392b" }}>SE DÉCONNECTER</p>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
