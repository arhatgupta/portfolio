import { useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import projects from "../data/projects";

export default function ProjectPage() {
  const { slug } = useParams();
  const project  = projects.find((p) => !p.future && p.slug === slug);

  const realProjects  = projects.filter((p) => !p.future);
  const currentIndex  = realProjects.findIndex((p) => p.slug === slug);
  const nextProject   = realProjects[(currentIndex + 1) % realProjects.length];

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!project) return <Navigate to="/" replace />;

  return (
    <main className="project">
      <Link to="/" className="project__back">← Archive</Link>

      <p className="project__num">
        #{String(project.id).padStart(3, "0")}
      </p>

      <h1 className="project__title">{project.title}</h1>

      {/* Meta */}
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

      {/* Description */}
      <p className="project__desc">{project.description}</p>

      {/* Cover */}
      <div className="project__cover">
        {project.cover
          ? <img src={project.cover} alt={project.title} />
          : <span>{String(project.id).padStart(3, "0")} — {project.title}</span>
        }
      </div>

      {/* Sub-projects */}
      {project.subProjects && (
        <>
          <p className="project__sub-label">Included Works</p>
          <ul className="project__sub-list">
            {project.subProjects.map((sub) => (
              <li key={sub} className="project__sub-item">{sub}</li>
            ))}
          </ul>
        </>
      )}

      {/* Next project nav */}
      <div className="project__nav">
        <span className="project__nav-label">Next Project</span>
        <Link
          to={`/project/${nextProject.slug}`}
          className="project__nav-link"
        >
          {nextProject.title} →
        </Link>
      </div>
    </main>
  );
}