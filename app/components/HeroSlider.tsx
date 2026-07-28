"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// All 4 slots use the same placeholder image — swap in real ones later
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=900&q=70",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=900&q=70",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=900&q=70",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=900&q=70",
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % HERO_IMAGES.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hero-slider">
      {HERO_IMAGES.map((src, i) => (
        <div key={i} className={`hero-slide${i === current ? " active" : ""}`}>
          <Image
            src={src}
            alt="Virtual assistant working with a business team"
            width={900}
            height={600}
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 0 }}
            unoptimized
            priority={i === 0}
          />
        </div>
      ))}
    </div>
  );
}
