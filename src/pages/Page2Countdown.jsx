import Countdown from "../components/Countdown";
import { client } from "../config/emadAlia";

// Builds a downloadable .ics file so "Remind me" works with zero backend.
function downloadReminder() {
  const start = new Date(client.weddingDateISO);
  const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
  const fmt = (d) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${client.namesEn.groom} & ${client.namesEn.bride}'s Wedding`,
    `LOCATION:${client.venue.name}, ${client.venue.area}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "emad-and-alia-wedding.ics";
  a.click();
  URL.revokeObjectURL(url);
}

export default function Page2Countdown() {
  return (
    <section className="snap-section page-countdown">
      <div className="stationery-card">
        <p className="eyebrow-en">Save the Date</p>
        <h2 className="title-en" style={{ fontSize: "var(--step-display-md)", fontFamily: "var(--font-body)", fontWeight: 500, letterSpacing: "0.06em" }}>
          {client.weddingDateLabel}
        </h2>
        <p style={{ marginTop: "0.2em", letterSpacing: "0.1em", textTransform: "uppercase", fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: 500 }}>
          {client.weddingDayLabel}
        </p>

        <Countdown targetISO={client.weddingDateISO} />

        <button className="remind-btn" onClick={downloadReminder}>
          Remind me
        </button>
      </div>
    </section>
  );
}
