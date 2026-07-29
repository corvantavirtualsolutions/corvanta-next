"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

/*
 * Placeholder: same image repeated 4× — swap each src for a real photo later.
 * Uses the same hero-slider / hero-slide / hero-dot CSS as HeroSlider.
 */
const STORY_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=70",
    alt: "Corvanta team collaborating",
  },
  {
    src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=70",
    alt: "Corvanta team collaborating",
  },
  {
    src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=70",
    alt: "Corvanta team collaborating",
  },
  {
    src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=70",
    alt: "Corvanta team collaborating",
  },
];

export default function StorySlider() {
  const [current, setCurrent] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % STORY_IMAGES.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [mounted]);

  return (
    <div className="hero-slider">
      {STORY_IMAGES.map((img, i) => (
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
      <div className="hero-dots" aria-hidden="true">
        {STORY_IMAGES.map((_, i) => (
          <span key={i} className={`hero-dot${i === current ? " active" : ""}`} />
        ))}
      </div>
    </div>
  );
}
