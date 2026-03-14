import React, { useMemo } from 'react';

export const RainLayer = () => {
  const drops = useMemo(() => {
    return Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`,
      opacity: Math.random()
    }));
  }, []);

  return (
    <div className="rain-container" id="rain-layer">
      {drops.map(drop => (
        <div
          key={drop.id}
          className="rain-pixel"
          style={{
            left: drop.left,
            animationDelay: drop.delay,
            opacity: drop.opacity
          }}
        />
      ))}
    </div>
  );
};
