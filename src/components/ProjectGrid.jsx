import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import projects from "../data/projects";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectGrid() {
  const listRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const rows = listRef.current.querySelectorAll(".project-row");

    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "expo.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 90%",
        },
      }
    );

    rows.forEach((row, i) => {
      gsap.fromTo(
        row,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "expo.out",
          delay: i * 0.06,
          scrollTrigger: {
            trigger: row,
            start: "top 92%",
          },
        }
      );
    });
  }, []);

  return (
    <section className="project-list">
      <div className="project-list__header" ref={headerRef}>
        <span>#</span>
        <span>Project</span>
        <span>Category</span>
        <span>Year</span>
      </div>

      <div ref={listRef}>
        {projects.map((project) => (
          <Link
            key={project.id}
            to={`/project/${project.slug}`}
            className="project-row"
          >
            <span className="project-row__num">{project.id}</span>
            <span className="project-row__title">{project.title}</span>
            <span className="project-row__cat">{project.category}</span>
            <span className="project-row__year">{project.year}</span>
            <span className="project-row__arrow">↗</span>
          </Link>
        ))}
      </div>
    </section>
  );
}