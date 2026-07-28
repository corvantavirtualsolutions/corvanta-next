"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const HERO_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=900&q=70",
    alt: "Business team collaborating remotely",
  },
  {
    src: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=900&q=70",
    alt: "Virtual assistant working on laptop",
  },
  {
    src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=70",
    alt: "Team collaboration meeting",
  },
  {
    src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=70",
    alt: "Professional virtual assistant at work",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % HERO_IMAGES.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [mounted]);

  return (
    <div className="hero-slider">
      {HERO_IMAGES.map((img, i) => (
        <div key={i} className={`hero-slide${i === current ? " active" : ""}`}>
          <Image
            src={img.src}
            alt={img.alt}
            width={900}
            height={600}
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 0 }}
            unoptimized
            priority={i === 0}
          />
        </div>
      ))}
      {/* Slide indicators */}
      <div className="hero-dots" aria-hidden="true">
        {HERO_IMAGES.map((_, i) => (
          <span key={i} className={`hero-dot${i === current ? " active" : ""}`} />
        ))}
      </div>
    </div>
  );
}
