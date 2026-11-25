// frontend/src/components/FlyingTicketsVortex.tsx
// 1:1 3D paper physics chamber + decelerating ticket scanner synced with server CSPRNG draw
import React, { useEffect, useRef, useState } from 'react';
import { EligiblePoolTicket } from '../types';
import { raffleAudio } from '../lib/raffleAudio';

export type DrawPhase = 'idle' | 'mixing' | 'selecting' | 'revealed';

interface FlyingTicketsVortexProps {
  tickets: EligiblePoolTicket[];
  drawPhase: DrawPhase;
  pendingWinner: any | null;
  winner: any | null;
  className?: string;
}

interface Ticket3D {
  x: number;
  y: number;
  z: number;
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
  camp: string;
  colorType: 'gold' | 'blue' | 'navy' | 'white';
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
}

const MAX_RENDERED_TICKETS = 100;

export const FlyingTicketsVortex: React.FC<FlyingTicketsVortexProps> = ({
  tickets,
  drawPhase,
  pendingWinner,
  winner,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const ticketsRef = useRef<Ticket3D[]>([]);
  const confettiRef = useRef<ConfettiParticle[]>([]);
  const scanTimeoutsRef = useRef<number[]>([]);

  // Refs synced to props so the 60fps loop stays continuous without restarting
  const drawPhaseRef = useRef<DrawPhase>(drawPhase);
  const highlightedTicketRef = useRef<string | null>(null);
  const lockedTicketRef = useRef<string | null>(null);
  const lockedWinnerDetailsRef = useRef<{ ticketNumber: string; name: string; camp: string } | null>(null);

  const [isAudioMuted, setIsAudioMuted] = useState(raffleAudio.getMuted());
  const [scannedTicket, setScannedTicket] = useState<{
    ticketNumber: string;
    name: string;
    camp: string;
    isLocked: boolean;
  } | null>(null);

  useEffect(() => {
    drawPhaseRef.current = drawPhase;
  }, [drawPhase]);

  // Build strict 1:1 3D ticket objects from actual verified tickets (0 tickets = empty chamber)
  useEffect(() => {
    if (tickets.length === 0) {
      ticketsRef.current = [];
      return;
    }

    // Preserve up to MAX_RENDERED_TICKETS unique real tickets; ensure pendingWinner is always included
    let pool = tickets.slice(0, MAX_RENDERED_TICKETS);
    if (pendingWinner?.ticketNumber && !pool.some((t) => t.ticketNumber === pendingWinner.ticketNumber)) {
      const winnerItem = tickets.find((t) => t.ticketNumber === pendingWinner.ticketNumber);
      if (winnerItem) {
        pool = [...pool.slice(0, MAX_RENDERED_TICKETS - 1), winnerItem];
      }
    }

    const colors: ('gold' | 'blue' | 'navy' | 'white')[] = ['blue', 'navy', 'white', 'gold'];
    const total = pool.length;

    const items: Ticket3D[] = pool.map((src, i) => {
      const angle = (i / Math.max(1, total)) * Math.PI * 2;
      const radius = total === 1 ? 0 : 120 + (i % 3) * 45 + Math.random() * 25;

      return {
        x: total === 1 ? 0 : Math.cos(angle) * radius,
        y: total === 1 ? 0 : ((i % 5) - 2) * 38 + (Math.random() - 0.5) * 20,
        z: total === 1 ? -40 : Math.sin(angle) * radius,
        pitch: Math.random() * Math.PI * 2,
        yaw: Math.random() * Math.PI * 2,
        roll: Math.random() * 0.6 - 0.3,
        dPitch: (Math.random() - 0.5) * 0.06,
        dYaw: (Math.random() - 0.5) * 0.07,
        dRoll: (Math.random() - 0.5) * 0.03,
        w: 112,
        h: 58,
        ticketNumber: src.ticketNumber,
        name: src.registration?.fullName || 'Participant',
        camp: src.registration?.campName || '',
        colorType: colors[i % colors.length],
      };
    });

    ticketsRef.current = items;
  }, [tickets, pendingWinner?.ticketNumber]);

  // Clear scheduled scan timeouts helper
  const clearScanTimers = () => {
    scanTimeoutsRef.current.forEach((id) => window.clearTimeout(id));
    scanTimeoutsRef.current = [];
  };

  // Phase orchestration for sound effects, decelerating spotlight scan, and confetti
  useEffect(() => {
    clearScanTimers();

    if (drawPhase === 'idle') {
      raffleAudio.stopDrawStorm();
      highlightedTicketRef.current = null;
      lockedTicketRef.current = null;
      lockedWinnerDetailsRef.current = null;
      setScannedTicket(null);
      return;
    }

    if (drawPhase === 'mixing') {
      highlightedTicketRef.current = null;
      lockedTicketRef.current = null;
      lockedWinnerDetailsRef.current = null;
      setScannedTicket(null);
      confettiRef.current = [];
      raffleAudio.startDrawStorm();
      return;
    }

    if (drawPhase === 'selecting' && pendingWinner) {
      raffleAudio.stopDrawStorm();

      const targetNum = pendingWinner.ticketNumber;
      const targetName = pendingWinner.registration?.fullName || 'Verified Participant';
      const targetCamp = pendingWinner.registration?.campName || '';

      // Build decelerating hop sequence through real verified tickets ending strictly on pendingWinner
      const otherTickets = tickets.filter((t) => t.ticketNumber !== targetNum);
      const delays = otherTickets.length === 0
        ? [180]
        : [70, 85, 100, 120, 145, 175, 220, 280, 360, 470, 620];

      let cumulativeDelay = 0;

      delays.forEach((stepDelay, idx) => {
        cumulativeDelay += stepDelay;
        const isFinal = idx === delays.length - 1;

        const timerId = window.setTimeout(() => {
          if (isFinal) {
            highlightedTicketRef.current = targetNum;
            lockedTicketRef.current = targetNum;
            lockedWinnerDetailsRef.current = {
              ticketNumber: targetNum,
              name: targetName,
              camp: targetCamp,
            };
            setScannedTicket({
              ticketNumber: targetNum,
              name: targetName,
              camp: targetCamp,
              isLocked: true,
            });
            raffleAudio.playTick(-260); // crisp higher lock chime
          } else {
            const candidate = otherTickets[Math.floor(Math.random() * otherTickets.length)];
            highlightedTicketRef.current = candidate.ticketNumber;
            setScannedTicket({
              ticketNumber: candidate.ticketNumber,
              name: candidate.registration?.fullName || 'Participant',
              camp: candidate.registration?.campName || '',
              isLocked: false,
            });
            raffleAudio.playTick(idx * 25);
          }
        }, cumulativeDelay);

        scanTimeoutsRef.current.push(timerId);
      });

      return () => clearScanTimers();
    }

    if (drawPhase === 'revealed' && winner) {
      highlightedTicketRef.current = winner.ticketNumber;
      lockedTicketRef.current = winner.ticketNumber;
      lockedWinnerDetailsRef.current = {
        ticketNumber: winner.ticketNumber,
        name: winner.registration?.fullName || 'Verified Participant',
        camp: winner.registration?.campName || '',
      };
      setScannedTicket(null);
      raffleAudio.playCelebrationFanfare();

      const colors = ['#F5A623', '#FCD34D', '#1A3A8F', '#38BDF8', '#FFFFFF'];
      const conf: ConfettiParticle[] = [];
      for (let i = 0; i < 95; i++) {
        conf.push({
          x: (Math.random() - 0.5) * 540,
          y: -160 - Math.random() * 120,
          vx: (Math.random() - 0.5) * 6.5,
          vy: Math.random() * 4 + 3,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.22,
          size: Math.random() * 8 + 6,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
      confettiRef.current = conf;
    }

    return () => clearScanTimers();
  }, [drawPhase, pendingWinner, winner, tickets]);

  // Continuous 60fps 3D rendering loop
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
      const focalLength = 560;
      const phase = drawPhaseRef.current;
      const highlighted = highlightedTicketRef.current;
      const locked = lockedTicketRef.current;

      // Ambient vault radial glow
      const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, Math.min(width, height) * 0.55);
      grad.addColorStop(0, phase === 'selecting' || phase === 'revealed'
        ? 'rgba(245, 166, 35, 0.24)'
        : 'rgba(26, 58, 143, 0.24)');
      grad.addColorStop(0.55, 'rgba(10, 24, 69, 0.14)');
      grad.addColorStop(1, 'rgba(3, 7, 18, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Glass tumbler rim
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(cx, cy) * 0.86, 0, Math.PI * 2);
      ctx.strokeStyle = phase === 'mixing'
        ? 'rgba(245, 166, 35, 0.55)'
        : phase === 'selecting'
          ? 'rgba(245, 166, 35, 0.8)'
          : 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = phase === 'selecting' ? 2.5 : 2;
      ctx.stroke();
      ctx.restore();

      // Wind air rings during mixing storm
      if (phase === 'mixing') {
        ctx.save();
        ctx.translate(cx, cy);
        for (let ring = 0; ring < 3; ring++) {
          ctx.beginPath();
          const r = 110 + ring * 50;
          ctx.arc(0, 0, r, time * 4 + ring, time * 4 + ring + 1.4);
          ctx.strokeStyle = `rgba(245, 166, 35, ${0.22 - ring * 0.04})`;
          ctx.lineWidth = 3;
          ctx.stroke();
        }
        ctx.restore();
      }

      const ticketsList = ticketsRef.current;

      // Determine orbital & tumble speeds per phase
      const vortexSpeed =
        phase === 'mixing' ? 0.085 :
        phase === 'selecting' ? (locked ? 0.004 : 0.02) :
        phase === 'revealed' ? 0.004 :
        0.01;
      const rotMult = phase === 'mixing' ? 2.4 : phase === 'selecting' ? 0.7 : 0.9;

      ticketsList.forEach((t) => {
        const isLockedWinner = locked && t.ticketNumber === locked;

        if (isLockedWinner) {
          // Smoothly pull the exact drawn ticket to center front of camera facing viewer
          t.x += (0 - t.x) * 0.12;
          t.y += (-10 - t.y) * 0.12;
          t.z += (-250 - t.z) * 0.12;
          t.pitch += (0 - Math.sin(t.pitch)) * 0.15;
          t.yaw += (0 - Math.sin(t.yaw)) * 0.15;
          t.roll += (0 - t.roll) * 0.15;
        } else {
          const currentAngle = Math.atan2(t.z, t.x) + vortexSpeed;
          const currentDist = Math.sqrt(t.x * t.x + t.z * t.z);

          if (currentDist > 1) {
            t.x = Math.cos(currentAngle) * currentDist;
            t.z = Math.sin(currentAngle) * currentDist;
          }
          t.y += Math.sin(time * 2.5 + t.x * 0.015) * (phase === 'mixing' ? 2.2 : 0.35);
          if (t.y > 140) t.y = -140;
          if (t.y < -140) t.y = 140;

          t.pitch += t.dPitch * rotMult;
          t.yaw += t.dYaw * rotMult;
          t.roll += t.dRoll * rotMult;
        }
      });

      // Depth sort (back to front)
      const sortedTickets = [...ticketsList].sort((a, b) => b.z - a.z);

      sortedTickets.forEach((t) => {
        const scale = focalLength / (focalLength + t.z + 300);
        if (scale <= 0) return;

        const screenX = cx + t.x * scale;
        const screenY = cy + t.y * scale;
        const isHighlighted = highlighted === t.ticketNumber;
        const isLocked = locked === t.ticketNumber;

        const cosYaw = isLocked ? 1 : Math.cos(t.yaw);
        const sinYaw = isLocked ? 0 : Math.sin(t.yaw);
        const cosPitch = isLocked ? 1 : Math.cos(t.pitch);
        const sinPitch = isLocked ? 0 : Math.sin(t.pitch);
        const normalZ = cosYaw * cosPitch;

        ctx.save();

        // Dim non-selected tickets once the winning ticket is locked
        if (locked && !isLocked) {
          ctx.globalAlpha = 0.25;
        }

        ctx.translate(screenX, screenY);
        ctx.scale(scale * (isHighlighted ? 1.25 : 1), scale * (isHighlighted ? 1.25 : 1));
        ctx.rotate(isLocked ? 0 : t.roll);
        ctx.transform(cosYaw, sinPitch * sinYaw, 0, cosPitch, 0, 0);

        const tw = t.w;
        const th = t.h;

        let baseColor = '#1A3A8F';
        let accentColor = '#F5A623';
        let textColor = '#FFFFFF';

        if (isHighlighted || isLocked) {
          baseColor = '#F59E0B';
          accentColor = '#FFFFFF';
          textColor = '#0F172A';
        } else if (t.colorType === 'gold') {
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

        const lightIntensity = Math.max(0.45, Math.min(1.0, 0.72 + normalZ * 0.3));

        // Radiant gold halo on actively scanned / locked ticket
        if (isHighlighted || isLocked) {
          ctx.shadowColor = '#F5A623';
          ctx.shadowBlur = isLocked ? 28 : 18;
        } else {
          ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
          ctx.shadowBlur = 12 * scale;
          ctx.shadowOffsetY = 6 * scale;
        }

        // Ticket stub shape
        ctx.fillStyle = baseColor;
        ctx.beginPath();
        ctx.roundRect(-tw / 2, -th / 2, tw, th, 5);
        ctx.fill();

        ctx.shadowColor = 'transparent';
        ctx.fillStyle = `rgba(255, 255, 255, ${(lightIntensity - 0.5) * 0.35})`;
        ctx.fill();

        ctx.strokeStyle = accentColor;
        ctx.lineWidth = isHighlighted || isLocked ? 2 : 1.2;
        ctx.stroke();

        // Perforated stub tear line
        ctx.setLineDash([2, 2]);
        ctx.strokeStyle = isHighlighted || isLocked ? 'rgba(15, 23, 42, 0.35)' : 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.moveTo(-tw / 2 + 20, -th / 2);
        ctx.lineTo(-tw / 2 + 20, th / 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Side perforation cutouts
        ctx.fillStyle = '#030712';
        ctx.beginPath();
        ctx.arc(-tw / 2 + 20, -th / 2, 3.2, 0, Math.PI);
        ctx.arc(-tw / 2 + 20, th / 2, 3.2, Math.PI, 0);
        ctx.fill();

        // Legible Name -> Ticket Number -> Camp stacked cleanly on face-up stubs
        if (scale > 0.42 && normalZ > -0.25) {
          const lockedDetails = isLocked && lockedWinnerDetailsRef.current?.ticketNumber === t.ticketNumber
            ? lockedWinnerDetailsRef.current
            : null;
          const displayName = lockedDetails?.name || t.name;
          const displayCamp = lockedDetails?.camp || t.camp;

          const shortName = displayName.length > 15 ? `${displayName.slice(0, 14)}…` : displayName;
          const shortCamp = displayCamp.length > 18 ? `${displayCamp.slice(0, 17)}…` : displayCamp;

          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';

          // 1. Participant Name (primary line)
          ctx.fillStyle = textColor;
          ctx.font = 'bold 8.5px sans-serif';
          ctx.fillText(shortName, -tw / 2 + 25, -12);

          // 2. Ticket Number right below Name
          ctx.fillStyle = isHighlighted || isLocked ? '#0F172A' : accentColor;
          ctx.font = 'bold 7.5px monospace';
          ctx.fillText(t.ticketNumber, -tw / 2 + 25, 2);

          // 3. Camp Name underneath
          if (shortCamp) {
            ctx.fillStyle = isHighlighted || isLocked ? 'rgba(15, 23, 42, 0.8)' : textColor;
            ctx.globalAlpha = (locked && !isLocked ? 0.25 : 1) * 0.82;
            ctx.font = '600 6.5px sans-serif';
            ctx.fillText(shortCamp, -tw / 2 + 25, 14);
          }
        }

        ctx.restore();
      });

      // Render celebration confetti particles
      if (confettiRef.current.length > 0) {
        ctx.save();
        ctx.translate(cx, cy);

        confettiRef.current.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.vRot;
          p.vy += 0.08;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
          ctx.restore();
        });

        confettiRef.current = confettiRef.current.filter((p) => p.y < height / 2 + 120);
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const toggleSound = () => {
    const nextState = raffleAudio.toggleMute();
    setIsAudioMuted(nextState);
  };

  return (
    <div className={`relative w-full flex flex-col items-center justify-center ${className}`}>
      <div className="relative w-full max-w-2xl h-[340px] sm:h-[420px] md:h-[460px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#040A1E] via-[#081236] to-[#030614] border-2 border-gold/30 shadow-[0_0_60px_rgba(26,58,143,0.35)]">
        <canvas ref={canvasRef} className="w-full h-full block cursor-default" />

        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-royal-blue/20 to-transparent pointer-events-none" />

        {/* Live Exact Pool Count Badge (Top-Left) */}
        <div className="absolute top-3 left-3 z-30 px-3 py-1.5 rounded-xl bg-black/55 border border-white/15 text-white text-[11px] font-bold backdrop-blur flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${tickets.length > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <span>
            {tickets.length === 0
              ? '0 Tickets Yet'
              : `${tickets.length} ${tickets.length === 1 ? 'Ticket' : 'Tickets'} in the Draw`}
          </span>
        </div>

        {/* Audio Mute/Unmute Control (Top-Right) */}
        <button
          onClick={toggleSound}
          className="absolute top-3 right-3 z-30 px-2.5 py-1.5 rounded-xl bg-black/50 hover:bg-black/75 border border-white/20 text-white text-xs font-semibold backdrop-blur transition-all flex items-center gap-1.5 shadow-md active:scale-95"
          title={isAudioMuted ? 'Turn Sound On' : 'Mute Sound'}
        >
          <span>{isAudioMuted ? '🔇' : '🔊'}</span>
          <span className="text-[10px] hidden sm:inline">{isAudioMuted ? 'Muted' : 'Sound On'}</span>
        </button>

        {/* Live Spotlight Scanner Readout during 'selecting' */}
        {drawPhase === 'selecting' && scannedTicket && (
          <div className="absolute inset-x-0 bottom-5 flex justify-center px-4 z-30 pointer-events-none">
            <div
              className={`px-5 py-2.5 rounded-2xl border backdrop-blur-xl shadow-2xl text-center transition-all duration-150 ${
                scannedTicket.isLocked
                  ? 'bg-gold text-midnight-navy border-white scale-105 shadow-[0_0_30px_rgba(245,166,35,0.75)]'
                  : 'bg-slate-900/90 text-white border-gold/50'
              }`}
            >
              <span className={`text-[9px] font-black uppercase tracking-widest block ${scannedTicket.isLocked ? 'text-midnight-navy/80' : 'text-gold'}`}>
                {scannedTicket.isLocked ? '✓ Winner Picked!' : 'Picking a Winner...'}
              </span>
              <div className={`font-heading text-lg sm:text-2xl font-black tracking-tight truncate max-w-[270px] mx-auto leading-tight mt-0.5 ${scannedTicket.isLocked ? 'text-midnight-navy' : 'text-white'}`}>
                {scannedTicket.name}
              </div>
              <div className={`font-mono text-xs sm:text-sm font-bold tracking-widest mt-0.5 ${scannedTicket.isLocked ? 'text-midnight-navy/85' : 'text-gold'}`}>
                {scannedTicket.ticketNumber}
              </div>
              {scannedTicket.camp && (
                <div className={`text-[11px] font-semibold truncate max-w-[260px] mx-auto mt-0.5 ${scannedTicket.isLocked ? 'text-midnight-navy/75' : 'text-sky-200'}`}>
                  {scannedTicket.camp}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mixing Status Pill Overlay */}
        {drawPhase === 'mixing' && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 rounded-full bg-gold/95 text-midnight-navy font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-2 animate-pulse whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-midnight-navy animate-ping" />
            <span>Shuffling {tickets.length} {tickets.length === 1 ? 'Ticket' : 'Tickets'}...</span>
          </div>
        )}

        {/* Empty Pool State — 0 Fake Tickets Shown */}
        {tickets.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pointer-events-none">
            <div className="bg-slate-900/75 border border-white/15 backdrop-blur-md rounded-2xl px-5 py-4 max-w-sm">
              <p className="text-sm font-bold text-white mb-1">No Tickets In The Draw Yet</p>
              <p className="text-xs text-slate-300 leading-relaxed">
                Once payments get approved by the team, tickets will drop right in here!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
