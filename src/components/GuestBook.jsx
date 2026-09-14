import { useState } from "react";
import "./GuestBook.css";

// ─── Paste your /exec URL here ───────────────────────────────────────────────
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyvsg_3JCVPBokpl6LeWSAKeJPO07Baqbl6Q-wh-oJPk60q41gddEh2hgnbqXDM9B7Y/exec";

/* Local card shown after a successful submission */
function EnvelopeEntry({ entry, index }) {
  return (
    <li className="gb-envelope" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="gb-envelope__seal" aria-hidden="true">✿</div>
      <div className="gb-envelope__body">
        <strong className="gb-envelope__name">{entry.name}</strong>
        <p className="gb-envelope__msg">{entry.message}</p>
      </div>
    </li>
  );
}

/**
 * POST {name, message} as a plain-text JSON body.
 * No Content-Type header → treated as text/plain (simple request) →
 * no CORS preflight needed → works fine with mode:"no-cors".
 * The Apps Script reads the body via e.postData.contents.
 */
async function postToSheet(name, message) {
  await fetch(SCRIPT_URL, {
    method: "POST",
    mode:   "no-cors",
    body:   JSON.stringify({ name, message }),
  });
}

export default function GuestBook() {
  const [name,    setName]    = useState("");
  const [message, setMessage] = useState("");
  const [entries, setEntries] = useState([]);
  const [status,  setStatus]  = useState("idle"); // idle | sending | sent | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    const n = name.trim();
    const m = message.trim();
    if (!n || !m) return;

    setStatus("sending");
    try {
      await postToSheet(n, m);
      setEntries((prev) => [{ id: Date.now(), name: n, message: m }, ...prev]);
      setName("");
      setMessage("");
      setStatus("sent");
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <div className="guestbook">
      <form className="guestbook__form" onSubmit={handleSubmit}>

        <label className="guestbook__field">
          <span className="guestbook__label">Your name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            autoComplete="name"
          />
        </label>

        <label className="guestbook__field">
          <span className="guestbook__label">Your wish</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Leave your wishes for Emad & Alia…"
            rows={3}
            required
          />
        </label>

        <button
          type="submit"
          className="guestbook__btn"
          disabled={status === "sending"}
        >
          {status === "sending" ? "Sealing…" : "✦ Send a message ✦"}
        </button>

        {status === "sent" && (
          <p className="guestbook__confirm">
            <span className="guestbook__confirm-icon">♡</span>
            Your wish was sealed with love
          </p>
        )}

        {status === "error" && (
          <p className="guestbook__confirm" style={{ color: "var(--copper-rose)" }}>
            <span className="guestbook__confirm-icon">!</span>
            Couldn't send — please try again
          </p>
        )}
      </form>

      {entries.length > 0 && (
        <ul className="guestbook__list">
          {entries.map((entry, i) => (
            <EnvelopeEntry key={entry.id} entry={entry} index={i} />
          ))}
        </ul>
      )}
    </div>
  );
}
