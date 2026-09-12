import "./StoryTimeline.css";

export default function StoryTimeline({ story }) {
  return (
    <div className="story-carousel-container">
      <div className="story-carousel">
        {story.map((beat, i) => (
          <div className="story-card" key={beat.id}>
            {/* Image */}
            <div className="story-card__image-wrapper">
              <img src={beat.image} alt={beat.label} className="story-card__image" loading="lazy" />
              <div className="story-card__overlay">
                <span className="story-card__index">{String(i + 1).padStart(2, "0")}</span>
              </div>
            </div>

            {/* Content */}
            <div className="story-card__content">
              <h3 className="story-card__label">{beat.label}</h3>
              <p className="story-card__body">{beat.body}</p>
              <div className="story-card__divider" aria-hidden="true">
                <span className="story-card__petal">✿</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Scroll hint for horizontal scroll */}
      <div className="story-carousel__hint">
        <span aria-hidden="true">← swipe to explore →</span>
      </div>
    </div>
  );
}
