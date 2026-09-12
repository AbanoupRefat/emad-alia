import { useEffect, useState } from "react";
import "./Countdown.css";

function getRemaining(targetISO) {
  const total = Math.max(0, new Date(targetISO).getTime() - Date.now());
  const day = Math.floor(total / 86400000);
  const hr = Math.floor((total % 86400000) / 3600000);
  const min = Math.floor((total % 3600000) / 60000);
  const sec = Math.floor((total % 60000) / 1000);
  return { day, hr, min, sec, done: total === 0 };
}

const UNITS = [
  { key: "day", label: "Days" },
  { key: "hr", label: "Hours" },
  { key: "min", label: "Minutes" },
  { key: "sec", label: "Seconds" },
];

export default function Countdown({ targetISO }) {
  const [remaining, setRemaining] = useState(() => getRemaining(targetISO));

  useEffect(() => {
    const id = setInterval(() => setRemaining(getRemaining(targetISO)), 1000);
    return () => clearInterval(id);
  }, [targetISO]);

  return (
    <div className="countdown" role="timer" aria-live="polite">
      {UNITS.map(({ key, label }) => (
        <div className="countdown__unit" key={key}>
          <span className="countdown__value">{String(remaining[key]).padStart(2, "0")}</span>
          <span className="countdown__label">{label}</span>
        </div>
      ))}
    </div>
  );
}
