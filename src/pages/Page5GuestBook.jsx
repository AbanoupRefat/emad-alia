import GuestBook from "../components/GuestBook";

export default function Page5GuestBook() {
  return (
    <section className="snap-section page-guestbook">
      <div className="stationery-card">
        <p className="eyebrow-en">Guest Book</p>
        <h2 className="title-en" style={{ fontSize: "var(--step-display-sm)", marginBottom: "var(--space-2)" }}>
          leave a message for us
        </h2>
        <GuestBook />
      </div>
    </section>
  );
}
