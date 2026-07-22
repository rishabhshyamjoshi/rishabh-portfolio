"use client";

import { useRef, useMemo, useState, useCallback, useImperativeHandle, forwardRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGLTF, Float, useScroll } from "@react-three/drei";
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

const BlackHoleExperience = forwardRef<BlackHoleControls, BlackHoleExperienceProps>(
  ({ position = [0, 0, 0], onSwallowed, onWave, activeModule }, ref) => {
    const groupRef = useRef<THREE.Group>(null);
    const modelRef = useRef<THREE.Group>(null);
    const gridMeshRef = useRef<THREE.Mesh>(null);
    const jetsRef = useRef<THREE.Points>(null);
    const diskParticlesRef = useRef<THREE.Points>(null);

    const [gravWaveActive, setGravWaveActive] = useState(false);
    const [waveRadius, setWaveRadius] = useState(0);

    const { scene, animations } = useGLTF("/black_hole.glb");

    // Clone GLTF scene & auto-scale to perfect 3.2 Three.js units via Box3
    const clonedScene = useMemo(() => {
      const clone = scene.clone(true);
      
      const box = new THREE.Box3().setFromObject(clone);
      const size = new THREE.Vector3();
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z) || 1;
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

    // Spacetime Grid Deformation Mesh (dark blue wireframe funnel)
    const gridGeometry = useMemo(() => {
      const size = 30;
      const divisions = 30;
      const geom = new THREE.PlaneGeometry(size, size, divisions, divisions);
      geom.rotateX(-Math.PI / 2);
      return geom;
    }, []);

    // Funnel depression
    useFrame(() => {
      if (!gridMeshRef.current) return;
      const pos = gridMeshRef.current.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const z = pos.getZ(i);
        const dist = Math.sqrt(x * x + z * z);
        const funnelDepth = -8 / Math.max(1.2, Math.pow(dist, 0.85));
        pos.setY(i, funnelDepth);
      }
      gridMeshRef.current.geometry.attributes.position.needsUpdate = true;
    });

    // Accretion Particles
    const { diskPositions, diskColors } = useMemo(() => {
      const count = 800;
      const diskPositions = new Float32Array(count * 3);
      const diskColors = new Float32Array(count * 3);
      const c1 = new THREE.Color("#ffaa00"); // Fiery Yellow/Orange
      const c2 = new THREE.Color("#ff3300"); // Deep Red/Orange
      const c3 = new THREE.Color("#ffffff"); // Intense White core

      for (let i = 0; i < count; i++) {
        const radius = 2.5 + Math.random() * 8;
        const angle = Math.random() * Math.PI * 2;
        diskPositions[i * 3] = Math.cos(angle) * radius;
        diskPositions[i * 3 + 1] = (Math.random() - 0.5) * 0.2;
        diskPositions[i * 3 + 2] = Math.sin(angle) * radius;

        const mixColor = radius < 3.5 ? c3 : radius < 5.5 ? c1 : c2;
        diskColors[i * 3] = mixColor.r;
        diskColors[i * 3 + 1] = mixColor.g;
        diskColors[i * 3 + 2] = mixColor.b;
      }
      return { diskPositions, diskColors };
    }, []);

    // Polar Jets Particles
    const jetPositions = useMemo(() => {
      const count = 300;
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const height = (Math.random() - 0.5) * 20;
        const radius = (1 - Math.abs(height) / 20) * 0.5 + 0.05;
        const angle = Math.random() * Math.PI * 2;
        pos[i * 3] = Math.cos(angle) * radius;
        pos[i * 3 + 1] = height;
        pos[i * 3 + 2] = Math.sin(angle) * radius;
      }
      return pos;
    }, []);

    const scroll = useScroll();

    // Spawn Throwable Object
    const spawnObject = useCallback(
      (type: "probe" | "asteroid" | "energy") => {
        const angle = Math.random() * Math.PI * 2;
        const distance = 8 + Math.random() * 4;
        const startX = Math.cos(angle) * distance;
        const startY = (Math.random() - 0.5) * 2;
        const startZ = Math.sin(angle) * distance;

        const tangentX = -Math.sin(angle) * (0.12 + Math.random() * 0.08);
        const tangentZ = Math.cos(angle) * (0.12 + Math.random() * 0.08);
        const inwardX = -startX * 0.01;
        const inwardZ = -startZ * 0.01;

        const colors = {
          probe: "#00f0ff",
          asteroid: "#ffaa44",
          energy: "#ff00ea",
        };

        const newObj: ThrownObject = {
          id: nextId.current++,
          type,
          position: new THREE.Vector3(startX, startY, startZ),
          velocity: new THREE.Vector3(tangentX + inwardX, (Math.random() - 0.5) * 0.04, tangentZ + inwardZ),
          rotation: new THREE.Vector3(Math.random(), Math.random(), Math.random()),
          rotSpeed: new THREE.Vector3((Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1),
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
      state.camera.position.lerp(targetCamPos, 0.05);
      state.camera.lookAt(0, 0, 0);

      // Model rotation
      if (modelRef.current) {
        modelRef.current.rotation.y = t * 0.25;
        modelRef.current.rotation.z = Math.sin(t * 0.4) * 0.05;
      }

      if (diskParticlesRef.current) {
        diskParticlesRef.current.rotation.y = t * 0.6;
      }

      if (jetsRef.current) {
        jetsRef.current.rotation.y = -t * 1.2;
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

      // Objects Physics Simulation
      const currentObjs = objectsRef.current;
      const remainingObjs: ThrownObject[] = [];

      for (let i = 0; i < currentObjs.length; i++) {
        const obj = currentObjs[i];
        obj.life += delta;

        const distSq = obj.position.lengthSq();
        const dist = Math.sqrt(distSq);

        const G = 6.0;
        const forceMag = G / Math.max(0.6, distSq);
        const pullDir = obj.position.clone().negate().normalize();

        obj.velocity.addScaledVector(pullDir, forceMag * delta * 50);
        obj.position.add(obj.velocity);
        obj.rotation.add(obj.rotSpeed);

        const eventHorizonRadius = 1.4;
        if (dist < eventHorizonRadius) {
          if (onSwallowed) onSwallowed(1);
          try {
            AudioController.getInstance().playObjectSwallowedSound();
          } catch (e) {}

          const burstParticles = [];
          for (let k = 0; k < 20; k++) {
            burstParticles.push({
              pos: obj.position.clone(),
              vel: new THREE.Vector3(
                (Math.random() - 0.5) * 3,
                (Math.random() - 0.5) * 3,
                (Math.random() - 0.5) * 3
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
        <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.2}>
          <group
            ref={modelRef}
            onClick={(e) => {
              e.stopPropagation();
              spawnObject("probe");
            }}
            onPointerOver={() => {
              document.body.style.cursor = "crosshair";
            }}
            onPointerOut={() => {
              document.body.style.cursor = "auto";
            }}
          >
            {/* Auto-scaled via Box3 bounding box */}
            <primitive object={clonedScene} />

            {/* Intense Fiery Ambient Lights (Interstellar look) */}
            <pointLight intensity={3.0} color="#ff8800" distance={8} decay={2} />
            <pointLight intensity={1.5} color="#ff3300" distance={12} decay={2} />
          </group>
        </Float>

        {/* Accretion Disk Particles */}
        <points ref={diskParticlesRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[diskPositions, 3]} />
            <bufferAttribute attach="attributes-color" args={[diskColors, 3]} />
          </bufferGeometry>
          <pointsMaterial
            size={0.06}
            vertexColors
            transparent
            opacity={0.7}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>

        {/* Polar Jets Particles */}
        <points ref={jetsRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[jetPositions, 3]} />
          </bufferGeometry>
          <pointsMaterial
            size={0.05}
            color="#ffaa00"
            transparent
            opacity={0.6}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>

        {/* Spacetime Gravity Grid Mesh */}
        <mesh ref={gridMeshRef} geometry={gridGeometry} position={[0, -3.5, 0]}>
          <meshBasicMaterial
            color="#ff3300"
            wireframe
            transparent
            opacity={0.12}
            side={THREE.DoubleSide}
          />
        </mesh>

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
useGLTF.preload("/black_hole.glb");
