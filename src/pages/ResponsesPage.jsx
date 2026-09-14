import { useState, useEffect, useRef } from "react";
import "./ResponsesPage.css";

// ─── Apps Script URL ──────────────────────────────────────────────────────────
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyvsg_3JCVPBokpl6LeWSAKeJPO07Baqbl6Q-wh-oJPk60q41gddEh2hgnbqXDM9B7Y/exec";

// ─── Enhanced Sparkles & Interactive Trail Canvas ──────────────────────────────
function SparklesBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // Invitation theme colors
    const colors = [
      { fill: "rgba(168, 106, 101, ", stroke: "#a86a65" }, // Copper Rose
      { fill: "rgba(224, 203, 137, ", stroke: "#e0cb89" }, // China Doll / Warm Gold
      { fill: "rgba(216, 166, 148, ", stroke: "#d8a694" }, // Rosewater
      { fill: "rgba(171, 136, 130, ", stroke: "#ab8882" }, // Dusty Rose
    ];

    // Background floating sparkles
    const count = Math.min(110, Math.floor((window.innerWidth * window.innerHeight) / 7500));
    const sparkles = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.8 + 0.5,
      angle: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.008 + 0.003,
      vy: -(Math.random() * 0.00015 + 0.00005), // gentle upwards drift
      color: colors[Math.floor(Math.random() * colors.length)],
      isStarburst: Math.random() > 0.4,
    }));

    // Mouse / Touch Trail Particles
    let trail = [];
    function addTrailParticle(px, py) {
      if (trail.length > 40) trail.shift();
      const col = colors[Math.floor(Math.random() * colors.length)];
      trail.push({
        x: px,
        y: py,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2 - 0.8,
        r: Math.random() * 2.2 + 0.8,
        alpha: 1,
        life: 1,
        decay: Math.random() * 0.02 + 0.015,
        color: col,
      });
    }

    function handlePointerMove(e) {
      addTrailParticle(e.clientX, e.clientY);
    }
    window.addEventListener("pointermove", handlePointerMove);

    // Draw a 4-point star burst
    function drawStarBurst(x, y, r, alpha, angle, color) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.globalAlpha = alpha;

      // Glow backdrop
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 4);
      grad.addColorStop(0, color.fill + (alpha * 0.45) + ")");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, r * 4, 0, Math.PI * 2);
      ctx.fill();

      // Core star
      ctx.fillStyle = color.stroke;
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        ctx.lineTo(Math.cos((i * Math.PI) / 2) * r * 3, Math.sin((i * Math.PI) / 2) * r * 3);
        ctx.lineTo(
          Math.cos((i * Math.PI) / 2 + Math.PI / 4) * (r * 0.7),
          Math.sin((i * Math.PI) / 2 + Math.PI / 4) * (r * 0.7)
        );
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function draw(t) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render floating ambient background sparkles
      sparkles.forEach((s) => {
        s.y += s.vy;
        if (s.y < -0.05) s.y = 1.05;
        s.angle += s.rotationSpeed;

        const alpha = ((Math.sin(t * s.speed + s.phase) + 1) / 2) * 0.85;
        const px = s.x * canvas.width;
        const py = s.y * canvas.height;

        if (s.isStarburst) {
          drawStarBurst(px, py, s.r, alpha, s.angle, s.color);
        } else {
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.fillStyle = s.color.stroke;
          ctx.beginPath();
          ctx.arc(px, py, s.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      // Render interactive mouse/touch trail
      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          trail.splice(i, 1);
          continue;
        }

        drawStarBurst(p.x, p.y, p.r, p.alpha, p.x * 0.05, p.color);
      }

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="rp-sparkles" aria-hidden="true" />;
}

// ─── Format Timestamp to Egypt Time (14 Sep 2026, 20:08) ────────────────────
function formatEgyptTime(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  if (isNaN(d.getTime())) return String(ts);

  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Cairo",
      day:      "2-digit",
      month:    "short",
      year:     "numeric",
      hour:     "2-digit",
      minute:   "2-digit",
      hour12:   false,
    }).format(d);
  } catch {
    return String(ts);
  }
}

// ─── Delete from Sheet ───────────────────────────────────────────────────────
async function deleteFromSheet(msg) {
  await fetch(SCRIPT_URL, {
    method: "POST",
    mode:   "no-cors",
    body:   JSON.stringify({
      action:   "delete",
      rowIndex: msg.rowIndex,
      name:     msg.name,
      message:  msg.message,
    }),
  });
}

// ─── Message Card ─────────────────────────────────────────────────────────────
function MessageCard({ msg, index, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!window.confirm(`Remove message from ${msg.name}?`)) return;
    setDeleting(true);
    try {
      await deleteFromSheet(msg);
    } catch {
      // no-cors mode throws on reading body — ignore
    }
    setTimeout(() => onDelete(index), 350);
  }

  return (
    <li
      className={`rp-card${deleting ? " rp-card--out" : ""}`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Shimmer top reflection bar */}
      <div className="rp-card__shimmer" aria-hidden="true" />

      <div className="rp-card__body">
        <div className="rp-card__top">
          <strong className="rp-card__name">{msg.name}</strong>
          {msg.timestamp && (
            <time className="rp-card__time">{formatEgyptTime(msg.timestamp)}</time>
          )}
        </div>
        <p className="rp-card__message">{msg.message}</p>
      </div>

      <button
        className="rp-card__delete"
        onClick={handleDelete}
        disabled={deleting}
        aria-label={`Delete message from ${msg.name}`}
        title="Delete"
      >
        {deleting ? (
          <div className="rp-card__del-spinner" />
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        )}
      </button>
    </li>
  );
}

// ─── Main Responses Page ──────────────────────────────────────────────────────
export default function ResponsesPage() {
  const [messages, setMessages] = useState([]);
  const [status,   setStatus]   = useState("loading");
  const [search,   setSearch]   = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const ctrl = new AbortController();

    fetch(SCRIPT_URL, { signal: ctrl.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (json && json.result === "success") {
          const msgs = Array.isArray(json.data) ? json.data : [];
          setMessages([...msgs].reverse());
          setStatus("ready");
        } else if (json && json.result === "error") {
          setErrorMsg(String(json.error || "Unknown error from script"));
          setStatus("error");
        } else {
          setErrorMsg("Unexpected response from server");
          setStatus("error");
        }
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setErrorMsg(err.message);
        setStatus("error");
      });

    return () => ctrl.abort();
  }, []);

  function handleDelete(idx) {
    setMessages((prev) => prev.filter((_, i) => i !== idx));
  }

  const filtered = messages.filter(
    (m) =>
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.message?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rp-root">
      {/* Background Animated Sparkles Canvas */}
      <SparklesBackground />

      {/* Floating Decorative Ambient Orbs */}
      <div className="rp-orb rp-orb--1" aria-hidden="true" />
      <div className="rp-orb rp-orb--2" aria-hidden="true" />
      <div className="rp-orb rp-orb--3" aria-hidden="true" />

      <div className="rp-content">
        {/* Header */}
        <header className="rp-header">
          <div className="rp-header__badge">
            <span className="rp-header__dot" aria-hidden="true" />
            <span className="rp-header__eyebrow">Emad &amp; Alia &middot; Private</span>
          </div>

          <h1 className="rp-header__title">Guest Messages</h1>

          <p className="rp-header__sub">
            {status === "ready" ? (
              <span className="rp-header__count-pill">
                {messages.length} {messages.length === 1 ? "wish received" : "wishes received"}
              </span>
            ) : (
              "\u00a0"
            )}
          </p>

          <div className="rp-header__divider" aria-hidden="true" />
        </header>

        {/* Search */}
        {status === "ready" && messages.length > 0 && (
          <div className="rp-search-wrap">
            <svg className="rp-search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M10.5 10.5L14.5 14.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            <input
              id="rp-search"
              className="rp-search"
              type="search"
              placeholder="Search by guest name or message…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search messages"
            />
          </div>
        )}

        {/* Loading State */}
        {status === "loading" && (
          <div className="rp-state">
            <div className="rp-spinner" aria-label="Loading…" />
            <p className="rp-state__text">Opening wedding guestbook…</p>
          </div>
        )}

        {/* Error State */}
        {status === "error" && (
          <div className="rp-state rp-state--error">
            <p className="rp-state__text">Couldn't load messages.</p>
            {errorMsg && <pre className="rp-error-detail">{errorMsg}</pre>}
            <button className="rp-retry-btn" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {status === "ready" && messages.length === 0 && (
          <div className="rp-state">
            <p className="rp-state__text">No messages yet — be the first to wish the couple!</p>
          </div>
        )}

        {/* Cards Grid */}
        {status === "ready" && filtered.length > 0 && (
          <ol className="rp-grid">
            {filtered.map((m, i) => (
              <MessageCard key={`${m.name}-${i}`} msg={m} index={i} onDelete={handleDelete} />
            ))}
          </ol>
        )}

        {/* No Search Results */}
        {status === "ready" && search && filtered.length === 0 && (
          <div className="rp-state">
            <p className="rp-state__text">No wishes found matching &ldquo;{search}&rdquo;</p>
          </div>
        )}

        {/* Footer */}
        <footer className="rp-footer">
          <a href="/" className="rp-footer__link">Back to Invitation</a>
        </footer>
      </div>
    </div>
  );
}
