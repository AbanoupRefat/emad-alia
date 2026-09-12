import { useState, useRef, useEffect } from "react";
import "./AudioPlayer.css";

export default function AudioPlayer({ src }) {
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  const wasPlayingBeforeHidden = useRef(false);

  useEffect(() => {
    // Try to play immediately when mounted (user just interacted with the gate, so it should be allowed)
    if (audioRef.current) {
      audioRef.current.volume = 0; // Start at 0 for fade in
      audioRef.current.play().then(() => {
        // Fade in over 3 seconds to target volume 0.4
        let currentVol = 0;
        const targetVol = 0.4;
        const fadeInterval = setInterval(() => {
          currentVol += 0.02;
          if (currentVol >= targetVol) {
            currentVol = targetVol;
            clearInterval(fadeInterval);
          }
          if (audioRef.current) {
            audioRef.current.volume = currentVol;
          }
        }, 150); // 150ms * 20 steps = 3000ms
      }).catch((err) => {
        console.log("Audio autoplay blocked:", err);
        setIsMuted(true); // Fallback to muted state if blocked
      });
    }
  }, []);

  // Automatically pause audio when user switches tabs or exits browser, resume when returning
  useEffect(() => {
    const handleVisibilityChange = () => {
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

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handleVisibilityChange);
    };
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      const nextMuted = !audioRef.current.muted;
      audioRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
      
      // If it was paused (e.g. autoplay blocked), try to play it again
      if (!nextMuted && audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
      }
    }
  };

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="auto" />
      <button 
        className={`audio-fab ${isMuted ? "audio-fab--muted" : ""}`}
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute music" : "Mute music"}
      >
        <span className="audio-fab__icon" aria-hidden="true">
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13"></path>
              <circle cx="6" cy="18" r="3"></circle>
              <circle cx="18" cy="16" r="3"></circle>
            </svg>
          )}
        </span>
      </button>
    </>
  );
}
