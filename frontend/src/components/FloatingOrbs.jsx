import { useEffect, useRef } from "react";

const FloatingOrbs = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let particles = [];
    let mouse = { x: null, y: null, radius: 200 };

    const colors = ["#60a5fa", "#a78bfa", "#34d399"]; // fixed for now

    function initParticles() {
      particles = Array.from({ length: 60 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 2,
        baseRadius: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        glow: 0,
      }));
    }

    function drawParticle(p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

      ctx.shadowBlur = p.glow;
      ctx.shadowColor = p.color;
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 1;
      ctx.fill();
    }

    function connectParticles() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          let dx = particles[i].x - particles[j].x;
          let dy = particles[i].y - particles[j].y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 250) { // much bigger threshold
            ctx.beginPath();
            ctx.strokeStyle = particles[i].color;
            ctx.globalAlpha = 0.5; // stronger alpha so you see it
            ctx.lineWidth = 1.2;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    }

    function updateParticles() {
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

        let dx = mouse.x - p.x;
        let dy = mouse.y - p.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          p.radius = Math.min(p.baseRadius * 3, p.radius + 0.5);
          p.glow = 25;
          p.x -= dx / 50;
          p.y -= dy / 50;
        } else {
          if (p.radius > p.baseRadius) p.radius -= 0.05;
          if (p.glow > 0) p.glow -= 1;
        }

        drawParticle(p);
      });

      connectParticles();
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      updateParticles();
      requestAnimationFrame(animate);
    }

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initParticles();
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      // Debug log
      // console.log("Mouse:", mouse.x, mouse.y);
    });

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", () => {});
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
};

export default FloatingOrbs;
