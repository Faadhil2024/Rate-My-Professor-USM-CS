import React from "react";

function polar(angleDeg: number, r: number) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: r * Math.cos(a), y: r * Math.sin(a) };
}

function Branch({ mirror = false }: { mirror?: boolean }) {
  const leafCount = 9;
  const startAngle = 135; // bottom-left, pointing down-and-out
  const endAngle = 262; // sweeps up through the left side to near top-center
  const radius = 58;

  const leaves = Array.from({ length: leafCount }, (_, i) => {
    const t = i / (leafCount - 1);
    let angle = startAngle + (endAngle - startAngle) * t;
    if (mirror) angle = 180 - angle;
    const { x, y } = polar(angle, radius);
    const size = 1.15 - t * 0.45; // bigger leaves at the base, tapering near the tip
    const rotate = mirror ? -(angle + 90) : angle - 90;
    return { x, y, size, rotate, key: i };
  });

  return (
    <>
      {leaves.map((leaf) => (
        <ellipse
          key={leaf.key}
          cx={leaf.x}
          cy={leaf.y}
          rx={9 * leaf.size}
          ry={3.4 * leaf.size}
          transform={`rotate(${leaf.rotate} ${leaf.x} ${leaf.y})`}
          fill="url(#laurel-gold)"
          stroke="#8a6a10"
          strokeWidth="0.4"
        />
      ))}
    </>
  );
}

export function LaurelWreath({ size = 180 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size * 0.86}
      viewBox="-70 -70 140 120"
      className="pointer-events-none"
    >
      <defs>
        <linearGradient id="laurel-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F5D485" />
          <stop offset="55%" stopColor="#D4A62A" />
          <stop offset="100%" stopColor="#9c7209" />
        </linearGradient>
      </defs>
      <Branch />
      <Branch mirror />
    </svg>
  );
}