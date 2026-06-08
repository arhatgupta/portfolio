import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="nav">
      <Link to="/" className="nav__logo">
        AU
      </Link>

      <div className="nav__right">
        <Link to="/about" className="nav__link">
          About
        </Link>

        <a
          href="mailto:designer.ukey@gmail.com"
          className="nav__link"
        >
          Contact
        </a>
      </div>
    </nav>
  );
}