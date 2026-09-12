import { useRef, useState, useEffect, useCallback } from "react";
import { client } from "../config/emadAlia";
import "./PageCinema.css";

// ─── Typewriter hook ──────────────────────────────────────────────────────────
function useTypewriter(text, speed = 70, start = false) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!start) return;
    setDisplayed("");
    setDone(false);
    let i = 0;
    const tick = () => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i < text.length) {
        setTimeout(tick, speed);
      } else {
        setDone(true);
      }
    };
    const t = setTimeout(tick, speed);
    return () => clearTimeout(t);
  }, [start, text, speed]);

  return { displayed, done };
}

// ─── Film grain overlay ───────────────────────────────────────────────────────
function FilmGrain() {
  return (
    <svg className="cinema-grain" aria-hidden="true">
      <filter id="grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.65"
          numOctaves="3"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
        <feBlend in="SourceGraphic" mode="multiply" result="blend" />
        <feComposite in="blend" in2="SourceGraphic" operator="in" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" opacity="0.08" />
    </svg>
  );
}

// ─── Floating dust particles ──────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  size: 2 + Math.random() * 3,
  delay: Math.random() * 5,
  dur: 6 + Math.random() * 8,
}));

function DustParticles() {
  return (
    <div className="cinema-dust" aria-hidden="true">
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="cinema-particle"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function PageCinema() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);

  const [isVisible, setIsVisible] = useState(false);
  const [startTypewriter, setStartTypewriter] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const hasEndedRef = useRef(false);

  const unlockScroll = useCallback(() => {
    setIsLocked(false);
    document.body.classList.remove("scroll-locked");
  }, []);

  const lockScroll = useCallback(() => {
    setIsLocked(true);
    document.body.classList.add("scroll-locked");
  }, []);

  // Block scroll events while locked
  useEffect(() => {
    if (!isLocked) return;

    const preventScroll = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    const preventKeys = (e) => {
      if (
        ["ArrowUp", "ArrowDown", "PageUp", "PageDown", " ", "Space", "Home", "End"].includes(
          e.key
        )
      ) {
        e.preventDefault();
        return false;
      }
    };

    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("keydown", preventKeys, { passive: false });

    return () => {
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("keydown", preventKeys);
    };
  }, [isLocked]);

  // Clean up lock when unmounted
  useEffect(() => {
    return () => {
      document.body.classList.remove("scroll-locked");
    };
  }, []);

  // 1. Observe when the user scrolls to this section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.6 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // 2. Play video, lock scroll, and start typewriter when visible
  useEffect(() => {
    if (isVisible && !hasEndedRef.current) {
      lockScroll();
      if (sectionRef.current) {
        sectionRef.current.scrollIntoView({ behavior: "smooth" });
      }

      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch((e) => {
          console.warn("Autoplay blocked:", e);
          unlockScroll();
        });
      }

      const t = setTimeout(() => setStartTypewriter(true), 1200);

      // Safety timer (unlock after 15 seconds if onEnded doesn't fire)
      const fallbackTimer = setTimeout(() => {
        if (!hasEndedRef.current) {
          handleVideoEnded();
        }
      }, 15000);

      return () => {
        clearTimeout(t);
        clearTimeout(fallbackTimer);
      };
    }
  }, [isVisible, lockScroll, unlockScroll]);

  const handleVideoEnded = () => {
    hasEndedRef.current = true;
    unlockScroll();
    setShowScrollHint(true);
    if (videoRef.current) {
      videoRef.current.loop = true;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleScrollNext = () => {
    if (sectionRef.current) {
      const nextSection = sectionRef.current.nextElementSibling;
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const nameLine = `${client.namesEn.groom} & ${client.namesEn.bride}`;
  const tagLine = `Our Big Day  ·  ${client.weddingDateLabel}`;

  const { displayed: names, done: namesDone } = useTypewriter(nameLine, 90, startTypewriter);
  const { displayed: tag, done: tagDone } = useTypewriter(tagLine, 60, namesDone);

  const { heroVideo } = client;

  return (
    <section ref={sectionRef} className="snap-section page-cinema" id="page-cinema">
      <div className="cinema-frame">
        {/* Top Text Area (Black space on mobile) */}
        <div className="cinema-text-top">
          {startTypewriter && <p className="cinema-reveal__eyebrow">Emad &amp; Alia present</p>}
          <h1 className="cinema-reveal__names">
            {names}
            {startTypewriter && !namesDone && <span className="cinema-cursor">|</span>}
          </h1>
        </div>

        {/* Video Container */}
        <div className="cinema-video-wrapper">
          <video
            ref={videoRef}
            className="cinema-video"
            muted
            playsInline
            poster={heroVideo.poster}
            onEnded={handleVideoEnded}
            onError={unlockScroll}
          >
            <source src={heroVideo.webm} type="video/webm" />
            <source src={heroVideo.mp4} type="video/mp4" />
          </video>

          {/* Cinematic letterbox bars */}
          <div className="cinema-bar cinema-bar--top" aria-hidden="true" />
          <div className="cinema-bar cinema-bar--bottom" aria-hidden="true" />
        </div>

        {/* Bottom Text Area (Black space on mobile) */}
        <div className="cinema-text-bottom">
          {namesDone && (
            <p className="cinema-reveal__tag">
              {tag}
              {!tagDone && <span className="cinema-cursor">|</span>}
            </p>
          )}
          {showScrollHint && (
            <button
              className="cinema-reveal__hint-btn"
              onClick={handleScrollNext}
              aria-label="Scroll to next page"
            >
              <span>Scroll to continue</span>
              <svg
                className="cinema-hint__arrow"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 13l5 5 5-5" />
                <path d="M12 6v12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
