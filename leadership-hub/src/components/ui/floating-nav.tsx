"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/calendar", label: "Calendar", icon: "📅" },
  { href: "/messages", label: "Messages", icon: "💬" },
  { href: "/tasks", label: "Tasks", icon: "✅" },
  { href: "/library", label: "Library", icon: "📁" },
];

export function FloatingNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-40">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between rounded-2xl border border-white/15 bg-slate-900/60 backdrop-blur-2xl px-6 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-bold">
              LH
            </div>
            <span className="text-white font-semibold text-lg hidden sm:block">Leadership Hub</span>
          </Link>

          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                    ${isActive
                      ? "bg-white/15 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                      : "text-white/60 hover:text-white/90 hover:bg-white/5"
                    }
                  `}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <form action="/api/auth/sign-out" method="POST">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-white/90 hover:bg-white/5 transition-all duration-200"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  );
}
