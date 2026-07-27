"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";

type DropdownItem = { label: string; href: string };
type NavItem =
  | { label: string; href: string; dropdown?: never }
  | { label: string; href?: never; dropdown: DropdownItem[] };

const navItems: NavItem[] = [
  { label: "How It Works", href: "/how-it-works" },
  {
    label: "Industries",
    dropdown: [
      { label: "Services We Offer", href: "/services" },
      { label: "Industries We Serve", href: "/industries" },
    ],
  },
  {
    label: "About Us",
    dropdown: [
      { label: "About Us", href: "/about-us" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

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
              <Link href="/find-a-talent" className="btn btn-primary btn-sm">
                Find a Talent
              </Link>
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

        <Link
          href="/find-a-talent"
          className="btn btn-primary btn-block"
          onClick={() => setMobileOpen(false)}
        >
          Find a Talent
        </Link>
      </div>
    </>
  );
}
