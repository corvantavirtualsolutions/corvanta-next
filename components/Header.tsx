"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";
import { logout } from "@/app/auth/actions";

type DropdownItem = { label: string; href: string };
type NavItem =
  | { label: string; href: string; dropdown?: never }
  | { label: string; href?: never; dropdown: DropdownItem[] };

type AuthUser = { email: string } | null;

const navItems: NavItem[] = [
  { label: "How It Works", href: "/how-it-works" },
  {
    label: "Industries",
    dropdown: [
      { label: "Services We Offer", href: "/services" },
      { label: "Industries We Serve", href: "/industries" },
    ],
  },
  { label: "Pricing", href: "/pricing" },
  {
    label: "About Us",
    dropdown: [
      { label: "About Us", href: "/about-us" },
      { label: "Contact", href: "/contact" },
      { label: "Client Reviews", href: "/reviews" },
    ],
  },
];

export default function Header({ user }: { user: AuthUser }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="navbar">
        <div className="container">
          <Link href="/" className="logo">
            <Image
              src="/logo.png"
              alt="Corvanta logo"
              width={36}
              height={36}
              className="logo-img"
              priority
            />
            Corvanta Virtual Solutions
          </Link>

          <div className="nav-right">
            <nav className="nav-links">
              {navItems.map((item) =>
                item.dropdown ? (
                  <div key={item.label} className="nav-item">
                    <button className="nav-trigger">
                      {item.label}
                      <ChevronDown size={13} className="nav-chevron" />
                    </button>
                    <div className="dropdown-menu">
                      <div className="dropdown-menu-inner">
                        {item.dropdown.map((sub) => (
                          <Link key={sub.href} href={sub.href} className="dropdown-link">
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link key={item.href} href={item.href}>
                    {item.label}
                  </Link>
                )
              )}
            </nav>

            <div className="nav-actions">
              <Link
                href={user ? "/find-a-talent" : "/login"}
                className={`btn ${user ? "btn-primary-dark" : "btn-primary"} btn-sm`}
              >
                Find a Talent
              </Link>
              {user && (
                <div className="nav-avatar" ref={avatarRef}>
                  <button
                    className="nav-avatar-btn"
                    onClick={() => setAvatarOpen((o) => !o)}
                    aria-label="Account menu"
                    aria-expanded={avatarOpen}
                  >
                    {user.email[0].toUpperCase()}
                  </button>
                  {avatarOpen && (
                    <div className="nav-avatar-dropdown">
                      <span className="nav-avatar-email" title={user.email}>
                        {user.email}
                      </span>
                      <div className="nav-avatar-divider" />
                      <form action={logout}>
                        <button type="submit" className="nav-avatar-option">
                          Log out
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <button
            className="nav-toggle"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <div className={`mobile-nav${mobileOpen ? " open" : ""}`}>
        <div className="mobile-nav-header">
          <Link href="/" className="logo" onClick={() => setMobileOpen(false)}>
            <Image
              src="/logo.png"
              alt="Corvanta logo"
              width={36}
              height={36}
              className="logo-img"
            />
            Corvanta Virtual Solutions
          </Link>
          <button
            className="mobile-nav-close"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          >
            <X />
          </button>
        </div>

        {navItems.map((item) =>
          item.dropdown ? (
            item.dropdown.map((sub) => (
              <Link
                key={sub.href}
                href={sub.href}
                onClick={() => setMobileOpen(false)}
              >
                {sub.label}
              </Link>
            ))
          ) : (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          )
        )}

        {user && (
          <>
            <span className="mobile-nav-email">{user.email}</span>
            <form action={logout}>
              <button
                type="submit"
                className="btn btn-outline btn-block"
                onClick={() => setMobileOpen(false)}
              >
                Log out
              </button>
            </form>
          </>
        )}

        <Link
          href={user ? "/find-a-talent" : "/login"}
          className={`btn ${user ? "btn-primary-dark" : "btn-primary"} btn-block`}
          onClick={() => setMobileOpen(false)}
        >
          Find a Talent
        </Link>
      </div>
    </>
  );
}
