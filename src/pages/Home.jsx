import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "../components/Hero";
import ProjectGrid from "../components/ProjectGrid";
import Footer from "../components/Footer";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  useEffect(() => {
    const headings = [
      aboutRef.current?.querySelector(".about-section__heading"),
      contactRef.current?.querySelector(".contact-section__heading"),
    ].filter(Boolean);

    headings.forEach((el) => {
      gsap.fromTo(
        el,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
          },
        }
      );
    });
  }, []);

  return (
    <main>
      <Hero />
      <ProjectGrid />

      {/* About */}
      <section className="about-section" ref={aboutRef}>
        <div className="about-section__left">
          <p className="section-label">About</p>
          <h2 className="about-section__heading">
            Design
            <br />
            as
            <br />
            Language
          </h2>
        </div>

        <div className="about-section__right">
          <p className="about-section__bio">
            Abha Ukey is a graphic designer and art director based in Pune,
            India. She works at the intersection of brand identity, editorial
            design, and digital product — crafting visual systems that
            communicate with clarity and intention. Her work spans print,
            screen, and space, always rooted in conceptual rigour and
            typographic precision.
          </p>

          <ul className="about-section__services">
            <li>Brand Identity & Visual Systems</li>
            <li>Editorial & Publication Design</li>
            <li>Digital Product Design (UI/UX)</li>
            <li>Typography & Lettering</li>
            <li>Art Direction & Photography</li>
            <li>Packaging Design</li>
          </ul>
        </div>
      </section>

      {/* Contact */}
      <section className="contact-section" ref={contactRef}>
        <h2 className="contact-section__heading">
          Let's make something <em>remarkable.</em>
        </h2>

        <div className="contact-section__links">
          <a
            href="mailto:designer.ukey@gmail.com"
            className="contact-section__link"
          >
            Email
          </a>

          <a
            href="https://www.behance.net/"
            target="_blank"
            rel="noreferrer"
            className="contact-section__link"
          >
            Behance
          </a>

          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noreferrer"
            className="contact-section__link"
          >
            Instagram
          </a>

          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noreferrer"
            className="contact-section__link"
          >
            LinkedIn
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}