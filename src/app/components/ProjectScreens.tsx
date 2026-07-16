"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text, Edges, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { AudioController } from "../utils/AudioController";

import { PROJECTS, ProjectData } from "../data/projects";

function Screen({ project, scrollProgress, onProjectClick }: { project: ProjectData, scrollProgress: number, onProjectClick: (data: any) => void }) {
  const meshRef = useRef<THREE.Group>(null);
  const scaleRef = useRef<THREE.Group>(null);
  const bgGroupRef = useRef<THREE.Group>(null);
  const fgGroupRef = useRef<THREE.Group>(null);
  
  const glassMaterialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const decoLineRef = useRef<THREE.MeshBasicMaterial>(null);
  const edgesRef = useRef<any>(null);
  const titleMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  
  const [hovered, setHovered] = useState(false);
  const currentTime = useRef(0);
  const hoverFactor = useRef(0);

  const texture = useTexture(project.image);

  // Create curved geometry for wrapping effect
  const curvedGeometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(project.scale[0], project.scale[1], 32, 32);
    const pos = geo.attributes.position;
    const radius = 8; // Curvature radius
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const angle = x / radius;
      pos.setX(i, Math.sin(angle) * radius);
      pos.setZ(i, (Math.cos(angle) - 1) * radius);
    }
    geo.computeVertexNormals();
    return geo;
  }, [project.scale]);

  // Interactive Liquid Hologram Shader
  const customShaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uHover: { value: 0 },
        uTexture: { value: texture },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uHover;
        uniform sampler2D uTexture;
        varying vec2 vUv;
        
        void main() {
          vec2 uv = vUv;
          
          // Subtle breathing effect on hover
          if (uHover > 0.0) {
            uv.y += sin(uv.x * 10.0 + uTime * 2.0) * 0.005;
            uv.x += cos(uv.y * 10.0 + uTime * 2.0) * 0.005;
          }
          
          vec4 texColor = texture2D(uTexture, uv);
          
          // Elegant scanlines
          float scanline = sin(uv.y * 150.0 - uTime * 5.0) * 0.03;
          
          // High-tech edge gradient glow
          float edgeX = smoothstep(0.4, 0.5, abs(uv.x - 0.5));
          float edgeY = smoothstep(0.4, 0.5, abs(uv.y - 0.5));
          float edge = max(edgeX, edgeY);
          float glow = edge * (0.3 + uHover * 0.7);
          
          vec3 neonColor = mix(vec3(0.1, 0.5, 1.0), vec3(0.8, 0.9, 1.0), sin(uTime * 2.0) * 0.5 + 0.5);
          
          // Desaturate image slightly when not hovered
          float gray = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
          vec3 finalTex = mix(vec3(gray) * vec3(0.5, 0.7, 1.0), texColor.rgb, uHover);
          
          gl_FragColor = vec4(finalTex + (neonColor * glow) + scanline, texColor.a);
          gl_FragColor.a *= mix(0.4, 0.95, uHover); // More opaque on hover
        }
      `,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  }, [texture]);

  useFrame((state) => {
    if (!meshRef.current || !scaleRef.current) return;
    const t = state.clock.getElapsedTime();
    currentTime.current = t;
    
    let localScrollProgress = 0;
    if (scrollProgress <= 1) {
      localScrollProgress = scrollProgress;
    } else if (scrollProgress <= 2) {
      localScrollProgress = Math.max(0, 1 - (scrollProgress - 1));
    } else {
      localScrollProgress = 0;
    }

    const radius = Math.pow(localScrollProgress, 1.5) * 15;
    const x = Math.cos(project.angle + t * 0.2) * radius;
    const z = Math.sin(project.angle + t * 0.2) * radius - 2; 
    const y = Math.sin(t * 1 + project.id) * 0.5;

    meshRef.current.position.set(x, y, z);
    meshRef.current.lookAt(0, 0, -2);
    
    const baseScale = Math.min(localScrollProgress * 2, 1);
    meshRef.current.scale.setScalar(baseScale);
    
    // Parallax logic
    hoverFactor.current = THREE.MathUtils.lerp(hoverFactor.current, hovered ? 1 : 0, 0.1);
    const targetScale = hovered ? 1.05 : 1.0;
    scaleRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);

    if (bgGroupRef.current) {
      bgGroupRef.current.position.z = THREE.MathUtils.lerp(bgGroupRef.current.position.z, hovered ? -0.8 : -0.05, 0.1);
    }
    if (fgGroupRef.current) {
      fgGroupRef.current.position.z = THREE.MathUtils.lerp(fgGroupRef.current.position.z, hovered ? 0.8 : 0.05, 0.1);
    }

    customShaderMaterial.uniforms.uTime.value = t;
    customShaderMaterial.uniforms.uHover.value = hoverFactor.current;

    // Material transitions
    if (glassMaterialRef.current && decoLineRef.current) {
      if (hovered) {
        glassMaterialRef.current.color.setHex(0x1a2b4c);
        decoLineRef.current.color.setHex(0x88ccff);
        if (edgesRef.current && edgesRef.current.material) edgesRef.current.material.color.setHex(0x55aaff);
        if (titleMaterialRef.current) {
          titleMaterialRef.current.color.setHex(0xffffff);
        }
      } else {
        glassMaterialRef.current.color.setHex(0x050a14);
        decoLineRef.current.color.setHex(0x224466);
        if (edgesRef.current && edgesRef.current.material) edgesRef.current.material.color.setHex(0x112233);
        if (titleMaterialRef.current) {
          titleMaterialRef.current.color.setHex(0x88aacc);
        }
      }
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    onProjectClick({
      ...project,
      animationTime: currentTime.current
    });
  };

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setHovered(true);
  };

  return (
    <group ref={meshRef} visible={scrollProgress < 1.9}>
      <group ref={scaleRef}>
        <group
          onPointerOver={handlePointerOver}
          onPointerOut={() => setHovered(false)}
          onClick={handleClick}
        >
          {/* LAYER 1: Background Liquid Shader Image */}
          <group ref={bgGroupRef} position={[0, 0, -0.05]}>
            <mesh geometry={curvedGeometry}>
              <primitive object={customShaderMaterial} attach="material" />
            </mesh>
          </group>

          {/* LAYER 2: Curved Glass Shell */}
          <mesh geometry={curvedGeometry}>
            <meshPhysicalMaterial
              ref={glassMaterialRef}
              color={hovered ? "#050505" : "#020202"}
              transmission={0.95}
              opacity={1}
              transparent
              roughness={0.15}
              thickness={1.5}
              envMapIntensity={3}
              clearcoat={1}
              clearcoatRoughness={0.05}
            />
            <Edges 
              ref={edgesRef}
              linewidth={hovered ? 1.5 : 1}
              threshold={15}
            />
          </mesh>
          
          {/* LAYER 3: Floating UI & Text */}
          <group ref={fgGroupRef} position={[0, 0, 0.05]}>
            <Text
              fontSize={0.35}
              position={[0, 0, 0]}
              maxWidth={project.scale[0] - 1}
              lineHeight={1.2}
              letterSpacing={0.1}
              textAlign="center"
              anchorX="center"
              anchorY="middle"
            >
              <meshBasicMaterial ref={titleMaterialRef} />
              {project.title.toUpperCase()}
            </Text>
            
            {/* Curved Deco Line */}
            <mesh position={[0, -project.scale[1]/2 + 0.4, 0]}>
              <planeGeometry args={[project.scale[0] - 1.5, 0.015]} />
              <meshBasicMaterial ref={decoLineRef} color={hovered ? "#88ccff" : "#224466"} transparent opacity={hovered ? 0.8 : 0.3} />
            </mesh>

            {/* High-Tech HUD Corner Brackets */}
            {[-1, 1].map((x) => 
              [-1, 1].map((y) => (
                <group key={`corner-${x}-${y}`} position={[x * (project.scale[0]/2 - 0.2), y * (project.scale[1]/2 - 0.2), 0]}>
                  {/* Horizontal bracket piece */}
                  <mesh position={[-x * 0.1, 0, 0]}>
                    <planeGeometry args={[0.2, 0.015]} />
                    <meshBasicMaterial color={hovered ? "#88ccff" : "#224466"} transparent opacity={hovered ? 0.8 : 0.3} />
                  </mesh>
                  {/* Vertical bracket piece */}
                  <mesh position={[0, -y * 0.1, 0]}>
                    <planeGeometry args={[0.015, 0.2]} />
                    <meshBasicMaterial color={hovered ? "#88ccff" : "#224466"} transparent opacity={hovered ? 0.8 : 0.3} />
                  </mesh>
                </group>
              ))
            )}
          </group>
        </group>
      </group>
    </group>
  );
}

export default function ProjectScreens({ scrollProgress, onProjectClick }: { scrollProgress: number, onProjectClick: (data: any) => void }) {
  return (
    <group>
      {PROJECTS.map((p) => (
        <Screen key={p.id} project={p} scrollProgress={scrollProgress} onProjectClick={onProjectClick} />
      ))}
    </group>
  );
}
