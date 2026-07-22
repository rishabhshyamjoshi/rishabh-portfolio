"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import Link from "next/link";
import CustomCursor from "../components/CustomCursor";

function RawBlackHoleModel() {
  const { scene } = useGLTF("/blackhole.glb");
  return <primitive object={scene} scale={0.01} />;
}

export default function AcademyPage() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden font-[var(--font-mono)]">
      <CustomCursor />

      {/* ═══ 3D CANVAS FULLSCREEN ═══ */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 15], fov: 50 }}
          gl={{ antialias: true }}
        >
          {/* Basic Lighting to ensure the model is visible if it lacks baked lights */}
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 10, 10]} intensity={2} />
          
          <Suspense fallback={null}>
            <RawBlackHoleModel />
            <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} enablePan={false} />
          </Suspense>
        </Canvas>
      </div>

      {/* ═══ MINIMAL NAVIGATION ═══ */}
      <div className="fixed top-8 left-8 z-50 pointer-events-auto">
        <Link
          href="/"
          className="flex items-center gap-3 border border-white/30 bg-black/60 backdrop-blur-md px-5 py-2.5 rounded-full text-[0.65rem] tracking-[0.2em] text-white hover:bg-white/10 transition-all duration-300"
        >
          <span>&larr;</span> RETURN TO CORE
        </Link>
      </div>
      
      {/* ═══ STATUS INDICATOR ═══ */}
      <div className="fixed bottom-8 left-8 z-50 pointer-events-none">
        <p className="text-[0.6rem] tracking-[0.2em] text-white/50">
          RAW MODEL RENDER: blackhole.glb
        </p>
      </div>
    </div>
  );
}

useGLTF.preload("/blackhole.glb");
