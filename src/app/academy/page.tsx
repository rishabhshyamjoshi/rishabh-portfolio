"use client";

import { OrbitControls, useGLTF, useProgress, useAnimations, ScrollControls, useScroll, Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette, Noise } from "@react-three/postprocessing";
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

// Center Relativistic Light Beam (Polar Jet through singularity core)
function PolarLightBeam() {
  return (
    <group>
      {/* Top Beam */}
      <mesh position={[0, 12, 0]}>
        <cylinderGeometry args={[0.08, 0.45, 24, 32, 1, true]} />
        <meshBasicMaterial
          color="#00f0ff"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Bottom Beam */}
      <mesh position={[0, -12, 0]} rotation={[Math.PI, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.45, 24, 32, 1, true]} />
        <meshBasicMaterial
          color="#ffaa00"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function RawBlackHoleModel() {
  const { scene, animations } = useGLTF("/blackhole.glb");
  const { actions } = useAnimations(animations, scene);
  const groupRef = useRef<THREE.Group>(null);

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
      const firstActionKey = Object.keys(actions)[0];
      actions[firstActionKey]?.play();
    }
  }, [actions]);

  // Frame loop for Rapid Relativistic Spin & Mouse Gravitational Tilt
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Fast relativistic spinning (outer accretion disk velocity)
    groupRef.current.rotation.y += delta * 3.5;

    // Gravitational mouse attraction effect (tilts blackhole towards cursor)
    const targetTiltX = state.pointer.y * 0.35;
    const targetTiltZ = -state.pointer.x * 0.35;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetTiltX, 0.08);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetTiltZ, 0.08);
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={5} />
      <PolarLightBeam />
    </group>
  );
}

// Hollywood Sci-Fi Figure-8 (Lemniscate) Infinity Scroll Camera Rig
function InfinityCameraRig() {
  const scroll = useScroll();

  useFrame((state) => {
    if (!scroll) return;
    const offset = scroll.offset; // 0.0 -> 1.0

    // Parameter t maps scroll offset (0 to 1) to full 2*PI circle loop
    const t = offset * Math.PI * 2;

    // Bernoulli Lemniscate (Figure-8 / Infinity symbol \infty) math
    // Starts at X=18, Z=0, and loops around in an 8 shape back to X=18, Z=0!
    const A = 18; // Size radius of figure-8
    const denom = 1 + Math.sin(t) * Math.sin(t);

    const fig8X = (A * Math.cos(t)) / denom;
    const fig8Z = (A * Math.sin(t) * Math.cos(t)) / denom;
    const fig8Y = Math.sin(t * 2) * 4 + 2; // Cinematic vertical elevation curve

    // Mouse parallax for subtle depth
    const parallaxX = state.pointer.x * 1.2;
    const parallaxY = state.pointer.y * 1.2;

    const targetCamPos = new THREE.Vector3(fig8X + parallaxX, fig8Y + parallaxY, fig8Z);

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
          <span>EVENT HORIZON // FIGURE-8 TOUR</span>
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
          SCROLL MOUSE DOWN TO OPERATE FIGURE-8 (∞) CINEMATIC ORBIT
        </span>
      </div>

      {/* ═══ 3D CANVAS FULLSCREEN ═══ */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [18, 2, 0], fov: 45 }}
          gl={{ antialias: true }}
        >
          {/* Crisp Deep Space Background Stars (No RGB / No Blur) */}
          <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

          {/* Dramatic Lighting Rig */}
          <ambientLight intensity={0.9} />
          <directionalLight position={[15, 20, 15]} intensity={3.5} color="#ffffff" />
          <pointLight position={[-12, -8, -12]} intensity={5} color="#ffaa00" />
          <pointLight position={[12, 8, -12]} intensity={4} color="#00e1ff" />
          
          <Suspense fallback={null}>
            <ScrollControls pages={4} damping={0.25}>
              <RawBlackHoleModel />
              <InfinityCameraRig />
            </ScrollControls>
          </Suspense>

          {/* Movie Post-Processing (Crisp Stars preserved, no Chromatic Aberration) */}
          <EffectComposer>
            <Bloom intensity={1.5} luminanceThreshold={0.2} luminanceSmoothing={0.9} />
            <Vignette eskil={false} offset={0.15} darkness={1.1} />
            <Noise opacity={0.02} />
          </EffectComposer>
        </Canvas>
      </div>
    </div>
  );
}

useGLTF.preload("/blackhole.glb");

