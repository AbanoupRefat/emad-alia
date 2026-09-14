import { useState, useEffect, useRef } from "react";
import "./ResponsesPage.css";

// ─── Apps Script URL ──────────────────────────────────────────────────────────
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyvsg_3JCVPBokpl6LeWSAKeJPO07Baqbl6Q-wh-oJPk60q41gddEh2hgnbqXDM9B7Y/exec";

// ─── Sparkles Canvas ──────────────────────────────────────────────────────────
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

    // Generate sparkle particles using invitation palette
    const colors = [
      "hsl(7, 30%, 53%)",   // #a86a65 (Copper Rose)
      "hsl(45, 55%, 70%)",  // #e0cb89 (China Doll / Warm Gold)
      "hsl(16, 48%, 71%)",  // #d8a694 (Rosewater)
      "hsl(356, 22%, 38%)", // #754b4d (Plum Wine)
    ];

    const count = Math.min(100, Math.floor((window.innerWidth * window.innerHeight) / 9000));
    const sparkles = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.6 + 0.4,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.007 + 0.002,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    function drawStar(x, y, r, alpha, color) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();

      // Draw subtle cross rays for larger sparkles
      if (r > 1.1) {
        ctx.strokeStyle = color;
        ctx.lineWidth = r * 0.35;
        ctx.globalAlpha = alpha * 0.55;
        const arm = r * 2.6;
        ctx.beginPath();
        ctx.moveTo(x - arm, y); ctx.lineTo(x + arm, y);
        ctx.moveTo(x, y - arm); ctx.lineTo(x, y + arm);
        ctx.stroke();
      }
      ctx.restore();
    }

    function draw(t) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      sparkles.forEach((s) => {
        const alpha = ((Math.sin(t * s.speed + s.phase) + 1) / 2) * 0.8;
        drawStar(
          s.x * canvas.width,
          s.y * canvas.height,
          s.r,
          alpha,
          s.color
        );
      });
      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="rp-sparkles" aria-hidden="true" />;
}

// ─── Format Timestamp to Egypt Time (Day HH:mm) ─────────────────────────────
function formatEgyptTime(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  if (isNaN(d.getTime())) return String(ts);

  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "Africa/Cairo",
      weekday:  "short",
      hour:     "2-digit",
      minute:   "2-digit",
      hour12:   false,
    }).format(d);
  } catch {
    return String(ts);
  }
}

// ─── Delete from Sheet ───────────────────────────────────────────────────────
async function deleteFromSheet(rowIndex) {
  // no-cors: opaque response, but the request reaches Apps Script just fine
  await fetch(SCRIPT_URL, {
    method: "POST",
    mode:   "no-cors",
    body:   JSON.stringify({ action: "delete", rowIndex }),
  });
}

// ─── Message Card ─────────────────────────────────────────────────────────────
function MessageCard({ msg, index, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!window.confirm(`Remove message from ${msg.name}?`)) return;
    setDeleting(true);
    try {
      await deleteFromSheet(msg.rowIndex);
    } catch {
      // no-cors always throws on response read — ignore, assume success
    }
    // Animate out, then remove from state
    setTimeout(() => onDelete(index), 320);
  }

  return (
    <li
      className={`rp-card${deleting ? " rp-card--out" : ""}`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
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
        {deleting
          ? <div className="rp-card__del-spinner" />
          : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          )
        }
      </button>
    </li>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
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
      <SparklesBackground />

      <div className="rp-content">
        {/* Header */}
        <header className="rp-header">
          <p className="rp-header__eyebrow">Emad &amp; Alia &middot; Private</p>
          <h1 className="rp-header__title">Guest Messages</h1>
          <p className="rp-header__sub">
            {status === "ready"
              ? `${messages.length} ${messages.length === 1 ? "message" : "messages"} received`
              : "\u00a0"}
          </p>
          <div className="rp-header__divider" aria-hidden="true" />
        </header>

        {/* Search */}
        {status === "ready" && messages.length > 0 && (
          <div className="rp-search-wrap">
            <svg className="rp-search-icon" width="15" height="15" viewBox="0 0 15 15" fill="none">
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M10 10L13.5 13.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <input
              id="rp-search"
              className="rp-search"
              type="search"
              placeholder="Search by name or message…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search messages"
            />
          </div>
        )}

        {/* Loading */}
        {status === "loading" && (
          <div className="rp-state">
            <div className="rp-spinner" aria-label="Loading…" />
            <p>Loading messages…</p>
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div className="rp-state rp-state--error">
            <p>Couldn't load messages.</p>
            {errorMsg && <pre className="rp-error-detail">{errorMsg}</pre>}
            <button className="rp-retry-btn" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        )}

        {/* Empty */}
        {status === "ready" && messages.length === 0 && (
          <div className="rp-state">
            <p>No messages yet — be the first to wish the couple!</p>
          </div>
        )}

        {/* Cards */}
        {status === "ready" && filtered.length > 0 && (
          <ol className="rp-grid">
            {filtered.map((m, i) => (
              <MessageCard key={`${m.name}-${i}`} msg={m} index={i} onDelete={handleDelete} />
            ))}
          </ol>
        )}

        {/* No search results */}
        {status === "ready" && search && filtered.length === 0 && (
          <div className="rp-state">
            <p>No results for &ldquo;{search}&rdquo;</p>
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
