import { useEffect, useRef } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { gsap } from "gsap";
import projects from "../data/projects";
import Footer from "../components/Footer";

export default function ProjectPage() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);
  const heroRef = useRef(null);

  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!heroRef.current) return;

    gsap.fromTo(
      heroRef.current.children,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "expo.out",
        stagger: 0.1,
      }
    );
  }, [slug]);

  if (!project) return <Navigate to="/" replace />;

  return (
    <main className="project-page">
      <Link to="/" className="project-page__back">
        Work
      </Link>

      {/* Hero */}
      <div className="project-page__hero" ref={heroRef}>
        <p className="project-page__num">{project.id}</p>
        <h1 className="project-page__title">{project.title}</h1>
        <div className="project-page__meta">
          <div className="project-page__meta-item">
            <span className="project-page__meta-label">Category</span>
            <span className="project-page__meta-value">{project.category}</span>
          </div>
          <div className="project-page__meta-item">
            <span className="project-page__meta-label">Year</span>
            <span className="project-page__meta-value">{project.year}</span>
          </div>
          {project.tags && (
            <div className="project-page__meta-item">
              <span className="project-page__meta-label">Tags</span>
              <span className="project-page__meta-value">
                {project.tags.join(" · ")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Cover image placeholder */}
      <div className="project-page__cover">
        <div
          className="project-page__cover-placeholder"
          style={{ background: project.color }}
        >
          {project.cover ? (
            <img src={project.cover} alt={project.title} />
          ) : (
            <span>
              {project.id} — {project.title}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="project-page__body">
        <p className="project-page__description">{project.description}</p>
        <div className="project-page__tags">
          {project.tags?.map((tag) => (
            <span key={tag} className="project-page__tag">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Sub-projects if any */}
      {project.subProjects && (
        <div className="project-page__sub-projects">
          <p className="project-page__sub-label">Included works</p>
          <ul className="project-page__sub-list">
            {project.subProjects.map((sub) => (
              <li key={sub} className="project-page__sub-item">
                {sub}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Next project */}
      <div className="project-page__next">
        <p className="project-page__next-label">Next Project</p>
        <Link
          to={`/project/${nextProject.slug}`}
          className="project-page__next-link"
        >
          {nextProject.title} ↗
        </Link>
      </div>

      <Footer />
    </main>
  );
}