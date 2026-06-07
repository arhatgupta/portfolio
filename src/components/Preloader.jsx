import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const preloaderRef = useRef(null);
  const lettersRef = useRef([]);
  const barRef = useRef(null);

  const name = "ABHA UKEY";

  useEffect(() => {
    // 1. Animate the letters in: staggered 3D flip (rotating on Y axis)
    gsap.fromTo(
      lettersRef.current,
      { 
        opacity: 0, 
        rotationY: 90, // Start rotated 90 degrees (invisible)
        y: 20 
      },
      {
        opacity: 1,
        rotationY: 0,  // Rotate back to 0 (flat to screen)
        y: 0,
        duration: 1.2,
        stagger: 0.1,  // Delay of 0.1s between each letter
        ease: "power3.out",
      }
    );

    // 2. Simulate loading progress from 0 to 100
    let currentProgress = { val: 0 };
    gsap.to(currentProgress, {
      val: 100,
      duration: 2.5, // Total loading time (2.5 seconds)
      ease: "power2.inOut",
      onUpdate: function () {
        setProgress(Math.floor(currentProgress.val));
        // Grow the progress bar width
        gsap.set(barRef.current, { width: `${currentProgress.val}%` });
      },
      onComplete: () => {
        // 3. Animate the letters rotating out before the screen slides up
        gsap.to(lettersRef.current, {
          opacity: 0,
          rotationX: 90, // Flip them upwards on exit
          y: -20,
          duration: 0.5,
          stagger: 0.05,
          ease: "power2.in",
        });

        // 4. Slide the preloader up and out of the screen
        gsap.to(preloaderRef.current, {
          yPercent: -100,
          duration: 0.8,
          ease: "power3.inOut",
          delay: 0.6, // Wait for the letters to disappear
          onComplete: () => setIsLoaded(true), // Unmount component
        });
      },
    });
  }, []);

  // Don't render anything once the animation is completely finished
  if (isLoaded) return null;

  return (
    <div className="preloader" ref={preloaderRef}>
      <div className="preloader__content">
        
        {/* Animated Name */}
        <div className="preloader__design-wrapper">
          {/* perspective gives the 3D rotation realistic depth */}
          <div className="preloader__name" style={{ perspective: "1000px" }}>
            {name.split("").map((char, index) => (
              <span
                key={index}
                // Store each letter span in the lettersRef array
                ref={(el) => (lettersRef.current[index] = el)}
                className="preloader__letter"
              >
                {/* Render non-breaking space for actual spaces to maintain width */}
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </div>
        </div>

        {/* Loading Bar & Percentage */}
        <div className="preloader__bottom">
          <div className="preloader__percentage">{progress}%</div>
          <div className="preloader__bar-container">
            <div className="preloader__bar" ref={barRef}></div>
          </div>
        </div>

      </div>
    </div>
  );
}