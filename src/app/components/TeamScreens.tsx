"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text, Edges, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { AudioController } from "../utils/AudioController";

import { TEAM, TeamData } from "../data/team";

function TeamScreen({ member, scrollProgress, onMemberClick }: { member: TeamData, scrollProgress: number, onMemberClick: (data: any) => void }) {
  const meshRef = useRef<THREE.Group>(null);
  const scaleRef = useRef<THREE.Group>(null);
  const bgGroupRef = useRef<THREE.Group>(null);
  const fgGroupRef = useRef<THREE.Group>(null);
  
  const glassMaterialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const decoLineRef = useRef<THREE.MeshBasicMaterial>(null);
  const edgesRef = useRef<any>(null);
  const titleMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const sub1MaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  
  const [hovered, setHovered] = useState(false);
  const currentTime = useRef(0);
  const hoverFactor = useRef(0);

  const texture = useTexture(member.image);

  // Create curved geometry for wrapping effect
  const curvedGeometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(member.scale[0], member.scale[1], 32, 32);
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
  }, [member.scale]);

  // Interactive Liquid Hologram Shader for Team Cards
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
          
          vec3 neonColor = mix(vec3(1.0, 0.3, 0.0), vec3(1.0, 0.8, 0.2), sin(uTime * 2.0) * 0.5 + 0.5);
          
          // Desaturate image slightly when not hovered
          float gray = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
          vec3 finalTex = mix(vec3(gray) * vec3(1.0, 0.6, 0.4), texColor.rgb, uHover);
          
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
    if (scrollProgress > 2 && scrollProgress <= 3) {
      localScrollProgress = scrollProgress - 2;
    } else if (scrollProgress > 3 && scrollProgress <= 4) {
      localScrollProgress = Math.max(0, 1 - (scrollProgress - 3));
    } else {
      localScrollProgress = 0;
    }
    const radius = Math.pow(localScrollProgress, 1.5) * 22; // Increased to 22 to clear the massive Mars
    const x = 40 + Math.cos(member.angle + t * 0.2) * radius;
    const z = Math.sin(member.angle + t * 0.2) * radius - 2; 
    const y = Math.sin(t * 1 + parseInt(member.id.split("-")[1])) * 0.5;

    meshRef.current.position.set(x, y, z);
    meshRef.current.lookAt(40, 0, -2);
    
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
        glassMaterialRef.current.color.setHex(0x4a1b0c);
        decoLineRef.current.color.setHex(0xffaa66);
        if (edgesRef.current && edgesRef.current.material) edgesRef.current.material.color.setHex(0xff6633);
        if (titleMaterialRef.current) titleMaterialRef.current.color.setHex(0xffffff);
        if (sub1MaterialRef.current) sub1MaterialRef.current.color.setHex(0xaaaaaa);
      } else {
        glassMaterialRef.current.color.setHex(0x1a0a04);
        decoLineRef.current.color.setHex(0x663311);
        if (edgesRef.current && edgesRef.current.material) edgesRef.current.material.color.setHex(0x331100);
        if (titleMaterialRef.current) titleMaterialRef.current.color.setHex(0xcc8866);
        if (sub1MaterialRef.current) sub1MaterialRef.current.color.setHex(0x664433);
      }
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    onMemberClick({
      ...member,
      animationTime: currentTime.current
    });
  };

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setHovered(true);
  };

  return (
    <group ref={meshRef} visible={scrollProgress > 2}>
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
              fontSize={0.25}
              position={[-member.scale[0]/2 + 0.3, member.scale[1]/2 - 0.3, 0]}
              anchorX="left"
              anchorY="top"
              letterSpacing={0.1}
            >
              <meshBasicMaterial ref={sub1MaterialRef} />
              {member.initials}
            </Text>
            
            <Text
              fontSize={0.35}
              position={[0, 0, 0]}
              maxWidth={member.scale[0] - 1}
              lineHeight={1.2}
              letterSpacing={0.1}
              textAlign="center"
              anchorX="center"
              anchorY="bottom"
            >
              <meshBasicMaterial ref={titleMaterialRef} />
              {member.name.toUpperCase()}
            </Text>

            <Text
              fontSize={0.15}
              position={[0, -0.3, 0]}
              maxWidth={member.scale[0] - 1}
              textAlign="center"
              anchorX="center"
              anchorY="top"
              letterSpacing={0.1}
            >
              <meshBasicMaterial color="rgba(255,255,255,0.6)" />
              {member.role.toUpperCase()}
            </Text>

            {/* Curved Deco Line */}
            <mesh position={[0, -member.scale[1]/2 + 0.4, 0]}>
              <planeGeometry args={[member.scale[0] - 1.5, 0.015]} />
              <meshBasicMaterial ref={decoLineRef} color={hovered ? "#ffaa66" : "#663311"} transparent opacity={hovered ? 0.8 : 0.3} />
            </mesh>

            {/* High-Tech HUD Corner Brackets */}
            {[-1, 1].map((x) => 
              [-1, 1].map((y) => (
                <group key={`corner-${x}-${y}`} position={[x * (member.scale[0]/2 - 0.2), y * (member.scale[1]/2 - 0.2), 0]}>
                  {/* Horizontal bracket piece */}
                  <mesh position={[-x * 0.1, 0, 0]}>
                    <planeGeometry args={[0.2, 0.015]} />
                    <meshBasicMaterial color={hovered ? "#ffaa66" : "#663311"} transparent opacity={hovered ? 0.8 : 0.3} />
                  </mesh>
                  {/* Vertical bracket piece */}
                  <mesh position={[0, -y * 0.1, 0]}>
                    <planeGeometry args={[0.015, 0.2]} />
                    <meshBasicMaterial color={hovered ? "#ffaa66" : "#663311"} transparent opacity={hovered ? 0.8 : 0.3} />
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

export default function TeamScreens({ scrollProgress, onMemberClick }: { scrollProgress: number, onMemberClick: (data: any) => void }) {
  return (
    <group>
      {TEAM.map((m) => (
        <TeamScreen key={m.id} member={m} scrollProgress={scrollProgress} onMemberClick={onMemberClick} />
      ))}
    </group>
  );
}
