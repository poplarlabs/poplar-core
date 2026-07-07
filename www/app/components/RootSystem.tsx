'use client';

import { useEffect, useRef } from 'react';

/**
 * The Poplar signature mark: scattered trunks above a horizon line,
 * one connected root system below it. Members anywhere; one thing at the root.
 * Strokes draw in when scrolled into view (see globals.css; reduced-motion safe).
 */
export default function RootSystem({ className = '' }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('in-view');
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <svg
      ref={ref}
      className={`root-system ${className}`}
      viewBox="0 0 900 250"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Seven scattered tree trunks above ground, joined below ground by a single shared root system"
    >
      {/* Horizon line */}
      <line x1="20" y1="120" x2="880" y2="120" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="4 6" pathLength="1" />

      {/* Trunks above ground — scattered, uneven, alive */}
      <g strokeLinecap="round" stroke="currentColor" strokeWidth="3.5">
        <path className="root-trunk" d="M 80 120 L 80 62 M 80 78 L 94 64 M 80 92 L 68 80" pathLength="1" />
        <path className="root-trunk" d="M 205 120 L 205 40 M 205 60 L 220 44 M 205 76 L 190 62 M 205 92 L 218 80" pathLength="1" />
        <path className="root-trunk" d="M 330 120 L 330 78 M 330 92 L 342 82" pathLength="1" />
        <path className="root-trunk" d="M 458 120 L 458 30 M 458 52 L 474 36 M 458 68 L 442 52 M 458 86 L 472 74" pathLength="1" />
        <path className="root-trunk" d="M 590 120 L 590 66 M 590 82 L 576 70 M 590 96 L 602 86" pathLength="1" />
        <path className="root-trunk" d="M 705 120 L 705 48 M 705 66 L 720 52 M 705 84 L 691 70" pathLength="1" />
        <path className="root-trunk" d="M 820 120 L 820 72 M 820 88 L 833 77" pathLength="1" />
      </g>

      {/* One root system below ground — every trunk joins the same spine */}
      <g strokeLinecap="round" stroke="currentColor" strokeWidth="2" strokeOpacity="0.7">
        <path d="M 80 120 C 82 156, 130 172, 190 178" pathLength="1" />
        <path d="M 205 120 C 205 150, 230 170, 280 177" pathLength="1" />
        <path d="M 330 120 C 328 152, 360 172, 400 177" pathLength="1" />
        <path d="M 458 120 C 458 154, 452 170, 450 178" pathLength="1" />
        <path d="M 590 120 C 592 152, 560 172, 520 177" pathLength="1" />
        <path d="M 705 120 C 703 150, 660 171, 610 177" pathLength="1" />
        <path d="M 820 120 C 818 156, 760 173, 700 178" pathLength="1" />
        {/* The shared spine */}
        <path d="M 150 178 C 300 186, 600 186, 750 178" strokeWidth="3" pathLength="1" />
        {/* Fine rootlets off the spine */}
        <path d="M 260 181 C 250 196, 240 204, 226 210" strokeWidth="1.5" strokeOpacity="0.5" pathLength="1" />
        <path d="M 420 184 C 416 200, 408 210, 396 218" strokeWidth="1.5" strokeOpacity="0.5" pathLength="1" />
        <path d="M 560 183 C 566 198, 576 208, 590 214" strokeWidth="1.5" strokeOpacity="0.5" pathLength="1" />
        <path d="M 680 180 C 690 194, 700 202, 716 208" strokeWidth="1.5" strokeOpacity="0.5" pathLength="1" />
      </g>
    </svg>
  );
}
