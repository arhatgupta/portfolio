import {
  Suspense, useRef, useState, useEffect, useCallback, useMemo
} from "react";
import { Link } from "react-router-dom";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import {
  useTexture, PerspectiveCamera, Html, useProgress
} from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

/* ══════════════════════════════════════════════════════════
   POSTER DATA
══════════════════════════════════════════════════════════ */
const BASE = import.meta.env.BASE_URL;

const POSTERS = [
  {
    id: "euphoria",
    name: "EUPHORIA",
    year: "2023",
    category: "Experimental Design",
    description:
      "Exploring the collision of color, emotion, and collective experience through making handmade textures with acrylic paints.",
    src: `${BASE}posters/euphoria.png`,
  },
  {
    id: "grinn",
    name: "GRINN",
    year: "2023",
    category: "Illustration",
    description: "A surreal study of optimism, exaggeration, and visual play.",
    src: `${BASE}posters/grinn.png`,
  },
  {
    id: "goonda",
    name: "GOONDA",
    year: "2022",
    category: "Cultural Identity",
    description: "Regional identity reimagined through contemporary graphic culture.",
    src: `${BASE}posters/goonda.png`,
  },
  {
    id: "umrao-jaan",
    name: "UMRAO JAAN",
    year: "2023",
    category: "Editorial",
    description: "Reframing cinematic heritage through a modern editorial lens.",
    src: `${BASE}posters/umrao-jaan.png`,
  },
  {
    id: "skrrt-club",
    name: "SKRRT CLUB",
    year: "2024",
    category: "Event Design",
    description:
      "Capturing the intensity and unpredictability of underground nightlife.",
    src: `${BASE}posters/skrrt-club.png`,
  },
  {
    id: "akshar",
    name: "AKSHAR",
    year: "2022",
    category: "Typography",
    description: "A Typography Exhibition Poster Design.",
    src: `${BASE}posters/akshar.png`,
  },
];

/*
  Room: 10 wide × 4.6 tall × 22 deep
  Back wall Z=-11, Left X=-5, Right X=5
  Eye level Y=1.6, camera starts at Z=8.5
*/
const POSTER_LAYOUT = [
  { poster: POSTERS[0], pos: [-4.92, 1.65, -2],    rot: [0,  Math.PI / 2, 0], w: 1.5, h: 2.1 },
  { poster: POSTERS[1], pos: [-4.92, 1.65, -6],    rot: [0,  Math.PI / 2, 0], w: 1.5, h: 2.1 },
  { poster: POSTERS[2], pos: [ 4.92, 1.65, -2],    rot: [0, -Math.PI / 2, 0], w: 1.5, h: 2.1 },
  { poster: POSTERS[3], pos: [ 4.92, 1.65, -6],    rot: [0, -Math.PI / 2, 0], w: 1.5, h: 2.1 },
  { poster: POSTERS[4], pos: [-2.4,  1.65, -10.92], rot: [0, 0, 0],            w: 1.5, h: 2.1 },
  { poster: POSTERS[5], pos: [ 2.4,  1.65, -10.92], rot: [0, 0, 0],            w: 1.5, h: 2.1 },
];

/* ══════════════════════════════════════════════════════════
   LOADING
══════════════════════════════════════════════════════════ */
function LoadingScreen() {
  const { progress } = useProgress();
  return (
    <div className="ex-load">
      <div className="ex-load__bar">
        <div className="ex-load__fill" style={{ width: `${progress}%` }} />
      </div>
      <p className="ex-load__pct">{Math.round(progress)}%</p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ENTRY SCREEN
══════════════════════════════════════════════════════════ */
function EntryScreen({ onEnter }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 80); }, []);
  return (
    <div className="ex-entry" style={{ opacity: vis ? 1 : 0 }}>
      <div className="ex-entry__inner">
        <p className="ex-entry__byline">ABHA UKEY</p>
        <h1 className="ex-entry__title">DIGITAL<br />EXHIBITION</h1>
        <p className="ex-entry__sub">6 Works &nbsp;·&nbsp; 2022–2024</p>
        <button className="ex-entry__btn" onClick={onEnter}>
          ENTER GALLERY &nbsp;→
        </button>
      </div>
      <Link to="/" className="ex-entry__archive">← Archive</Link>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PROCEDURAL FLOOR TEXTURE (warm oak hardwood planks)
══════════════════════════════════════════════════════════ */
function useFloorTexture() {
  return useMemo(() => {
    const W = 1024, H = 1024;
    const canvas = document.createElement("canvas");
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#b8743a";
    ctx.fillRect(0, 0, W, H);

    const plankH = 32;
    for (let y = 0; y < H; y += plankH) {
      const v = (Math.random() - 0.5) * 28;
      const r = Math.min(255, Math.max(0, 184 + v));
      const g = Math.min(255, Math.max(0, 116 + v * 0.5));
      const b = Math.min(255, Math.max(0, 58 + v * 0.25));
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(0, y, W, plankH - 1);

      // Grain
      ctx.strokeStyle = "rgba(0,0,0,0.05)";
      ctx.lineWidth = 0.6;
      for (let i = 0; i < 10; i++) {
        const gy = y + Math.random() * plankH;
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.bezierCurveTo(W * 0.25, gy + 3, W * 0.75, gy - 3, W, gy);
        ctx.stroke();
      }
      // Seam
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.fillRect(0, y + plankH - 1, W, 1);
    }
    // Cross joints
    ctx.strokeStyle = "rgba(0,0,0,0.1)";
    ctx.lineWidth = 1;
    for (let x = 90; x < W; x += 90 + Math.random() * 30) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(5, 9);
    tex.anisotropy = 16;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    return tex;
  }, []);
}

/* ══════════════════════════════════════════════════════════
   SPOTLIGHT FIXTURE (white cylinder + cone glow)
══════════════════════════════════════════════════════════ */
function SpotFixture({ position, targetPos, intensity = 55 }) {
  const target = useRef();
  const lightRef = useRef();

  useEffect(() => {
    if (lightRef.current && target.current) {
      lightRef.current.target = target.current;
    }
  }, []);

  return (
    <group position={position}>
      {/* Housing */}
      <mesh castShadow>
        <cylinderGeometry args={[0.05, 0.065, 0.17, 12]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Dark aperture */}
      <mesh position={[0, -0.086, 0]}>
        <circleGeometry args={[0.05, 12]} />
        <meshStandardMaterial color="#080808" />
      </mesh>
      {/* Invisible target */}
      <object3D ref={target} position={targetPos} />
      <spotLight
        ref={lightRef}
        angle={0.28}
        penumbra={0.45}
        intensity={intensity}
        color="#fff9ee"
        distance={9}
        decay={2}
        castShadow
        shadow-mapSize={[512, 512]}
        shadow-bias={-0.001}
      />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════
   MUSEUM PLINTH (pedestal)
══════════════════════════════════════════════════════════ */
function Plinth({ position, w = 0.35, d = 0.35, h = 0.9 }) {
  return (
    <group position={position}>
      {/* Main column */}
      <mesh castShadow receiveShadow position={[0, h / 2, 0]}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.85} metalness={0} />
      </mesh>
      {/* Top cap */}
      <mesh castShadow receiveShadow position={[0, h + 0.015, 0]}>
        <boxGeometry args={[w + 0.04, 0.03, d + 0.04]} />
        <meshStandardMaterial color="#ddd" roughness={0.7} metalness={0} />
      </mesh>
      {/* Base */}
      <mesh receiveShadow position={[0, 0.015, 0]}>
        <boxGeometry args={[w + 0.04, 0.03, d + 0.04]} />
        <meshStandardMaterial color="#ddd" roughness={0.7} metalness={0} />
      </mesh>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════
   CERAMIC VASE (lathe geometry)
══════════════════════════════════════════════════════════ */
function Vase({ position, color = "#e0dbd5", scale = 1 }) {
  const geo = useMemo(() => {
    const points = [
      new THREE.Vector2(0,      0),
      new THREE.Vector2(0.06,   0.02),
      new THREE.Vector2(0.09,   0.08),
      new THREE.Vector2(0.10,   0.18),
      new THREE.Vector2(0.085,  0.30),
      new THREE.Vector2(0.065,  0.38),
      new THREE.Vector2(0.05,   0.44),
      new THREE.Vector2(0.055,  0.50),
      new THREE.Vector2(0.07,   0.54),
      new THREE.Vector2(0.065,  0.58),
      new THREE.Vector2(0.04,   0.60),
    ];
    return new THREE.LatheGeometry(points, 28);
  }, []);

  return (
    <mesh
      geometry={geo}
      position={position}
      scale={[scale, scale, scale]}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color={color}
        roughness={0.25}
        metalness={0.05}
        envMapIntensity={0.6}
      />
    </mesh>
  );
}

/* ══════════════════════════════════════════════════════════
   GALLERY BENCH
══════════════════════════════════════════════════════════ */
function Bench({ position, rot = 0 }) {
  return (
    <group position={position} rotation={[0, rot, 0]}>
      {/* Seat */}
      <mesh castShadow receiveShadow position={[0, 0.38, 0]}>
        <boxGeometry args={[1.5, 0.06, 0.36]} />
        <meshStandardMaterial color="#8B6F47" roughness={0.7} metalness={0} />
      </mesh>
      {/* Legs */}
      {[[-0.6, 0], [0.6, 0]].map(([lx], i) => (
        <mesh key={i} castShadow receiveShadow position={[lx, 0.19, 0]}>
          <boxGeometry args={[0.06, 0.38, 0.3]} />
          <meshStandardMaterial color="#333" roughness={0.3} metalness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

/* ══════════════════════════════════════════════════════════
   ROOM GEOMETRY
══════════════════════════════════════════════════════════ */
function Room() {
  const floorTex = useFloorTexture();
  const railXs   = [-1.6, 1.6];
  const spotZs   = [7.5, 5, 2, -1, -4, -7, -9.5];

  return (
    <group>
      {/* ── Floor ─────────────────────────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -1]} receiveShadow>
        <planeGeometry args={[10, 24]} />
        <meshStandardMaterial
          map={floorTex}
          roughness={0.55}
          metalness={0.05}
        />
      </mesh>

      {/* ── Ceiling ───────────────────────────────────────── */}
      <mesh position={[0, 4.6, -1]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 24]} />
        <meshStandardMaterial color="#f4f4f4" roughness={1} />
      </mesh>

      {/* ── Back wall ─────────────────────────────────────── */}
      <mesh position={[0, 2.3, -11]} receiveShadow>
        <planeGeometry args={[10, 6.6]} />
        <meshStandardMaterial color="#8c8c8c" roughness={0.95} />
      </mesh>

      {/* ── Left wall ─────────────────────────────────────── */}
      <mesh position={[-5, 2.3, -1]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[24, 6.6]} />
        <meshStandardMaterial color="#959595" roughness={0.95} />
      </mesh>

      {/* ── Right wall ────────────────────────────────────── */}
      <mesh position={[5, 2.3, -1]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[24, 6.6]} />
        <meshStandardMaterial color="#959595" roughness={0.95} />
      </mesh>

      {/* ── Ceiling-wall black accent strips ──────────────── */}
      {[-4.97, 4.97].map((xv, i) => (
        <mesh key={i} position={[xv, 4.56, -1]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[24, 0.05, 0.04]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.7} />
        </mesh>
      ))}

      {/* ── Black baseboard ───────────────────────────────── */}
      <mesh position={[0, 0.07, -10.97]}>
        <boxGeometry args={[10, 0.14, 0.04]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.6} />
      </mesh>
      {[-4.97, 4.97].map((xv, i) => (
        <mesh key={i} position={[xv, 0.07, -1]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[24, 0.14, 0.04]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.6} />
        </mesh>
      ))}

      {/* ── Track rails ───────────────────────────────────── */}
      {railXs.map((rx) => (
        <mesh key={rx} position={[rx, 4.52, -1]}>
          <boxGeometry args={[0.035, 0.035, 22]} />
          <meshStandardMaterial color="#181818" roughness={0.3} metalness={0.85} />
        </mesh>
      ))}

      {/* ── Spot fixtures ─────────────────────────────────── */}
      {railXs.map((rx) =>
        spotZs.map((sz) => (
          <SpotFixture
            key={`${rx}-${sz}`}
            position={[rx, 4.44, sz]}
            targetPos={[rx * 0.4, 0, sz]}
            intensity={50}
          />
        ))
      )}

      {/* ── Global illumination ───────────────────────────── */}
      <ambientLight intensity={0.55} color="#fffaf4" />

      {/* Ceiling ambient wash */}
      {[-7, -3, 1, 5].map((z, i) => (
        <pointLight key={i} position={[0, 4.1, z]} intensity={14} color="#fff8f0" decay={2} distance={9} />
      ))}

      {/* Floor bounce */}
      <pointLight position={[0, 0.25, 2]}  intensity={9}  color="#c8701e" decay={2} distance={14} />
      <pointLight position={[0, 0.25, -4]} intensity={7}  color="#c06818" decay={2} distance={12} />
      <pointLight position={[0, 0.25, -8]} intensity={5}  color="#b86016" decay={2} distance={10} />

      {/* ── Museum furniture ──────────────────────────────── */}
      {/* Centre bench */}
      <Bench position={[0, 0, -5]} rot={0} />

      {/* Plinths with vases — left side */}
      <Plinth position={[-4.1, 0, 0.5]} />
      <Vase   position={[-4.1, 0.94, 0.5]} color="#d4c5b0" scale={1.1} />

      {/* Plinths with vases — right side */}
      <Plinth position={[4.1, 0, 0.5]} />
      <Vase   position={[4.1, 0.94, 0.5]} color="#c8bfb5" scale={1.0} />

      {/* Small plinth near back wall */}
      <Plinth position={[0, 0, -9.5]} w={0.4} d={0.4} h={0.7} />
      <Vase   position={[0, 0.74, -9.5]} color="#e0dbd4" scale={0.9} />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════
   POSTER FRAME — premium framed artwork
══════════════════════════════════════════════════════════ */
function PosterFrame({ layout, isHovered, onHover, onUnhover, onClick, isFocused }) {
  const groupRef  = useRef();
  const spotRef   = useRef();
  const { poster, pos, rot, w, h } = layout;

  // Load texture with max quality settings
  const texture = useTexture(poster.src, (t) => {
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.anisotropy = 16;
    t.needsUpdate = true;
  });

  const frameW    = w  + 0.18;
  const frameH    = h  + 0.18;
  const matW      = w  + 0.10;
  const matH      = h  + 0.10;
  const frameD    = 0.055;

  // Smooth hover scale
  useFrame((_, dt) => {
    if (!groupRef.current || isFocused) return;
    const target = isHovered ? 1.035 : 1.0;
    groupRef.current.scale.lerp(
      new THREE.Vector3(target, target, target),
      dt * 8
    );
    // Subtle hover elevation
    const ty = pos[1] + (isHovered ? 0.025 : 0);
    groupRef.current.position.y += (ty - groupRef.current.position.y) * dt * 8;
  });

  return (
    <group ref={groupRef} position={pos} rotation={rot}>
      {/* ── Outer frame (dark walnut) ──────────────────────── */}
      <mesh castShadow receiveShadow position={[0, 0, -frameD * 0.5]}>
        <boxGeometry args={[frameW, frameH, frameD]} />
        <meshStandardMaterial
          color="#1e1612"
          roughness={0.4}
          metalness={0.1}
          envMapIntensity={0.3}
        />
      </mesh>

      {/* ── Inner frame reveal (thin inner edge) ──────────── */}
      <mesh position={[0, 0, -frameD * 0.1]}>
        <boxGeometry args={[matW, matH, 0.02]} />
        <meshStandardMaterial color="#2a2218" roughness={0.6} />
      </mesh>

      {/* ── White mat board ───────────────────────────────── */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[matW, matH, 0.015]} />
        <meshStandardMaterial color="#f9f8f6" roughness={0.92} />
      </mesh>

      {/* ── Artwork surface ───────────────────────────────── */}
      <mesh
        position={[0, 0, 0.012]}
        onPointerEnter={(e) => { e.stopPropagation(); onHover(); }}
        onPointerLeave={(e) => { e.stopPropagation(); onUnhover(); }}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
      >
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.55}
          metalness={0}
          toneMapped
        />
      </mesh>

      {/* ── Per-artwork dedicated spotlight ───────────────── */}
      <spotLight
        ref={spotRef}
        position={[0, 2.5, 1.0]}
        target-position={[0, 0, 0]}
        angle={0.35}
        penumbra={0.5}
        intensity={isHovered ? 120 : 80}
        color="#fff8ec"
        distance={6}
        decay={2}
        castShadow={false}
      />

      {/* ── Hover hint ────────────────────────────────────── */}
      {isHovered && !isFocused && (
        <Html position={[0, -h / 2 - 0.2, 0.02]} center>
          <div className="ex-hint">CLICK TO VIEW</div>
        </Html>
      )}
    </group>
  );
}

/* ══════════════════════════════════════════════════════════
   MUSEUM PLAQUE (in-world HTML label shown after focus)
  
   Appears at world-space position beside the poster.
   Fades in after camera arrives.
   Feels like a physical wall label, NOT a modal.
══════════════════════════════════════════════════════════ */
function MuseumPlaque({ layout, visible, onBack }) {
  const { poster, pos, rot, w, h } = layout;
  const [px, py, pz] = pos;
  const [, ry] = rot;

  // Position plaque below and slightly right of poster in local space
  // It's parented to the poster group's world space via layout data
  const plaqueLocalX = w / 2 + 0.05;
  const plaqueLocalY = -h / 2 + 0.05;

  return (
    <group position={pos} rotation={rot}>
      <Html
        position={[plaqueLocalX, plaqueLocalY - 0.55, 0.04]}
        transform
        occlude={false}
        style={{ pointerEvents: visible ? "all" : "none" }}
      >
        <div
          className="ex-plaque"
          style={{ opacity: visible ? 1 : 0 }}
        >
          <div className="ex-plaque__rule" />
          <h2 className="ex-plaque__title">{poster.name}</h2>
          <p className="ex-plaque__meta">
            {poster.category} &nbsp;·&nbsp; {poster.year}
          </p>
          <p className="ex-plaque__desc">{poster.description}</p>
          <button className="ex-plaque__back" onClick={onBack}>
            ← Return
          </button>
        </div>
      </Html>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════
   CAMERA CONTROLLER
  
   - Free walk: WASD + mouse drag yaw
   - Focus: GSAP tween to close viewing distance in front of poster
   - Restore: GSAP tween back to saved position/rotation
══════════════════════════════════════════════════════════ */
function CameraController({ focusTarget, onFocusComplete, restoreSignal }) {
  const { camera } = useThree();
  const keys        = useRef({});
  const yaw         = useRef(0);
  const targetYaw   = useRef(0);
  const isDragging  = useRef(false);
  const lastMouse   = useRef({ x: 0, y: 0 });
  const vel         = useRef(new THREE.Vector3());
  const pos         = useRef(new THREE.Vector3(0, 1.7, 8.5));
  const isFocused   = useRef(false);
  const savedPos    = useRef(new THREE.Vector3());
  const savedYaw    = useRef(0);
  const activeTween = useRef(null);

  useEffect(() => {
    camera.position.copy(pos.current);
  }, []);

  useEffect(() => {
    const down = (e) => { keys.current[e.code] = true; };
    const up   = (e) => { keys.current[e.code] = false; };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup",   up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup",   up);
    };
  }, []);

  useEffect(() => {
    const onDown = (e) => {
      if (isFocused.current) return;
      isDragging.current = true;
      lastMouse.current = { x: e.clientX, y: e.clientY };
    };
    const onMove = (e) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastMouse.current.x;
      targetYaw.current -= dx * 0.0038;
      targetYaw.current  = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, targetYaw.current));
      lastMouse.current  = { x: e.clientX, y: e.clientY };
    };
    const onUp = () => { isDragging.current = false; };

    window.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
    };
  }, []);

  // FOCUS: move camera to viewing position in front of poster
  useEffect(() => {
    if (!focusTarget) return;
    isFocused.current = true;

    // Save current state for restore
    savedPos.current.copy(pos.current);
    savedYaw.current = yaw.current;

    const [px, py, pz] = focusTarget.pos;
    const [, ry] = focusTarget.rot;

    // 1.6m in front of poster surface
    const dist = 1.6;
    const tx = px + Math.sin(ry) * dist * -1;
    const tz = pz + Math.cos(ry) * dist;

    const proxy = { x: pos.current.x, y: pos.current.y, z: pos.current.z };

    if (activeTween.current) activeTween.current.kill();
    activeTween.current = gsap.to(proxy, {
      x: tx, y: py, z: tz,
      duration: 1.6,
      ease: "power3.inOut",
      onUpdate: () => {
        camera.position.set(proxy.x, proxy.y, proxy.z);
        camera.lookAt(px, py, pz);
      },
      onComplete: () => {
        pos.current.set(tx, py, tz);
        if (onFocusComplete) onFocusComplete();
      },
    });
  }, [focusTarget]);

  // RESTORE: smoothly return to saved position
  useEffect(() => {
    if (restoreSignal === 0) return;
    isFocused.current = false;

    const proxy = {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
    };
    const target = savedPos.current;

    if (activeTween.current) activeTween.current.kill();
    activeTween.current = gsap.to(proxy, {
      x: target.x, y: target.y, z: target.z,
      duration: 1.4,
      ease: "power3.inOut",
      onUpdate: () => {
        camera.position.set(proxy.x, proxy.y, proxy.z);
        // Gradually restore yaw by looking slightly forward
        const fwd = new THREE.Vector3(
          -Math.sin(savedYaw.current), 0, -Math.cos(savedYaw.current)
        );
        camera.lookAt(
          camera.position.x + fwd.x,
          camera.position.y,
          camera.position.z + fwd.z
        );
      },
      onComplete: () => {
        pos.current.copy(target);
        yaw.current       = savedYaw.current;
        targetYaw.current = savedYaw.current;
      },
    });
  }, [restoreSignal]);

  // Free walk loop
  useFrame((_, dt) => {
    if (isFocused.current) return;

    yaw.current += (targetYaw.current - yaw.current) * dt * 9;

    const SPEED = 4.2;
    const fwd   = new THREE.Vector3(-Math.sin(yaw.current), 0, -Math.cos(yaw.current));
    const right = new THREE.Vector3(Math.cos(yaw.current),  0, -Math.sin(yaw.current));

    const move  = new THREE.Vector3();
    if (keys.current["KeyW"] || keys.current["ArrowUp"])    move.addScaledVector(fwd,    SPEED);
    if (keys.current["KeyS"] || keys.current["ArrowDown"])  move.addScaledVector(fwd,   -SPEED);
    if (keys.current["KeyA"] || keys.current["ArrowLeft"])  move.addScaledVector(right, -SPEED);
    if (keys.current["KeyD"] || keys.current["ArrowRight"]) move.addScaledVector(right,  SPEED);

    vel.current.lerp(move, dt * 5.5);
    pos.current.addScaledVector(vel.current, dt);

    // Clamp to room
    pos.current.x = Math.max(-4.0, Math.min(4.0, pos.current.x));
    pos.current.z = Math.max(-9.2, Math.min(8.8, pos.current.z));
    pos.current.y = 1.7;

    camera.position.copy(pos.current);
    const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw.current);
    camera.quaternion.slerp(q, dt * 12);
  });

  return null;
}

/* ══════════════════════════════════════════════════════════
   SCENE
══════════════════════════════════════════════════════════ */
function Scene() {
  const [hovered,        setHovered]        = useState(null);
  const [focusTarget,    setFocusTarget]     = useState(null);
  const [focusedLayout,  setFocusedLayout]   = useState(null);
  const [plaqueVisible,  setPlaqueVisible]   = useState(false);
  const [restoreSignal,  setRestoreSignal]   = useState(0);

  const handleClick = useCallback((layout) => {
    setFocusTarget(layout);
    setFocusedLayout(layout);
    setPlaqueVisible(false);
  }, []);

  const handleFocusComplete = useCallback(() => {
    setTimeout(() => setPlaqueVisible(true), 200);
  }, []);

  const handleBack = useCallback(() => {
    setPlaqueVisible(false);
    setFocusTarget(null);
    setTimeout(() => {
      setRestoreSignal((s) => s + 1);
      setFocusedLayout(null);
    }, 400);
  }, []);

  return (
    <>
      <PerspectiveCamera makeDefault fov={70} near={0.05} far={80} />

      <CameraController
        focusTarget={focusTarget}
        onFocusComplete={handleFocusComplete}
        restoreSignal={restoreSignal}
      />

      <Suspense fallback={null}>
        <Room />

        {POSTER_LAYOUT.map((layout) => (
          <PosterFrame
            key={layout.poster.id}
            layout={layout}
            isHovered={hovered === layout.poster.id && focusedLayout === null}
            onHover={() => { if (!focusedLayout) setHovered(layout.poster.id); }}
            onUnhover={() => setHovered(null)}
            onClick={() => handleClick(layout)}
            isFocused={focusedLayout?.poster.id === layout.poster.id}
          />
        ))}

        {focusedLayout && (
          <MuseumPlaque
            layout={focusedLayout}
            visible={plaqueVisible}
            onBack={handleBack}
          />
        )}
      </Suspense>
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   CONTROLS HUD
══════════════════════════════════════════════════════════ */
function ControlsHUD() {
  const [vis, setVis] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setVis(false), 6000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="ex-controls" style={{ opacity: vis ? 1 : 0 }}>
      <div className="ex-controls__row"><kbd>W A S D</kbd><span>Move</span></div>
      <div className="ex-controls__row"><kbd>Drag</kbd><span>Look</span></div>
      <div className="ex-controls__row"><kbd>Click</kbd><span>View artwork</span></div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════ */
export default function Exhibition() {
  const [phase,     setPhase]     = useState("entry");
  const [canvasVis, setCanvasVis] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleEnter = useCallback(() => {
    setPhase("gallery");
    setTimeout(() => setCanvasVis(true), 80);
  }, []);

  if (phase === "entry") return <EntryScreen onEnter={handleEnter} />;

  return (
    <div className="ex-wrap">
      <div className="ex-topbar">
        <span className="ex-topbar__title">ABHA UKEY · DIGITAL EXHIBITION</span>
        <Link to="/" className="ex-topbar__back">← Archive</Link>
      </div>

      <div className="ex-canvas-wrap" style={{ opacity: canvasVis ? 1 : 0 }}>
        <Suspense fallback={<LoadingScreen />}>
          <Canvas
            shadows="soft"
            gl={{
              antialias:           true,
              toneMapping:         THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.05,
              outputColorSpace:    THREE.SRGBColorSpace,
            }}
            style={{ width: "100%", height: "100%" }}
          >
            <Scene />
          </Canvas>
        </Suspense>
      </div>

      <ControlsHUD />
    </div>
  );
}