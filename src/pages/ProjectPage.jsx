import { useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import projects from "../data/projects";

export default function ProjectPage() {
  const { slug } = useParams();
  const real     = projects.filter((p) => !p.future);
  const project  = real.find((p) => p.slug === slug);
  const idx      = real.findIndex((p) => p.slug === slug);
  const next     = real[(idx + 1) % real.length];

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!project) return <Navigate to="/" replace />;

  return (
    <main className="project">
      <Link to="/" className="project__back">← Archive</Link>

      <p className="project__num">#{project.id}</p>
      <h1 className="project__title">{project.title}</h1>

      <div className="project__meta">
        <div className="project__meta-item">
          <span className="project__meta-label">Category</span>
          <span className="project__meta-value">{project.category}</span>
        </div>
        <div className="project__meta-item">
          <span className="project__meta-label">Year</span>
          <span className="project__meta-value">{project.year}</span>
        </div>
        {project.tags && (
          <div className="project__meta-item">
            <span className="project__meta-label">Tags</span>
            <span className="project__meta-value">
              {project.tags.join(" · ")}
            </span>
          </div>
        )}
      </div>

      <p className="project__desc">{project.description}</p>

      <div className="project__cover">
        {project.cover
          ? <img src={project.cover} alt={project.title} />
          : <span>#{project.id} — {project.title}</span>
        }
      </div>

      {project.subProjects && (
        <>
          <p className="project__sub-label">Included Works</p>
          <ul className="project__sub-list">
            {project.subProjects.map((s) => (
              <li key={s} className="project__sub-item">{s}</li>
            ))}
          </ul>
        </>
      )}

      <div className="project__nav">
        <span className="project__nav-label">Next Project</span>
        <Link to={`/project/${next.slug}`} className="project__nav-link">
          {next.title} →
        </Link>
      </div>
    </main>
  );
}