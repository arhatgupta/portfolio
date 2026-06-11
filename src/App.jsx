import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import gsap from "gsap";

import Navbar from "./components/Navbar";
import Preloader from "./components/Preloader";

import Home from "./pages/Home";
import About from "./pages/About";
import ProjectPage from "./pages/ProjectPage";
import Exhibition from "./pages/Exhibition";

import "./styles/global.css";
import "./styles/archive.css";
import "./styles/exhibition.css";

function PageTransitionController() {
  const { pathname } = useLocation();

  // On first load, hide curtain above viewport
  useEffect(() => {
    gsap.set("#page-transition", { yPercent: -100 });
  }, []);

  // Animate on route changes
  useEffect(() => {
    window.scrollTo(0, 0);

    gsap.to("#page-transition", {
      yPercent: -100,
      duration: 0.8,
      ease: "power3.inOut",
    });
  }, [pathname]);

  return <div id="page-transition" className="page-transition"></div>;
}

function AppRoutes() {
  const { pathname } = useLocation();

  // Exhibition page has its own navigation
  const isExhibition = pathname === "/project/posters-and-fun";

  return (
    <>
      <PageTransitionController />

      {!isExhibition && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/project/posters-and-fun" element={<Exhibition />} />
        <Route path="/project/:slug" element={<ProjectPage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Preloader />
      <AppRoutes />
    </BrowserRouter>
  );
}