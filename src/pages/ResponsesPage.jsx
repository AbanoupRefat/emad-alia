import { useState, useEffect } from "react";
import "./ResponsesPage.css";

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyvsg_3JCVPBokpl6LeWSAKeJPO07Baqbl6Q-wh-oJPk60q41gddEh2hgnbqXDM9B7Y/exec";

/**
 * ResponsesPage — private page for Emad & Alia only.
 * Accessible via /?view=responses
 *
 * Fetches all submitted messages from the Google Apps Script sheet
 * and displays them in a beautiful, stationery-card layout.
 */
export default function ResponsesPage() {
  const [entries, setEntries]   = useState([]);
  const [status,  setStatus]    = useState("loading"); // loading | ready | error
  const [search,  setSearch]    = useState("");

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${SCRIPT_URL}?action=getAll`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        // Expect: { data: [{ name, message, timestamp }, ...] }
        const rows = Array.isArray(data?.data) ? data.data : [];
        setEntries(rows);
        setStatus("ready");
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Failed to load responses:", err);
          setStatus("error");
        }
      });

    return () => controller.abort();
  }, []);

  const filtered = entries.filter(
    (e) =>
      e.name?.toLowerCase().includes(search.toLowerCase()) ||
      e.message?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rp-root">
      {/* ── Header ── */}
      <header className="rp-header">
        <p className="rp-header__eyebrow">Emad &amp; Alia · Private</p>
        <h1 className="rp-header__title">Guest Messages</h1>
        <p className="rp-header__sub">
          {status === "ready"
            ? `${entries.length} ${entries.length === 1 ? "message" : "messages"} received`
            : "\u00a0"}
        </p>
      </header>

      {/* ── Search ── */}
      {status === "ready" && entries.length > 0 && (
        <div className="rp-search-wrap">
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

      {/* ── States ── */}
      {status === "loading" && (
        <div className="rp-state">
          <div className="rp-spinner" aria-label="Loading…" />
          <p>Loading messages…</p>
        </div>
      )}

      {status === "error" && (
        <div className="rp-state rp-state--error">
          <span className="rp-state__icon">✗</span>
          <p>Couldn't load messages. Check your connection and refresh.</p>
          <button className="rp-retry-btn" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      )}

      {status === "ready" && entries.length === 0 && (
        <div className="rp-state">
          <span className="rp-state__icon">✉</span>
          <p>No messages yet — be the first to wish the couple!</p>
        </div>
      )}

      {/* ── Cards grid ── */}
      {status === "ready" && filtered.length > 0 && (
        <ol className="rp-grid" reversed>
          {filtered.map((entry, i) => (
            <li key={i} className="rp-card" style={{ animationDelay: `${i * 40}ms` }}>
              <div className="rp-card__seal" aria-hidden="true">✿</div>
              <div className="rp-card__body">
                <strong className="rp-card__name">{entry.name}</strong>
                {entry.timestamp && (
                  <time className="rp-card__time">
                    {new Date(entry.timestamp).toLocaleDateString("en-GB", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </time>
                )}
                <p className="rp-card__message">{entry.message}</p>
              </div>
            </li>
          ))}
        </ol>
      )}

      {status === "ready" && search && filtered.length === 0 && (
        <div className="rp-state">
          <p>No results for &ldquo;{search}&rdquo;</p>
        </div>
      )}

      {/* ── Footer ── */}
      <footer className="rp-footer">
        <a href="/" className="rp-footer__link">← Back to Invitation</a>
      </footer>
    </div>
  );
}
