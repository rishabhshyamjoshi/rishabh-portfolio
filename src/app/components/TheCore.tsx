"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Float, useGLTF } from "@react-three/drei";
import { AudioController } from "../utils/AudioController";

// ════════════════════════════════════════════════════════════════
// EXISTING COMPONENTS (Earth & Mars)
// ════════════════════════════════════════════════════════════════

const colorBase = new THREE.Color(0xcccccc);
const colorPulse = new THREE.Color(0x88bbff);
const emissiveBase = new THREE.Color(0x444444);
const emissivePulse = new THREE.Color(0x6699dd);

function FragmentMesh({ frag, index, scrollProgress }: { frag: any, index: number, scrollProgress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const smoothPulse = useRef(0);
  const targetPos = useRef(new THREE.Vector3());

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;

    const targetRotX = frag.randomRotX * scrollProgress * 100;
    const targetRotY = frag.randomRotY * scrollProgress * 100;
    
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, 0.05);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, 0.05);

    let audioPulse = 0;
    const audio = AudioController.getInstance();
    if (audio.isInitialized) {
      const data = audio.getFrequencyData();
      if (data.length > 0) {
        const bassAvg = (data[0] + data[1] + data[2]) / 3;
        audioPulse = (bassAvg / 255) * 0.15;
      }
    }
    
    // Smooth out the pulse so it doesn't jitter
    smoothPulse.current = THREE.MathUtils.lerp(smoothPulse.current, audioPulse, 0.12);
    const sp = smoothPulse.current;

    const expansion = Math.sin(scrollProgress * Math.PI) * 5 + (sp * 3.0);
    targetPos.current.copy(frag.center).multiplyScalar(1 + expansion);
    meshRef.current.position.lerp(targetPos.current, 0.06);
    
    // Subtle scale pulse on beat
    const scalePulse = 1.0 + sp * 0.4;
    meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, scalePulse, 0.1));

    // Color shifts slightly with beat — subtle blue-white glow
    materialRef.current.color.lerpColors(colorBase, colorPulse, sp * 2);
    materialRef.current.emissive.lerpColors(emissiveBase, emissivePulse, sp * 2.5);
    materialRef.current.emissiveIntensity = 0.5 + sp * 3.0;
    materialRef.current.opacity = 0.5 + sp * 0.3;
  });

  return (
    <mesh ref={meshRef} position={frag.center} geometry={frag.geometry}>
      <meshPhysicalMaterial
        ref={materialRef}
        wireframe={true}
        roughness={0.2}
        metalness={0.9}
        clearcoat={1}
        transparent={true}
        opacity={0.5}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function EarthPlanet({ scrollProgress, position }: { scrollProgress: number, position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const innerCoreRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.PointLight>(null);
  const velocity = useRef(new THREE.Vector2(0, 0));
  const lastPointer = useRef(new THREE.Vector2(0, 0));
  const smoothGlow = useRef(0);

  const { scene } = useGLTF("/core_inner.glb");
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  const fragments = useMemo(() => {
    const frags = [];
    const geom = new THREE.IcosahedronGeometry(2.1, 3);
    const pos = geom.attributes.position;

    for (let i = 0; i < pos.count; i += 3) {
      const v1 = new THREE.Vector3().fromBufferAttribute(pos, i);
      const v2 = new THREE.Vector3().fromBufferAttribute(pos, i + 1);
      const v3 = new THREE.Vector3().fromBufferAttribute(pos, i + 2);
      const center = v1.clone().add(v2).add(v3).divideScalar(3);

      const triGeom = new THREE.BufferGeometry();
      const vertices = new Float32Array([
        v1.x - center.x, v1.y - center.y, v1.z - center.z,
        v2.x - center.x, v2.y - center.y, v2.z - center.z,
        v3.x - center.x, v3.y - center.y, v3.z - center.z,
      ]);
      triGeom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      triGeom.computeVertexNormals();

      frags.push({
        geometry: triGeom,
        center,
        randomRotX: (Math.random() - 0.5) * 0.05,
        randomRotY: (Math.random() - 0.5) * 0.05,
      });
    }
    return frags;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.15;
    groupRef.current.rotation.z = t * 0.05;

    // Audio-reactive glow
    let audioPulse = 0;
    const audio = AudioController.getInstance();
    if (audio.isInitialized) {
      const data = audio.getFrequencyData();
      if (data.length > 0) {
        const bassAvg = (data[0] + data[1] + data[2]) / 3;
        audioPulse = (bassAvg / 255) * 0.15;
      }
    }
    smoothGlow.current = THREE.MathUtils.lerp(smoothGlow.current, audioPulse, 0.1);
    
    if (glowRef.current) {
      glowRef.current.intensity = 4 + smoothGlow.current * 15;
    }

    if (innerCoreRef.current) {
      innerCoreRef.current.scale.setScalar(1.5 + scrollProgress * 0.1);
      const mouseDeltaX = state.pointer.x - lastPointer.current.x;
      const mouseDeltaY = state.pointer.y - lastPointer.current.y;
      lastPointer.current.copy(state.pointer);
      velocity.current.x += mouseDeltaY * 0.03;
      velocity.current.y += mouseDeltaX * 0.03;
      velocity.current.x = THREE.MathUtils.lerp(velocity.current.x, 0, 0.05);
      velocity.current.y = THREE.MathUtils.lerp(velocity.current.y, 0, 0.05);
      innerCoreRef.current.rotation.x += velocity.current.x;
      innerCoreRef.current.rotation.y += velocity.current.y + 0.003;
    }
  });

  return (
    <group position={position}>
      {/* Earth glow — soft blue-white halo */}
      <pointLight ref={glowRef} intensity={4} color="#88aaff" distance={20} decay={2} />
      <pointLight intensity={2} color="#ffffff" distance={12} decay={2} />
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <group ref={groupRef}>
          <primitive ref={innerCoreRef} object={clonedScene} scale={1.5} />
          {fragments.map((frag, i) => (
            <FragmentMesh key={i} frag={frag} index={i} scrollProgress={scrollProgress} />
          ))}
        </group>
      </Float>
    </group>
  );
}

function MarsPlanet({ scrollProgress, position }: { scrollProgress: number, position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const marsRef = useRef<THREE.Group>(null);
  const velocity = useRef(new THREE.Vector2(0, 0));
  const lastPointer = useRef(new THREE.Vector2(0, 0));

  const { scene } = useGLTF("/mars_out.gltf");
  
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child: any) => {
      if (child.isMesh && child.material) {
        child.material = child.material.clone();
        child.material.metalness = 0.2;
        child.material.roughness = 0.8;
        child.material.needsUpdate = true;
      }
    });
    return clone;
  }, [scene]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.1;

    if (marsRef.current) {
      marsRef.current.scale.setScalar((10 + scrollProgress * 0.2) / 200);
      
      const mouseDeltaX = state.pointer.x - lastPointer.current.x;
      const mouseDeltaY = state.pointer.y - lastPointer.current.y;
      lastPointer.current.copy(state.pointer);
      
      velocity.current.x += mouseDeltaY * 0.02; 
      velocity.current.y += mouseDeltaX * 0.02; 
      velocity.current.x = THREE.MathUtils.lerp(velocity.current.x, 0, 0.05);
      velocity.current.y = THREE.MathUtils.lerp(velocity.current.y, 0, 0.05);
      
      marsRef.current.rotation.x += velocity.current.x;
      marsRef.current.rotation.y += velocity.current.y + 0.002;
    }
  });

  return (
    <group position={position}>
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
        <group ref={groupRef}>
          <primitive ref={marsRef} object={clonedScene} scale={10 / 200} />
          <pointLight position={[5, 3, 5]} intensity={8} color="#ffaa66" distance={25} />
          <pointLight position={[-4, -2, 4]} intensity={3} color="#ff4400" distance={20} />
        </group>
      </Float>
    </group>
  );
}


// ════════════════════════════════════════════════════════════════
// MASTER EXPORT
// ════════════════════════════════════════════════════════════════

export default function SolarSystem({ scrollProgress }: { scrollProgress: number }) {
  const getLocalProgress = (n: number) => Math.min(1, Math.abs(scrollProgress - 2 * n));

  return (
    <group>
      <EarthPlanet scrollProgress={getLocalProgress(0)} position={[0, 0, -2]} />
      <MarsPlanet scrollProgress={getLocalProgress(1)} position={[40, 0, -2]} />
    </group>
  );
}
