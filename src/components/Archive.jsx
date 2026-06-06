import { Link } from "react-router-dom";
import projects from "../data/projects";

// How many ? chars to fill the title area
const FUTURE_MASK = "?".repeat(60);

export default function Archive() {
  const real   = projects.filter((p) => !p.future);
  const future = projects.filter((p) =>  p.future);

  return (
    <main className="archive">
      {/* ── Real projects ──────────────────────────── */}
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

      {/* ── NEXT UP label ──────────────────────────── */}
      {future.length > 0 && (
        <div className="archive__next-up">NEXT UP</div>
      )}

      {/* ── Future projects ────────────────────────── */}
      {future.map((project) => (
        <div
          key={project.id}
          className="archive__row archive__row--future"
        >
          <NumCell id={project.id} />
          <span className="archive__title archive__title--future">
            {FUTURE_MASK}
          </span>
        </div>
      ))}
    </main>
  );
}

function NumCell({ id }) {
  const padded = String(id).padStart(3, "0");
  return (
    <div className="archive__num">
      <span className="archive__hash">#</span>
      <span className="archive__id">{padded}</span>
    </div>
  );
}