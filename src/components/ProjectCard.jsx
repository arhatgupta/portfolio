// Used for future grid view – currently the list view (ProjectGrid) is primary

export default function ProjectCard({ project }) {
  return (
    <div className="project-card">
      <div
        className="project-card__cover"
        style={{ background: project.color || "var(--grey-dim)" }}
      >
        {project.cover ? (
          <img src={project.cover} alt={project.title} />
        ) : (
          <span>{project.id}</span>
        )}
      </div>
      <div className="project-card__info">
        <p className="project-card__num">{project.id}</p>
        <h3 className="project-card__title">{project.title}</h3>
        <p className="project-card__cat">{project.category}</p>
      </div>
    </div>
  );
}