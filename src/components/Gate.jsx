import { useRef, useState } from "react";
import gsap from "gsap";
import "./Gate.css";

/**
 * A two-leaf gate the guest drags open (or taps, on mobile) to reveal
 * the couple's names. Built on the same rotateY hinge physics as the
 * platform's shared Gate component — kept local here so this client's
 * copy/timing can diverge without touching the shared one.
 */
export default function Gate({ onOpened, children }) {
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const [opened, setOpened] = useState(false);

  const open = () => {
    if (opened) return;
    setOpened(true);
    const tl = gsap.timeline({
      defaults: { duration: 1.1, ease: "power3.inOut" },
      onComplete: onOpened,
    });
    tl.to(leftRef.current, { rotateY: -110, transformPerspective: 1200 }, 0);
    tl.to(rightRef.current, { rotateY: 110, transformPerspective: 1200 }, 0);
    tl.to([leftRef.current, rightRef.current], { opacity: 0, duration: 0.4 }, 0.7);
  };

  return (
    <div className="gate" onClick={open}>
      <div className="gate__content">{children}</div>
      <div ref={leftRef} className="gate__leaf gate__leaf--left" aria-hidden="true" />
      <div ref={rightRef} className="gate__leaf gate__leaf--right" aria-hidden="true" />
      {!opened && <p className="gate__hint">Tap to open</p>}
    </div>
  );
}
