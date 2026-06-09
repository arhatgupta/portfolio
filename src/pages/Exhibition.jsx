import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";

/* ─── Poster data ───────────────────────────────────────── */
const POSTERS = [
  {
    id: "euphoria",
    name: "EUPHORIA",
    year: "2023",
    category: "Experimental Design",
    description:
      "Exploring the collision of color, emotion, and collective experience through making handmade textures with acrylic paints.",
    src: `${import.meta.env.BASE_URL}posters/euphoria.png`,
  },
  {
    id: "grinn",
    name: "GRINN",
    year: "2023",
    category: "Illustration",
    description:
      "A surreal study of optimism, exaggeration, and visual play.",
    src: `${import.meta.env.BASE_URL}posters/grinn.png`,
  },
  {
    id: "goonda",
    name: "GOONDA",
    year: "2022",
    category: "Cultural Identity",
    description:
      "Regional identity reimagined through contemporary graphic culture.",
    src: `${import.meta.env.BASE_URL}posters/goonda.png`,
  },
  {
    id: "umrao-jaan",
    name: "UMRAO JAAN",
    year: "2023",
    category: "Editorial",
    description:
      "Reframing cinematic heritage through a modern editorial lens.",
    src: `${import.meta.env.BASE_URL}posters/umrao-jaan.png`,
  },
  {
    id: "skrrt-club",
    name: "SKRRT CLUB",
    year: "2024",
    category: "Event Design",
    description:
      "Capturing the intensity and unpredictability of underground nightlife.",
    src: `${import.meta.env.BASE_URL}posters/skrrt-club.png`,
  },
  {
    id: "akshar",
    name: "AKSHAR",
    year: "2022",
    category: "Typography",
    description: "A Typography Exhibition Poster Design.",
    src: `${import.meta.env.BASE_URL}posters/akshar.png`,
  },
];

/* ─── Entry screen ──────────────────────────────────────── */
function EntryScreen({ onEnter }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="ex-entry" style={{ opacity: visible ? 1 : 0 }}>
      <div className="ex-entry__inner">
        <p className="ex-entry__name">ABHA UKEY</p>
        <h1 className="ex-entry__title">DIGITAL EXHIBITION</h1>
        <p className="ex-entry__sub">6 Works · 2022–2024</p>
        <button className="ex-entry__btn" onClick={onEnter}>
          ENTER &nbsp;→
        </button>
      </div>
      <Link to="/" className="ex-entry__back">← Archive</Link>
    </div>
  );
}

/* ─── Detail overlay ────────────────────────────────────── */
function DetailOverlay({ poster, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="ex-detail" onClick={onClose}>
      <div
        className="ex-detail__panel"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="ex-detail__close" onClick={onClose}>
          ← BACK TO EXHIBITION
        </button>
        <div className="ex-detail__img-wrap">
          <img
            src={poster.src}
            alt={poster.name}
            className="ex-detail__img"
          />
        </div>
        <div className="ex-detail__info">
          <h2 className="ex-detail__poster-name">{poster.name}</h2>
          <p className="ex-detail__meta">
            {poster.category} · {poster.year}
          </p>
          <p className="ex-detail__desc">{poster.description}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Gallery room ──────────────────────────────────────── */
/*
  CSS 3D perspective gallery.
  Left wall:  posters 0, 1
  Back wall:  posters 2, 3, 4
  Right wall: poster 5
*/
function GalleryRoom({ onPosterClick }) {
  const [hovered, setHovered] = useState(null);

  const wallPosters = {
    left:  [POSTERS[0], POSTERS[1]],
    back:  [POSTERS[2], POSTERS[3], POSTERS[4]],
    right: [POSTERS[5]],
  };

  return (
    <div className="ex-room">
      {/* ── Ceiling ────────────────────────────────────── */}
      <div className="ex-room__ceiling">
        <div className="ex-room__light" />
        <div className="ex-room__light" />
        <div className="ex-room__light" />
      </div>

      {/* ── Floor ──────────────────────────────────────── */}
      <div className="ex-room__floor" />

      {/* ── Back wall ──────────────────────────────────── */}
      <div className="ex-room__wall ex-room__wall--back">
        <div className="ex-wall-row">
          {wallPosters.back.map((p) => (
            <PosterFrame
              key={p.id}
              poster={p}
              hovered={hovered === p.id}
              onEnter={() => setHovered(p.id)}
              onLeave={() => setHovered(null)}
              onClick={() => onPosterClick(p)}
            />
          ))}
        </div>
      </div>

      {/* ── Left wall ──────────────────────────────────── */}
      <div className="ex-room__wall ex-room__wall--left">
        <div className="ex-wall-col">
          {wallPosters.left.map((p) => (
            <PosterFrame
              key={p.id}
              poster={p}
              hovered={hovered === p.id}
              onEnter={() => setHovered(p.id)}
              onLeave={() => setHovered(null)}
              onClick={() => onPosterClick(p)}
              small
            />
          ))}
        </div>
      </div>

      {/* ── Right wall ─────────────────────────────────── */}
      <div className="ex-room__wall ex-room__wall--right">
        <div className="ex-wall-col">
          {wallPosters.right.map((p) => (
            <PosterFrame
              key={p.id}
              poster={p}
              hovered={hovered === p.id}
              onEnter={() => setHovered(p.id)}
              onLeave={() => setHovered(null)}
              onClick={() => onPosterClick(p)}
              large
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Poster frame ──────────────────────────────────────── */
function PosterFrame({ poster, hovered, onEnter, onLeave, onClick, small, large }) {
  return (
    <div
      className={`ex-frame ${small ? "ex-frame--small" : ""} ${large ? "ex-frame--large" : ""} ${hovered ? "ex-frame--hovered" : ""}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      <div className="ex-frame__border">
        <img
          src={poster.src}
          alt={poster.name}
          className="ex-frame__img"
          loading="lazy"
        />
        {hovered && (
          <div className="ex-frame__hint">CLICK TO VIEW</div>
        )}
      </div>
      <div className="ex-frame__label">
        <span className="ex-frame__label-name">{poster.name}</span>
        <span className="ex-frame__label-year">{poster.year}</span>
      </div>
    </div>
  );
}

/* ─── Main exhibition component ─────────────────────────── */
export default function Exhibition() {
  const [phase, setPhase] = useState("entry"); // entry | gallery
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleEnter = useCallback(() => {
    setPhase("gallery");
    setTimeout(() => setGalleryVisible(true), 50);
  }, []);

  const handlePosterClick = useCallback((poster) => {
    setSelected(poster);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelected(null);
  }, []);

  if (phase === "entry") {
    return <EntryScreen onEnter={handleEnter} />;
  }

  return (
    <div
      className="ex-gallery-wrap"
      style={{ opacity: galleryVisible ? 1 : 0 }}
    >
      {/* Top bar */}
      <div className="ex-topbar">
        <span className="ex-topbar__title">ABHA UKEY · DIGITAL EXHIBITION</span>
        <Link to="/" className="ex-topbar__back">← Archive</Link>
      </div>

      {/* Legend */}
      <div className="ex-legend">
        {POSTERS.map((p, i) => (
          <button
            key={p.id}
            className="ex-legend__item"
            onClick={() => setSelected(p)}
          >
            {String(i + 1).padStart(2, "0")} {p.name}
          </button>
        ))}
      </div>

      {/* Gallery room */}
      <GalleryRoom onPosterClick={handlePosterClick} />

      {/* Detail overlay */}
      {selected && (
        <DetailOverlay poster={selected} onClose={handleCloseDetail} />
      )}
    </div>
  );
}