import { useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import projects from "../data/projects";

const QMARKS = "?".repeat(60);

export default function Archive() {
  const navigate = useNavigate();
  const real   = projects.filter((p) => !p.future);
  const future = projects.filter((p) =>  p.future);
  const [futureHovered, setFutureHovered] = useState(false);

  // ── CUSTOM NAVIGATION HANDLER ──
  const handleProjectClick = (e, slug) => {
    e.preventDefault();
    
    // 1. Move curtain to the BOTTOM instantly
    gsap.set("#page-transition", { yPercent: 100 });
    
    // 2. Animate curtain to the CENTER to cover the screen
    gsap.to("#page-transition", {
      yPercent: 0,
      duration: 0.6,
      ease: "power3.inOut",
      onComplete: () => {
        // Once screen is black, change the page URL!
        navigate(`/project/${slug}`);
      }
    });
  };

  return (
    <main className="archive">
      {/* ── Real projects ── */}
      {real.map((project) => (
        <a
          key={project.id}
          href={`/project/${project.slug}`}
          onClick={(e) => handleProjectClick(e, project.slug)}
          className="archive__row"
        >
          <NumCell id={project.id} />
          <span className="archive__title">{project.title}</span>
        </a>
      ))}

      {/* ── Future region ── */}
      {future.length > 0 && (
        <div
          className="archive__future-region"
          onMouseEnter={() => setFutureHovered(true)}
          onMouseLeave={() => setFutureHovered(false)}
        >
          <span className="archive__next-up">NEXT UP</span>
          {future.map((project) => (
            <div key={project.id} className="archive__row archive__row--future">
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

function NumCell({ id }) {
  return (
    <div className="archive__num">
      <span className="archive__hash">#</span>
      <span className="archive__id">{id}</span>
    </div>
  );
}