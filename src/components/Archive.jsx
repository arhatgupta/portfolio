import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import projects from "../data/projects";

const QMARKS = "?".repeat(80);

export default function Archive() {
  const navigate = useNavigate();

  const real = projects.filter((p) => !p.future);
  const future = projects.filter((p) => p.future);

  const handleProjectClick = (e, slug) => {
    e.preventDefault();

    gsap.set("#page-transition", { yPercent: 100 });

    gsap.to("#page-transition", {
      yPercent: 0,
      duration: 0.6,
      ease: "power3.inOut",
      onComplete: () => {
        navigate(`/project/${slug}`);
      },
    });
  };

  return (
    <main className="archive">
      {real.map((project) => (
        <a
          key={project.id}
          href={`/project/${project.slug}`}
          onClick={(e) => handleProjectClick(e, project.slug)}
          className="archive__row"
        >
          <NumCell id={project.id} />
          <span className="archive__title">{project.title}</span>
          <span className="archive__arrow">↗</span>
        </a>
      ))}

      {future.length > 0 && (
        <div className="archive__future-region">
          <span className="archive__next-up">NEXT&nbsp;UP</span>

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