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

        <h2 className="title-en" style={{ fontSize: "var(--step-display-md)" }}>
          {venue.name}
        </h2>
        <p>{venue.area}</p>
        <p style={{ fontSize: "1.1rem", letterSpacing: "0.04em" }}>{venue.time}</p>

        <a className="remind-btn" href={venue.mapsUrl} target="_blank" rel="noreferrer">
          View on Google Maps
        </a>

        {venue.kidsNote && <p className="page-location__note">{venue.kidsNote}</p>}
      </div>
    </section>
  );
}
