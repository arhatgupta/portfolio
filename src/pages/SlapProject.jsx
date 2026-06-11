import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../styles/slap.css";

gsap.registerPlugin(ScrollTrigger);

const basePath = import.meta.env.BASE_URL;

// Custom Draggable Sticker Component
function DraggableSticker({ src, initialX, initialY, initialRotation }) {
  const [pos, setPos] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const [zIndex, setZIndex] = useState(10);
  const offset = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e) => {
    setIsDragging(true);
    setZIndex((prev) => prev + 100); 
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    setPos({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y });
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    e.target.releasePointerCapture(e.pointerId);
  };

  return (
    <img
      src={src}
      alt="Interactive Sticker"
      className="slap-sticker"
      style={{
        left: pos.x,
        top: pos.y,
        transform: `rotate(${initialRotation}deg)`,
        zIndex: isDragging ? 9999 : zIndex,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      draggable={false}
    />
  );
}

export default function SlapProject() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const marqueeRef = useRef(null);
  const gridRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      
      // Hero Parallax
      gsap.utils.toArray(".slap-hero__floating-img").forEach((img, i) => {
        gsap.to(img, {
          yPercent: -60 - (i * 15), 
          rotation: "+=20",
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // Wall Grid Entrance
      gridRefs.current.forEach((img) => {
        if (!img) return;
        gsap.from(img, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: img,
            start: "top 90%", 
          },
        });
      });

      // Infinite Marquee
      gsap.to(marqueeRef.current, {
        xPercent: -50,
        ease: "none",
        duration: 15,
        repeat: -1,
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // ── GSAP HOVER HANDLERS ──

  // 1. Hero Images Hover
  const handleHeroHover = (e) => {
    gsap.to(e.target, { scale: 1.15, duration: 0.3, ease: "power2.out" });
  };
  const handleHeroLeave = (e) => {
    gsap.to(e.target, { scale: 1, duration: 0.3, ease: "power2.out" });
  };

  // 2. "Catchy" Wall Grid Hover (Aggressive spring + random tilt)
  const handleWallHover = (e) => {
    // Generate a random tilt between -8deg and +8deg
    const randomTilt = (Math.random() * 16) - 8;
    
    gsap.to(e.target, {
      scale: 1.15,
      rotation: randomTilt,
      boxShadow: "0px 30px 50px rgba(0,0,0,0.25)",
      zIndex: 50, // Bring to front
      duration: 0.6,
      ease: "back.out(2)", // Super springy/bouncy effect!
    });
  };

  const handleWallLeave = (e) => {
    gsap.to(e.target, {
      scale: 1,
      rotation: 0,
      boxShadow: "0px 10px 30px rgba(0,0,0,0.05)",
      zIndex: 1,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  // 3. Page Out Transition for Back Button
  // 3. Page Out Transition for Back Button
  // 3. Page Out Transition for Back Button
  const handleBackClick = (e) => {
    e.preventDefault();
    
    // Move curtain to bottom instantly
    gsap.set("#page-transition", { yPercent: 100 });
    
    // Sweep up to cover screen
    gsap.to("#page-transition", {
      yPercent: 0,
      duration: 0.6,
      ease: "power3.inOut",
      onComplete: () => navigate("/")
    });
  };

  return (
    <div className="slap-page" ref={containerRef}>
      
      {/* ── 1. HERO (Images 1 to 5) ── */}
      <section className="slap-hero" ref={heroRef}>
        <img onMouseEnter={handleHeroHover} onMouseLeave={handleHeroLeave} src={`${basePath}slap/1.png`} className="slap-hero__floating-img" style={{ top: "10%", left: "5%", transform: "rotate(-15deg)" }} alt="" />
        <img onMouseEnter={handleHeroHover} onMouseLeave={handleHeroLeave} src={`${basePath}slap/2.png`} className="slap-hero__floating-img" style={{ bottom: "15%", right: "8%", transform: "rotate(10deg)" }} alt="" />
        <img onMouseEnter={handleHeroHover} onMouseLeave={handleHeroLeave} src={`${basePath}slap/3.png`} className="slap-hero__floating-img" style={{ top: "15%", right: "20%", transform: "rotate(25deg)", width: "180px" }} alt="" />
        <img onMouseEnter={handleHeroHover} onMouseLeave={handleHeroLeave} src={`${basePath}slap/4.png`} className="slap-hero__floating-img" style={{ bottom: "10%", left: "15%", transform: "rotate(-5deg)", width: "220px" }} alt="" />
        <img onMouseEnter={handleHeroHover} onMouseLeave={handleHeroLeave} src={`${basePath}slap/5.png`} className="slap-hero__floating-img" style={{ top: "40%", left: "80%", transform: "rotate(-20deg)", width: "150px" }} alt="" />
        
        <h1 className="slap-hero__title">
          SLAP
          <span className="slap-hero__subtitle">Sounds Like A Plan</span>
        </h1>
      </section>

      {/* ── 2. STICKER PLAYGROUND (Images 18 to 23) ── */}
      <section className="slap-playground">
        <div className="slap-playground__header">
          Drag the stickers<br/>Make a mess
        </div>
        
        <DraggableSticker src={`${basePath}slap/18.png`} initialX={50}  initialY={150} initialRotation={-10} />
        <DraggableSticker src={`${basePath}slap/19.png`} initialX={350} initialY={100} initialRotation={15} />
        <DraggableSticker src={`${basePath}slap/20.png`} initialX={200} initialY={450} initialRotation={-25} />
        <DraggableSticker src={`${basePath}slap/21.png`} initialX={100} initialY={600} initialRotation={5} />
        <DraggableSticker src={`${basePath}slap/22.png`} initialX={550} initialY={350} initialRotation={20} />
        <DraggableSticker src={`${basePath}slap/23.png`} initialX={650} initialY={600} initialRotation={-15} />
      </section>

      {/* ── 3. MARQUEE SECTION ── */}
      <section className="slap-marquee-section">
        <div className="slap-marquee" ref={marqueeRef}>
          SOUNDS LIKE A PLAN • SOUNDS LIKE A PLAN • SOUNDS LIKE A PLAN • SOUNDS LIKE A PLAN • SOUNDS LIKE A PLAN • 
        </div>
      </section>

      {/* ── 4. OVERVIEW ── */}
      <section className="slap-overview">
        <div className="slap-overview__meta">
          <h3>PROJECT</h3>
          <p>SLAP Events</p>
          <h3>ROLE</h3>
          <p>Identity & Typography</p>
          <h3>YEAR</h3>
          <p>2024</p>
        </div>
        <div className="slap-overview__text">
          SLAP is a social event initiative celebrating community and spontaneous interactions. This project explores the brand's expressive personality through aggressive, playful, and experimental typography—treating the logo not as a static mark, but as a living sticker.
        </div>
      </section>

      {/* ── 5. COLOR STORY ── */}
      <section className="slap-colors">
        <div className="slap-color-block" style={{ backgroundColor: "#6C244C", color: "#E882B5" }}>PLUM</div>
        <div className="slap-color-block" style={{ backgroundColor: "#D4E059", color: "#6C244C" }}>LIME</div>
        <div className="slap-color-block" style={{ backgroundColor: "#E882B5", color: "#DE243D" }}>PINK</div>
        <div className="slap-color-block" style={{ backgroundColor: "#DE243D", color: "#f0f0ec" }}>RED</div>
      </section>

      {/* ── 6. EXPLORATION WALL (Images 6 to 17) ── */}
      <section className="slap-wall">
        <div className="slap-wall__grid">
          {[6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map((num, i) => (
            <img 
              key={num} 
              src={`${basePath}slap/${num}.png`} 
              alt={`Typography Exploration ${num}`} 
              className="slap-wall__item"
              ref={el => gridRefs.current[i] = el}
              onMouseEnter={handleWallHover}   /* Added GSAP Catchy Animation */
              onMouseLeave={handleWallLeave}   /* Added GSAP Catchy Animation */
            />
          ))}
        </div>
      </section>

      {/* ── 7. FOOTER ── */}
      <section className="slap-footer">
        <a href="/" onClick={handleBackClick} className="slap-back-btn">
          ← Return to Archive
        </a>
      </section>

    </div>
  );
}