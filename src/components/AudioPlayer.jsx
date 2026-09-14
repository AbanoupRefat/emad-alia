import { useRef, useEffect } from "react";

/**
 * AudioPlayer — invisible, no FAB.
 * Mounts when the gate starts to open; fades in immediately
 * (the user's drag gesture counts as the required user interaction).
 */
export default function AudioPlayer({ src }) {
  const audioRef = useRef(null);
  const wasPlayingBeforeHidden = useRef(false);

  // Fade-in on mount
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = 0;
    audioRef.current.play().then(() => {
      let vol = 0;
      const targetVol = 0.4;
      const id = setInterval(() => {
        vol += 0.02;
        if (vol >= targetVol) { vol = targetVol; clearInterval(id); }
        if (audioRef.current) audioRef.current.volume = vol;
      }, 150); // 20 steps × 150 ms = 3 s fade
    }).catch((err) => {
      console.log("Audio autoplay blocked:", err);
    });
  }, []);

  // Pause / resume on tab visibility change
  useEffect(() => {
    const handleVisibility = () => {
      if (!audioRef.current) return;
      if (document.hidden) {
        if (!audioRef.current.paused) {
          wasPlayingBeforeHidden.current = true;
          audioRef.current.pause();
        }
      } else {
        if (wasPlayingBeforeHidden.current) {
          audioRef.current.play().catch(() => {});
          wasPlayingBeforeHidden.current = false;
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pagehide", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pagehide", handleVisibility);
    };
  }, []);

  return <audio ref={audioRef} src={src} loop preload="auto" />;
}
