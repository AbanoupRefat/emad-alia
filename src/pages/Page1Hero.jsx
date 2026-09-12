import { client } from "../config/emadAlia";

export default function Page1Hero() {
  return (
    <section className="snap-section page-hero">
      <div
        style={{
          textAlign: "center",
          zIndex: 10,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        {/* Eyebrow */}
        <p
          className="eyebrow-en"
          style={{
            color: "var(--text-muted)",
            margin: 0,
            fontSize: "clamp(0.85rem, 1.8vw, 1.1rem)",
            letterSpacing: "0.18em",
          }}
        >
          Our Wedding
        </p>

        {/* Decorative rule */}
        <div
          aria-hidden="true"
          style={{
            width: 60,
            height: 1,
            background: "linear-gradient(90deg, transparent, var(--copper-rose), transparent)",
            margin: "0.4rem 0",
          }}
        />

        {/* English names */}
        <h1
          className="title-en"
          style={{
            margin: 0,
            textShadow: "0 2px 24px rgba(168,106,101,0.35)",
          }}
        >
          {client.namesEn.groom} &amp; {client.namesEn.bride}
        </h1>

        {/* Arabic names */}
        <h2
          className="title-ar"
          style={{
            color: "var(--text-primary)",
            margin: "0.15em 0 0",
          }}
        >
          {client.namesAr.groom} &amp; {client.namesAr.bride}
        </h2>

        {/* Decorative rule */}
        <div
          aria-hidden="true"
          style={{
            width: 60,
            height: 1,
            background: "linear-gradient(90deg, transparent, var(--copper-rose), transparent)",
            margin: "0.4rem 0",
          }}
        />

        {/* Date */}
        <p
          style={{
            color: "var(--text-muted)",
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)",
            letterSpacing: "0.12em",
            margin: 0,
          }}
        >
          {client.weddingDateLabel} · {client.weddingDayLabel}
        </p>
      </div>

      {/* Scroll hint */}
      <p className="scroll-hint" style={{ color: "var(--text-muted)", opacity: 0.55 }}>
        scroll ↓
      </p>
    </section>
  );
}

