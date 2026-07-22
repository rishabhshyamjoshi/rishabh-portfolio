"use client";

import { useEffect, useRef, useState, Suspense, useCallback, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import Environment from "./Environment";
import SolarSystem from "./TheCore";
import ProjectScreens from "./ProjectScreens";
import TeamScreens from "./TeamScreens";
import BlackHoleExperience from "./BlackHoleExperience";
import ProjectDetailModal from "./ProjectDetailModal";
import { AudioController } from "../utils/AudioController";

function CameraController({ setScrollProgress, activeProject }: { setScrollProgress: (v: number) => void, activeProject: any }) {
  const { camera, pointer } = useThree();
  const targetScroll = useRef(0);
  const currentScroll = useRef(0);
  
  const targetParallax = useRef(new THREE.Vector2(0, 0));
  const currentParallax = useRef(new THREE.Vector2(0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, -2));
  const smoothPan = useRef(0);

  useEffect(() => {
    let lastTouchY = 0;

    const handleWheel = (e: WheelEvent) => {
      if (activeProject) return; 
      targetScroll.current += e.deltaY * 0.001;
      if (targetScroll.current > 4) targetScroll.current = 4;
      if (targetScroll.current < 0) targetScroll.current = 0;
    };
    
    const handleTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (activeProject) return;
      const currentY = e.touches[0].clientY;
      const deltaY = lastTouchY - currentY;
      targetScroll.current += deltaY * 0.005; // Slightly faster multiplier for touch dragging
      if (targetScroll.current > 4) targetScroll.current = 4;
      if (targetScroll.current < 0) targetScroll.current = 0;
      lastTouchY = currentY;
    };

    const handleNav = (e: any) => {
      targetScroll.current = e.detail;
    };
    
    window.addEventListener("wheel", handleWheel);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("navTo", handleNav as any);
    
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("navTo", handleNav as any);
    };
  }, [activeProject]);

  useFrame((state) => {
    const rawScrollDelta = targetScroll.current - currentScroll.current;
    const scrollDelta = Math.abs(rawScrollDelta);
    currentScroll.current += rawScrollDelta * 0.02;
    setScrollProgress(currentScroll.current);

    const aspect = window.innerWidth / window.innerHeight;
    const baseFov = aspect < 1 ? 100 : 75; 
    // Dynamic FOV warp effect on movement (reduced by ~10%)
    const targetFov = baseFov + (scrollDelta * 54); 
    
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, 0.05);
      camera.updateProjectionMatrix();
    }

    targetParallax.current.set(pointer.x * 0.4, pointer.y * 0.3);
    currentParallax.current.lerp(targetParallax.current, 0.025);

    // Audio muffle and ambient continuous slow pan
    let muffleIntensity = 0;
    if (activeProject) {
      muffleIntensity = 0.85;
    } else {
      // Muffling effect while scrolling (reduced 25%)
      muffleIntensity = Math.min(scrollDelta * 7.5, 0.75);
      
      // Target pan (reduced 25%)
      const targetPan = Math.max(-0.75, Math.min(0.75, rawScrollDelta * 3.75)); 
      // Lerp for smooth effect
      smoothPan.current = THREE.MathUtils.lerp(smoothPan.current, targetPan, 0.05);
    }

    try { 
      const audio = AudioController.getInstance();
      audio.applyMovementEffect(muffleIntensity); 
      audio.setPan(smoothPan.current);
    } catch(err) {}

    if (activeProject) {
      const isMars = activeProject.name !== undefined;
      const baseProjectX = isMars ? 40 : 0;
      const t = activeProject.animationTime; 
      
      let localScrollProgress = 0;
      if (isMars) {
        localScrollProgress = currentScroll.current > 2 ? Math.min(1, currentScroll.current - 2) : 0;
      } else {
        localScrollProgress = Math.min(1, currentScroll.current);
      }

      const radius = Math.pow(localScrollProgress, 1.5) * 15;
      const px = baseProjectX + Math.cos(activeProject.angle + t * 0.2) * (radius - 2); 
      const pz = Math.sin(activeProject.angle + t * 0.2) * (radius - 2) - 2;
      const py = Math.sin(t * 1 + (isMars ? parseInt(activeProject.id.split("-")[1]) : activeProject.id)) * 0.5;

      camera.position.lerp(new THREE.Vector3(px, py, pz), 0.05);
      
      const targetLook = new THREE.Vector3(
        baseProjectX + Math.cos(activeProject.angle + t * 0.2) * radius,
        py,
        Math.sin(activeProject.angle + t * 0.2) * radius - 2
      );
      currentLookAt.current.lerp(targetLook, 0.1); 
      camera.lookAt(currentLookAt.current);
    } else {
      let idealX = 0;
      let idealY = 0;
      let idealZ = 0;
      let idealLookX = 0;
      
      // Generalized planetary scroll logic
      // N = planet index (0 = Earth, 1 = Mars, etc.)
      // scroll range [2N, 2N+1] is orbiting planet N
      // scroll range [2N+1, 2N+2] is traveling from N to N+1
      const scroll = currentScroll.current;
      const N = Math.floor(scroll / 2);
      const localScroll = scroll - N * 2; // Always [0, 2)
      
      const baseProjectX = N * 40;
      const nextProjectX = (N + 1) * 40;
      
      const getOrbitRadius = (planetIndex: number) => {
        // Earth (0) is small, Mars (1) is massive now
        return planetIndex === 0 ? 8 : 18;
      };
      
      const r1 = getOrbitRadius(N);
      const r2 = getOrbitRadius(N + 1);

      if (localScroll <= 1) {
        // Orbiting planet N
        const angle = localScroll * Math.PI * 2;
        idealX = baseProjectX + Math.sin(angle) * r1;
        idealZ = -2 + Math.cos(angle) * r1;
        idealY = (localScroll % 1) * 1.5;
        idealLookX = baseProjectX;
      } else {
        // Traveling to planet N+1
        const progress = localScroll - 1; // [0, 1)
        const smoothProgress = progress * progress * (3 - 2 * progress);
        idealX = THREE.MathUtils.lerp(baseProjectX, nextProjectX, smoothProgress);
        
        const baseZ = THREE.MathUtils.lerp(r1, r2, smoothProgress) - 2;
        // Reduced the zoom-out arc significantly as requested
        const arcAmount = Math.max(5, (r1 + r2) * 0.15);
        idealZ = baseZ + Math.sin(progress * Math.PI) * arcAmount;
        
        idealY = Math.sin(progress * Math.PI * 2) * 4;
        idealLookX = THREE.MathUtils.lerp(baseProjectX, nextProjectX, smoothProgress);
      }

      idealX += currentParallax.current.x;
      idealY += currentParallax.current.y;

      const targetPos = new THREE.Vector3(idealX, idealY, idealZ);
      const targetLook = new THREE.Vector3(idealLookX - currentParallax.current.x, -currentParallax.current.y, -2);
      
      camera.position.lerp(targetPos, 0.04);
      currentLookAt.current.lerp(targetLook, 0.04);
      camera.lookAt(currentLookAt.current);
    }
  });

  return null;
}

// Speed lines that appear during fast camera movement
function MovementFX({ scrollProgress }: { scrollProgress: number }) {
  const linesRef = useRef<THREE.Points>(null);
  const prevScroll = useRef(scrollProgress);
  const smoothSpeed = useRef(0);
  
  const { count, positions, velocities } = useMemo(() => {
    const count = 200;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
      velocities[i * 3] = (Math.random() - 0.5) * 0.1;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.05;
      velocities[i * 3 + 2] = -0.5 - Math.random() * 0.5;
    }
    return { count, positions, velocities };
  }, []);

  useFrame((state) => {
    if (!linesRef.current) return;
    const speed = Math.abs(scrollProgress - prevScroll.current);
    prevScroll.current = scrollProgress;
    smoothSpeed.current = THREE.MathUtils.lerp(smoothSpeed.current, speed, 0.05);
    
    const mat = linesRef.current.material as THREE.PointsMaterial;
    mat.opacity = Math.min(smoothSpeed.current * 100, 0.8);
    
    // Animate particles flying past the camera
    const positions = linesRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      // Move Z towards camera
      positions[i * 3 + 2] += 2.0 * smoothSpeed.current + 0.02;
      
      // Reset if they pass the camera
      if (positions[i * 3 + 2] > 10) {
        positions[i * 3 + 2] = -30 - Math.random() * 20;
      }
    }
    linesRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Follow camera base position
    linesRef.current.position.copy(state.camera.position);
    // Offset slightly so we fly through them
    linesRef.current.position.z -= 10;
  });

  return (
    <points ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#aaccff"
        size={0.03}
        transparent
        opacity={0}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function Scene() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeProject, setActiveProject] = useState<any>(null);

  const handleReturn = () => {
    setActiveProject(null);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, background: "#020202" }}>
      <Canvas
        camera={{ position: [0, 0, 100], fov: 60 }}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
        dpr={[1, 1]}
      >
        <color attach="background" args={["#050505"]} />
        {/* NO fog — it was eating Mars at distance 40! */}
        
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 20, 10]} intensity={2.5} color="#ffffff" />
        <directionalLight position={[-10, 5, -10]} intensity={1.2} color="#ffccaa" />
        <directionalLight position={[0, -10, 5]} intensity={0.8} color="#6688cc" />
        
        <CameraController setScrollProgress={setScrollProgress} activeProject={activeProject} />
        
        <Stars radius={120} depth={60} count={500} factor={3} saturation={0} fade speed={0.5} />
        <Environment />
        
        <Suspense fallback={null}>
          <SolarSystem scrollProgress={scrollProgress} />
        </Suspense>
        
        <ProjectScreens scrollProgress={scrollProgress} onProjectClick={setActiveProject} />
        <TeamScreens scrollProgress={scrollProgress} onMemberClick={setActiveProject} />
        <Suspense fallback={null}>
          <BlackHoleExperience scrollProgress={scrollProgress} position={[80, 0, -2]} />
        </Suspense>
        <MovementFX scrollProgress={scrollProgress} />
        
        <EffectComposer multisampling={0}>
          <Bloom 
            luminanceThreshold={0.6} 
            luminanceSmoothing={0.9} 
            intensity={0.5} 
          />
        </EffectComposer>
        
      </Canvas>
      
      {activeProject && (
        <>
          <ProjectDetailModal item={activeProject} onClose={handleReturn} />
          <button
            onClick={handleReturn}
            style={{
              position: "absolute",
              bottom: "3rem",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 100,
              padding: "0.8rem 2rem",
              background: "rgba(0,0,0,0.6)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.2)",
              fontFamily: "'Space Mono', monospace",
              cursor: "pointer",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              backdropFilter: "blur(10px)",
              borderRadius: "4px",
              fontSize: "0.7rem",
              transition: "all 0.3s ease"
            }}
            data-hover
          >
            ← BACK
          </button>
        </>
      )}
    </div>
  );
}
