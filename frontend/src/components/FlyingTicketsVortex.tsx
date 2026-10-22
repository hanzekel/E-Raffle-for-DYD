// 3D paper physics canvas engine simulating realistic fluttering raffle tickets in a wind vortex
import React, { useEffect, useRef, useState } from 'react';
import { EligiblePoolTicket } from '../types';
import { raffleAudio } from '../lib/raffleAudio';

interface FlyingTicketsVortexProps {
  tickets: EligiblePoolTicket[];
  isShuffling: boolean;
  winner: any | null;
  onDrawComplete?: () => void;
  className?: string;
}

interface Ticket3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  pitch: number;
  yaw: number;
  roll: number;
  dPitch: number;
  dYaw: number;
  dRoll: number;
  w: number;
  h: number;
  ticketNumber: string;
  name: string;
  colorType: 'gold' | 'blue' | 'navy' | 'white';
  isGoldenTarget?: boolean;
}

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  vRot: number;
  size: number;
  color: string;
  opacity: number;
}

export const FlyingTicketsVortex: React.FC<FlyingTicketsVortexProps> = ({
  tickets,
  isShuffling,
  winner,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const ticketsRef = useRef<Ticket3D[]>([]);
  const confettiRef = useRef<ConfettiParticle[]>([]);
  const [isAudioMuted, setIsAudioMuted] = useState(raffleAudio.getMuted());

  // Track state transitions for audio and pull animation
  const prevShufflingRef = useRef(false);
  const prevWinnerRef = useRef<any | null>(null);

  // Initialize pool of 3D tickets
  useEffect(() => {
    const poolSize = Math.max(35, Math.min(tickets.length, 65));
    const items: Ticket3D[] = [];

    const colors: ('gold' | 'blue' | 'navy' | 'white')[] = ['gold', 'blue', 'navy', 'white'];

    for (let i = 0; i < poolSize; i++) {
      const src = tickets[i % (tickets.length || 1)];
      const angle = (i / poolSize) * Math.PI * 2;
      const radius = 160 + Math.random() * 120;

      items.push({
        x: Math.cos(angle) * radius,
        y: (Math.random() - 0.5) * 180,
        z: Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        vz: 0,
        pitch: Math.random() * Math.PI * 2,
        yaw: Math.random() * Math.PI * 2,
        roll: Math.random() * Math.PI * 2,
        dPitch: (Math.random() - 0.5) * 0.08,
        dYaw: (Math.random() - 0.5) * 0.08,
        dRoll: (Math.random() - 0.5) * 0.05,
        w: 74,
        h: 38,
        ticketNumber: src?.ticketNumber || `DYD-${1000 + i}`,
        name: src?.registration?.fullName?.split(' ')[0] || 'Youth',
        colorType: colors[i % colors.length],
      });
    }

    ticketsRef.current = items;
  }, [tickets.length]);

  // Handle Audio triggers on state changes
  useEffect(() => {
    if (isShuffling && !prevShufflingRef.current) {
      raffleAudio.startDrawStorm();
      confettiRef.current = [];
    } else if (!isShuffling && prevShufflingRef.current) {
      raffleAudio.stopDrawStorm();
    }
    prevShufflingRef.current = isShuffling;
  }, [isShuffling]);

  useEffect(() => {
    if (winner && !prevWinnerRef.current) {
      raffleAudio.playCelebrationFanfare();
      // Spawn festive confetti shower
      const colors = ['#F5A623', '#FCD34D', '#1A3A8F', '#38BDF8', '#FFFFFF'];
      const conf: ConfettiParticle[] = [];
      for (let i = 0; i < 90; i++) {
        conf.push({
          x: (Math.random() - 0.5) * 500,
          y: -150 - Math.random() * 100,
          vx: (Math.random() - 0.5) * 6,
          vy: Math.random() * 4 + 3,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.2,
          size: Math.random() * 8 + 6,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: 1,
        });
      }
      confettiRef.current = conf;
    }
    prevWinnerRef.current = winner;
  }, [winner]);

  // Main 3D Physics and Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const render = () => {
      time += 0.016;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const focalLength = 550;

      // Draw Chamber Cylinder Lighting & Depth Ambient
      const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, Math.min(width, height) * 0.55);
      grad.addColorStop(0, 'rgba(26, 58, 143, 0.22)');
      grad.addColorStop(0.5, 'rgba(10, 24, 69, 0.12)');
      grad.addColorStop(1, 'rgba(3, 7, 18, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Glass Chamber Outline Rim
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(cx, cy) * 0.88, 0, Math.PI * 2);
      ctx.strokeStyle = isShuffling
        ? 'rgba(245, 166, 35, 0.45)'
        : 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // Swirling golden air currents when shuffling
      if (isShuffling) {
        ctx.save();
        ctx.translate(cx, cy);
        for (let ring = 0; ring < 3; ring++) {
          ctx.beginPath();
          const r = 120 + ring * 50;
          ctx.arc(0, 0, r, time * 3 + ring, time * 3 + ring + 1.2);
          ctx.strokeStyle = `rgba(245, 166, 35, ${0.15 - ring * 0.03})`;
          ctx.lineWidth = 3;
          ctx.stroke();
        }
        ctx.restore();
      }

      const ticketsList = ticketsRef.current;

      // Update Physics for each ticket
      const vortexSpeed = isShuffling ? 0.075 : 0.012;
      const verticalSwirl = isShuffling ? 2.5 : 0.4;

      ticketsList.forEach((t) => {
        // Orbit mathematics
        const currentAngle = Math.atan2(t.z, t.x) + vortexSpeed;
        const currentDist = Math.sqrt(t.x * t.x + t.z * t.z);

        // Turbulence wobbles
        t.x = Math.cos(currentAngle) * currentDist;
        t.z = Math.sin(currentAngle) * currentDist;
        t.y += Math.sin(time * 3 + t.x * 0.01) * verticalSwirl;

        // Keep inside vertical hopper bounds
        if (t.y > 140) t.y = -140;
        if (t.y < -140) t.y = 140;

        // 3D paper rotation
        t.pitch += t.dPitch * (isShuffling ? 2.2 : 1.0);
        t.yaw += t.dYaw * (isShuffling ? 2.2 : 1.0);
        t.roll += t.dRoll * (isShuffling ? 2.2 : 1.0);
      });

      // Sort by depth Z so foreground tickets draw on top of background
      const sortedTickets = [...ticketsList].sort((a, b) => b.z - a.z);

      // Render each 3D ticket
      sortedTickets.forEach((t) => {
        // Project center point
        const scale = focalLength / (focalLength + t.z + 300);
        if (scale <= 0) return;

        const screenX = cx + t.x * scale;
        const screenY = cy + t.y * scale;

        // Calculate 3D surface normal for realistic lighting and paper shading
        const cosYaw = Math.cos(t.yaw);
        const sinYaw = Math.sin(t.yaw);
        const cosPitch = Math.cos(t.pitch);
        const sinPitch = Math.sin(t.pitch);

        const normalZ = cosYaw * cosPitch;

        ctx.save();
        ctx.translate(screenX, screenY);
        ctx.scale(scale, scale);
        ctx.rotate(t.roll);

        // 3D perspective distortion using transform
        ctx.transform(cosYaw, sinPitch * sinYaw, 0, cosPitch, 0, 0);

        const tw = t.w;
        const th = t.h;

        // Ticket Base Color & Lighting
        let baseColor = '#1A3A8F';
        let accentColor = '#F5A623';
        let textColor = '#FFFFFF';

        if (t.colorType === 'gold') {
          baseColor = '#D97706';
          accentColor = '#FEF3C7';
          textColor = '#0F172A';
        } else if (t.colorType === 'navy') {
          baseColor = '#0A1845';
          accentColor = '#60A5FA';
          textColor = '#FFFFFF';
        } else if (t.colorType === 'white') {
          baseColor = '#F8FAFC';
          accentColor = '#1A3A8F';
          textColor = '#0F172A';
        }

        // Apply lighting shade based on angle to viewer
        const lightIntensity = Math.max(0.4, Math.min(1.0, 0.7 + normalZ * 0.35));

        // Ticket Drop Shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
        ctx.shadowBlur = 12 * scale;
        ctx.shadowOffsetY = 6 * scale;

        // Main Ticket Body
        ctx.fillStyle = baseColor;
        ctx.beginPath();
        ctx.roundRect(-tw / 2, -th / 2, tw, th, 4);
        ctx.fill();

        ctx.shadowColor = 'transparent';

        // Lighting wash overlay
        ctx.fillStyle = `rgba(255, 255, 255, ${(lightIntensity - 0.5) * 0.4})`;
        ctx.fill();

        // Border
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Perforated Stub Line
        ctx.setLineDash([2, 2]);
        ctx.strokeStyle = `rgba(255, 255, 255, 0.4)`;
        ctx.beginPath();
        ctx.moveTo(-tw / 2 + 18, -th / 2);
        ctx.lineTo(-tw / 2 + 18, th / 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Side Notches for Authentic Ticket Look
        ctx.fillStyle = '#030712';
        ctx.beginPath();
        ctx.arc(-tw / 2 + 18, -th / 2, 3, 0, Math.PI);
        ctx.arc(-tw / 2 + 18, th / 2, 3, Math.PI, 0);
        ctx.fill();

        // Draw Ticket Text if close enough to camera
        if (scale > 0.48 && normalZ > -0.2) {
          ctx.fillStyle = textColor;
          ctx.font = 'bold 8px monospace';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText(t.ticketNumber, -tw / 2 + 22, -3);

          ctx.fillStyle = accentColor;
          ctx.font = '7px sans-serif';
          ctx.fillText('DYD26', -tw / 2 + 22, 6);
        }

        ctx.restore();
      });

      // Render Confetti Particles if Active
      if (confettiRef.current.length > 0) {
        ctx.save();
        ctx.translate(cx, cy);

        confettiRef.current.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.vRot;
          p.vy += 0.08; // Gravity

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
          ctx.restore();
        });

        // Cull offscreen confetti
        confettiRef.current = confettiRef.current.filter((p) => p.y < height / 2 + 100);
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isShuffling]);

  const toggleSound = () => {
    const nextState = raffleAudio.toggleMute();
    setIsAudioMuted(nextState);
  };

  return (
    <div className={`relative w-full flex flex-col items-center justify-center ${className}`}>
      {/* 3D Flying Tickets Canvas */}
      <div className="relative w-full max-w-2xl h-[340px] sm:h-[420px] md:h-[460px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#040A1E] via-[#081236] to-[#030614] border-2 border-gold/30 shadow-[0_0_60px_rgba(26,58,143,0.35)]">
        <canvas
          ref={canvasRef}
          className="w-full h-full block cursor-default"
        />

        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-royal-blue/20 to-transparent pointer-events-none" />

        {/* Audio Mute/Unmute Control */}
        <button
          onClick={toggleSound}
          className="absolute top-3 right-3 z-30 px-2.5 py-1.5 rounded-xl bg-black/50 hover:bg-black/75 border border-white/20 text-white text-xs font-semibold backdrop-blur transition-all flex items-center gap-1.5 shadow-md active:scale-95"
          title={isAudioMuted ? 'Turn Sound On' : 'Mute Sound'}
        >
          <span>{isAudioMuted ? '🔇' : '🔊'}</span>
          <span className="text-[10px] hidden sm:inline">{isAudioMuted ? 'Muted' : 'Sound On'}</span>
        </button>

        {/* Shuffling Status Pill Overlay */}
        {isShuffling && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 rounded-full bg-gold/90 text-midnight-navy font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-2 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-midnight-navy animate-ping" />
            <span>Swirling {tickets.length} Verified Entries...</span>
          </div>
        )}

        {/* Empty Pool Notice */}
        {tickets.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-center p-4 text-slate-400 text-xs">
            No approved entries in pool yet. Entries will fly here automatically when approved.
          </div>
        )}
      </div>
    </div>
  );
};

