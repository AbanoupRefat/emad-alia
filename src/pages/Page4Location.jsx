import { client } from "../config/emadAlia";

export default function Page4Location() {
  const { venue } = client;
  return (
    <section className="snap-section page-location">
      <div className="stationery-card">
        <p className="eyebrow-en">Location</p>
        
        {venue.image && (
          <div style={{ width: "100%", margin: "var(--space-2) 0", borderRadius: "calc(var(--radius-card) - 4px)", overflow: "hidden", aspectRatio: "16/9" }}>
            <img src={venue.image} alt={venue.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        )}

        <h2 className="title-en" style={{ fontSize: "var(--step-display-md)", fontFamily: "var(--font-display)", fontWeight: 500 }}>
          {venue.name}
        </h2>
        <p style={{ fontSize: "1.05rem", fontWeight: 500, margin: "0.4rem 0" }}>{venue.area}</p>
        <p style={{ fontSize: "1.1rem", letterSpacing: "0.04em", fontWeight: 500, color: "var(--text-muted)" }}>{venue.time}</p>

        <a className="remind-btn" href={venue.mapsUrl} target="_blank" rel="noreferrer">
          View on Google Maps
        </a>

        {client.kidsNote && (
          <div className="kids-reminder-badge">
            <span className="kids-reminder-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.72-8.72 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </span>
            <span>{client.kidsNote}</span>
          </div>
        )}
      </div>
    </section>
  );
}
