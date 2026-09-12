import { client } from "../config/emadAlia";

export default function Page6Closing() {
  return (
    <section className="snap-section page-closing">
      <div className="page-closing__text">
        <p className="eyebrow-en">{client.signature}</p>
        <h2 className="title-en" style={{ fontSize: "var(--step-display-md)", textAlign: "center" }}>
          {client.closingMessage}
        </h2>
      </div>
    </section>
  );
}
