"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

/*
 * 4 distinct images so the fade is visibly different each cycle.
 * Swap src values for real brand photos when they're ready.
 */
const STORY_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=70",
    alt: "Corvanta team collaborating around a table",
  },
  {
    src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=900&q=70",
    alt: "Remote business team in a video call",
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
    /*
     * story-slider: same visual treatment as hero-slider (border-radius,
     * shadow, overflow, slides) but WITHOUT the fixed aspect-ratio so it
     * can fill the full height of its flex-column parent (.story-img-col).
     */
    <div className="story-slider">
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
