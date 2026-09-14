import { useState } from "react";
import "./GuestBook.css";

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyvsg_3JCVPBokpl6LeWSAKeJPO07Baqbl6Q-wh-oJPk60q41gddEh2hgnbqXDM9B7Y/exec";

// Sealed envelope entry card (shown after local submission feedback)
function EnvelopeEntry({ entry, index }) {
  return (
    <li
      className="gb-envelope"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="gb-envelope__seal" aria-hidden="true">✿</div>
      <div className="gb-envelope__body">
        <strong className="gb-envelope__name">{entry.name}</strong>
        <p className="gb-envelope__msg">{entry.message}</p>
      </div>
    </li>
  );
}

/**
 * Submits to the Google Apps Script using a no-cors fetch.
 * Because of no-cors the response is opaque — we optimistically
 * treat every non-network-error as success.
 */
async function submitToSheet(name, message) {
  const params = new URLSearchParams({ name, message });
  await fetch(`${SCRIPT_URL}?${params.toString()}`, {
    method: "GET",
    mode: "no-cors",
  });
}

export default function GuestBook() {
  const [name,    setName]    = useState("");
  const [message, setMessage] = useState("");
  const [entries, setEntries] = useState([]);
  const [status,  setStatus]  = useState("idle"); // idle | sending | sent | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setStatus("sending");

    try {
      await submitToSheet(name.trim(), message.trim());
      setEntries((prev) => [
        { name: name.trim(), message: message.trim(), id: Date.now() },
        ...prev,
      ]);
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

        <button type="submit" className="guestbook__btn" disabled={status === "sending"}>
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
