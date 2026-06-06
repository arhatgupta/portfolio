import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="about">
      <Link to="/" className="project__back">
        ← Work
      </Link>

      <h1 className="about__title">
        Abha
        <br />
        Ukey
      </h1>

      <p className="about__bio">
        Graphic designer and art director based in Pune, India.
        Working at the intersection of brand identity, editorial design,
        and digital product — crafting visual systems that communicate
        with clarity and intention. Practice spans print, screen, and space,
        always rooted in conceptual rigour and typographic precision.
      </p>

      <p className="about__section-label">Disciplines</p>
      <ul className="about__list">
        {[
          "Brand Identity & Visual Systems",
          "Editorial & Publication Design",
          "Digital Product Design (UI/UX)",
          "Typography & Lettering",
          "Art Direction & Photography",
          "Packaging Design",
        ].map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>

      <p className="about__section-label">Education</p>
      <ul className="about__list">
        <li>Bachelor of Design — Visual Communication</li>
      </ul>

      <p className="about__section-label">Available for</p>
      <ul className="about__list">
        <li>Freelance Projects</li>
        <li>Full-time Opportunities</li>
        <li>Collaborations</li>
      </ul>

      <h2 className="about__contact-heading">Get in touch</h2>

      <div className="about__contact-links">
        <a
          href="mailto:designer.ukey@gmail.com"
          className="about__contact-link"
        >
          designer.ukey@gmail.com
        </a>

        <a
          href="https://www.behance.net/"
          target="_blank"
          rel="noreferrer"
          className="about__contact-link"
        >
          Behance ↗
        </a>

        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noreferrer"
          className="about__contact-link"
        >
          Instagram ↗
        </a>

        <a
          href="https://www.linkedin.com/"
          target="_blank"
          rel="noreferrer"
          className="about__contact-link"
        >
          LinkedIn ↗
        </a>
      </div>
    </main>
  );
}