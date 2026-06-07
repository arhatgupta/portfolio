import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="nav">
      <Link to="/" className="nav__logo">Abha</Link>
      <ul className="nav__links">
        <li><Link to="/">Work</Link></li>
        <li><Link to="/about">About</Link></li>
        <li>
          <a href="mailto:designer.ukey@gmail.com">Contact</a>
        </li>
      </ul>
    </nav>
  );
}