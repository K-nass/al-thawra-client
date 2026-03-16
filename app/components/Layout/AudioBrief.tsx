import { useState } from "react";
import { Play } from "lucide-react";
import { AudioPlayerModal } from "./AudioPlayerModal";

export function AudioBrief() {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-3 shrink-0">
        {/* Microphone GIF indicator */}
        <img
          src="/microphone.gif"
          alt="مؤشر صوتي نشط"
          className="w-10 h-10 object-contain "
        />

        {/* Label text */}
        <span
          className="text-sm font-medium whitespace-nowrap"
          style={{ color: "#2d3436" }}
        >
          استمع إلى &quot;إيجاز&quot; اليوم
        </span>

        {/* Duration badge */}
        <span
          className="text-sm font-bold whitespace-nowrap"
          style={{ color: "#c71f37" }}
        >
          8:28 دقيقه
        </span>

        {/* Play button */}
        <button
          onClick={() => setIsPlayerOpen(true)}
          aria-label="تشغيل إيجاز اليوم"
          className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          style={{ border: "1px solid #c71f37" }}
        >
          <Play
            className="w-3.5 h-3.5"
            style={{ color: "#c71f37" }}
            fill="#c71f37"
          />
        </button>
      </div>

      {/* Audio Player Modal */}
      <AudioPlayerModal
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        audioSrc="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        title="إيجاز اليوم"
      />
    </>
  );
}
