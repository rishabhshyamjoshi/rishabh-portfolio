"use client";

import { useRef, useMemo, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { AudioController } from "../utils/AudioController";

const NUM_TENTACLES = 8;
const POINTS_PER_TENTACLE = 8;
const TENTACLE_LENGTH = 0.4;
const GRAVITY = new THREE.Vector3(0, -0.05, 0);

function Tentacle({ index, headRef }: { index: number, headRef: React.RefObject<THREE.Group> }) {
  const lineRef = useRef<any>(null);
  const [points] = useState(() => Array(POINTS_PER_TENTACLE).fill(0).map(() => new THREE.Vector3()));
  
  // Angle around the bell
  const angle = (index / NUM_TENTACLES) * Math.PI * 2;
  const radius = 0.8; // Attachment radius on the bell

  useFrame((state) => {
    if (!headRef.current) return;
    const t = state.clock.getElapsedTime();
    
    // 1. Calculate the attachment point in world space
    const attachmentLocal = new THREE.Vector3(
      Math.cos(angle) * radius,
      -0.2,
      Math.sin(angle) * radius
    );
    // Apply head's rotation and position to the local attachment point
    const attachmentWorld = attachmentLocal.applyMatrix4(headRef.current.matrixWorld);
    
    // 2. Update point 0 (attached to the bell)
    points[0].copy(attachmentWorld);

    // 3. Spring physics for the rest of the points
    for (let i = 1; i < POINTS_PER_TENTACLE; i++) {
      const prev = points[i - 1];
      const current = points[i];
      
      // Calculate target resting position directly below the previous point
      const target = prev.clone().add(new THREE.Vector3(0, -TENTACLE_LENGTH, 0));
      
      // Add a flowing underwater sway (sine waves based on time and index)
      const swayX = Math.sin(t * 2 + i * 0.5 + index) * 0.05;
      const swayZ = Math.cos(t * 1.5 + i * 0.5 + index) * 0.05;
      target.add(new THREE.Vector3(swayX, 0, swayZ));

      // Lerp current point towards target for springy follow effect
      // Lower points lag behind more
      const followSpeed = 0.2 - (i * 0.01);
      current.lerp(target, Math.max(followSpeed, 0.05));
    }
    
    // Update the Line geometry for 60fps performance without React re-renders
    if (lineRef.current) {
      lineRef.current.setFromPoints(points);
    }
  });

  return (
    <line>
      <bufferGeometry ref={lineRef} />
      <lineBasicMaterial color="#00f0ff" transparent opacity={0.6} />
    </line>
  );
}

export default function Jellyfish() {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const coreMaterialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const { pointer, viewport, camera } = useThree();

  // Smoothing vectors
  const targetPos = useRef(new THREE.Vector3());
  const currentPos = useRef(new THREE.Vector3());
  const targetRot = useRef(new THREE.Euler());
  const currentRot = useRef(new THREE.Euler());

  useFrame((state) => {
    if (!groupRef.current || !headRef.current) return;
    const t = state.clock.getElapsedTime();

    // 1. Calculate Target Position (convert mouse pointer to 3D space)
    // We want the jellyfish to swim exactly where the mouse is on a 2D plane in front of the camera
    const vec = new THREE.Vector3(pointer.x, pointer.y, 0.5);
    vec.unproject(camera);
    const dir = vec.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z; 
    targetPos.current.copy(camera.position.clone().add(dir.multiplyScalar(distance)));
    // Add an offset so it floats slightly above/behind the exact mouse tip, or just give it Z depth
    targetPos.current.z = -1; // float in front of the core (which is at -2)

    // 2. Velocity and Rotation (tilt into movement)
    const velocityX = targetPos.current.x - currentPos.current.x;
    const velocityY = targetPos.current.y - currentPos.current.y;
    
    // Smoothly interpolate position
    currentPos.current.lerp(targetPos.current, 0.05);
    groupRef.current.position.copy(currentPos.current);

    // Tilt the head based on velocity
    targetRot.current.set(
      velocityY * 1.5, // Pitch forward/back
      0,
      -velocityX * 1.5 // Roll left/right
    );
    
    // Add natural breathing/bobbing to rotation
    targetRot.current.x += Math.sin(t * 2) * 0.1;
    targetRot.current.z += Math.cos(t * 2.5) * 0.1;

    // Smoothly interpolate rotation
    currentRot.current.x = THREE.MathUtils.lerp(currentRot.current.x, targetRot.current.x, 0.1);
    currentRot.current.y = THREE.MathUtils.lerp(currentRot.current.y, targetRot.current.y, 0.1);
    currentRot.current.z = THREE.MathUtils.lerp(currentRot.current.z, targetRot.current.z, 0.1);
    
    headRef.current.rotation.copy(currentRot.current);

    // 3. Audio Reactivity for the core
    let audioPulse = 0;
    const audio = AudioController.getInstance();
    if (audio.isInitialized) {
      const data = audio.getFrequencyData();
      if (data.length > 0) {
        const bassAvg = (data[0] + data[1] + data[2]) / 3;
        audioPulse = (bassAvg / 255); 
      }
    }

    if (coreMaterialRef.current) {
      // Pulse between Cyan and Purple based on time and audio
      const hue = 0.5 + (Math.sin(t * 0.5) * 0.5 + 0.5) * 0.35;
      coreMaterialRef.current.emissive.setHSL(hue, 1, 0.5);
      coreMaterialRef.current.emissiveIntensity = 2 + audioPulse * 5;
      
      // Make the bell expand slightly on beat
      headRef.current.scale.setScalar(1 + audioPulse * 0.2);
    }
  });

  return (
    <group ref={groupRef}>
      
      {/* The Jellyfish Head (Bell) */}
      <group ref={headRef}>
        {/* Outer Glass Shell */}
        <mesh scale={[1, 0.5, 1]} position={[0, 0, 0]}>
          <sphereGeometry args={[1, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.3}
            roughness={0.1}
            metalness={0.1}
            transmission={1}
            thickness={2}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Inner Glowing Audio-Reactive Core */}
        <mesh position={[0, -0.2, 0]} scale={[0.4, 0.3, 0.4]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshPhysicalMaterial
            ref={coreMaterialRef}
            color="#000000"
            emissive="#00f0ff"
            emissiveIntensity={2}
            wireframe
          />
        </mesh>
      </group>

      {/* The Tentacles */}
      {Array.from({ length: NUM_TENTACLES }).map((_, i) => (
        <Tentacle key={i} index={i} headRef={headRef} />
      ))}
      
    </group>
  );
}
