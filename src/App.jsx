import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import gsap from "gsap";
import Navbar      from "./components/Navbar";
import Home        from "./pages/Home";
import About       from "./pages/About";
import ProjectPage from "./pages/ProjectPage";
import Preloader   from "./components/Preloader"; 
import "./styles/global.css";
import "./styles/archive.css";

function PageTransitionController() {
  const { pathname } = useLocation();
  
  // 1. On very first load, instantly tuck the curtain away at the top
  useEffect(() => {
    gsap.set("#page-transition", { yPercent: -100 });
  }, []);

  // 2. Every time the URL changes, sweep the curtain UP to reveal the page
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
  return (
    <>
      <PageTransitionController />
      <Navbar />
      <Routes>
        <Route path="/"              element={<Home />} />
        <Route path="/about"         element={<About />} />
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