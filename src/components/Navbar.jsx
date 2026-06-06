import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <>
      <nav
        className="navbar"
        style={{ borderBottom: scrolled ? "1px solid #2a2a2a" : "none" }}
      >
        <Link to="/" className="navbar__logo">
          AU
        </Link>

        <ul className="navbar__links">
          <li>
            <Link to="/">Work</Link>
          </li>

          <li>
            <Link to="/about">About</Link>
          </li>

          <li>
            <a
              href="mailto:designer.ukey@gmail.com"
              target="_blank"
              rel="noreferrer"
            >
              Contact
            </a>
          </li>
        </ul>

        <button
          className="navbar__menu-btn"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span
            style={{
              transform: menuOpen ? "translateY(6px) rotate(45deg)" : "none",
            }}
          />
          <span style={{ opacity: menuOpen ? 0 : 1 }} />
          <span
            style={{
              transform: menuOpen ? "translateY(-6px) rotate(-45deg)" : "none",
            }}
          />
        </button>
      </nav>

      {/* Mobile Nav */}
      <div className={`mobile-nav ${menuOpen ? "open" : ""}`}>
        <ul className="mobile-nav__links">
          <li>
            <Link to="/" onClick={() => setMenuOpen(false)}>
              Work
            </Link>
          </li>

          <li>
            <Link to="/about" onClick={() => setMenuOpen(false)}>
              About
            </Link>
          </li>

          <li>
            <a
              href="mailto:designer.ukey@gmail.com"
              rel="noreferrer"
            >
              Contact
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}