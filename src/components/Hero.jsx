import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Hero() {
  const eyebrowRef = useRef(null);
  const nameRef = useRef(null);
  const roleRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

    tl.fromTo(
      eyebrowRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 }
    )
      .fromTo(
        nameRef.current.querySelectorAll("span"),
        { y: "110%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 1.2, stagger: 0.08 },
        "-=0.6"
      )
      .fromTo(
        roleRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        "-=0.7"
      )
      .fromTo(
        bottomRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
        "-=0.5"
      );
  }, []);

  return (
    <section className="hero">
      <div className="hero__main">
        <p className="hero__eyebrow" ref={eyebrowRef}>
          Designer & Art Director — Pune, India
        </p>

        <h1 className="hero__name" ref={nameRef}>
          <span>ABHA</span>
          <span>UKEY</span>
        </h1>

        <p className="hero__role" ref={roleRef}>
          Brand Identity · Editorial · Digital Product · Art Direction
        </p>
      </div>

      <div className="hero__bottom" ref={bottomRef}>
        <div className="hero__scroll-hint">Scroll to explore</div>
        <div className="hero__counter">007 Projects</div>
      </div>
    </section>
  );
}