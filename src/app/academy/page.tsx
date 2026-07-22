"use client";

import { OrbitControls, useGLTF, useProgress, useAnimations, ScrollControls, useScroll, Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise } from "@react-three/postprocessing";
import { Vector2 } from "three";
import Link from "next/link";
import CustomCursor from "../components/CustomCursor";
import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import * as THREE from "three";
import { AudioController } from "../utils/AudioController";

function LoaderOverlay() {
  const { progress, active } = useProgress();
  
  if (!active && progress === 100) return null;
  
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black text-white font-[var(--font-mono)] pointer-events-none">
      <div className="text-[0.65rem] tracking-[0.4em] mb-4 text-cyan-400 animate-pulse">
        ESTABLISHING UPLINK TO SINGULARITY
      </div>
      <div className="w-64 h-[1px] bg-white/10 relative overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-cyan-400 transition-all duration-300 shadow-[0_0_10px_rgba(0,240,255,0.8)]" 
          style={{ width: `${progress}%` }} 
        />
      </div>
      <div className="mt-4 text-[0.55rem] tracking-[0.2em] text-white/40">
        DOWNLOADING MASS ({progress.toFixed(0)}%)
      </div>
    </div>
  );
}

function RawBlackHoleModel() {
  const { scene, animations } = useGLTF("/blackhole.glb");
  const { actions } = useAnimations(animations, scene);
  const modelRef = useRef<THREE.Group>(null);

  // Enhance model materials for high metallic gloss & specular shine
  useMemo(() => {
    scene.traverse((child: any) => {
      if (child.isMesh && child.material) {
        child.material = child.material.clone();
        child.material.metalness = 0.95;
        child.material.roughness = 0.08;
        child.material.needsUpdate = true;
      }
    });
  }, [scene]);

  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      Object.values(actions).forEach((action) => {
        if (action) {
          action.timeScale = 2.5; // Speed up baked animation so relative velocity is never zero
          action.play();
        }
      });
    }
  }, [actions]);

  // Continuous extra spin so relative velocity is fast and active
  useFrame((state, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.6;
    }
  });

  return (
    <group ref={modelRef}>
      <primitive object={scene} scale={5} />
    </group>
  );
}

// Ambient Space Dust Particles to create realistic interstellar surrounding
function SpaceDust() {
  const count = 1200;
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const color1 = new THREE.Color("#ff9900");
    const color2 = new THREE.Color("#00d4ff");

    for (let i = 0; i < count; i++) {
      const radius = 15 + Math.random() * 60;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      pos[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      pos[i * 3 + 1] = radius * Math.sin(phi);
      pos[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);

      const mixCol = Math.random() > 0.5 ? color1 : color2;
      col[i * 3] = mixCol.r;
      col[i * 3 + 1] = mixCol.g;
      col[i * 3 + 2] = mixCol.b;
    }
    return { positions: pos, colors: col };
  }, []);

  const pointsRef = useRef<THREE.Points>(null);
  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        vertexColors
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Hollywood Sci-Fi Elliptical Orbit & Interactive 360 Mouse Drag Camera Rig
function CinematicCameraRig() {
  const scroll = useScroll();
  const isDragging = useRef(false);
  const previousMouse = useRef({ x: 0, y: 0 });
  const dragAngles = useRef({ x: 0, y: 0 });

  // Handle Mouse Drag for 360 User Control
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      // Don't drag if clicking UI buttons/links
      if ((e.target as HTMLElement)?.closest("a, button")) return;
      isDragging.current = true;
      previousMouse.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - previousMouse.current.x;
      const deltaY = e.clientY - previousMouse.current.y;

      dragAngles.current.x += deltaX * 0.005;
      dragAngles.current.y = THREE.MathUtils.clamp(dragAngles.current.y + deltaY * 0.005, -Math.PI / 3, Math.PI / 3);

      previousMouse.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useFrame((state) => {
    if (!scroll) return;
    const offset = scroll.offset; // 0.0 (top) -> 1.0 (bottom)

    // Elliptical Orbit Parametric Equations: Semi-major axis = 24, Semi-minor axis = 14
    const a = 24;
    const b = 14;
    
    // Base scroll orbital angle (0 to 2PI)
    const baseAngle = offset * Math.PI * 2;
    
    // Add user's interactive 360 mouse drag offset
    const totalAngle = baseAngle + dragAngles.current.x;

    // Calculate Elliptical Coordinates
    let rawX = Math.sin(totalAngle) * a;
    let rawZ = Math.cos(totalAngle) * b;
    let rawY = Math.sin(offset * Math.PI * 2) * 5 + dragAngles.current.y * 12;

    // Distance Safety Check: Ensure camera distance is ALWAYS >= 13.5 (Never clips inside blackhole)
    const currentPos = new THREE.Vector3(rawX, rawY, rawZ);
    const dist = currentPos.length();
    const minDistance = 13.5;
    
    if (dist < minDistance) {
      currentPos.normalize().multiplyScalar(minDistance);
    }

    // Mouse parallax for subtle depth
    const parallaxX = state.pointer.x * 1.5;
    const parallaxY = state.pointer.y * 1.5;

    const targetCamPos = new THREE.Vector3(currentPos.x + parallaxX, currentPos.y + parallaxY, currentPos.z);

    state.camera.position.lerp(targetCamPos, 0.08);
    state.camera.lookAt(0, 0, 0);

    // Modulate audio depth/filter based on scroll proximity
    try {
      AudioController.getInstance().applyMovementEffect(offset);
    } catch (e) {}
  });

  return null;
}

export default function AcademyPage() {
  const [audioMuted, setAudioMuted] = useState(true);

  useEffect(() => {
    const initAudio = async () => {
      try {
        const audio = AudioController.getInstance();
        await audio.init();
        setAudioMuted(audio.isMuted);
      } catch (e) {}
    };
    initAudio();
  }, []);

  const toggleAudio = async () => {
    const muted = await AudioController.getInstance().toggleMute();
    setAudioMuted(muted);
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden font-[var(--font-mono)] select-none">
      <CustomCursor />
      <LoaderOverlay />

      {/* ═══ CINEMATIC WIDESCREEN LETTERBOX ═══ */}
      <div className="fixed top-0 left-0 right-0 h-[7vh] bg-black/90 z-40 border-b border-white/10 flex items-center justify-between px-8 pointer-events-auto backdrop-blur-sm">
        <Link
          href="/"
          className="flex items-center gap-3 border border-white/30 bg-white/5 hover:bg-white/15 px-4 py-1.5 rounded-full text-[0.6rem] tracking-[0.25em] text-white transition-all duration-300"
        >
          <span>&larr;</span> RETURN TO CORE
        </Link>
        <div className="flex items-center gap-6 text-[0.55rem] tracking-[0.3em] text-white/60">
          <span>ELLIPTICAL ORBIT // 360° INTERACTIVE</span>
          <button
            onClick={toggleAudio}
            className="flex items-center gap-2 border border-cyan-500/40 px-3 py-1 rounded-full text-cyan-400 hover:bg-cyan-500/20 transition-all duration-300"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${audioMuted ? "bg-red-500" : "bg-cyan-400 animate-pulse"}`} />
            AUDIO: {audioMuted ? "MUTED" : "ACTIVE"}
          </button>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-[7vh] bg-black/90 z-40 border-t border-white/10 flex items-center justify-between px-8 pointer-events-none backdrop-blur-sm">
        <span className="text-[0.55rem] tracking-[0.3em] text-white/40">
          MASS: 4.1M M☉ | DILATION: ACTIVE
        </span>
        <span className="text-[0.55rem] tracking-[0.3em] text-cyan-400/80 animate-pulse">
          SCROLL TO ORBIT | CLICK & DRAG MOUSE FOR 360° MANUAL CONTROL
        </span>
      </div>

      {/* ═══ 3D CANVAS FULLSCREEN ═══ */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 10, 30], fov: 45 }}
          gl={{ antialias: true }}
        >
          {/* Real Space Surrounding Environment */}
          <Stars radius={120} depth={60} count={4000} factor={4} saturation={0} fade speed={1.2} />
          <SpaceDust />

          {/* Realistic High-Contrast Lighting Rig */}
          <ambientLight intensity={0.9} />
          <directionalLight position={[20, 25, 15]} intensity={4.0} color="#ffffff" />
          <pointLight position={[-15, -10, -15]} intensity={6.0} color="#ff8800" />
          <pointLight position={[15, 10, -15]} intensity={5.0} color="#00d4ff" />
          <pointLight position={[0, 15, 0]} intensity={3.0} color="#ffffff" />
          
          <Suspense fallback={null}>
            <ScrollControls pages={4} damping={0.25}>
              <RawBlackHoleModel />
              <CinematicCameraRig />
            </ScrollControls>
          </Suspense>

          {/* Movie Post-Processing */}
          <EffectComposer>
            <Bloom intensity={1.5} luminanceThreshold={0.18} luminanceSmoothing={0.9} />
            <ChromaticAberration offset={new Vector2(0.002, 0.002)} />
            <Vignette eskil={false} offset={0.15} darkness={1.15} />
            <Noise opacity={0.025} />
          </EffectComposer>
        </Canvas>
      </div>
    </div>
  );
}

useGLTF.preload("/blackhole.glb");

