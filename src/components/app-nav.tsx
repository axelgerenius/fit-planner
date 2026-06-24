"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

const PRIMARY = "#FF6500";
const DARK = "#111827";
const GRAY = "#6B7280";
const BORDER = "#E5E7EB";
const WHITE = "#FFFFFF";

const SPORT_SUBNAV = [
  { href: "/planning", label: "Programme" },
  { href: "/carnet",   label: "Carnet" },
];

const PRIMARY_NAV = [
  { href: "/dashboard", label: "Accueil",   icon: HomeIcon },
  { href: "/planning",  label: "Sport",     icon: DumbbellIcon, also: ["/carnet"] },
  { href: "/nutrition", label: "Nutrition", icon: ForkIcon,     also: ["/courses"] },
  { href: "/historique",label: "Stats",     icon: StatsIcon },
];

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function HomeIcon({ active }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? PRIMARY : GRAY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z"/>
      <path d="M9 21V12h6v9"/>
    </svg>
  );
}

function DumbbellIcon({ active }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? PRIMARY : GRAY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 6.5h11M6.5 17.5h11"/>
      <rect x="2" y="5" width="3" height="14" rx="1"/>
      <rect x="4" y="8" width="2" height="8" rx="0.5"/>
      <rect x="19" y="5" width="3" height="14" rx="1"/>
      <rect x="18" y="8" width="2" height="8" rx="0.5"/>
    </svg>
  );
}

function ForkIcon({ active }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? PRIMARY : GRAY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/>
      <path d="M7 2v20"/>
      <path d="M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>
    </svg>
  );
}

function StatsIcon({ active }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? PRIMARY : GRAY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 20V10"/>
      <path d="M12 20V4"/>
      <path d="M6 20v-6"/>
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 01-3.46 0"/>
    </svg>
  );
}

type NotificationItem = {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  createdAt: string;
};

function relativeTime(iso: string) {
  const min = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (min < 1) return "à l'instant";
  if (min < 60) return `il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `il y a ${h} h`;
  return `il y a ${Math.floor(h / 24)} j`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AppNav({ user }: { user: { name: string; email: string } }) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sportSubOpen, setSportSubOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("/api/notifications");
        if (!res.ok) return;
        const data = await res.json();
        if (active) {
          setNotifications(data.items);
          setUnreadCount(data.unreadCount);
        }
      } catch {}
    }
    load();
    const interval = setInterval(load, 60000);
    return () => { active = false; clearInterval(interval); };
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    if (notifOpen) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [notifOpen]);

  function handleNotifClick(n: NotificationItem) {
    if (!n.read) {
      setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x));
      setUnreadCount(prev => Math.max(0, prev - 1));
      fetch(`/api/notifications/${n.id}/read`, { method: "POST" }).catch(() => {});
    }
    setNotifOpen(false);
  }

  function handleMarkAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
    fetch("/api/notifications/read-all", { method: "POST" }).catch(() => {});
  }

  const initials = user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const isSportActive = pathname.startsWith("/planning") || pathname.startsWith("/carnet");

  function isActive(nav: typeof PRIMARY_NAV[0]) {
    return pathname.startsWith(nav.href) || (nav.also?.some(a => pathname.startsWith(a)) ?? false);
  }

  return (
    <>
      {/* ─── TOP BAR ─────────────────────────────────────────────────────── */}
      <header style={{ background: WHITE, borderBottom: `1px solid ${BORDER}`, position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* Logo */}
          <Link href="/dashboard" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
            <img src="/icon.svg" alt="" width={28} height={28} style={{ borderRadius: 8, border: `1px solid ${BORDER}` }} />
            <span style={{ fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 2, color: DARK }}>
              VITA<span style={{ color: PRIMARY }}>LOOP</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {PRIMARY_NAV.map(link => {
              const active = isActive(link);
              if (link.href === "/planning") {
                return (
                  <div key={link.href} style={{ position: "relative" }}
                    onMouseEnter={() => setSportSubOpen(true)}
                    onMouseLeave={() => setSportSubOpen(false)}>
                    <Link href={link.href} style={{
                      display: "flex", alignItems: "center", gap: 4,
                      padding: "6px 12px", borderRadius: 8, textDecoration: "none",
                      fontSize: 14, fontWeight: active ? 700 : 500,
                      color: active ? PRIMARY : GRAY,
                      background: active ? "#FFF3ED" : "transparent",
                    }}>
                      {link.label} <span style={{ fontSize: 10, opacity: 0.6 }}>▾</span>
                    </Link>
                    {sportSubOpen && (
                      <div style={{
                        position: "absolute", top: "100%", left: 0,
                        background: WHITE, border: `1px solid ${BORDER}`,
                        borderTop: `2px solid ${PRIMARY}`, borderRadius: "0 0 12px 12px",
                        minWidth: 160, zIndex: 20, boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                      }}>
                        {SPORT_SUBNAV.map(sub => (
                          <Link key={sub.href} href={sub.href} style={{
                            display: "block", padding: "10px 16px",
                            textDecoration: "none", fontSize: 13,
                            fontWeight: pathname.startsWith(sub.href) ? 700 : 400,
                            color: pathname.startsWith(sub.href) ? PRIMARY : DARK,
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
                <Link key={link.href} href={link.href} style={{
                  padding: "6px 12px", borderRadius: 8, textDecoration: "none",
                  fontSize: 14, fontWeight: active ? 700 : 500,
                  color: active ? PRIMARY : GRAY,
                  background: active ? "#FFF3ED" : "transparent",
                }}>
                  {link.label}
                </Link>
              );
            })}
            <Link href="/habitudes" style={{
              padding: "6px 12px", borderRadius: 8, textDecoration: "none",
              fontSize: 14, fontWeight: pathname.startsWith("/habitudes") ? 700 : 500,
              color: pathname.startsWith("/habitudes") ? PRIMARY : GRAY,
              background: pathname.startsWith("/habitudes") ? "#FFF3ED" : "transparent",
            }}>
              Habitudes
            </Link>
          </nav>

          {/* Right: Bell + Avatar */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div ref={notifRef} style={{ position: "relative" }}>
              <button onClick={() => setNotifOpen(o => !o)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 4, position: "relative" }}>
                <BellIcon />
                {unreadCount > 0 && (
                  <span style={{
                    position: "absolute", top: 2, right: 2,
                    width: 8, height: 8, borderRadius: "50%",
                    background: PRIMARY, border: `1.5px solid ${WHITE}`,
                  }} />
                )}
              </button>

              {notifOpen && (
                <div style={{
                  position: "absolute", top: "100%", right: 0, marginTop: 8,
                  width: 320, maxHeight: 420, overflowY: "auto",
                  background: WHITE, border: `1px solid ${BORDER}`,
                  borderRadius: 16, boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                  zIndex: 30,
                }}>
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "14px 16px", borderBottom: `1px solid ${BORDER}`,
                  }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: DARK }}>Notifications</p>
                    {unreadCount > 0 && (
                      <button onClick={handleMarkAllRead}
                        style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, color: PRIMARY }}>
                        Tout marquer lu
                      </button>
                    )}
                  </div>

                  {notifications.length === 0 ? (
                    <p style={{ padding: "32px 16px", textAlign: "center", fontSize: 13, color: GRAY }}>
                      Aucune notification
                    </p>
                  ) : (
                    notifications.map(n => {
                      const content = (
                        <div style={{
                          display: "flex", gap: 10, alignItems: "flex-start",
                          padding: "12px 16px", borderBottom: `1px solid ${BORDER}`,
                          background: n.read ? "transparent" : "#FFF3ED",
                        }}>
                          {!n.read && (
                            <span style={{
                              width: 7, height: 7, borderRadius: "50%",
                              background: PRIMARY, marginTop: 5, flexShrink: 0,
                            }} />
                          )}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: 13, fontWeight: 700, color: DARK }}>{n.title}</p>
                            <p style={{ fontSize: 12, color: GRAY, marginTop: 2, lineHeight: 1.4 }}>{n.message}</p>
                            <p style={{ fontSize: 11, color: GRAY, marginTop: 4, opacity: 0.8 }}>{relativeTime(n.createdAt)}</p>
                          </div>
                        </div>
                      );
                      return n.link ? (
                        <Link key={n.id} href={n.link} onClick={() => handleNotifClick(n)} style={{ textDecoration: "none", display: "block" }}>
                          {content}
                        </Link>
                      ) : (
                        <button key={n.id} onClick={() => handleNotifClick(n)}
                          style={{ background: "none", border: "none", padding: 0, width: "100%", textAlign: "left", cursor: "pointer", display: "block" }}>
                          {content}
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => setDrawerOpen(true)}
              style={{
                width: 36, height: 36, borderRadius: "50%",
                background: PRIMARY, color: WHITE,
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 800, fontSize: 13,
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              }}
            >
              {initials}
            </button>
          </div>
        </div>
      </header>

      {/* ─── SOUS-NAV SPORT (mobile) ─────────────────────────────────────── */}
      {isSportActive && (
        <div className="md:hidden sticky top-14 z-10"
          style={{ background: WHITE, borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {SPORT_SUBNAV.map(sub => {
              const active = pathname.startsWith(sub.href);
              return (
                <Link key={sub.href} href={sub.href} style={{
                  fontSize: 13, fontWeight: 700, letterSpacing: 1,
                  padding: "10px 32px", textDecoration: "none",
                  color: active ? PRIMARY : GRAY,
                  borderBottom: active ? `3px solid ${PRIMARY}` : "3px solid transparent",
                }}>
                  {sub.label.toUpperCase()}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── BOTTOM NAV (mobile) ─────────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20" style={{
        background: WHITE,
        borderTop: `1px solid ${BORDER}`,
        boxShadow: "0 -4px 16px rgba(0,0,0,0.06)",
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", height: 64, alignItems: "center" }}>

          {/* Accueil */}
          {PRIMARY_NAV.slice(0, 2).map(link => {
            const active = isActive(link);
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href} style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", gap: 3, textDecoration: "none",
              }}>
                <Icon active={active} />
                <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: active ? PRIMARY : GRAY }}>
                  {link.label}
                </span>
              </Link>
            );
          })}

          {/* ─── + Center button ─── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <button
              onClick={() => setQuickOpen(true)}
              style={{
                width: 52, height: 52, borderRadius: "50%",
                background: PRIMARY, border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 4px 16px ${PRIMARY}60`,
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={WHITE} strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
            </button>
          </div>

          {/* Nutrition + Stats */}
          {PRIMARY_NAV.slice(2).map(link => {
            const active = isActive(link);
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href} style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", gap: 3, textDecoration: "none",
              }}>
                <Icon active={active} />
                <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: active ? PRIMARY : GRAY }}>
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ─── QUICK-ADD DRAWER ────────────────────────────────────────────── */}
      {quickOpen && (
        <>
          <div onClick={() => setQuickOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 30 }} />
          <div style={{
            position: "fixed", bottom: 64, left: 0, right: 0, zIndex: 40,
            background: WHITE, borderRadius: "24px 24px 0 0",
            boxShadow: "0 -8px 32px rgba(0,0,0,0.12)",
          }}>
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
              <div style={{ width: 40, height: 4, borderRadius: 2, background: BORDER }} />
            </div>
            <div style={{ padding: "8px 0 24px" }}>
              {[
                { href: "/carnet",    emoji: "📋", label: "Logger une séance",   desc: "Enregistre ta séance d'aujourd'hui" },
                { href: "/habitudes", emoji: "✅", label: "Mes habitudes",         desc: "Valider les habitudes du jour" },
                { href: "/historique",emoji: "⚖️", label: "Suivi du poids",        desc: "Enregistrer mon poids" },
              ].map(item => (
                <Link key={item.href} href={item.href} onClick={() => setQuickOpen(false)} style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "14px 20px", textDecoration: "none",
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: "#FFF3ED", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22, flexShrink: 0,
                  }}>
                    {item.emoji}
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: DARK }}>{item.label}</p>
                    <p style={{ fontSize: 12, color: GRAY, marginTop: 2 }}>{item.desc}</p>
                  </div>
                </Link>
              ))}
              <div style={{ borderTop: `1px solid ${BORDER}`, margin: "8px 20px 0" }} />
              <button onClick={() => { signOut({ callbackUrl: "/login" }); setQuickOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "14px 20px", background: "none", border: "none",
                  cursor: "pointer", width: "100%",
                }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, flexShrink: 0,
                }}>
                  🚪
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#EF4444" }}>Se déconnecter</p>
                </div>
              </button>
            </div>
          </div>
        </>
      )}

      {/* ─── PROFIL DRAWER (desktop avatar click) ───────────────────────── */}
      {drawerOpen && (
        <>
          <div onClick={() => setDrawerOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 30 }} />
          <div style={{
            position: "fixed", top: 64, right: 16, zIndex: 40,
            background: WHITE, borderRadius: 16, width: 220,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            border: `1px solid ${BORDER}`,
          }}>
            <div style={{ padding: "16px", borderBottom: `1px solid ${BORDER}` }}>
              <p style={{ fontWeight: 700, fontSize: 14, color: DARK }}>{user.name}</p>
              <p style={{ fontSize: 12, color: GRAY, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</p>
            </div>
            <div style={{ padding: "8px 0" }}>
              <Link href="/profil" onClick={() => setDrawerOpen(false)} style={{
                display: "block", padding: "10px 16px",
                fontSize: 14, color: DARK, textDecoration: "none", fontWeight: 500,
              }}>
                Mon profil
              </Link>
              <button onClick={() => { signOut({ callbackUrl: "/login" }); setDrawerOpen(false); }}
                style={{
                  display: "block", width: "100%", textAlign: "left",
                  padding: "10px 16px", background: "none", border: "none",
                  fontSize: 14, color: "#EF4444", cursor: "pointer", fontWeight: 500,
                }}>
                Se déconnecter
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
