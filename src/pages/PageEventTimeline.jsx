import { client } from "../config/emadAlia";
import "./PageEventTimeline.css";

export default function PageEventTimeline() {
  const { eventTimeline } = client;

  if (!eventTimeline || eventTimeline.length === 0) return null;

  return (
    <section className="snap-section page-event-timeline">
      <div className="page-event-timeline__inner">
        <div className="page-event-timeline__header">
          <h2 className="title-en" style={{ fontSize: "var(--step-display-md)" }}>
            Wedding Day
          </h2>
          <p className="eyebrow-en">A schedule of events</p>
        </div>

        <div className="event-timeline-list">
          {/* The wavy SVG line spanning top to bottom */}
          <div className="event-timeline__wave" aria-hidden="true" />

          {eventTimeline.map((event, i) => {
            const isLeft = i % 2 === 0;
            return (
              <div
                className={`event-timeline-item ${isLeft ? "event-timeline-item--left" : "event-timeline-item--right"}`}
                key={i}
              >
                {isLeft ? (
                  <>
                    <div className="event-timeline-content event-timeline-content--left">
                      <h3 className="event-timeline-time">{event.time}</h3>
                      <p className="event-timeline-title">{event.title}</p>
                    </div>
                    <div className="event-timeline-dot" />
                    <div className="event-timeline-spacer" />
                  </>
                ) : (
                  <>
                    <div className="event-timeline-spacer" />
                    <div className="event-timeline-dot" />
                    <div className="event-timeline-content event-timeline-content--right">
                      <h3 className="event-timeline-time">{event.time}</h3>
                      <p className="event-timeline-title">{event.title}</p>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
