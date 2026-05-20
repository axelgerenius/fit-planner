"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV_LINKS = [
  { href: "/dashboard", label: "Accueil" },
  { href: "/planning", label: "Planning" },
  { href: "/nutrition", label: "Nutrition" },
  { href: "/courses", label: "Courses" },
];

export default function AppNav({ user }: { user: { name: string; email: string } }) {
  const pathname = usePathname();
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="bg-background sticky top-0 z-10" style={{ borderBottom: "2px solid #1a1a1a" }}>
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo Bebas Neue */}
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="text-foreground leading-none tracking-widest"
            style={{ fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif", fontSize: "22px" }}
          >
            FIT<span style={{ color: "#c0392b" }}>PLANNER</span>
          </Link>

          <nav className="hidden md:flex items-center gap-0">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="block h-0.5 bg-primary mt-0.5" />
                )}
              </Link>
            ))}
          </nav>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <Avatar className="h-8 w-8">
              <AvatarFallback
                className="text-xs font-bold"
                style={{ background: "#1a1a1a", color: "#f5f0e8", fontFamily: "var(--font-space-mono)" }}
              >
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
            <DropdownMenuItem
              className="cursor-pointer"
              style={{ color: "#c0392b" }}
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile nav */}
      <nav className="md:hidden flex overflow-x-auto" style={{ borderTop: "1px solid #d8d0c4" }}>
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex-1 text-center px-2 py-2.5 text-xs font-medium whitespace-nowrap transition-colors ${
              pathname === link.href ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
            style={pathname === link.href ? { borderBottom: "2px solid #c0392b" } : {}}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
