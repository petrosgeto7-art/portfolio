import React, { useRef, useEffect } from 'react';

// Universe starfield background with twinkling stars
export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let stars: { x: number; y: number; size: number; opacity: number; speed: number; twinkleSpeed: number; twinklePhase: number; color: string }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const colors = [
      'rgba(255, 255, 255,',       // white
      'rgba(251, 191, 36,',        // amber
      'rgba(252, 211, 77,',        // yellow
      'rgba(148, 163, 184,',       // slate
      'rgba(6, 182, 212,',         // cyan (rare)
    ];

    const initStars = () => {
      stars = [];
      const count = Math.floor((canvas.width * canvas.height) / 8000);
      for (let i = 0; i < count; i++) {
        const colorIndex = Math.random() < 0.05 ? 4 : Math.random() < 0.15 ? (Math.random() < 0.5 ? 1 : 2) : (Math.random() < 0.4 ? 3 : 0);
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.8 + 0.3,
          opacity: Math.random() * 0.6 + 0.1,
          speed: Math.random() * 0.02 + 0.005,
          twinkleSpeed: Math.random() * 0.03 + 0.01,
          twinklePhase: Math.random() * Math.PI * 2,
          color: colors[colorIndex],
        });
      }
    };

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.5 + 0.5;
        const currentOpacity = star.opacity * (0.3 + twinkle * 0.7);

        // Draw star glow
        if (star.size > 1) {
          const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 3);
          gradient.addColorStop(0, star.color + (currentOpacity * 0.3).toFixed(3) + ')');
          gradient.addColorStop(1, star.color + '0)');
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Draw star core
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color + currentOpacity.toFixed(3) + ')';
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    resize();
    animationId = requestAnimationFrame(animate);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[-3] pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
}
