import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar      from "./components/Navbar";
import Home        from "./pages/Home";
import About       from "./pages/About";
import ProjectPage from "./pages/ProjectPage";
import Exhibition  from "./pages/Exhibition";
import "./styles/global.css";
import "./styles/archive.css";
import "./styles/exhibition.css";

function ScrollReset() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function AppRoutes() {
  const { pathname } = useLocation();
  // Hide navbar on exhibition route — it has its own top bar
  const isExhibition = pathname === "/project/posters-and-fun";

  return (
    <>
      <ScrollReset />
      {!isExhibition && <Navbar />}
      <Routes>
        <Route path="/"                        element={<Home />} />
        <Route path="/about"                   element={<About />} />
        <Route path="/project/posters-and-fun" element={<Exhibition />} />
        <Route path="/project/:slug"           element={<ProjectPage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppRoutes />
    </BrowserRouter>
  );
}