import { useState, useEffect } from "react";
import "./ResponsesPage.css";

// ─── Same URL as GuestBook ────────────────────────────────────────────────────
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxe5DjIyMU56bUCkQb0KduhTyQAFs7jfRRefrT18o9wjQFwQTeRaTpkYrh4h-6otK1Ydg/exec";

/**
 * Private page for Emad & Alia — /?view=responses
 *
 * doGet returns: { result: "success", data: [{timestamp, name, message}, ...] }
 * Data is filtered (no header row, no empty rows) by the Apps Script.
 */
export default function ResponsesPage() {
  const [messages, setMessages] = useState([]);
  const [status,   setStatus]   = useState("loading"); // loading | ready | error
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
        // Apps Script returns { result: "success", data: [{timestamp, name, message}] }
        if (json && json.result === "success") {
          const msgs = Array.isArray(json.data) ? json.data : [];
          // Reverse so newest messages appear first
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

  const filtered = messages.filter(
    (m) =>
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.message?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rp-root">

      {/* Header */}
      <header className="rp-header">
        <p className="rp-header__eyebrow">Emad &amp; Alia · Private</p>
        <h1 className="rp-header__title">Guest Messages</h1>
        <p className="rp-header__sub">
          {status === "ready"
            ? `${messages.length} ${messages.length === 1 ? "message" : "messages"} received`
            : "\u00a0"}
        </p>
      </header>

      {/* Search */}
      {status === "ready" && messages.length > 0 && (
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
          <span className="rp-state__icon">✗</span>
          <p>Couldn't load messages.</p>
          {errorMsg && (
            <pre className="rp-error-detail">{errorMsg}</pre>
          )}
          <button className="rp-retry-btn" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      )}

      {/* Empty */}
      {status === "ready" && messages.length === 0 && (
        <div className="rp-state">
          <span className="rp-state__icon">✉</span>
          <p>No messages yet.</p>
        </div>
      )}

      {/* Cards */}
      {status === "ready" && filtered.length > 0 && (
        <ol className="rp-grid">
          {filtered.map((m, i) => (
            <li key={i} className="rp-card" style={{ animationDelay: `${i * 40}ms` }}>
              <div className="rp-card__seal" aria-hidden="true">✿</div>
              <div className="rp-card__body">
                <strong className="rp-card__name">{m.name}</strong>
                {m.timestamp && (
                  <time className="rp-card__time">{m.timestamp}</time>
                )}
                <p className="rp-card__message">{m.message}</p>
              </div>
            </li>
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
        <a href="/" className="rp-footer__link">← Back to Invitation</a>
      </footer>

    </div>
  );
}
