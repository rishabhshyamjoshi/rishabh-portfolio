"use client";

import { useRef, useMemo, useState, useCallback, useImperativeHandle, forwardRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGLTF, Float, useScroll, Html } from "@react-three/drei";
import { AudioController } from "../utils/AudioController";

interface ThrownObject {
  id: number;
  type: "probe" | "asteroid" | "energy";
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  rotation: THREE.Vector3;
  rotSpeed: THREE.Vector3;
  scale: number;
  color: string;
  life: number;
}

interface ParticleBurst {
  id: number;
  position: THREE.Vector3;
  color: string;
  particles: { pos: THREE.Vector3; vel: THREE.Vector3; opacity: number }[];
  life: number;
}

export interface BlackHoleControls {
  spawnObject: (type: "probe" | "asteroid" | "energy") => void;
  triggerGravWave: () => void;
}

interface BlackHoleExperienceProps {
  scrollProgress?: number;
  position?: [number, number, number];
  onSwallowed?: (count: number) => void;
  onWave?: () => void;
  activeModule?: string | null;
}

// Newtonian Gravity Constant (Scaled for the simulation)
const GM = 25.0;

const BlackHoleExperience = forwardRef<BlackHoleControls, BlackHoleExperienceProps>(
  ({ position = [0, 0, 0], onSwallowed, onWave, activeModule }, ref) => {
    const groupRef = useRef<THREE.Group>(null);
    const modelRef = useRef<THREE.Group>(null);

    const [gravWaveActive, setGravWaveActive] = useState(false);
    const [waveRadius, setWaveRadius] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Using the user's latest uploaded blackhole.glb
    const { scene, animations } = useGLTF("/blackhole.glb");

    // Clone GLTF scene & auto-scale to perfect 3.2 Three.js units via Box3
    const clonedScene = useMemo(() => {
      const clone = scene.clone(true);
      
      const box = new THREE.Box3().setFromObject(clone);
      const size = new THREE.Vector3();
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      // Target scale keeps the model at a consistent visible size regardless of the source file
      const targetScale = 3.2 / maxDim;
      clone.scale.setScalar(targetScale);

      clone.traverse((child: any) => {
        if (child.isMesh && child.material) {
          child.material = child.material.clone();
          child.material.side = THREE.DoubleSide;
          child.material.needsUpdate = true;
        }
      });
      return clone;
    }, [scene]);

    // Object Spawner & Physics State
    const objectsRef = useRef<ThrownObject[]>([]);
    const burstsRef = useRef<ParticleBurst[]>([]);
    const nextId = useRef(1);

    const scroll = useScroll();

    // Spawn Throwable Object with Real Orbital Mechanics
    const spawnObject = useCallback(
      (type: "probe" | "asteroid" | "energy") => {
        const angle = Math.random() * Math.PI * 2;
        const distance = 8 + Math.random() * 4;
        
        // Initial position (random point on a circle)
        const pos = new THREE.Vector3(
          Math.cos(angle) * distance,
          (Math.random() - 0.5) * 1.5,
          Math.sin(angle) * distance
        );

        // To create a stable circular orbit, velocity must be tangential to position
        // v = sqrt(GM / r)
        const r = pos.length();
        const vMag = Math.sqrt(GM / r);
        
        // Tangent vector in XZ plane
        const tangent = new THREE.Vector3(-pos.z, 0, pos.x).normalize();
        
        // Add some random variation (0.7 to 1.1) to create elliptical orbits instead of perfect circles
        const velocityModifier = 0.7 + Math.random() * 0.4;
        const velocity = tangent.multiplyScalar(vMag * velocityModifier);

        // Add a slight inward/outward component to make trajectories more chaotic
        velocity.add(new THREE.Vector3((Math.random() - 0.5)*0.5, (Math.random() - 0.5)*0.5, (Math.random() - 0.5)*0.5));

        const colors = {
          probe: "#00f0ff",
          asteroid: "#ffaa44",
          energy: "#ff00ea",
        };

        const newObj: ThrownObject = {
          id: nextId.current++,
          type,
          position: pos,
          velocity: velocity,
          rotation: new THREE.Vector3(Math.random(), Math.random(), Math.random()),
          rotSpeed: new THREE.Vector3((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2),
          scale: type === "probe" ? 0.25 : type === "asteroid" ? 0.4 : 0.3,
          color: colors[type],
          life: 0,
        };

        objectsRef.current.push(newObj);
        try {
          AudioController.getInstance().playLaunchProbeSound();
        } catch (e) {}
      },
      []
    );

    // Trigger Gravitational Wave
    const triggerGravWave = useCallback(() => {
      setGravWaveActive(true);
      setWaveRadius(0);
      if (onWave) onWave();
      try {
        AudioController.getInstance().playObjectSwallowedSound();
      } catch (e) {}
    }, [onWave]);

    // Expose control methods to parent via ref
    useImperativeHandle(ref, () => ({
      spawnObject,
      triggerGravWave,
    }));

    // Frame Physics Loop
    useFrame((state, delta) => {
      if (!groupRef.current) return;
      const t = state.clock.getElapsedTime();

      // Cinematic Camera Parallax, Zoom & 360 Scroll Orbit
      const targetZoom = activeModule ? 5 : 12;
      const scrollOffset = scroll ? scroll.offset : 0;
      
      // Calculate 360 Orbit based on scroll position (0 to 1 -> 0 to 2PI)
      const orbitAngle = scrollOffset * Math.PI * 2;
      
      // Add subtle mouse parallax on top of the orbit
      const parallaxX = (state.pointer.x * 2);
      const parallaxY = (state.pointer.y * 2);
      
      const camX = Math.sin(orbitAngle) * targetZoom + parallaxX;
      const camZ = Math.cos(orbitAngle) * targetZoom;
      // Slight vertical arc over the black hole during scroll
      const camY = Math.sin(scrollOffset * Math.PI) * 4 + parallaxY;

      const targetCamPos = new THREE.Vector3(camX, camY, camZ);
      
      // Black Hole Pull / Shake Effect
      if (isHovered) {
        // Shake intensity
        const shake = 0.05;
        targetCamPos.x += (Math.random() - 0.5) * shake;
        targetCamPos.y += (Math.random() - 0.5) * shake;
        targetCamPos.z += (Math.random() - 0.5) * shake;
        
        // FOV Warp
        if (state.camera instanceof THREE.PerspectiveCamera) {
          state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, 65, 0.05);
          state.camera.updateProjectionMatrix();
        }
      } else {
        if (state.camera instanceof THREE.PerspectiveCamera) {
          state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, 50, 0.05);
          state.camera.updateProjectionMatrix();
        }
      }

      state.camera.position.lerp(targetCamPos, 0.05);
      state.camera.lookAt(0, 0, 0);

      // Model rotation
      if (modelRef.current) {
        modelRef.current.rotation.y = t * 0.15;
        modelRef.current.rotation.z = Math.sin(t * 0.2) * 0.05;
      }

      // Gravitational Wave Expansion
      if (gravWaveActive) {
        setWaveRadius((prev) => {
          if (prev > 20) {
            setGravWaveActive(false);
            return 0;
          }
          return prev + delta * 15;
        });
      }

      // True Newtonian Physics Simulation for Objects
      const currentObjs = objectsRef.current;
      const remainingObjs: ThrownObject[] = [];

      for (let i = 0; i < currentObjs.length; i++) {
        const obj = currentObjs[i];
        obj.life += delta;

        const distSq = obj.position.lengthSq();
        const dist = Math.sqrt(distSq);

        // a = -GM / r^2
        // We use Math.max(0.1, distSq) to prevent infinite acceleration at the center
        const accelerationMag = GM / Math.max(0.1, distSq);
        const pullDir = obj.position.clone().negate().normalize();
        
        const acceleration = pullDir.multiplyScalar(accelerationMag);

        // Update velocity (v = v + at)
        obj.velocity.addScaledVector(acceleration, delta);
        
        // Update position (p = p + vt)
        obj.position.addScaledVector(obj.velocity, delta);
        
        // Update rotation
        obj.rotation.addScaledVector(obj.rotSpeed, delta);

        const eventHorizonRadius = 1.0;
        if (dist < eventHorizonRadius) {
          // Object crossed the event horizon
          if (onSwallowed) onSwallowed(1);
          try {
            AudioController.getInstance().playObjectSwallowedSound();
          } catch (e) {}

          const burstParticles = [];
          for (let k = 0; k < 20; k++) {
            burstParticles.push({
              pos: obj.position.clone(),
              vel: new THREE.Vector3(
                (Math.random() - 0.5) * 5,
                (Math.random() - 0.5) * 5,
                (Math.random() - 0.5) * 5
              ),
              opacity: 1,
            });
          }
          burstsRef.current.push({
            id: Date.now() + Math.random(),
            position: obj.position.clone(),
            color: obj.color,
            particles: burstParticles,
            life: 0,
          });
        } else {
          remainingObjs.push(obj);
        }
      }

      objectsRef.current = remainingObjs;

      // Burst particle simulation
      burstsRef.current = burstsRef.current
        .map((b) => {
          b.life += delta;
          b.particles.forEach((p) => {
            p.pos.addScaledVector(p.vel, delta);
            p.opacity = Math.max(0, 1 - b.life * 2);
          });
          return b;
        })
        .filter((b) => b.life < 0.5);
    });

    return (
      <group position={position} ref={groupRef}>
        {/* ═══ 3D BLACK HOLE GLTF MODEL ═══ */}
        <Float speed={1.0} rotationIntensity={0.1} floatIntensity={0.1}>
          <group
            ref={modelRef}
            onClick={(e) => {
              e.stopPropagation();
              spawnObject("probe");
            }}
            onPointerOver={() => {
              document.body.style.cursor = "crosshair";
              setIsHovered(true);
            }}
            onPointerOut={() => {
              document.body.style.cursor = "auto";
              setIsHovered(false);
            }}
          >
            {/* Auto-scaled via Box3 bounding box (User's blackhole.glb) */}
            <primitive object={clonedScene} />

            {/* Intense Fiery Ambient Lights to illuminate the model */}
            <pointLight intensity={3.0} color="#ff8800" distance={8} decay={2} />
            <pointLight intensity={1.5} color="#ff3300" distance={12} decay={2} />
          </group>
        </Float>

        {/* Gravitational Wave Pulse */}
        {gravWaveActive && (
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[Math.max(0.1, waveRadius - 0.4), waveRadius, 64]} />
            <meshBasicMaterial
              color="#ffaa00"
              side={THREE.DoubleSide}
              transparent
              opacity={Math.max(0, 1 - waveRadius / 20)}
            />
          </mesh>
        )}

        {/* Objects & Bursts */}
        <ThrownObjectsRenderer objects={objectsRef.current} />
        <BurstRenderer bursts={burstsRef.current} />

        {/* ═══ INTERACTIVE HUD (Spawn Buttons) ═══ */}
        {scroll && scroll.offset < 0.2 && (
          <Html center style={{ position: "absolute", bottom: "-40vh", width: "100vw", display: "flex", justifyContent: "center", gap: "20px", pointerEvents: "none" }}>
            <div style={{ display: "flex", gap: "15px", pointerEvents: "auto", fontFamily: "var(--font-orbitron)" }}>
              <button 
                onClick={() => spawnObject("probe")}
                className="px-4 py-2 bg-black/50 border border-cyan-500/50 text-cyan-400 text-xs tracking-widest hover:bg-cyan-500/20 transition-all rounded"
                style={{ backdropFilter: "blur(4px)" }}
              >
                + LAUNCH PROBE
              </button>
              <button 
                onClick={() => spawnObject("asteroid")}
                className="px-4 py-2 bg-black/50 border border-orange-500/50 text-orange-400 text-xs tracking-widest hover:bg-orange-500/20 transition-all rounded"
                style={{ backdropFilter: "blur(4px)" }}
              >
                + THROW ASTEROID
              </button>
              <button 
                onClick={() => spawnObject("energy")}
                className="px-4 py-2 bg-black/50 border border-pink-500/50 text-pink-400 text-xs tracking-widest hover:bg-pink-500/20 transition-all rounded"
                style={{ backdropFilter: "blur(4px)" }}
              >
                + THROW ENERGY
              </button>
            </div>
          </Html>
        )}
      </group>
    );
  }
);

BlackHoleExperience.displayName = "BlackHoleExperience";

function ThrownObjectsRenderer({ objects }: { objects: ThrownObject[] }) {
  return (
    <>
      {objects.map((obj) => {
        const dist = obj.position.length();
        // Tidal force stretching (Spaghettification)
        const stretchZ = Math.max(1, 3.5 / Math.max(0.6, dist));
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
                <meshStandardMaterial color={obj.color} emissive={obj.color} emissiveIntensity={1} wireframe />
              </mesh>
            ) : obj.type === "asteroid" ? (
              <mesh>
                <dodecahedronGeometry args={[1, 1]} />
                <meshStandardMaterial color={obj.color} roughness={0.7} metalness={0.5} />
              </mesh>
            ) : (
              <mesh>
                <sphereGeometry args={[1, 16, 16]} />
                <meshStandardMaterial color={obj.color} emissive={obj.color} emissiveIntensity={1.5} wireframe />
              </mesh>
            )}
          </group>
        );
      })}
    </>
  );
}

function BurstRenderer({ bursts }: { bursts: ParticleBurst[] }) {
  return (
    <>
      {bursts.map((b) => (
        <group key={b.id}>
          {b.particles.map((p, idx) => (
            <mesh key={idx} position={[p.pos.x, p.pos.y, p.pos.z]}>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshBasicMaterial color={b.color} transparent opacity={p.opacity} />
            </mesh>
          ))}
        </group>
      ))}
    </>
  );
}

export default BlackHoleExperience;
useGLTF.preload("/blackhole.glb");
