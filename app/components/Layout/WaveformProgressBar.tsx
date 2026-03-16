import { useMemo, useId } from "react";

interface WaveformProgressBarProps {
  /** Playback progress from 0 to 100 */
  progress: number;
  /** Callback when user clicks/drags to seek — receives a 0-100 value */
  onSeek: (percent: number) => void;
  /** Whether the bar is in RTL mode */
  rtl?: boolean;
}

// --- Deterministic waveform path generator ---
// Seed-based pseudo-random for consistent waveform across renders
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateWaveformPath(
  width: number,
  height: number,
  segments: number = 200
): string {
  const mid = height / 2;
  const maxAmp = height / 2 - 2; // leave 2px padding
  const rand = seededRandom(42);

  // Pre-generate amplitude envelope — varying "energy" across the track
  const envelopePoints = 30;
  const envelope: number[] = [];
  for (let i = 0; i < envelopePoints; i++) {
    envelope.push(0.15 + rand() * 0.85); // min 15% amplitude
  }

  const points: [number, number][] = [];

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const x = t * width;

    // Interpolate envelope
    const envPos = t * (envelopePoints - 1);
    const envIdx = Math.floor(envPos);
    const envFrac = envPos - envIdx;
    const envVal =
      envelope[Math.min(envIdx, envelopePoints - 1)] * (1 - envFrac) +
      envelope[Math.min(envIdx + 1, envelopePoints - 1)] * envFrac;

    // Multi-frequency sine wave for organic feel
    const wave =
      Math.sin(t * Math.PI * 14) * 0.5 +
      Math.sin(t * Math.PI * 23 + 1.2) * 0.3 +
      Math.sin(t * Math.PI * 41 + 0.7) * 0.2;

    const y = mid + wave * maxAmp * envVal;
    points.push([x, y]);
  }

  // Build smooth cubic bezier path through points
  let d = `M ${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)}`;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx = (prev[0] + curr[0]) / 2;
    d += ` C ${cpx.toFixed(2)} ${prev[1].toFixed(2)}, ${cpx.toFixed(2)} ${curr[1].toFixed(2)}, ${curr[0].toFixed(2)} ${curr[1].toFixed(2)}`;
  }

  return d;
}

export function WaveformProgressBar({
  progress,
  onSeek,
  rtl = true,
}: WaveformProgressBarProps) {
  const clipId = useId();

  // Fixed logical dimensions — the SVG scales via viewBox
  const W = 1000;
  const H = 30;

  const pathD = useMemo(() => generateWaveformPath(W, H, 200), []);

  // In RTL the "played" portion is from the right edge
  const clipX = rtl ? W * (1 - progress / 100) : 0;
  const clipW = rtl ? W - clipX : (progress / 100) * W;

  // --- pointer interaction ---
  const handlePointerEvent = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    let ratio = (e.clientX - rect.left) / rect.width;
    if (rtl) ratio = 1 - ratio;
    onSeek(Math.max(0, Math.min(100, ratio * 100)));
  };

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    handlePointerEvent(e);
  };

  return (
    <div
      className="w-full rounded-md cursor-pointer select-none"
      style={{ background: "#1e2128" }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="w-full h-10 block"
        onPointerDown={handlePointerDown}
        onPointerMove={(e) => {
          if (e.buttons > 0) handlePointerEvent(e);
        }}
        role="slider"
        aria-label="شريط تقدم الصوت"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
      >
        <defs>
          <clipPath id={`wf-active-${clipId}`}>
            <rect x={clipX} y="0" width={clipW} height={H} />
          </clipPath>
          <clipPath id={`wf-inactive-${clipId}`}>
            <rect
              x={rtl ? 0 : clipW}
              y="0"
              width={rtl ? clipX : W - clipW}
              height={H}
            />
          </clipPath>
        </defs>

        {/* Inactive / unplayed waveform */}
        <path
          d={pathD}
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          clipPath={`url(#wf-inactive-${clipId})`}
        />

        {/* Active / played waveform — periwinkle */}
        <path
          d={pathD}
          fill="none"
          stroke="#c71f37"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          clipPath={`url(#wf-active-${clipId})`}
        />
      </svg>
    </div>
  );
}
