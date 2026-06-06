import { useState } from "react";
import { Link } from "react-router-dom";
import projects from "../data/projects";

/*
  Question mark string:
  Must fill the full visual width of the title area.
  At 3vw font-size on a 1440px screen, title area ≈ 1380px wide.
  Each '?' glyph in IBM Plex Mono at that size ≈ ~25px → ~55 chars fills it.
  We use 60 to be safe — overflow:hidden clips excess.
*/
const QMARKS = "?".repeat(60);

export default function Archive() {
  const real   = projects.filter((p) => !p.future);
  const future = projects.filter((p) =>  p.future);

  // Track hover over the entire future region
  const [futureHovered, setFutureHovered] = useState(false);

  return (
    <main className="archive">

      {/* ── Real projects ──────────────────────────────────── */}
      {real.map((project) => (
        <Link
          key={project.id}
          to={`/project/${project.slug}`}
          className="archive__row"
        >
          <NumCell id={project.id} />
          <span className="archive__title">{project.title}</span>
        </Link>
      ))}

      {/* ── Future region ──────────────────────────────────── */}
      {future.length > 0 && (
        <div
          className="archive__future-region"
          onMouseEnter={() => setFutureHovered(true)}
          onMouseLeave={() => setFutureHovered(false)}
        >
          {/*
            NEXT UP: absolutely positioned inside region.
            Visible only while region is hovered.
            CSS handles the opacity transition via
            .archive__future-region:hover .archive__next-up
            (pure CSS — no JS state needed for the label itself)
          */}
          <span className="archive__next-up">NEXT UP</span>

          {future.map((project) => (
            <div
              key={project.id}
              className="archive__row archive__row--future"
            >
              <NumCell id={project.id} />
              <span className="archive__title archive__title--future">
                {QMARKS}
              </span>
            </div>
          ))}
        </div>
      )}

    </main>
  );
}

/* ── Number cell ────────────────────────────────────────────
   Renders:
     #
     1        ← bare integer, NOT zero-padded
*/
function NumCell({ id }) {
  return (
    <div className="archive__num">
      <span className="archive__hash">#</span>
      <span className="archive__id">{id}</span>
    </div>
  );
}