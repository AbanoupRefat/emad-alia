import { useState, useEffect, useRef } from "react";
import "./ResponsesPage.css";

// ─── Apps Script URL ──────────────────────────────────────────────────────────
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyvsg_3JCVPBokpl6LeWSAKeJPO07Baqbl6Q-wh-oJPk60q41gddEh2hgnbqXDM9B7Y/exec";

const ITEMS_PER_PAGE = 6;

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
      vy: -(Math.random() * 0.00015 + 0.00005),
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

    function drawStarBurst(x, y, r, alpha, angle, color) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.globalAlpha = alpha;

      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 4);
      grad.addColorStop(0, color.fill + (alpha * 0.45) + ")");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, r * 4, 0, Math.PI * 2);
      ctx.fill();

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
function MessageCard({ msg, index, onRequestDelete, isDeleting }) {
  return (
    <li
      className={`rp-card${isDeleting ? " rp-card--out" : ""}`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
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
        onClick={() => onRequestDelete(msg)}
        disabled={isDeleting}
        aria-label={`Delete message from ${msg.name}`}
        title="Delete message"
      >
        {isDeleting ? (
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

// ─── Custom Glassmorphism Confirm Modal ──────────────────────────────────────
function ConfirmDeleteModal({ target, onConfirm, onCancel, deleting }) {
  if (!target) return null;

  return (
    <div className="rp-modal-overlay" onClick={onCancel}>
      <div className="rp-modal" onClick={(e) => e.stopPropagation()}>
        <div className="rp-modal__shimmer" aria-hidden="true" />
        <h3 className="rp-modal__title">Remove Wish?</h3>
        <p className="rp-modal__text">
          Are you sure you want to delete the message from{" "}
          <strong>&ldquo;{target.name}&rdquo;</strong>?
        </p>

        <div className="rp-modal__actions">
          <button
            className="rp-modal__btn rp-modal__btn--cancel"
            onClick={onCancel}
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            className="rp-modal__btn rp-modal__btn--delete"
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting ? "Deleting…" : "Delete Wish"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Toast Notification ───────────────────────────────────────────────────────
function Toast({ message }) {
  if (!message) return null;

  return (
    <div className="rp-toast" role="status">
      <span className="rp-toast__icon">✓</span>
      <span>{message}</span>
    </div>
  );
}

// ─── Main Responses Page ──────────────────────────────────────────────────────
export default function ResponsesPage() {
  const [messages,      setMessages]      = useState([]);
  const [status,        setStatus]        = useState("loading");
  const [search,        setSearch]        = useState("");
  const [errorMsg,      setErrorMsg]      = useState("");
  const [deleteTarget,  setDeleteTarget]  = useState(null); // msg object
  const [isDeleting,    setIsDeleting]    = useState(false);
  const [toastMsg,      setToastMsg]      = useState(null);
  const [currentPage,   setCurrentPage]   = useState(1);

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
          // Ensure LATEST (newest / highest rowIndex) responses come FIRST
          const sorted = [...msgs].sort((a, b) => (b.rowIndex || 0) - (a.rowIndex || 0));
          setMessages(sorted);
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

  function handleRequestDelete(msg) {
    setDeleteTarget(msg);
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      await deleteFromSheet(deleteTarget);
    } catch {
      // no-cors mode throws on reading body — ignore
    }

    const name = deleteTarget.name;
    const targetRowIndex = deleteTarget.rowIndex;

    // Remove from state
    setMessages((prev) => prev.filter((m) => m.rowIndex !== targetRowIndex));

    setIsDeleting(false);
    setDeleteTarget(null);

    // Trigger Toast
    setToastMsg(`Wish from "${name}" deleted`);
    setTimeout(() => {
      setToastMsg(null);
    }, 3200);
  }

  function handleCancelDelete() {
    setDeleteTarget(null);
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to page 1 on search
  };

  const filtered = messages.filter(
    (m) =>
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.message?.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const effectivePage = Math.min(currentPage, totalPages);
  const startIndex = (effectivePage - 1) * ITEMS_PER_PAGE;
  const paginatedMessages = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page) => {
    setCurrentPage(page);
    setTimeout(() => {
      const target = document.querySelector(".rp-card") || document.querySelector(".rp-grid");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 40);
  };

  return (
    <div className="rp-root">
      {/* Background Animated Canvas */}
      <SparklesBackground />

      {/* Floating Ambient Orbs */}
      <div className="rp-orb rp-orb--1" aria-hidden="true" />
      <div className="rp-orb rp-orb--2" aria-hidden="true" />
      <div className="rp-orb rp-orb--3" aria-hidden="true" />

      {/* Toast Notification */}
      <Toast message={toastMsg} />

      {/* Custom Glassmorphism Confirm Modal */}
      <ConfirmDeleteModal
        target={deleteTarget}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        deleting={isDeleting}
      />

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
              onChange={handleSearchChange}
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
          <>
            <ol className="rp-grid">
              {paginatedMessages.map((m, i) => (
                <MessageCard
                  key={`${m.name}-${m.rowIndex || i}`}
                  msg={m}
                  index={i}
                  onRequestDelete={handleRequestDelete}
                  isDeleting={deleteTarget?.rowIndex === m.rowIndex && isDeleting}
                />
              ))}
            </ol>

            {/* Glassmorphism Pagination Controls */}
            {totalPages > 1 && (
              <nav className="rp-pagination" aria-label="Messages Pagination">
                <button
                  className="rp-pagination__btn"
                  onClick={() => goToPage(effectivePage - 1)}
                  disabled={effectivePage === 1}
                  aria-label="Previous Page"
                >
                  &larr; Prev
                </button>

                <div className="rp-pagination__pages">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      className={`rp-pagination__page${page === effectivePage ? " rp-pagination__page--active" : ""}`}
                      onClick={() => goToPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  className="rp-pagination__btn"
                  onClick={() => goToPage(effectivePage + 1)}
                  disabled={effectivePage === totalPages}
                  aria-label="Next Page"
                >
                  Next &rarr;
                </button>
              </nav>
            )}
          </>
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
