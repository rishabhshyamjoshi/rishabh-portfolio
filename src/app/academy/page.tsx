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
          action.timeScale = 6.0; // Fast rotation of outer orange accretion disk
          action.play();
        }
      });
    }
  }, [actions]);

  // Fast continuous spin of the outer disk layer
  useFrame((state, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 1.8;
    }
  });

  return (
    <group ref={modelRef}>
      <primitive object={scene} scale={5} />
    </group>
  );
}

// Hollywood Sci-Fi Scroll Camera Rig: Approach -> 360° Orbit -> Opposite Side Deep Space Exit
function CinematicCameraRig() {
  const scroll = useScroll();

  useFrame((state) => {
    if (!scroll) return;
    const offset = scroll.offset; // 0.0 (top) -> 1.0 (bottom)

    let radius = 15;
    let angle = 0;
    let elevation = 2;

    if (offset < 0.3) {
      // Phase 1: Deep Space Approach (Front Side) — Camera zooms in from 65 to 15
      const p = offset / 0.3;
      const easeP = Math.pow(p, 0.8);
      radius = THREE.MathUtils.lerp(65, 15, easeP);
      elevation = THREE.MathUtils.lerp(20, 2, easeP);
      angle = THREE.MathUtils.lerp(0, Math.PI * 0.4, easeP);
    } else if (offset < 0.7) {
      // Phase 2: Close-up 360° Orbital Tour around Singularity
      const p = (offset - 0.3) / 0.4;
      radius = 15 - Math.sin(p * Math.PI) * 1.5; // Stays safely outside (>13.5)
      elevation = 2 + Math.sin(p * Math.PI) * 5;
      angle = Math.PI * 0.4 + p * (Math.PI * 2); // Full 360° orbit
    } else {
      // Phase 3: Exit Zoom-out to Deep Space on OPPOSITE SIDE
      const p = (offset - 0.7) / 0.3;
      const easeP = Math.pow(p, 1.2);
      
      const startAngle = Math.PI * 0.4 + Math.PI * 2;
      const targetAngle = startAngle + Math.PI * 0.5; // Continue heading away on opposite side
      
      radius = THREE.MathUtils.lerp(15, 65, easeP);
      elevation = THREE.MathUtils.lerp(2, -15, easeP); // Deep space exit trajectory
      angle = THREE.MathUtils.lerp(startAngle, targetAngle, easeP);
    }

    // Add mouse parallax sway for depth
    const parallaxX = state.pointer.x * 1.5;
    const parallaxY = state.pointer.y * 1.5;

    const camX = Math.sin(angle) * radius + parallaxX;
    const camZ = Math.cos(angle) * radius;
    const camY = elevation + parallaxY;

    const targetCamPos = new THREE.Vector3(camX, camY, camZ);

    state.camera.position.lerp(targetCamPos, 0.08);
    state.camera.lookAt(0, 0, 0);

    // Modulate audio depth/filter based on scroll proximity (deeper when close, fading when far)
    try {
      const proximityFactor = 1 - Math.min(1, Math.abs(radius - 15) / 50);
      AudioController.getInstance().applyMovementEffect(proximityFactor);
    } catch (e) {}
  });

  return null;
}

interface ThrownObject {
  id: number;
  type: "probe" | "asteroid" | "energy";
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  rotation: THREE.Vector3;
  rotSpeed: THREE.Vector3;
  scale: number;
  color: string;
}

interface ParticleBurst {
  id: number;
  position: THREE.Vector3;
  color: string;
  particles: { pos: THREE.Vector3; vel: THREE.Vector3; opacity: number }[];
  life: number;
}

// Throwable Objects Renderer & Physical Newtonian Gravity Simulation
function ThrowableObjectsManager({ 
  objects, 
  onSwallowed 
}: { 
  objects: ThrownObject[]; 
  onSwallowed: (id: number, pos: THREE.Vector3, color: string) => void;
}) {
  useFrame((_, delta) => {
    const GM = 28.0;
    const eventHorizonRadius = 2.2; // Distance where blackhole GLB is touched

    objects.forEach((obj) => {
      const distSq = obj.position.lengthSq();
      const dist = Math.sqrt(distSq);

      if (dist < eventHorizonRadius) {
        // Destroy object when it touches blackhole GLB!
        onSwallowed(obj.id, obj.position.clone(), obj.color);
        return;
      }

      // Newtonian Gravity: Acceleration a = -GM / r^2
      const accelMag = GM / Math.max(0.2, distSq);
      const pullDir = obj.position.clone().negate().normalize();
      const accel = pullDir.multiplyScalar(accelMag);

      // Integrate velocity and position
      obj.velocity.addScaledVector(accel, delta);
      obj.position.addScaledVector(obj.velocity, delta);

      // Rotate object in space
      obj.rotation.addScaledVector(obj.rotSpeed, delta);
    });
  });

  return (
    <>
      {objects.map((obj) => {
        const dist = obj.position.length();
        // Tidal force stretching (Spaghettification) near event horizon
        const stretchZ = Math.max(1, 4.0 / Math.max(0.8, dist));
        const compressXY = Math.max(0.2, 1 / Math.sqrt(stretchZ));

        return (
          <group
            key={obj.id}
            position={[obj.position.x, obj.position.y, obj.position.z]}
            rotation={[obj.rotation.x, obj.rotation.y, obj.rotation.z]}
            scale={[obj.scale * compressXY, obj.scale * compressXY, obj.scale * stretchZ]}
          >
            {obj.type === "probe" ? (
              <mesh>
                <octahedronGeometry args={[1]} />
                <meshStandardMaterial color={obj.color} emissive={obj.color} emissiveIntensity={1.2} wireframe />
              </mesh>
            ) : obj.type === "asteroid" ? (
              <mesh>
                <dodecahedronGeometry args={[1, 1]} />
                <meshStandardMaterial color={obj.color} roughness={0.6} metalness={0.8} />
              </mesh>
            ) : (
              <mesh>
                <sphereGeometry args={[1, 16, 16]} />
                <meshStandardMaterial color={obj.color} emissive={obj.color} emissiveIntensity={2.0} wireframe />
              </mesh>
            )}
          </group>
        );
      })}
    </>
  );
}

function BurstParticleRenderer({ bursts }: { bursts: ParticleBurst[] }) {
  useFrame((_, delta) => {
    bursts.forEach((b) => {
      b.life += delta;
      b.particles.forEach((p) => {
        p.pos.addScaledVector(p.vel, delta);
        p.opacity = Math.max(0, 1 - b.life * 2.5);
      });
    });
  });

  return (
    <>
      {bursts.filter(b => b.life < 0.5).map((b) => (
        <group key={b.id}>
          {b.particles.map((p, idx) => (
            <mesh key={idx} position={[p.pos.x, p.pos.y, p.pos.z]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshBasicMaterial color={b.color} transparent opacity={p.opacity} />
            </mesh>
          ))}
        </group>
      ))}
    </>
  );
}

export default function AcademyPage() {
  const [audioMuted, setAudioMuted] = useState(true);
  const [objects, setObjects] = useState<ThrownObject[]>([]);
  const [bursts, setBursts] = useState<ParticleBurst[]>([]);
  const nextId = useRef(1);

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

  const spawnObject = (type: "probe" | "asteroid" | "energy") => {
    const angle = Math.random() * Math.PI * 2;
    const distance = 9 + Math.random() * 4;
    
    // Spawn position on circular shell around blackhole
    const pos = new THREE.Vector3(
      Math.cos(angle) * distance,
      (Math.random() - 0.5) * 2,
      Math.sin(angle) * distance
    );

    // Initial tangential velocity for realistic orbital trajectory (v = sqrt(GM / r))
    const GM = 28.0;
    const r = pos.length();
    const vMag = Math.sqrt(GM / r) * (0.75 + Math.random() * 0.4);
    const tangent = new THREE.Vector3(-pos.z, 0, pos.x).normalize();
    const velocity = tangent.multiplyScalar(vMag);
    velocity.add(new THREE.Vector3((Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4));

    const colors = {
      probe: "#00f0ff",
      asteroid: "#ffaa44",
      energy: "#ff00ea",
    };

    const newObj: ThrownObject = {
      id: nextId.current++,
      type,
      position: pos,
      velocity,
      rotation: new THREE.Vector3(Math.random(), Math.random(), Math.random()),
      rotSpeed: new THREE.Vector3((Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3),
      scale: type === "probe" ? 0.3 : type === "asteroid" ? 0.45 : 0.35,
      color: colors[type],
    };

    setObjects((prev) => [...prev, newObj]);
    try {
      AudioController.getInstance().playLaunchProbeSound();
    } catch (e) {}
  };

  const handleSwallowed = (id: number, pos: THREE.Vector3, color: string) => {
    setObjects((prev) => prev.filter((o) => o.id !== id));
    
    // Trigger particle explosion burst upon touching blackhole
    const particles = [];
    for (let k = 0; k < 25; k++) {
      particles.push({
        pos: pos.clone(),
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 6
        ),
        opacity: 1,
      });
    }

    setBursts((prev) => [...prev, { id: Date.now() + Math.random(), position: pos, color, particles, life: 0 }]);

    try {
      AudioController.getInstance().playObjectSwallowedSound();
    } catch (e) {}
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

      <div className="fixed bottom-0 left-0 right-0 h-[8vh] bg-black/90 z-40 border-t border-white/10 flex items-center justify-between px-8 pointer-events-auto backdrop-blur-sm">
        <span className="text-[0.55rem] tracking-[0.3em] text-white/40">
          MASS: 4.1M M☉ | DILATION: ACTIVE
        </span>
        
        {/* ═══ THROWABLE OBJECTS CONTROLS ═══ */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => spawnObject("probe")}
            className="border border-cyan-500/50 bg-cyan-500/10 hover:bg-cyan-500/30 text-cyan-300 px-3.5 py-1.5 rounded-full text-[0.6rem] tracking-[0.2em] transition-all duration-300 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
          >
            + LAUNCH PROBE
          </button>
          <button
            onClick={() => spawnObject("asteroid")}
            className="border border-amber-500/50 bg-amber-500/10 hover:bg-amber-500/30 text-amber-300 px-3.5 py-1.5 rounded-full text-[0.6rem] tracking-[0.2em] transition-all duration-300 shadow-[0_0_10px_rgba(255,170,0,0.2)]"
          >
            + THROW ASTEROID
          </button>
          <button
            onClick={() => spawnObject("energy")}
            className="border border-pink-500/50 bg-pink-500/10 hover:bg-pink-500/30 text-pink-300 px-3.5 py-1.5 rounded-full text-[0.6rem] tracking-[0.2em] transition-all duration-300 shadow-[0_0_10px_rgba(255,0,234,0.2)]"
          >
            + THROW ENERGY
          </button>
        </div>
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
              <ThrowableObjectsManager objects={objects} onSwallowed={handleSwallowed} />
              <BurstParticleRenderer bursts={bursts} />
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

