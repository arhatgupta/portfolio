import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar      from "./components/Navbar";
import Home        from "./pages/Home";
import About       from "./pages/About";
import ProjectPage from "./pages/ProjectPage";
import Preloader   from "./components/Preloader"; // <-- IMPORT HERE
import "./styles/global.css";
import "./styles/archive.css";

function ScrollReset() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function AppRoutes() {
  return (
    <>
      <ScrollReset />
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
      <Preloader /> {/* <-- ADD COMPONENT HERE */}
      <AppRoutes />
    </BrowserRouter>
  );
}