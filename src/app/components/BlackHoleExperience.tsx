"use client";

import { useRef, useMemo, useState, useEffect, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useGLTF, Html, Float } from "@react-three/drei";
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
  swallowed?: boolean;
}

interface ParticleBurst {
  id: number;
  position: THREE.Vector3;
  color: string;
  particles: { pos: THREE.Vector3; vel: THREE.Vector3; opacity: number }[];
  life: number;
}

export default function BlackHoleExperience({
  scrollProgress,
  position = [120, 0, -2],
}: {
  scrollProgress: number;
  position?: [number, number, number];
}) {
  const groupRef = useRef<THREE.Group>(null);
  const modelRef = useRef<THREE.Group>(null);
  const gridMeshRef = useRef<THREE.Mesh>(null);
  const jetsRef = useRef<THREE.Points>(null);
  const diskParticlesRef = useRef<THREE.Points>(null);
  
  const [swallowedCount, setSwallowedCount] = useState(0);
  const [cameraTourMode, setCameraTourMode] = useState<"orbit" | "dive" | "polar" | "grid">("orbit");
  const [gravWaveActive, setGravWaveActive] = useState(false);
  const [waveRadius, setWaveRadius] = useState(0);

  const { scene } = useGLTF("/black_hole.glb");

  // Clone GLTF scene safely
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child: any) => {
      if (child.isMesh) {
        child.material = child.material.clone();
        if (child.material) {
          child.material.side = THREE.DoubleSide;
          child.material.emissiveIntensity = 2.0;
        }
      }
    });
    return clone;
  }, [scene]);

  // Object Spawner & Physics State
  const objectsRef = useRef<ThrownObject[]>([]);
  const burstsRef = useRef<ParticleBurst[]>([]);
  const nextId = useRef(1);

  // Spacetime Grid Deformation Mesh
  const gridGeometry = useMemo(() => {
    const size = 30;
    const divisions = 40;
    const geom = new THREE.PlaneGeometry(size, size, divisions, divisions);
    geom.rotateX(-Math.PI / 2);
    return geom;
  }, []);

  // Update Grid Deformation for Gravity Funnel Effect
  useFrame(() => {
    if (!gridMeshRef.current) return;
    const pos = gridMeshRef.current.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const dist = Math.sqrt(x * x + z * z);
      // Funnel depression equation r^-0.8
      const funnelDepth = -12 / Math.max(1.2, Math.pow(dist, 0.85));
      pos.setY(i, funnelDepth);
    }
    gridMeshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  // Relativistic Jet & Accretion Particles
  const { diskPositions, diskColors } = useMemo(() => {
    const count = 1200;
    const diskPositions = new Float32Array(count * 3);
    const diskColors = new Float32Array(count * 3);
    const c1 = new THREE.Color("#00f0ff");
    const c2 = new THREE.Color("#ff0077");
    const c3 = new THREE.Color("#ffffff");

    for (let i = 0; i < count; i++) {
      const radius = 3.5 + Math.random() * 12;
      const angle = Math.random() * Math.PI * 2;
      diskPositions[i * 3] = Math.cos(angle) * radius;
      diskPositions[i * 3 + 1] = (Math.random() - 0.5) * 0.4;
      diskPositions[i * 3 + 2] = Math.sin(angle) * radius;

      const mixColor = radius < 6 ? c2 : Math.random() > 0.5 ? c1 : c3;
      diskColors[i * 3] = mixColor.r;
      diskColors[i * 3 + 1] = mixColor.g;
      diskColors[i * 3 + 2] = mixColor.b;
    }
    return { diskPositions, diskColors };
  }, []);

  // Polar Jets Particles
  const jetPositions = useMemo(() => {
    const count = 400;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const height = (Math.random() - 0.5) * 35;
      const radius = (1 - Math.abs(height) / 35) * 0.8 + 0.1;
      const angle = Math.random() * Math.PI * 2;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = height;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, []);

  // Spawn Throwable Object
  const spawnObject = useCallback((type: "probe" | "asteroid" | "energy") => {
    const angle = Math.random() * Math.PI * 2;
    const distance = 14 + Math.random() * 6;
    const startX = Math.cos(angle) * distance;
    const startY = (Math.random() - 0.5) * 4;
    const startZ = Math.sin(angle) * distance;

    // Tangential orbital velocity + inward gravitational pull component
    const tangentX = -Math.sin(angle) * (0.15 + Math.random() * 0.1);
    const tangentZ = Math.cos(angle) * (0.15 + Math.random() * 0.1);
    const inwardX = -startX * 0.008;
    const inwardZ = -startZ * 0.008;

    const colors = {
      probe: "#00f0ff",
      asteroid: "#ffaa44",
      energy: "#ff00ea",
    };

    const newObj: ThrownObject = {
      id: nextId.current++,
      type,
      position: new THREE.Vector3(startX, startY, startZ),
      velocity: new THREE.Vector3(tangentX + inwardX, (Math.random() - 0.5) * 0.05, tangentZ + inwardZ),
      rotation: new THREE.Vector3(Math.random(), Math.random(), Math.random()),
      rotSpeed: new THREE.Vector3((Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1),
      scale: type === "probe" ? 0.35 : type === "asteroid" ? 0.6 : 0.45,
      color: colors[type],
      life: 0,
    };

    objectsRef.current.push(newObj);
    try {
      AudioController.getInstance().playLaunchProbeSound();
    } catch (e) {}
  }, []);

  // Trigger Gravitational Wave Pulse
  const triggerGravWave = useCallback(() => {
    setGravWaveActive(true);
    setWaveRadius(0);
    try {
      AudioController.getInstance().playObjectSwallowedSound();
    } catch (e) {}
  }, []);

  // Frame Physics & Animation Loop
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Rotate Black Hole GLTF model
    if (modelRef.current) {
      modelRef.current.rotation.y = t * 0.35;
      modelRef.current.rotation.z = Math.sin(t * 0.5) * 0.08;
    }

    // Animate Accretion Disk particles
    if (diskParticlesRef.current) {
      diskParticlesRef.current.rotation.y = t * 0.8;
    }

    // Animate Polar Jets
    if (jetsRef.current) {
      jetsRef.current.rotation.y = -t * 1.5;
    }

    // Gravitational Wave Expansion
    if (gravWaveActive) {
      setWaveRadius((prev) => {
        if (prev > 25) {
          setGravWaveActive(false);
          return 0;
        }
        return prev + delta * 20;
      });
    }

    // Physics Simulation for Thrown Objects
    const currentObjs = objectsRef.current;
    const remainingObjs: ThrownObject[] = [];

    for (let i = 0; i < currentObjs.length; i++) {
      const obj = currentObjs[i];
      obj.life += delta;

      // Distance to Black Hole singularity at (0,0,0)
      const distSq = obj.position.lengthSq();
      const dist = Math.sqrt(distSq);

      // Gravitational Force F = G * M / r^2
      const G = 8.5; // Strong gravity constant for dramatic motion
      const forceMag = G / Math.max(0.8, distSq);
      const pullDir = obj.position.clone().negate().normalize();

      // Accelerate towards black hole
      obj.velocity.addScaledVector(pullDir, forceMag * delta * 60);
      obj.position.add(obj.velocity);

      // Spin object
      obj.rotation.add(obj.rotSpeed);

      // Spaghettification & Event Horizon Swallowing
      const eventHorizonRadius = 2.2;
      if (dist < eventHorizonRadius) {
        // Swallowed by black hole!
        setSwallowedCount((prev) => prev + 1);
        try {
          AudioController.getInstance().playObjectSwallowedSound();
        } catch (e) {}

        // Spawn particle implosion burst
        const burstParticles = [];
        for (let k = 0; k < 25; k++) {
          burstParticles.push({
            pos: obj.position.clone(),
            vel: new THREE.Vector3(
              (Math.random() - 0.5) * 4,
              (Math.random() - 0.5) * 4,
              (Math.random() - 0.5) * 4
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

    // Update Swallowing Particle Bursts
    burstsRef.current = burstsRef.current
      .map((b) => {
        b.life += delta;
        b.particles.forEach((p) => {
          p.pos.addScaledVector(p.vel, delta);
          p.opacity = Math.max(0, 1 - b.life * 2);
        });
        return b;
      })
      .filter((b) => b.life < 0.6);
  });

  // Calculate section visibility & active state
  // Section index 3 is around scrollProgress 3.0 to 4.0
  const isSectionActive = scrollProgress > 2.5 && scrollProgress < 4.2;

  return (
    <group position={position} ref={groupRef}>
      {/* ═══ 3D BLACK HOLE GLTF MODEL ═══ */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
        <group
          ref={modelRef}
          onClick={(e) => {
            e.stopPropagation();
            // Launch interactive probe when clicking the Black Hole!
            spawnObject("probe");
          }}
          onPointerOver={() => {
            document.body.style.cursor = "crosshair";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "auto";
          }}
        >
          <primitive object={clonedScene} scale={2.8} />

          {/* Singular Event Horizon Core Glow */}
          <pointLight intensity={15} color="#00f0ff" distance={15} decay={1.5} />
          <pointLight intensity={8} color="#ff0088" distance={20} decay={2} />
        </group>
      </Float>

      {/* ═══ ACCRETION DISK HIGH-SPEED PARTICLES ═══ */}
      <points ref={diskParticlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[diskPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[diskColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          vertexColors
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* ═══ RELATIVISTIC POLAR JETS ═══ */}
      <points ref={jetsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[jetPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#00f0ff"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* ═══ SPACETIME GRAVITY WELL GRID MESH ═══ */}
      <mesh ref={gridMeshRef} geometry={gridGeometry} position={[0, -2.5, 0]}>
        <meshBasicMaterial
          color="#00f0ff"
          wireframe
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ═══ GRAVITATIONAL WAVE IMPACT PULSE RING ═══ */}
      {gravWaveActive && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[Math.max(0.1, waveRadius - 0.5), waveRadius, 64]} />
          <meshBasicMaterial
            color="#00f0ff"
            side={THREE.DoubleSide}
            transparent
            opacity={Math.max(0, 1 - waveRadius / 25)}
          />
        </mesh>
      )}

      {/* ═══ INTERACTIVE THROWN OBJECTS ═══ */}
      <ThrownObjectsRenderer objects={objectsRef.current} />

      {/* ═══ PARTICLE IMPLOSION BURSTS ═══ */}
      <BurstRenderer bursts={burstsRef.current} />

      {/* ═══ 3D INTERACTIVE TELEMETRY HUD OVERLAY ═══ */}
      {isSectionActive && (
        <Html position={[0, 5, 0]} center distanceFactor={18} style={{ pointerEvents: "auto" }}>
          <div
            style={{
              padding: "1rem 1.5rem",
              background: "rgba(3, 8, 16, 0.85)",
              border: "1px solid rgba(0, 240, 255, 0.4)",
              borderRadius: "12px",
              color: "#fff",
              fontFamily: "'Space Mono', monospace",
              backdropFilter: "blur(16px)",
              boxShadow: "0 0 30px rgba(0, 240, 255, 0.2)",
              display: "flex",
              flexDirection: "column",
              gap: "0.8rem",
              minWidth: "320px",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#00f0ff",
                    boxShadow: "0 0 8px #00f0ff",
                  }}
                />
                <span style={{ fontSize: "0.75rem", letterSpacing: "0.2em", color: "#00f0ff", fontWeight: "bold" }}>
                  BLACK HOLE SINGULARITY
                </span>
              </div>
              <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.4)" }}>
                ID: SG-001
              </span>
            </div>

            {/* Telemetry Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", fontSize: "0.6rem", color: "rgba(255,255,255,0.7)" }}>
              <div>
                <span style={{ color: "rgba(255,255,255,0.4)", display: "block" }}>MASS</span>
                <span>4.1M M☉</span>
              </div>
              <div>
                <span style={{ color: "rgba(255,255,255,0.4)", display: "block" }}>SCHWARZSCHILD</span>
                <span>12.1 AU</span>
              </div>
              <div>
                <span style={{ color: "rgba(255,255,255,0.4)", display: "block" }}>TIME DILATION</span>
                <span style={{ color: "#ff0077" }}>∞ (CRITICAL)</span>
              </div>
              <div>
                <span style={{ color: "rgba(255,255,255,0.4)", display: "block" }}>CONSUMED</span>
                <span style={{ color: "#00f0ff", fontWeight: "bold" }}>{swallowedCount} OBJECTS</span>
              </div>
            </div>

            {/* Interactive Object Launcher Buttons */}
            <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.4rem" }}>
              <button
                onClick={() => spawnObject("probe")}
                style={{
                  flex: 1,
                  padding: "0.4rem 0.6rem",
                  background: "rgba(0, 240, 255, 0.15)",
                  border: "1px solid rgba(0, 240, 255, 0.5)",
                  borderRadius: "6px",
                  color: "#00f0ff",
                  fontSize: "0.55rem",
                  letterSpacing: "0.1em",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                + LAUNCH PROBE
              </button>
              <button
                onClick={() => spawnObject("asteroid")}
                style={{
                  flex: 1,
                  padding: "0.4rem 0.6rem",
                  background: "rgba(255, 170, 68, 0.15)",
                  border: "1px solid rgba(255, 170, 68, 0.5)",
                  borderRadius: "6px",
                  color: "#ffaa44",
                  fontSize: "0.55rem",
                  letterSpacing: "0.1em",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                + THROW ASTEROID
              </button>
              <button
                onClick={triggerGravWave}
                style={{
                  flex: 1,
                  padding: "0.4rem 0.6rem",
                  background: "rgba(255, 0, 119, 0.15)",
                  border: "1px solid rgba(255, 0, 119, 0.5)",
                  borderRadius: "6px",
                  color: "#ff0077",
                  fontSize: "0.55rem",
                  letterSpacing: "0.1em",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                ⚡ GRAV WAVE
              </button>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

// Sub-component to render interactive objects undergoing gravitational spaghettification
function ThrownObjectsRenderer({ objects }: { objects: ThrownObject[] }) {
  return (
    <>
      {objects.map((obj) => {
        const dist = obj.position.length();
        // Spaghettification stretching effect as object approaches horizon
        const stretchZ = Math.max(1, 4.5 / Math.max(0.8, dist));
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
                <meshStandardMaterial
                  color={obj.color}
                  emissive={obj.color}
                  emissiveIntensity={1.5}
                  wireframe
                />
              </mesh>
            ) : obj.type === "asteroid" ? (
              <mesh>
                <dodecahedronGeometry args={[1, 1]} />
                <meshStandardMaterial color={obj.color} roughness={0.7} metalness={0.5} />
              </mesh>
            ) : (
              <mesh>
                <sphereGeometry args={[1, 16, 16]} />
                <meshStandardMaterial
                  color={obj.color}
                  emissive={obj.color}
                  emissiveIntensity={2.5}
                  wireframe
                />
              </mesh>
            )}
            <pointLight color={obj.color} intensity={2} distance={4} />
          </group>
        );
      })}
    </>
  );
}

// Sub-component to render implosion bursts when black hole swallows an object
function BurstRenderer({ bursts }: { bursts: ParticleBurst[] }) {
  return (
    <>
      {bursts.map((b) => (
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

useGLTF.preload("/black_hole.glb");
