import { client } from "../config/emadAlia";

export default function Page6Closing() {
  return (
    <section className="snap-section page-closing">
      <div className="page-closing__text">
        <p className="eyebrow-en" style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
          {client.signature}
        </p>
        <h2 className="title-en" style={{ fontSize: "var(--step-display-md)", textAlign: "center" }}>
          {client.closingMessage}
        </h2>

        {/* Developer Credit & Contact Footer */}
        <div className="closing-credit-container">
          <p className="closing-credit-name">
            Made by{" "}
            <a
              href="https://wa.me/201017747943"
              target="_blank"
              rel="noopener noreferrer"
              className="closing-credit-link"
            >
              Eng/ Abanoub Refat
            </a>
          </p>
          
          <p className="closing-credit-subtext">
            For creating your custom invitation, reach us via:
          </p>

          <div className="closing-social-links">
            <a
              href="https://www.instagram.com/da3wa_eg/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="closing-social-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              <span>Instagram</span>
            </a>

            <a
              href="https://wa.me/201017747943"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="closing-social-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
