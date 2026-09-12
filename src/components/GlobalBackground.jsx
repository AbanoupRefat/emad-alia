import "./GlobalBackground.css";

const ELEMENTS = [
  { type: "heart", size: 200, top: "8%", left: "5%", delay: 0, dur: 9 },
  { type: "star",  size: 150, top: "60%", left: "75%", delay: 2, dur: 11 },
  { type: "heart", size: 130, top: "35%", left: "82%", delay: 1, dur: 8 },
  { type: "star",  size: 100, top: "78%", left: "10%", delay: 3, dur: 10 },
  { type: "heart", size: 170, top: "15%", left: "60%", delay: 0.5, dur: 12 },
  { type: "star",  size: 110, top: "50%", left: "30%", delay: 1.8, dur: 7 },
  { type: "heart", size: 90,  top: "85%", left: "45%", delay: 2.5, dur: 9 },
  { type: "star",  size: 140, top: "25%", left: "20%", delay: 1.2, dur: 10 },
];

export default function GlobalBackground() {
  return (
    <div className="global-background" aria-hidden="true">
      {ELEMENTS.map((el, i) => (
        <svg
          key={i}
          className="global-bg-element"
          width={el.size}
          height={el.size}
          viewBox={el.type === "heart" ? "0 0 100 90" : "0 0 100 100"}
          style={{ 
            top: el.top, 
            left: el.left, 
            animationDelay: `${el.delay}s`, 
            animationDuration: `${el.dur}s` 
          }}
        >
          {el.type === "heart" ? (
            <path
              d="M50 85 C50 85 5 55 5 28 A22 22 0 0 1 50 18 A22 22 0 0 1 95 28 C95 55 50 85 50 85Z"
              fill="var(--heart-color)"
            />
          ) : (
            <path
              d="M50 5 L61 35 L95 35 L67 55 L78 85 L50 65 L22 85 L33 55 L5 35 L39 35 Z"
              fill="var(--star-color)"
            />
          )}
        </svg>
      ))}
    </div>
  );
}
