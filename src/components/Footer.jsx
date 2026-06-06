export default function Footer() {
  return (
    <footer className="footer">
      <p className="footer__copy">
        © {new Date().getFullYear()} Abha Ukey. All rights reserved.
      </p>
      <button
        className="footer__back-top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        ↑ Back to top
      </button>
    </footer>
  );
}