import React, { useState, useEffect } from 'react';

const CursorEffect = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updatePosition);

    return () => window.removeEventListener('mousemove', updatePosition);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          backgroundColor: 'rgba(187, 134, 252, 0.3)',
          transform: 'translate(-50%, -50%)',
          transition: 'all 0.1s ease',
        }}
      />
    </div>
  );
};

export default CursorEffect;