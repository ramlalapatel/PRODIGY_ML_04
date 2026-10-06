import { GestureId, HandLandmark } from '../types/gestures';

/**
 * Standard 21 Hand Landmark Topology (MediaPipe & Leap Motion compliant):
 * 0: Wrist
 * 1-4: Thumb (CMC, MCP, IP, Tip)
 * 5-8: Index (MCP, PIP, DIP, Tip)
 * 9-12: Middle (MCP, PIP, DIP, Tip)
 * 13-16: Ring (MCP, PIP, DIP, Tip)
 * 17-20: Pinky (MCP, PIP, DIP, Tip)
 */
export const HAND_CONNECTIONS: [number, number][] = [
  // Palm Base
  [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
  [0, 5], [5, 6], [6, 7], [7, 8], // Index
  [5, 9], [9, 10], [10, 11], [11, 12], // Middle
  [9, 13], [13, 14], [14, 15], [15, 16], // Ring
  [13, 17], [17, 18], [18, 19], [19, 20], // Pinky
  [0, 17], // Palm boundary
];

/**
 * Generates canonical 21-landmark coordinates (normalized 0..1) for each LeapGestRecog gesture
 */
export function getCanonicalLandmarks(gesture: GestureId, time = 0): HandLandmark[] {
  // Base wrist center
  const wx = 0.5;
  const wy = 0.8;
  const wz = 0;

  // Small organic oscillation
  const wobble = Math.sin(time * 2) * 0.005;

  switch (gesture) {
    case '01_palm': {
      // All 5 fingers extended outward like a star
      return [
        { x: wx, y: wy, z: wz }, // 0: Wrist
        // Thumb
        { x: 0.42 + wobble, y: 0.72, z: 0.02 },
        { x: 0.35 + wobble, y: 0.64, z: 0.04 },
        { x: 0.30 + wobble, y: 0.55, z: 0.05 },
        { x: 0.26 + wobble, y: 0.48, z: 0.06 },
        // Index
        { x: 0.44, y: 0.58, z: 0.01 },
        { x: 0.41, y: 0.45, z: 0.01 },
        { x: 0.39, y: 0.32, z: 0.01 },
        { x: 0.38, y: 0.20 + wobble, z: 0.01 },
        // Middle
        { x: 0.50, y: 0.56, z: 0 },
        { x: 0.50, y: 0.42, z: 0 },
        { x: 0.50, y: 0.28, z: 0 },
        { x: 0.50, y: 0.16 + wobble, z: 0 },
        // Ring
        { x: 0.56, y: 0.58, z: -0.01 },
        { x: 0.58, y: 0.46, z: -0.01 },
        { x: 0.60, y: 0.34, z: -0.01 },
        { x: 0.62, y: 0.23 + wobble, z: -0.01 },
        // Pinky
        { x: 0.62, y: 0.62, z: -0.02 },
        { x: 0.67, y: 0.52, z: -0.02 },
        { x: 0.71, y: 0.42, z: -0.02 },
        { x: 0.74, y: 0.32 + wobble, z: -0.02 },
      ];
    }
    case '02_l': {
      // Index pointing UP, Thumb extended 90° LEFT, others curled
      return [
        { x: wx, y: wy, z: wz },
        // Thumb (extended horizontally)
        { x: 0.42, y: 0.72, z: 0.02 },
        { x: 0.34, y: 0.68, z: 0.04 },
        { x: 0.26, y: 0.67, z: 0.05 },
        { x: 0.18 + wobble, y: 0.66, z: 0.06 },
        // Index (extended vertically)
        { x: 0.47, y: 0.58, z: 0.01 },
        { x: 0.47, y: 0.44, z: 0.01 },
        { x: 0.47, y: 0.31, z: 0.01 },
        { x: 0.47, y: 0.19 + wobble, z: 0.01 },
        // Middle (curled)
        { x: 0.52, y: 0.58, z: 0 },
        { x: 0.53, y: 0.52, z: 0.05 },
        { x: 0.52, y: 0.60, z: 0.08 },
        { x: 0.51, y: 0.66, z: 0.08 },
        // Ring (curled)
        { x: 0.57, y: 0.60, z: -0.01 },
        { x: 0.58, y: 0.54, z: 0.05 },
        { x: 0.57, y: 0.62, z: 0.08 },
        { x: 0.56, y: 0.67, z: 0.08 },
        // Pinky (curled)
        { x: 0.62, y: 0.64, z: -0.02 },
        { x: 0.63, y: 0.58, z: 0.05 },
        { x: 0.62, y: 0.65, z: 0.08 },
        { x: 0.61, y: 0.70, z: 0.07 },
      ];
    }
    case '03_fist':
    case '04_fist_moved': {
      // All fingers tightly closed
      const moveOffset = gesture === '04_fist_moved' ? Math.sin(time * 4) * 0.08 : 0;
      return [
        { x: wx + moveOffset, y: wy, z: wz },
        // Thumb folded over index/middle
        { x: 0.43 + moveOffset, y: 0.70, z: 0.06 },
        { x: 0.42 + moveOffset, y: 0.62, z: 0.09 },
        { x: 0.46 + moveOffset, y: 0.57, z: 0.11 },
        { x: 0.51 + moveOffset, y: 0.57, z: 0.11 },
        // Index curled
        { x: 0.45 + moveOffset, y: 0.60, z: 0.02 },
        { x: 0.45 + moveOffset, y: 0.51, z: 0.06 },
        { x: 0.46 + moveOffset, y: 0.58, z: 0.09 },
        { x: 0.46 + moveOffset, y: 0.65, z: 0.09 },
        // Middle curled
        { x: 0.50 + moveOffset, y: 0.59, z: 0 },
        { x: 0.50 + moveOffset, y: 0.49, z: 0.06 },
        { x: 0.51 + moveOffset, y: 0.57, z: 0.09 },
        { x: 0.51 + moveOffset, y: 0.64, z: 0.09 },
        // Ring curled
        { x: 0.55 + moveOffset, y: 0.60, z: -0.02 },
        { x: 0.55 + moveOffset, y: 0.51, z: 0.06 },
        { x: 0.56 + moveOffset, y: 0.58, z: 0.09 },
        { x: 0.56 + moveOffset, y: 0.65, z: 0.09 },
        // Pinky curled
        { x: 0.60 + moveOffset, y: 0.63, z: -0.03 },
        { x: 0.60 + moveOffset, y: 0.55, z: 0.05 },
        { x: 0.60 + moveOffset, y: 0.61, z: 0.08 },
        { x: 0.60 + moveOffset, y: 0.68, z: 0.08 },
      ];
    }
    case '05_thumb': {
      // Thumb straight UP, all others curled
      return [
        { x: wx, y: wy, z: wz },
        // Thumb extended high
        { x: 0.43, y: 0.68, z: 0.02 },
        { x: 0.40, y: 0.55, z: 0.04 },
        { x: 0.38, y: 0.42, z: 0.05 },
        { x: 0.36 + wobble, y: 0.28, z: 0.06 },
        // Index curled
        { x: 0.48, y: 0.64, z: 0.02 },
        { x: 0.50, y: 0.58, z: 0.06 },
        { x: 0.50, y: 0.66, z: 0.08 },
        { x: 0.49, y: 0.72, z: 0.08 },
        // Middle curled
        { x: 0.53, y: 0.63, z: 0 },
        { x: 0.55, y: 0.57, z: 0.06 },
        { x: 0.55, y: 0.65, z: 0.08 },
        { x: 0.54, y: 0.71, z: 0.08 },
        // Ring curled
        { x: 0.58, y: 0.64, z: -0.02 },
        { x: 0.60, y: 0.58, z: 0.06 },
        { x: 0.60, y: 0.66, z: 0.08 },
        { x: 0.59, y: 0.72, z: 0.08 },
        // Pinky curled
        { x: 0.63, y: 0.67, z: -0.03 },
        { x: 0.64, y: 0.62, z: 0.05 },
        { x: 0.64, y: 0.68, z: 0.08 },
        { x: 0.63, y: 0.74, z: 0.07 },
      ];
    }
    case '06_index': {
      // Index pointing out, others curled
      return [
        { x: wx, y: wy, z: wz },
        // Thumb folded
        { x: 0.44, y: 0.70, z: 0.04 },
        { x: 0.42, y: 0.63, z: 0.07 },
        { x: 0.45, y: 0.58, z: 0.09 },
        { x: 0.48, y: 0.60, z: 0.09 },
        // Index pointing straight up
        { x: 0.48, y: 0.58, z: 0.01 },
        { x: 0.48, y: 0.44, z: 0.01 },
        { x: 0.48, y: 0.30, z: 0.01 },
        { x: 0.48 + wobble, y: 0.17, z: 0.01 },
        // Middle curled
        { x: 0.53, y: 0.60, z: 0 },
        { x: 0.54, y: 0.53, z: 0.06 },
        { x: 0.54, y: 0.61, z: 0.08 },
        { x: 0.53, y: 0.67, z: 0.08 },
        // Ring curled
        { x: 0.58, y: 0.62, z: -0.02 },
        { x: 0.59, y: 0.55, z: 0.06 },
        { x: 0.59, y: 0.63, z: 0.08 },
        { x: 0.58, y: 0.69, z: 0.08 },
        // Pinky curled
        { x: 0.63, y: 0.65, z: -0.03 },
        { x: 0.64, y: 0.59, z: 0.05 },
        { x: 0.64, y: 0.66, z: 0.08 },
        { x: 0.63, y: 0.72, z: 0.07 },
      ];
    }
    case '07_ok': {
      // Thumb and Index form ring (contact at tips), middle/ring/pinky extended
      return [
        { x: wx, y: wy, z: wz },
        // Thumb curves toward index
        { x: 0.43, y: 0.72, z: 0.02 },
        { x: 0.38, y: 0.62, z: 0.04 },
        { x: 0.38, y: 0.50, z: 0.05 },
        { x: 0.43, y: 0.44, z: 0.05 }, // Tip meets index tip
        // Index curves toward thumb
        { x: 0.47, y: 0.60, z: 0.01 },
        { x: 0.47, y: 0.48, z: 0.02 },
        { x: 0.45, y: 0.42, z: 0.04 },
        { x: 0.43, y: 0.44, z: 0.05 }, // Tip meets thumb tip
        // Middle extended up
        { x: 0.53, y: 0.58, z: 0 },
        { x: 0.54, y: 0.44, z: 0 },
        { x: 0.55, y: 0.30, z: 0 },
        { x: 0.56, y: 0.18 + wobble, z: 0 },
        // Ring extended up
        { x: 0.59, y: 0.60, z: -0.01 },
        { x: 0.61, y: 0.47, z: -0.01 },
        { x: 0.63, y: 0.34, z: -0.01 },
        { x: 0.64, y: 0.22 + wobble, z: -0.01 },
        // Pinky extended up
        { x: 0.64, y: 0.63, z: -0.02 },
        { x: 0.68, y: 0.52, z: -0.02 },
        { x: 0.72, y: 0.41, z: -0.02 },
        { x: 0.75, y: 0.31 + wobble, z: -0.02 },
      ];
    }
    case '08_palm_moved': {
      // Open palm with high horizontal motion / wave
      const wave = Math.sin(time * 6) * 0.07;
      const base = getCanonicalLandmarks('01_palm', time);
      return base.map(pt => ({
        ...pt,
        x: pt.x + wave,
      }));
    }
    case '09_c': {
      // Fingers curved into a C-arc (cup shape)
      return [
        { x: wx, y: wy, z: wz },
        // Thumb curved out and slightly up
        { x: 0.42, y: 0.74, z: 0.03 },
        { x: 0.35, y: 0.70, z: 0.05 },
        { x: 0.33, y: 0.63, z: 0.07 },
        { x: 0.36 + wobble, y: 0.57, z: 0.08 },
        // Index curved in
        { x: 0.46, y: 0.60, z: 0.01 },
        { x: 0.43, y: 0.48, z: 0.03 },
        { x: 0.40, y: 0.40, z: 0.06 },
        { x: 0.45 + wobble, y: 0.37, z: 0.09 },
        // Middle curved in
        { x: 0.51, y: 0.59, z: 0 },
        { x: 0.49, y: 0.47, z: 0.03 },
        { x: 0.46, y: 0.39, z: 0.06 },
        { x: 0.51 + wobble, y: 0.36, z: 0.09 },
        // Ring curved in
        { x: 0.56, y: 0.60, z: -0.01 },
        { x: 0.54, y: 0.49, z: 0.02 },
        { x: 0.52, y: 0.41, z: 0.05 },
        { x: 0.57 + wobble, y: 0.38, z: 0.08 },
        // Pinky curved in
        { x: 0.61, y: 0.63, z: -0.02 },
        { x: 0.60, y: 0.53, z: 0.01 },
        { x: 0.58, y: 0.45, z: 0.04 },
        { x: 0.62 + wobble, y: 0.42, z: 0.07 },
      ];
    }
    case '10_down': {
      // Inverted hand pointing downwards
      const base = getCanonicalLandmarks('01_palm', time);
      return base.map(pt => ({
        ...pt,
        y: 1.0 - (pt.y - 0.1), // flipped upside down
        z: -pt.z,
      }));
    }
    default:
      return getCanonicalLandmarks('01_palm', time);
  }
}

/**
 * Renders an authentic Near-Infrared (NIR) Leap Motion sensor frame onto an HTML canvas.
 * Leap Motion sensor produces high-contrast 850nm NIR grayscale images with:
 * - Bright glowing bone / tissue highlights
 * - Radial infrared falloff from center LEDs
 * - Subtle sensor noise / dithering
 */
export function renderLeapNIRFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  gesture: GestureId,
  time = 0,
  filterMode: 'nir' | 'edge' | 'threshold' | 'skeleton' = 'nir'
) {
  // Clear canvas
  ctx.fillStyle = '#06080e';
  ctx.fillRect(0, 0, width, height);

  const landmarks = getCanonicalLandmarks(gesture, time);

  // Background subtle IR sensor noise & gradient
  const bgGrad = ctx.createRadialGradient(
    width * 0.5,
    height * 0.75,
    20,
    width * 0.5,
    height * 0.75,
    width * 0.6
  );
  bgGrad.addColorStop(0, 'rgba(38, 48, 65, 0.4)');
  bgGrad.addColorStop(0.6, 'rgba(15, 20, 30, 0.2)');
  bgGrad.addColorStop(1, 'rgba(6, 8, 14, 0)');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Render Hand Flesh Silhouette (IR reflection)
  ctx.save();
  
  if (filterMode === 'threshold') {
    ctx.filter = 'contrast(300%) grayscale(100%)';
  }

  // Draw palm blob
  const palmCenter = {
    x: (landmarks[0].x + landmarks[5].x + landmarks[17].x) / 3 * width,
    y: (landmarks[0].y + landmarks[5].y + landmarks[17].y) / 3 * height,
  };

  const palmRadius = width * 0.15;
  const palmGlow = ctx.createRadialGradient(
    palmCenter.x,
    palmCenter.y,
    10,
    palmCenter.x,
    palmCenter.y,
    palmRadius * 1.5
  );
  palmGlow.addColorStop(0, filterMode === 'edge' ? '#475569' : '#e2e8f0');
  palmGlow.addColorStop(0.5, filterMode === 'edge' ? '#1e293b' : '#94a3b8');
  palmGlow.addColorStop(0.85, filterMode === 'edge' ? '#0f172a' : '#334155');
  palmGlow.addColorStop(1, 'transparent');

  ctx.fillStyle = palmGlow;
  ctx.beginPath();
  ctx.arc(palmCenter.x, palmCenter.y, palmRadius, 0, Math.PI * 2);
  ctx.fill();

  // Draw Finger segments with IR bone scatter
  const fingerChains = [
    [0, 1, 2, 3, 4], // Thumb
    [0, 5, 6, 7, 8], // Index
    [0, 9, 10, 11, 12], // Middle
    [0, 13, 14, 15, 16], // Ring
    [0, 17, 18, 19, 20], // Pinky
  ];

  fingerChains.forEach((chain, fIdx) => {
    // Finger thickness decreases toward tip
    for (let i = 0; i < chain.length - 1; i++) {
      const p1 = landmarks[chain[i]];
      const p2 = landmarks[chain[i + 1]];
      const x1 = p1.x * width;
      const y1 = p1.y * height;
      const x2 = p2.x * width;
      const y2 = p2.y * height;

      const baseWidth = (24 - i * 3.5) * (fIdx === 0 ? 1.2 : 1.0);

      // Bone cylinder glow
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineWidth = baseWidth;
      ctx.lineCap = 'round';
      ctx.strokeStyle = filterMode === 'edge' ? '#334155' : 'rgba(203, 213, 225, 0.75)';
      ctx.stroke();

      // Inner high-intensity bone core
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineWidth = Math.max(2, baseWidth * 0.35);
      ctx.strokeStyle = filterMode === 'edge' ? '#94a3b8' : 'rgba(255, 255, 255, 0.9)';
      ctx.stroke();
    }
  });

  // Fingertip radiant points
  [4, 8, 12, 16, 20].forEach(tipIdx => {
    const pt = landmarks[tipIdx];
    const tx = pt.x * width;
    const ty = pt.y * height;
    const tipGrad = ctx.createRadialGradient(tx, ty, 2, tx, ty, 16);
    tipGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    tipGrad.addColorStop(0.5, 'rgba(226, 232, 240, 0.6)');
    tipGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = tipGrad;
    ctx.beginPath();
    ctx.arc(tx, ty, 16, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();

  // If in Edge filter mode, render Sobel / Laplace contour lines
  if (filterMode === 'edge') {
    ctx.save();
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([2, 2]);

    // Outer silhouette contour line
    ctx.beginPath();
    const tips = [0, 4, 3, 2, 8, 7, 6, 12, 11, 10, 16, 15, 14, 20, 19, 18, 17, 0];
    tips.forEach((idx, i) => {
      const px = landmarks[idx].x * width;
      const py = landmarks[idx].y * height;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  // If Skeleton mode, overlay 21 skeletal landmarks with concentric circle gradients
  if (filterMode === 'skeleton') {
    ctx.save();
    
    // Draw bones
    HAND_CONNECTIONS.forEach(([i, j]) => {
      const p1 = landmarks[i];
      const p2 = landmarks[j];
      ctx.beginPath();
      ctx.moveTo(p1.x * width, p1.y * height);
      ctx.lineTo(p2.x * width, p2.y * height);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.7)';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw landmark nodes with concentric circle with gradient
    landmarks.forEach((pt, idx) => {
      const px = pt.x * width;
      const py = pt.y * height;
      const isTip = [4, 8, 12, 16, 20].includes(idx);
      const isWrist = idx === 0;

      // Outer circle with gradient fading to transparency
      const radGrad = ctx.createRadialGradient(px, py, 1, px, py, isTip ? 12 : 7);
      radGrad.addColorStop(0, isTip ? 'rgba(245, 158, 11, 0.9)' : 'rgba(6, 182, 212, 0.9)');
      radGrad.addColorStop(0.5, isTip ? 'rgba(245, 158, 11, 0.3)' : 'rgba(6, 182, 212, 0.3)');
      radGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = radGrad;
      ctx.beginPath();
      ctx.arc(px, py, isTip ? 12 : 7, 0, Math.PI * 2);
      ctx.fill();

      // Solid inner core
      ctx.fillStyle = isTip ? '#f59e0b' : isWrist ? '#10b981' : '#06b6d4';
      ctx.beginPath();
      ctx.arc(px, py, isTip ? 3.5 : 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Schematic index text on tips and wrist
      if (isTip || isWrist) {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '9px JetBrains Mono, monospace';
        ctx.fillText(`${idx}`, px + 6, py - 6);
      }
    });

    ctx.restore();
  }
}
