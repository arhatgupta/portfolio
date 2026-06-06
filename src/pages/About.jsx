import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

export default function About() {
  const heroRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    gsap.fromTo(
      heroRef.current.children,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "expo.out",
        stagger: 0.12,
      }
    );
  }, []);

  return (
    <main style={{ padding: "0 2.5rem 6rem" }}>
      {/* Back */}
      <Link
        to="/"
        style={{
          position: "fixed",
          top: "1.5rem",
          left: "2.5rem",
          fontSize: "var(--fs-xs)",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--white)",
          zIndex: 100,
          mixBlendMode: "difference",
          display: "flex",
          alignItems: "center",
          gap: "0.8rem",
        }}
      >
        ← Work
      </Link>

      {/* Hero */}
      <div
        ref={heroRef}
        style={{
          minHeight: "60svh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          paddingBottom: "4rem",
          paddingTop: "8rem",
          borderBottom: "1px solid var(--grey-dim)",
        }}
      >
        <p className="section-label" style={{ marginBottom: "1.5rem" }}>
          About
        </p>

        <h1
          style={{
            fontSize: "var(--fs-xl)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            lineHeight: 0.9,
            marginBottom: "3rem",
          }}
        >
          Abha
          <br />
          Ukey
        </h1>

        <p
          style={{
            fontSize: "var(--fs-sm)",
            lineHeight: 2,
            color: "var(--grey)",
            maxWidth: "60ch",
          }}
        >
          Graphic designer and art director based in Pune, India. She works at
          the intersection of brand identity, editorial design, and digital
          product — crafting visual systems that communicate with clarity and
          intention. Her practice spans print, screen, and space, always rooted
          in conceptual rigour and typographic precision.
        </p>
      </div>

      {/* Details Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4rem",
          padding: "5rem 0",
          borderBottom: "1px solid var(--grey-dim)",
        }}
      >
        <div>
          <p className="section-label" style={{ marginBottom: "2rem" }}>
            Disciplines
          </p>

          <ul
            style={{
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: 0,
            }}
          >
            {[
              "Brand Identity & Visual Systems",
              "Editorial & Publication Design",
              "Digital Product Design (UI/UX)",
              "Typography & Lettering",
              "Art Direction & Photography",
              "Packaging Design",
            ].map((s) => (
              <li
                key={s}
                style={{
                  fontSize: "var(--fs-sm)",
                  padding: "1rem 0",
                  borderBottom: "1px solid var(--grey-dim)",
                  color: "var(--grey)",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--white)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--grey)")
                }
              >
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "3rem",
          }}
        >
          <div>
            <p className="section-label" style={{ marginBottom: "1rem" }}>
              Education
            </p>

            <p
              style={{
                fontSize: "var(--fs-sm)",
                color: "var(--grey)",
                lineHeight: 1.8,
              }}
            >
              Bachelor of Design
              <br />
              Specialisation in Visual Communication
            </p>
          </div>

          <div>
            <p className="section-label" style={{ marginBottom: "1rem" }}>
              Based in
            </p>

            <p
              style={{
                fontSize: "var(--fs-sm)",
                color: "var(--grey)",
              }}
            >
              Pune, Maharashtra, India
            </p>
          </div>

          <div>
            <p className="section-label" style={{ marginBottom: "1rem" }}>
              Available for
            </p>

            <p
              style={{
                fontSize: "var(--fs-sm)",
                color: "var(--grey)",
                lineHeight: 1.8,
              }}
            >
              Freelance projects
              <br />
              Full-time opportunities
              <br />
              Collaborations
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: "5rem 0" }}>
        <p
          style={{
            fontSize: "var(--fs-xs)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--grey)",
            marginBottom: "2rem",
          }}
        >
          Get in touch
        </p>

        <a
          href="mailto:designer.ukey@gmail.com"
          style={{
            fontSize: "var(--fs-xl)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            color: "var(--white)",
            transition: "color 0.3s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--grey)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--white)")
          }
        >
          designer.ukey
          <br />
          @gmail.com
        </a>
      </div>

      <Footer />
    </main>
  );
}