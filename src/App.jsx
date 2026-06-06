import { useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import ProjectPage from "./pages/ProjectPage";
import "./styles/global.css";
import "./styles/home.css";
import "./styles/project.css";

function Cursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    let mouseX = 0, mouseY = 0;
    let curX = 0, curY = 0;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const lerp = (a, b, n) => a + (b - a) * n;

    const animate = () => {
      curX = lerp(curX, mouseX, 0.15);
      curY = lerp(curY, mouseY, 0.15);
      if (cursor) {
        cursor.style.left = curX + "px";
        cursor.style.top  = curY + "px";
      }
      requestAnimationFrame(animate);
    };

    const onEnter = () => cursor?.classList.add("hovered");
    const onLeave = () => cursor?.classList.remove("hovered");

    document.addEventListener("mousemove", onMove);
    document.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    animate();

    return () => {
      document.removeEventListener("mousemove", onMove);
    };
  }, []);

  return <div className="cursor" ref={cursorRef} />;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/project/:slug" element={<ProjectPage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Cursor />
      <AppRoutes />
    </BrowserRouter>
  );
}