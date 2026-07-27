"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/industries", label: "Industries" },
  { href: "/about-us", label: "About Us" },
  { href: "/contact", label: "Contact" },
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
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
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

      <div className={`mobile-nav${mobileOpen ? " open" : ""}`}>
        <div className="mobile-nav-header">
          <Link
            href="/"
            className="logo"
            onClick={() => setMobileOpen(false)}
          >
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

        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMobileOpen(false)}
          >
            {link.label}
          </Link>
        ))}

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
