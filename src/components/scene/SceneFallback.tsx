import { useMemo } from "react";
import { rng } from "./rng";

/**
 * Fallback sem WebGL: a mesma metáfora da cena 3D numa ilustração estática —
 * pontos âmbar dispersos que convergem num cristal e saem como seis feixes ordenados.
 */
export function SceneFallback() {
  const dots = useMemo(() => {
    const r = rng(11);
    return Array.from({ length: 90 }, () => {
      const t = r();
      const spread = (1 - t) * 260;
      return {
        x: 80 + t * 560,
        y: 450 + (r() - 0.5) * spread * 2,
        s: 1 + r() * 2.6,
        o: 0.25 + r() * 0.6,
      };
    });
  }, []);
  const lanes = [-75, -45, -15, 15, 45, 75];

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-[2] h-full w-full opacity-60"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id="fb-core" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#5eead4" stopOpacity="0.55" />
          <stop offset="1" stopColor="#5eead4" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fb-lane" x1="0" x2="1">
          <stop offset="0" stopColor="#5eead4" stopOpacity="0.9" />
          <stop offset="1" stopColor="#7dd3fc" stopOpacity="0" />
        </linearGradient>
      </defs>
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.s} fill="#fbbf6b" opacity={d.o} />
      ))}
      <circle cx="760" cy="450" r="180" fill="url(#fb-core)" />
      <g fill="none" stroke="#c8fff6" strokeOpacity="0.55" strokeWidth="1.2">
        <path d="M760 360 L838 405 L838 495 L760 540 L682 495 L682 405 Z" />
        <path d="M760 360 L760 540 M682 405 L838 495 M838 405 L682 495" strokeOpacity="0.25" />
      </g>
      <circle cx="760" cy="450" r="250" fill="none" stroke="#5eead4" strokeOpacity="0.25" />
      {lanes.map((dy) => (
        <path
          key={dy}
          d={`M850 ${450 + dy * 0.4} C 1050 ${450 + dy * 0.6}, 1250 ${450 + dy * 1.6}, 1440 ${450 + dy * 2.6}`}
          stroke="url(#fb-lane)"
          strokeWidth="1.5"
          fill="none"
        />
      ))}
    </svg>
  );
}
