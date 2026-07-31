"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { logout } from "@/app/auth/actions";

type AuthUser = { email: string };

export default function AdminHeader({ user }: { user: AuthUser }) {
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
    <header className="navbar">
      <div className="container" style={{ justifyContent: "space-between" }}>
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
      </div>
    </header>
  );
}
