"use client";

import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Float, useGLTF, Html } from "@react-three/drei";
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
        // Substantially increased base audio pulse for stronger reaction
        audioPulse = (bassAvg / 255) * 0.65;
      }
    }
    
    // Smooth out the pulse so it doesn't jitter, but keep it snappy
    smoothPulse.current = THREE.MathUtils.lerp(smoothPulse.current, audioPulse, 0.25);
    const sp = smoothPulse.current;

    // Subtle expansion bounce (0.5x)
    const expansion = Math.sin(scrollProgress * Math.PI) * 5 + (sp * 0.5);
    targetPos.current.copy(frag.center).multiplyScalar(1 + expansion);
    meshRef.current.position.lerp(targetPos.current, 0.15); // Snappier movement
    
    // Subtle scale pulse on beat (0.5x)
    const scalePulse = 1.0 + sp * 0.5;
    meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, scalePulse, 0.2));

    // Invisible during the entire Projects section (1 to 3), visible at Home (0) and Team (4)
    let fadeOut = 1.0;
    if (scrollProgress > 0.2 && scrollProgress < 3.8) {
      if (scrollProgress < 0.8) {
        fadeOut = 1.0 - (scrollProgress - 0.2) / 0.6; // Fade out leaving Home
      } else if (scrollProgress > 3.2) {
        fadeOut = (scrollProgress - 3.2) / 0.6; // Fade in entering Team
      } else {
        fadeOut = 0; // Completely invisible for projects
      }
    }
    meshRef.current.visible = fadeOut > 0.01; // Completely disable rendering when faded

    // Color shifts slightly with beat — intense blue-white glow
    materialRef.current.color.lerpColors(colorBase, colorPulse, sp * 3);
    materialRef.current.emissive.lerpColors(emissiveBase, emissivePulse, sp * 4.0);
    materialRef.current.emissiveIntensity = 0.5 + sp * 0.5; // Subtle intensity spike on beat (0.5x)
    materialRef.current.opacity = (0.5 + sp * 0.5) * fadeOut;
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

function Satellite() {
  const satRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const [hovered, setHovered] = useState(false);
  
  const { scene } = useGLTF("/debris.glb");
  const debrisScene = useMemo(() => {
    const clone = scene.clone(true);
    // Optional: tweak materials if needed
    clone.traverse((child: any) => {
      if (child.isMesh && child.material) {
        child.material = child.material.clone();
        child.material.metalness = 0.8;
        child.material.roughness = 0.3;
        child.material.needsUpdate = true;
      }
    });
    return clone;
  }, [scene]);
  
  useFrame((state) => {
    if (!satRef.current) return;
    const t = state.clock.getElapsedTime();
    const radius = 3.2; // Orbit slightly outside the wireframe
    const speed = 0.6;
    
    // Orbital path
    satRef.current.position.x = Math.sin(t * speed) * radius;
    satRef.current.position.z = Math.cos(t * speed) * radius;
    satRef.current.position.y = Math.sin(t * speed * 0.4) * 1.2; 
    
    // Add some spin to the debris itself so it tumbles
    satRef.current.rotation.x = t * 0.2;
    satRef.current.rotation.y = t * 0.5;
    
    // Blink red beacon light
    if (lightRef.current) {
       lightRef.current.intensity = Math.sin(t * 8) > 0 ? 2 : 0;
    }
  });

  return (
    <group 
      ref={satRef}
      onClick={(e) => {
        e.stopPropagation();
        window.open('/manufacturing', '_blank');
      }}
      onPointerOver={(e) => { 
        e.stopPropagation(); 
        document.body.style.cursor = 'pointer'; 
        setHovered(true);
      }}
      onPointerOut={() => { 
        document.body.style.cursor = 'auto'; 
        setHovered(false);
      }}
    >
      <primitive object={debrisScene} scale={0.1} />
      
      {/* 3D UI Tracking Label */}
      <Html
        position={[0, 0.4, 0]}
        center
        distanceFactor={10}
        style={{ pointerEvents: "none" }}
      >
        <div style={{
          padding: "4px 8px",
          background: "rgba(0, 0, 0, 0.7)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          borderRadius: "4px",
          color: "white",
          fontSize: "10px",
          letterSpacing: "0.2em",
          whiteSpace: "nowrap",
          backdropFilter: "blur(4px)",
          textTransform: "uppercase",
          opacity: hovered ? 1 : 0.4,
          transform: hovered ? "scale(1.1)" : "scale(1)",
          transition: "all 0.3s ease",
          boxShadow: hovered ? "0 0 10px rgba(255,255,255,0.2)" : "none"
        }}>
          {hovered ? "EXPLORE MANUFACTURING" : "SATELLITE INTEL"}
        </div>
      </Html>

      {/* Beacon Light attached to the debris */}
      <pointLight ref={lightRef} position={[0.3, 0.3, 0]} color="#ff0000" distance={3} decay={2} />
      <mesh position={[0.3, 0.3, 0]}>
        <sphereGeometry args={[0.015]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
    </group>
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
        <Satellite />
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
  
  const [clickCount, setClickCount] = useState(0);

  const { scene } = useGLTF("/mars_out.glb");
  
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
        <group 
          ref={groupRef}
          onClick={(e) => {
            e.stopPropagation();
            setClickCount(prev => prev + 1);
          }}
          onPointerOver={() => { document.body.style.cursor = "crosshair"; }}
          onPointerOut={() => { document.body.style.cursor = "none"; }}
        >
          <primitive ref={marsRef} object={clonedScene} scale={10 / 200} />
          
          {/* EASTER EGG ROVER */}
          {clickCount >= 5 && (
            <mesh position={[0, 10.5, 0]}>
              <boxGeometry args={[0.5, 0.3, 0.8]} />
              <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
              <pointLight color="#00f0ff" intensity={2} distance={2} />
            </mesh>
          )}

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
