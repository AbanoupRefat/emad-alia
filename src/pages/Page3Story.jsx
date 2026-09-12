import StoryTimeline from "../components/StoryTimeline";
import { client } from "../config/emadAlia";

export default function Page3Story() {
  return (
    <section className="snap-section page-story" style={{ alignItems: "flex-start", overflowY: "auto" }}>
      <div className="page-story__inner" style={{ paddingTop: "var(--space-4)", paddingBottom: "var(--space-4)" }}>
        <p className="eyebrow-en" style={{ color: "var(--text-primary)", marginBottom: "var(--space-3)" }}>
          Our Story
        </p>
        <StoryTimeline story={client.story} />
      </div>
    </section>
  );
}

