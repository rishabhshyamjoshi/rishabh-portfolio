"use client";

import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";

/**
 * Drop-in replacement for drei's <Text> that avoids troika-three-text / webgl-sdf-generator
 * which requires the ANGLE_instanced_arrays WebGL extension.
 * 
 * Uses a simple Canvas2D -> Sprite approach instead.
 * Supports: fontSize, position, color, letterSpacing, anchorX, anchorY, maxWidth, textAlign,
 * lineHeight, children (text content), onClick, onPointerOver, onPointerOut.
 * 
 * The child <meshBasicMaterial> or <meshStandardMaterial> is ignored since we use SpriteMaterial,
 * but color from those materials is handled via the materialRef forwarding.
 */

interface CanvasTextProps {
  children: React.ReactNode;
  fontSize?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
  anchorX?: "left" | "center" | "right";
  anchorY?: "top" | "middle" | "bottom";
  letterSpacing?: number;
  maxWidth?: number;
  textAlign?: "left" | "center" | "right";
  lineHeight?: number;
  onClick?: (e: any) => void;
  onPointerOver?: (e: any) => void;
  onPointerOut?: (e: any) => void;
  ref?: any;
}

// Extract text from React children (skip material elements)
function extractText(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) {
    return children
      .filter((c) => typeof c === "string" || typeof c === "number")
      .map(String)
      .join("");
  }
  return "";
}

// Extract ref from material child elements
function extractMaterialRef(children: React.ReactNode): any {
  if (Array.isArray(children)) {
    for (const child of children) {
      if (child && typeof child === "object" && "props" in child) {
        if (child.props?.ref) return child.props.ref;
      }
    }
  }
  if (children && typeof children === "object" && "props" in children) {
    if ((children as any).props?.ref) return (children as any).props.ref;
  }
  return null;
}

function CanvasText({
  children,
  fontSize = 0.5,
  position = [0, 0, 0],
  rotation,
  color = "#ffffff",
  anchorX = "center",
  anchorY = "middle",
  letterSpacing = 0,
  maxWidth,
  textAlign = "center",
  lineHeight = 1.2,
  onClick,
  onPointerOver,
  onPointerOut,
}: CanvasTextProps) {
  const spriteRef = useRef<THREE.Sprite>(null);
  const text = extractText(children);
  const materialRef = extractMaterialRef(children);

  const { texture, aspectRatio, textWidth, textHeight } = useMemo(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    
    // Scale factor for crisp text
    const scale = 128; // pixels per Three.js unit of fontSize
    const pxSize = fontSize * scale;
    
    ctx.font = `500 ${pxSize}px 'Space Grotesk', 'Inter', 'Segoe UI', sans-serif`;
    
    // Calculate letter spacing in pixels
    const lsPixels = letterSpacing * pxSize;
    
    // Word-wrap logic
    const words = text.split(" ");
    const maxWidthPx = maxWidth ? maxWidth * scale : Infinity;
    const lines: string[] = [];
    let currentLine = "";
    
    for (const word of words) {
      const testLine = currentLine ? currentLine + " " + word : word;
      const testWidth = measureTextWithSpacing(ctx, testLine, lsPixels);
      if (testWidth > maxWidthPx && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
    
    // Calculate dimensions
    let widestLine = 0;
    for (const line of lines) {
      const w = measureTextWithSpacing(ctx, line, lsPixels);
      if (w > widestLine) widestLine = w;
    }
    
    const lineHeightPx = pxSize * lineHeight;
    const totalHeight = lines.length * lineHeightPx;
    
    // Add padding
    const padX = pxSize * 0.5;
    const padY = pxSize * 0.5;
    
    canvas.width = Math.ceil(widestLine + padX * 2);
    canvas.height = Math.ceil(totalHeight + padY * 2);
    
    // Re-set font after canvas resize
    ctx.font = `500 ${pxSize}px 'Space Grotesk', 'Inter', 'Segoe UI', sans-serif`;
    ctx.fillStyle = color;
    ctx.textBaseline = "top";
    
    // Draw each line
    for (let i = 0; i < lines.length; i++) {
      const lineW = measureTextWithSpacing(ctx, lines[i], lsPixels);
      let x = padX;
      if (textAlign === "center") x = (canvas.width - lineW) / 2;
      else if (textAlign === "right") x = canvas.width - lineW - padX;
      
      drawTextWithSpacing(ctx, lines[i], x, padY + i * lineHeightPx, lsPixels);
    }
    
    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.premultiplyAlpha = false;
    tex.needsUpdate = true;
    
    const ar = canvas.width / canvas.height;
    const threeH = totalHeight / scale;
    const threeW = threeH * ar;
    
    return {
      texture: tex,
      aspectRatio: ar,
      textWidth: threeW,
      textHeight: threeH,
    };
  }, [text, fontSize, color, letterSpacing, maxWidth, textAlign, lineHeight]);

  // If there's a material ref from a child <meshBasicMaterial ref={...}>,
  // we create a fake object so the parent can change its .color and we re-render
  useEffect(() => {
    if (materialRef?.current === undefined && materialRef) {
      // Provide a proxy object that the parent can use to set color
      materialRef.current = {
        color: new THREE.Color(color),
        _proxy: true,
      };
    }
  }, [materialRef, color]);

  // Anchor offset
  const offsetX = anchorX === "left" ? textWidth / 2 : anchorX === "right" ? -textWidth / 2 : 0;
  const offsetY = anchorY === "top" ? -textHeight / 2 : anchorY === "bottom" ? textHeight / 2 : 0;

  return (
    <sprite
      ref={spriteRef}
      position={[position[0] + offsetX, position[1] + offsetY, position[2]]}
      scale={[textWidth, textHeight, 1]}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <spriteMaterial
        map={texture}
        transparent
        depthWrite={false}
        sizeAttenuation
      />
    </sprite>
  );
}

function measureTextWithSpacing(ctx: CanvasRenderingContext2D, text: string, spacing: number): number {
  if (spacing === 0) return ctx.measureText(text).width;
  let width = 0;
  for (let i = 0; i < text.length; i++) {
    width += ctx.measureText(text[i]).width + (i < text.length - 1 ? spacing : 0);
  }
  return width;
}

function drawTextWithSpacing(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, spacing: number): void {
  if (spacing === 0) {
    ctx.fillText(text, x, y);
    return;
  }
  let currentX = x;
  for (let i = 0; i < text.length; i++) {
    ctx.fillText(text[i], currentX, y);
    currentX += ctx.measureText(text[i]).width + spacing;
  }
}

export default CanvasText;
