import { useState } from "react";
import "./GuestBook.css";

// Sealed envelope entry card
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

async function submitMessage(entry) {
  return Promise.resolve(entry);
}

export default function GuestBook() {
  const [name,    setName]    = useState("");
  const [message, setMessage] = useState("");
  const [entries, setEntries] = useState([]);
  const [status,  setStatus]  = useState("idle"); // idle | sending | sent

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setStatus("sending");
    const entry = { name: name.trim(), message: message.trim(), id: Date.now() };
    await submitMessage(entry);
    setEntries((prev) => [entry, ...prev]);
    setName("");
    setMessage("");
    setStatus("sent");
    setTimeout(() => setStatus("idle"), 4000);
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

