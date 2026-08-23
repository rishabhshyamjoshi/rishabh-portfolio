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
import FooterScreen from "./FooterScreen";
import ProjectDetailModal from "./ProjectDetailModal";
import { AudioController } from "../utils/AudioController";
import AudioReactiveStars from "./AudioReactiveStars";

function CameraController({ setScrollProgress, activeProject }: { setScrollProgress: (v: number) => void, activeProject: any }) {
  const { camera, pointer } = useThree();
  const targetScroll = useRef(0);
  const currentScroll = useRef(0);
  
  const targetParallax = useRef(new THREE.Vector2(0, 0));
  const currentParallax = useRef(new THREE.Vector2(0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, -2));
  const smoothPan = useRef(0);

  // Drag-to-rotate state
  const isDragging = useRef(false);
  const dragStart = useRef(0);
  const targetDragAngle = useRef(0);
  const currentDragAngle = useRef(0);

  useEffect(() => {
    let lastTouchY = 0;

    const handleWheel = (e: WheelEvent) => {
      if (activeProject) return; 
      targetScroll.current += e.deltaY * 0.001;
      if (targetScroll.current > 5) targetScroll.current = 5;
      if (targetScroll.current < 0) targetScroll.current = 0;
    };
    
    const handleTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0].clientY;
      isDragging.current = true;
      dragStart.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!activeProject) {
        const currentY = e.touches[0].clientY;
        const deltaY = lastTouchY - currentY;
        targetScroll.current += deltaY * 0.005; // Slightly faster multiplier for touch dragging
        if (targetScroll.current > 5) targetScroll.current = 5;
        if (targetScroll.current < 0) targetScroll.current = 0;
        lastTouchY = currentY;
      }
      if (isDragging.current) {
        const deltaX = e.touches[0].clientX - dragStart.current;
        targetDragAngle.current -= deltaX * 0.002;
        dragStart.current = e.touches[0].clientX;
      }
    };

    const handleTouchEnd = () => {
      isDragging.current = false;
    };

    const handlePointerDown = (e: PointerEvent) => {
      isDragging.current = true;
      dragStart.current = e.clientX;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (isDragging.current) {
        const deltaX = e.clientX - dragStart.current;
        targetDragAngle.current -= deltaX * 0.002;
        dragStart.current = e.clientX;
      }
    };

    const handlePointerUp = () => {
      isDragging.current = false;
    };

    const handleNav = (e: any) => {
      targetScroll.current = e.detail;
    };
    
    window.addEventListener("wheel", handleWheel);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
    window.addEventListener("navTo", handleNav as any);
    
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      window.removeEventListener("navTo", handleNav as any);
    };
  }, [activeProject]);

  const rotateAround = (cx: number, cz: number, x: number, z: number, angle: number) => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const nx = (cos * (x - cx)) - (sin * (z - cz)) + cx;
    const nz = (sin * (x - cx)) + (cos * (z - cz)) + cz;
    return { x: nx, z: nz };
  };

  useFrame((state) => {
    const rawScrollDelta = targetScroll.current - currentScroll.current;
    const scrollDelta = Math.abs(rawScrollDelta);
    currentScroll.current += rawScrollDelta * 0.02;
    setScrollProgress(currentScroll.current);

    // Smooth drag angle interpolation
    currentDragAngle.current = THREE.MathUtils.lerp(currentDragAngle.current, targetDragAngle.current, 0.05);

    const aspect = window.innerWidth / window.innerHeight;
    const baseFov = aspect < 1 ? 100 : 75; 
    const targetFov = baseFov + (scrollDelta * 54); 
    
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, 0.05);
      camera.updateProjectionMatrix();
    }

    targetParallax.current.set(pointer.x * 0.4, pointer.y * 0.3);
    currentParallax.current.lerp(targetParallax.current, 0.025);

    let muffleIntensity = 0;
    if (activeProject) {
      muffleIntensity = 0.85;
    } else {
      muffleIntensity = Math.min(scrollDelta * 7.5, 0.75);
      const targetPan = Math.max(-0.75, Math.min(0.75, rawScrollDelta * 3.75)); 
      smoothPan.current = THREE.MathUtils.lerp(smoothPan.current, targetPan, 0.05);
    }

    try { 
      const audio = AudioController.getInstance();
      audio.applyMovementEffect(muffleIntensity); 
      audio.setPan(smoothPan.current);
    } catch(err) {}

    if (activeProject) {
      const isMars = activeProject.name !== undefined;
      const baseProjectX = isMars ? 100 : 0;
      const t = activeProject.animationTime; 
      
      let localScrollProgress = 0;
      if (isMars) {
        localScrollProgress = currentScroll.current > 2 ? Math.min(1, currentScroll.current - 2) : 0;
      } else {
        localScrollProgress = Math.min(1, currentScroll.current);
      }

      const radius = Math.pow(localScrollProgress, 1.5) * 15;
      let px = baseProjectX + Math.cos(activeProject.angle + t * 0.2) * (radius - 2); 
      let pz = Math.sin(activeProject.angle + t * 0.2) * (radius - 2) - 2;
      const py = Math.sin(t * 1 + (isMars ? parseInt(activeProject.id.split("-")[1]) : activeProject.id)) * 0.5;

      const targetLook = new THREE.Vector3(
        baseProjectX + Math.cos(activeProject.angle + t * 0.2) * radius,
        py,
        Math.sin(activeProject.angle + t * 0.2) * radius - 2
      );
      
      // Apply 360 manual rotation
      const rotatedCam = rotateAround(targetLook.x, targetLook.z, px, pz, currentDragAngle.current);
      px = rotatedCam.x;
      pz = rotatedCam.z;

      camera.position.lerp(new THREE.Vector3(px, py, pz), 0.05);
      currentLookAt.current.lerp(targetLook, 0.1); 
      camera.lookAt(currentLookAt.current);
    } else {
      let idealX = 0;
      let idealY = 0;
      let idealZ = 0;
      let idealLookX = 0;
      
      const scroll = currentScroll.current;
      const N = Math.floor(scroll / 2);
      const localScroll = scroll - N * 2; 
      
      const baseProjectX = N * 100;
      const nextProjectX = (N + 1) * 100;
      
      const getOrbitRadius = (planetIndex: number) => {
        if (planetIndex === 0) return 8;
        if (planetIndex === 1) return 18;
        return 12;
      };
      
      const r1 = getOrbitRadius(N);
      const r2 = getOrbitRadius(N + 1);

      if (localScroll <= 1) {
        const angle = localScroll * Math.PI * 2;
        idealX = baseProjectX + Math.sin(angle) * r1;
        idealZ = -2 + Math.cos(angle) * r1;
        idealY = (localScroll % 1) * 1.5;
        idealLookX = baseProjectX;
      } else {
        const progress = localScroll - 1;
        const smoothProgress = progress * progress * (3 - 2 * progress);
        idealX = THREE.MathUtils.lerp(baseProjectX, nextProjectX, smoothProgress);
        
        const baseZ = THREE.MathUtils.lerp(r1, r2, smoothProgress) - 2;
        const arcAmount = Math.max(5, (r1 + r2) * 0.15);
        idealZ = baseZ + Math.sin(progress * Math.PI) * arcAmount;
        
        idealY = Math.sin(progress * Math.PI * 2) * 4;
        idealLookX = THREE.MathUtils.lerp(baseProjectX, nextProjectX, smoothProgress);
      }

      idealX += currentParallax.current.x;
      idealY += currentParallax.current.y;
      
      let targetLook = new THREE.Vector3(idealLookX - currentParallax.current.x, -currentParallax.current.y, -2);
      
      // Apply 360 manual rotation
      const rotatedCam = rotateAround(targetLook.x, targetLook.z, idealX, idealZ, currentDragAngle.current);
      idealX = rotatedCam.x;
      idealZ = rotatedCam.z;

      const targetPos = new THREE.Vector3(idealX, idealY, idealZ);
      
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
        
        <AudioReactiveStars count={1500} />
        <Environment />
        
        <Suspense fallback={null}>
          <SolarSystem scrollProgress={scrollProgress} />
        </Suspense>
        
        <ProjectScreens scrollProgress={scrollProgress} onProjectClick={setActiveProject} />
        <TeamScreens scrollProgress={scrollProgress} onMemberClick={setActiveProject} />
        <FooterScreen scrollProgress={scrollProgress} />
        <MovementFX scrollProgress={scrollProgress} />
        
        <EffectComposer multisampling={0}>
          <Bloom 
            luminanceThreshold={0.5} 
            luminanceSmoothing={0.9} 
            intensity={0.6} 
          />
          <ChromaticAberration 
            blendFunction={BlendFunction.NORMAL}
            offset={new THREE.Vector2(0.0005, 0.0005)} 
            radialModulation={false}
            modulationOffset={0}
          />
          <Noise 
            premultiply 
            blendFunction={BlendFunction.ADD} 
            opacity={0.015} 
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
