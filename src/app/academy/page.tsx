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
          action.timeScale = 2.5; // Speed up baked animation 2.5x so relative velocity is never zero
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

// Hollywood Sci-Fi Centered Infinity-Loop (Figure-8) Camera Rig
function CinematicCameraRig() {
  const scroll = useScroll();

  useFrame((state) => {
    if (!scroll) return;
    const offset = scroll.offset; // 0.0 (top) -> 1.0 (bottom)

    let camX = 0;
    let camY = 18;
    let camZ = 60;

    if (offset < 0.25) {
      // Approach Phase: Deep space zoom-in towards the blackhole origin
      const p = offset / 0.25;
      const easeP = Math.pow(p, 0.7);
      camZ = THREE.MathUtils.lerp(60, 16, easeP);
      camY = THREE.MathUtils.lerp(18, 0, easeP);
      camX = 0;
    } else {
      // Centered Infinity Loop (Figure-8) Orbit Phase around (0,0,0)
      // t goes 0 -> 2PI over the remaining 75% scroll
      const p = (offset - 0.25) / 0.75;
      const t = p * Math.PI * 2;

      // Spherical Figure-8 parametric orbit:
      // x = R * sin(t), z = R * cos(t), y = H * sin(2t)
      // Radius oscillates slightly (14 to 18) to form a true 3D lemniscate loop around origin
      const R = 16 + Math.cos(2 * t) * 2;
      const H = 6.5;

      camX = Math.sin(t) * R;
      camZ = Math.cos(t) * R;
      camY = Math.sin(2 * t) * H;
    }

    // Add subtle mouse parallax sway for depth
    const parallaxX = state.pointer.x * 1.5;
    const parallaxY = state.pointer.y * 1.5;

    const targetCamPos = new THREE.Vector3(camX + parallaxX, camY + parallaxY, camZ);

    state.camera.position.lerp(targetCamPos, 0.08);
    state.camera.lookAt(0, 0, 0); // Always stay locked onto the Black Hole Singularity at (0,0,0)

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
          <span>EVENT HORIZON // 360° TOUR</span>
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
          SCROLL MOUSE DOWN TO OPERATE 360° CINEMATIC ORBIT
        </span>
      </div>

      {/* ═══ 3D CANVAS FULLSCREEN ═══ */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 30, 90], fov: 45 }}
          gl={{ antialias: true }}
        >
          {/* Deep Space Background Stars */}
          <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

          {/* Dramatic Lighting Rig */}
          <ambientLight intensity={0.8} />
          <directionalLight position={[15, 20, 15]} intensity={3.5} color="#ffffff" />
          <pointLight position={[-12, -8, -12]} intensity={5} color="#ffaa00" />
          <pointLight position={[12, 8, -12]} intensity={4} color="#00e1ff" />
          
          <Suspense fallback={null}>
            <ScrollControls pages={4} damping={0.25}>
              <RawBlackHoleModel />
              <CinematicCameraRig />
            </ScrollControls>
          </Suspense>

          {/* Movie Post-Processing */}
          <EffectComposer>
            <Bloom intensity={1.4} luminanceThreshold={0.2} luminanceSmoothing={0.9} />
            <ChromaticAberration offset={new Vector2(0.002, 0.002)} />
            <Vignette eskil={false} offset={0.15} darkness={1.1} />
            <Noise opacity={0.025} />
          </EffectComposer>
        </Canvas>
      </div>
    </div>
  );
}

useGLTF.preload("/blackhole.glb");
