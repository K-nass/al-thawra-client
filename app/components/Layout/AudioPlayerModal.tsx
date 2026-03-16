import { useState, useRef, useEffect, useCallback } from "react";
import { X, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { WaveformProgressBar } from "./WaveformProgressBar";

interface AudioPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** URL of the audio source */
  audioSrc?: string;
  /** Title shown in the player */
  title?: string;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function AudioPlayerModal({
  isOpen,
  onClose,
  audioSrc = "/audio/brief.mp3",
  title = "إيجاز اليوم",
}: AudioPlayerModalProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);

  // --- audio element setup ---
  useEffect(() => {
    if (!isOpen) return;

    const audio = new Audio(audioSrc);
    audio.preload = "metadata";
    audio.volume = volume;
    audioRef.current = audio;

    const onLoaded = () => setDuration(audio.duration);
    const onTimeUpdate = () => {
      if (!isSeeking) setCurrentTime(audio.currentTime);
    };
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, audioSrc]);

  // --- play / pause ---
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => { });
    }
    setIsPlaying((p) => !p);
  }, [isPlaying]);

  // --- volume ---
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (v > 0) setIsMuted(false);
  };

  // --- seeking via waveform ---
  const handleWaveformSeek = useCallback(
    (percent: number) => {
      const audio = audioRef.current;
      if (!audio || !duration) return;
      setIsSeeking(true);
      const newTime = (percent / 100) * duration;
      audio.currentTime = newTime;
      setCurrentTime(newTime);
      // Release seeking flag after a tick so timeupdate doesn't fight
      requestAnimationFrame(() => setIsSeeking(false));
    },
    [duration]
  );

  // --- close handler ---
  const handleClose = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
    setCurrentTime(0);
    onClose();
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          dir="rtl"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[100]"
        >
          <div className="border-t border-black/10 shadow-2xl" style={{ background: "#1e2128" }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Controls row */}
              <div className="flex items-center gap-4 py-2">
                {/* Close button */}
                <button
                  onClick={handleClose}
                  aria-label="إغلاق المشغل"
                  className="shrink-0 p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-white/70" />
                </button>

                {/* Current time */}
                <span className="text-xs text-white/50 tabular-nums min-w-[36px] text-center fix-numbers">
                  {formatTime(currentTime)}
                </span>

                {/* Waveform progress bar */}
                <div className="flex-1 min-w-0">
                  <WaveformProgressBar
                    progress={progress}
                    onSeek={handleWaveformSeek}
                    rtl={true}
                  />
                </div>

                {/* Duration */}
                <span className="text-xs text-white/50 tabular-nums min-w-[36px] text-center fix-numbers">
                  {formatTime(duration)}
                </span>

                {/* Play / Pause */}
                <button
                  onClick={togglePlay}
                  aria-label={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
                  className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-[#c71f37] hover:bg-[#c71f37]/80 active:scale-95 transition-all cursor-pointer"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-white" fill="white" />
                  ) : (
                    <Play className="w-5 h-5 text-white" fill="white" />
                  )}
                </button>

                {/* Volume */}
                <div className="hidden sm:flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setIsMuted((m) => !m)}
                    aria-label={isMuted ? "تشغيل الصوت" : "كتم الصوت"}
                    className="p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4 text-white/50" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-white/50" />
                    )}
                  </button>

                  <div className="relative w-20 h-1">
                    <div className="absolute inset-0 rounded-full bg-white/15" />
                    <div
                      className="absolute right-0 top-0 h-full rounded-full bg-[#c71f37] transition-all"
                      style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                    />
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="absolute inset-0 w-full h-full appearance-none bg-transparent cursor-pointer
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md
                        [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-md"
                      aria-label="مستوى الصوت"
                    />
                  </div>
                </div>

                {/* Title (end of row) */}
                <span className="hidden md:block text-sm font-medium text-white truncate max-w-[150px]">
                  {title}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
