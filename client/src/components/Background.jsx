import { useEffect, useRef, useState } from 'react';

export default function Background() {
  const canvasRef = useRef(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Determine if document is in dark mode
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    // Initial check
    checkDarkMode();

    // Listen for class changes on document.documentElement (for theme switcher)
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates
    const mouse = {
      x: null,
      y: null,
      radius: 180, // Influence radius
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initElements();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    // Node class representing circuit terminals
    class Node {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.radius = Math.random() * 2.5 + 2.5; // Larger nodes
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      update() {
        // Drift slowly
        this.x += this.vx;
        this.y += this.vy;

        // Bounce on borders
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse interaction (slight magnetic push/pull)
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.hypot(dx, dy);

          if (distance < mouse.radius) {
            // Push away gently
            const force = (mouse.radius - distance) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            this.x -= Math.cos(angle) * force * 0.8;
            this.y -= Math.sin(angle) * force * 0.8;
          }
        }

        this.pulsePhase += 0.03;
      }

      draw(isDarkTheme) {
        ctx.beginPath();
        const baseColor = isDarkTheme 
          ? 'rgba(56, 189, 248, ' // Sky blue (Dark Mode)
          : 'rgba(79, 70, 229, '; // Indigo (Light Mode)
        
        // Brighter pulsing glow
        const alpha = isDarkTheme 
          ? 0.45 + Math.sin(this.pulsePhase) * 0.25 
          : 0.35 + Math.sin(this.pulsePhase) * 0.2;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${baseColor}${alpha})`;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = isDarkTheme ? '#ffffff' : '#312e81';
        ctx.fill();
      }
    }

    // Floating chip/module graphic
    class Chip {
      constructor(label, widthSize, heightSize) {
        this.label = label;
        this.w = widthSize;
        this.h = heightSize;
        this.x = Math.random() * (width - widthSize - 100) + 50;
        this.y = Math.random() * (height - heightSize - 100) + 50;
        this.vx = (Math.random() - 0.5) * 0.15;
        this.vy = (Math.random() - 0.5) * 0.15;
        this.pins = Math.floor(Math.random() * 4) + 4; // number of pins on each side
        this.angle = (Math.random() - 0.5) * 0.1; // dynamic tilt
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce
        if (this.x < 50 || this.x > width - this.w - 50) this.vx *= -1;
        if (this.y < 50 || this.y > height - this.h - 50) this.vy *= -1;
      }

      draw(isDarkTheme) {
        ctx.save();
        ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
        ctx.rotate(this.angle);

        const halfW = -this.w / 2;
        const halfH = -this.h / 2;

        // Colors
        const strokeColor = isDarkTheme ? 'rgba(99, 102, 241, 0.4)' : 'rgba(71, 85, 105, 0.2)';
        const pinColor = isDarkTheme ? 'rgba(234, 179, 8, 0.4)' : 'rgba(202, 138, 4, 0.4)'; // Golden copper pins
        const bodyBg = isDarkTheme ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.7)';
        const textColor = isDarkTheme ? 'rgba(56, 189, 248, 0.6)' : 'rgba(67, 56, 202, 0.6)';

        // Draw Pins (Left and Right)
        ctx.fillStyle = pinColor;
        const pinW = 6;
        const pinH = 3;
        const pinSpacing = this.h / (this.pins + 1);

        for (let i = 1; i <= this.pins; i++) {
          const pinY = halfH + pinSpacing * i - pinH / 2;
          // Left pin
          ctx.fillRect(halfW - pinW, pinY, pinW, pinH);
          // Right pin
          ctx.fillRect(halfW + this.w, pinY, pinW, pinH);
        }

        // Draw Pins (Top and Bottom)
        const pinSpacingW = this.w / (this.pins + 1);
        for (let i = 1; i <= this.pins; i++) {
          const pinX = halfW + pinSpacingW * i - pinH / 2;
          // Top pin
          ctx.fillRect(pinX, halfH - pinW, pinH, pinW);
          // Bottom pin
          ctx.fillRect(pinX, halfH + this.h, pinH, pinW);
        }

        // Chip Body
        ctx.beginPath();
        ctx.roundRect(halfW, halfH, this.w, this.h, 6);
        ctx.fillStyle = bodyBg;
        ctx.fill();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Subtle tech details inside the chip
        ctx.beginPath();
        ctx.roundRect(halfW + 4, halfH + 4, this.w - 8, this.h - 8, 4);
        ctx.strokeStyle = isDarkTheme ? 'rgba(99, 102, 241, 0.15)' : 'rgba(71, 85, 105, 0.08)';
        ctx.stroke();

        // Notch (top center indicator)
        ctx.beginPath();
        ctx.arc(0, halfH, 4, 0, Math.PI);
        ctx.fillStyle = bodyBg;
        ctx.fill();
        ctx.strokeStyle = strokeColor;
        ctx.stroke();

        // Label
        ctx.font = 'bold 9px monospace';
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.label, 0, 0);

        ctx.restore();
      }
    }

    // Glowing Signal Pulses that travel along circuit trace paths
    class SignalPulse {
      constructor(startNode, endNode) {
        this.start = startNode;
        this.end = endNode;
        this.progress = 0;
        this.speed = Math.random() * 0.015 + 0.01; // Sneakier/snappier electron speed
        this.size = Math.random() * 2 + 2.5; // Larger pulse size
      }

      update() {
        this.progress += this.speed;
        return this.progress >= 1; // Returns true if pulse has finished traveling
      }

      draw(isDarkTheme) {
        const x = this.start.x + (this.end.x - this.start.x) * this.progress;
        const y = this.start.y + (this.end.y - this.start.y) * this.progress;

        ctx.beginPath();
        ctx.arc(x, y, this.size, 0, Math.PI * 2);
        
        if (isDarkTheme) {
          ctx.fillStyle = '#06b6d4'; // Glowing Cyan signal
          ctx.shadowBlur = 12;
          ctx.shadowColor = '#06b6d4';
        } else {
          ctx.fillStyle = '#4f46e5'; // Glowing Indigo signal
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#4f46e5';
        }
        
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow
      }
    }

    let nodes = [];
    let chips = [];
    let pulses = [];

    const initElements = () => {
      nodes = [];
      chips = [];
      pulses = [];

      // Scale count based on screen size
      const nodeCount = Math.min(Math.floor((width * height) / 19000), 85);
      const chipCount = Math.min(Math.floor(width / 320), 6);

      // Create nodes
      for (let i = 0; i < nodeCount; i++) {
        nodes.push(new Node(Math.random() * width, Math.random() * height));
      }

      // Create silicon chips
      const chipLabels = ['MCU-32', 'DAC-10', 'ADC-12', 'RF-TRANS', 'FPGA-9', 'EEPROM', 'IO-EXP'];
      for (let i = 0; i < chipCount; i++) {
        const label = chipLabels[i % chipLabels.length];
        chips.push(new Chip(label, 70, 50));
      }
    };

    initElements();

    const animate = () => {
      // Clear with soft gradient overlay (cleans trace rendering artifacts)
      ctx.clearRect(0, 0, width, height);

      const isDarkTheme = document.documentElement.classList.contains('dark');

      // Update and draw floating modules/chips first (so traces render on top if needed)
      chips.forEach((chip) => {
        chip.update();
        chip.draw(isDarkTheme);
      });

      // Draw trace lines connecting nodes
      const maxDistance = 145; // Increased connection reach
      ctx.lineWidth = 1.2;     // Thicker trace lines

      for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i];

        for (let j = i + 1; j < nodes.length; j++) {
          const nodeB = nodes[j];
          const dist = Math.hypot(nodeA.x - nodeB.x, nodeA.y - nodeB.y);

          if (dist < maxDistance) {
            // Draw neat right-angle circuit-like corners occasionally for extra realism
            const alpha = (maxDistance - dist) / maxDistance * (isDarkTheme ? 0.35 : 0.28);
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            
            // 35% chance to draw right-angle paths, typical for circuit traces
            if ((i + j) % 3 === 0) {
              ctx.lineTo(nodeA.x + (nodeB.x - nodeA.x) / 2, nodeA.y);
              ctx.lineTo(nodeA.x + (nodeB.x - nodeA.x) / 2, nodeB.y);
            }
            ctx.lineTo(nodeB.x, nodeB.y);

            ctx.strokeStyle = isDarkTheme 
              ? `rgba(56, 189, 248, ${alpha})` // Glowing Sky Blue trace
              : `rgba(99, 102, 241, ${alpha})`; // Indigo trace
            ctx.stroke();

            // Spawn dynamic signal pulses periodically along this trace path
            if (pulses.length < 35 && Math.random() < 0.006) { // Spawned much more frequently
              pulses.push(new SignalPulse(nodeA, nodeB));
            }
          }
        }

        // Draw traces connecting chips to nearby nodes
        chips.forEach((chip) => {
          const distToChip = Math.hypot(nodeA.x - (chip.x + chip.w/2), nodeA.y - (chip.y + chip.h/2));
          if (distToChip < 160) {
            const alpha = (160 - distToChip) / 160 * (isDarkTheme ? 0.25 : 0.22);
            ctx.beginPath();
            ctx.moveTo(chip.x + chip.w/2, chip.y + chip.h/2);
            ctx.lineTo(nodeA.x, nodeA.y);
            ctx.strokeStyle = isDarkTheme 
              ? `rgba(168, 85, 247, ${alpha})` // Purple links for chips
              : `rgba(129, 140, 248, ${alpha})`;
            ctx.stroke();
          }
        });

        // Interactive mouse hover trace lines
        if (mouse.x !== null && mouse.y !== null) {
          const distToMouse = Math.hypot(nodeA.x - mouse.x, nodeA.y - mouse.y);
          if (distToMouse < 220) { // Increased mouse radius
            const alpha = (220 - distToMouse) / 220 * (isDarkTheme ? 0.65 : 0.45);
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = isDarkTheme 
              ? `rgba(6, 182, 212, ${alpha})` // Bright Cyan links to mouse
              : `rgba(79, 70, 229, ${alpha})`; // Indigo links to mouse
            ctx.stroke();
          }
        }

        nodeA.update();
        nodeA.draw(isDarkTheme);
      }

      // Update and draw signal pulses
      pulses = pulses.filter((pulse) => {
        const finished = pulse.update();
        pulse.draw(isDarkTheme);
        return !finished;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none -z-10 bg-transparent transition-colors duration-500"
    />
  );
}
