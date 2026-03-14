import React, { useMemo } from 'react';

export const SnowLayer = () => {
  const flakes = useMemo(() => {
    return Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 4}s`,
      size: `${Math.random() * 4 + 2}px`,
      opacity: Math.random() * 0.6 + 0.4
    }));
  }, []);

  return (
    <div className="snow-container">
      {flakes.map(flake => (
        <div
          key={flake.id}
          className="snow-pixel"
          style={{
            left: flake.left,
            animationDelay: flake.delay,
            width: flake.size,
            height: flake.size,
            opacity: flake.opacity
          }}
        />
      ))}
    </div>
  );
};
