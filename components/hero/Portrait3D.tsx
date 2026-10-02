"use client";

import { useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// 1. Create the Geometries
const createHumanGeo = () => {
  const shape = new THREE.Shape();
  shape.absarc(0, 0.14, 0.04, 0, Math.PI * 2, false);
  shape.moveTo(-0.025, 0.09);
  shape.lineTo(-0.07, 0.06);
  shape.lineTo(-0.05, -0.09);
  shape.lineTo(-0.015, -0.09);
  shape.lineTo(0, -0.02);
  shape.lineTo(0.015, -0.09);
  shape.lineTo(0.05, -0.09);
  shape.lineTo(0.07, 0.06);
  shape.lineTo(0.025, 0.09);
  return new THREE.ShapeGeometry(shape);
};

const humanGeo = createHumanGeo();
const dotGeo = new THREE.CircleGeometry(0.036, 6);
const teethGeo = new THREE.CircleGeometry(0.04, 8);

// 2. The Core System
function ParticleSwarm({ imageUrl }: { imageUrl: string }) {
  const humansMeshRef = useRef<THREE.InstancedMesh>(null);
  const dotsMeshRef = useRef<THREE.InstancedMesh>(null);
  const teethMeshRef = useRef<THREE.InstancedMesh>(null);
  
  const humansRef = useRef<any[]>([]); 
  const dotsRef = useRef<any[]>([]); 
  const teethRef = useRef<any[]>([]); 
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const mouse3D = useRef(new THREE.Vector3(-999, -999, 0));

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.crossOrigin = "Anonymous";
    
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxDimension = 130;
      let { width, height } = img;
      
      if (width > height) {
        height = Math.round((height * maxDimension) / width);
        width = maxDimension;
      } else {
        width = Math.round((width * maxDimension) / height);
        height = maxDimension;
      }
      
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      ctx.drawImage(img, 0, 0, width, height);
      const imgData = ctx.getImageData(0, 0, width, height).data;
      
      const parsedHumans = [];
      const parsedDots = [];
      const parsedTeeth = [];
      
      const spacing = 0.054;
      const scale = 1.8;

      const leftFadeZoneEnd = width * 0.10;
      const rightFadeZoneStart = width * 0.80;
      const totalHorizFadeWidth = width * 0.20;
      const bottomFadeZoneStart = height * 0.95;
      const totalFadeZoneHeight = height - bottomFadeZoneStart;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          
          if (x < leftFadeZoneEnd && Math.random() > x / leftFadeZoneEnd) continue;
          if (x > rightFadeZoneStart && Math.random() > 1 - ((x - rightFadeZoneStart) / totalHorizFadeWidth)) continue;
          if (y > bottomFadeZoneStart && Math.random() > 1 - ((y - bottomFadeZoneStart) / totalFadeZoneHeight)) continue;

          const i = (y * width + x) * 4;
          const r = imgData[i] / 255;
          const g = imgData[i + 1] / 255;
          const b = imgData[i + 2] / 255;
          const alpha = imgData[i + 3];

          if (alpha < 50) continue;

          let hX = (x - width / 2) * spacing;
          let hY = (-(y - height / 2) * spacing) + 0.25;

          hX = hX * (scale + 0.05);
          hY = hY * scale;

          // Your Original Geometry Filtering Logic
          const distFromCenter = Math.sqrt(hX * hX + (hY - 0.3 * scale) * (hY - 0.3 * scale));
          const brightness = (0.2126 * (r*255) + 0.7152 * (g*255) + 0.0722 * (b*255)) / 255;
          
          const isWhitePixel = (r > 0.80 && g > 0.80 && b > 0.75);
          const isLightPixel = (r > 0.70 && g > 0.65 && b > 0.60);
          const isMouthArea = (Math.abs(hX) < 0.4 * scale) && (hY > -0.2 * scale && hY < 0.15 * scale);
          const isFaceCenter = distFromCenter <= 0.7 * scale;
          const isToothPixel = (isWhitePixel || isLightPixel) && (isMouthArea || isFaceCenter);
          const isBackgroundWhite = (r > 0.84 && g > 0.84 && b > 0.80) && distFromCenter > 0.8 * scale && !isToothPixel;

          if (isBackgroundWhite) continue;

          const isSkinTone = (r > b * 1.22) && (r > 0.22);
          const isFineFacialFeature = (brightness > 0.15 && brightness < 0.72 && isSkinTone) || isToothPixel;

          const particle = {
            home: new THREE.Vector3(hX, hY, 0),
            current: new THREE.Vector3(hX, hY, 0),
            color: new THREE.Color(r, g, b),
            isPanicking: false,
            rotationZ: 0,
            isWanderer: false
          };

          if (isToothPixel) {
            parsedTeeth.push(particle);
          } else if (isFineFacialFeature) {
            parsedDots.push(particle);
          } else {
            parsedHumans.push(particle);
          }
        }
      }

      // Add the Wanderers
      const wandererPositions = [
        { x: -4.2, y: 2.8 }, { x: -3.8, y: 1.2 }, { x: -4.5, y: -2.0 }, { x: -3.0, y: -3.5 },
        { x: 3.9, y: 3.2 }, { x: 4.5, y: 1.5 }, { x: 3.5, y: -1.5 }, { x: 4.2, y: -3.2 }
      ];
      wandererPositions.forEach(pos => {
        parsedHumans.push({
          home: new THREE.Vector3(pos.x, pos.y, 0),
          current: new THREE.Vector3(pos.x, pos.y, 0),
          color: new THREE.Color(1, 1, 1),
          isPanicking: false,
          rotationZ: 0,
          isWanderer: true,
          wanderPhase: Math.random() * 100,
          wanderSpeed: 0.15 + Math.random() * 0.3
        });
      });
      
      humansRef.current = parsedHumans;
      dotsRef.current = parsedDots;
      teethRef.current = parsedTeeth;

      // Helper to initialize colors
      const initMesh = (ref: any, data: any[]) => {
        if (!ref.current) return;
        const colorArray = new Float32Array(data.length * 3);
        data.forEach((p, i) => p.color.toArray(colorArray, i * 3));
        ref.current.instanceColor = new THREE.InstancedBufferAttribute(colorArray, 3);
        ref.current.instanceColor.needsUpdate = true;
        ref.current.count = data.length;
      };

      initMesh(humansMeshRef, parsedHumans);
      initMesh(dotsMeshRef, parsedDots);
      initMesh(teethMeshRef, parsedTeeth);
    };
  }, [imageUrl]);

  // The Physics Loop
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    const updatePhysics = (particles: any[], meshRef: any, baseScale: number, doRotation: boolean) => {
      if (!meshRef.current || particles.length === 0) return;

      const panicRadius = 0.55;
      const safeDistance = 1.1;
      const runSpeed = 0.16;
      const walkSpeed = 0.09;
      const snapThreshold = 0.04;
      const fleeVec = new THREE.Vector3();
      const homeVec = new THREE.Vector3();

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (p.isWanderer) {
          p.current.x = p.home.x + Math.sin(time * p.wanderSpeed + p.wanderPhase) * 0.5;
          p.current.y = p.home.y + Math.cos(time * p.wanderSpeed * 0.7 + p.wanderPhase) * 0.4;
          if (doRotation) p.rotationZ = Math.sin(time * p.wanderSpeed) * 0.15;
        } else {
          const distToMouse = p.current.distanceTo(mouse3D.current);
          const distToHome = p.current.distanceTo(p.home);
          const mouseDistToMyHome = p.home.distanceTo(mouse3D.current);

          if (!p.isPanicking && distToMouse < panicRadius) p.isPanicking = true;
          if (p.isPanicking && distToMouse > safeDistance && mouseDistToMyHome > safeDistance) p.isPanicking = false;

          if (p.isPanicking) {
            fleeVec.subVectors(p.current, mouse3D.current).setZ(0);
            if (fleeVec.lengthSq() > 0.001) {
              fleeVec.normalize();
              const forceFactor = (safeDistance - distToMouse) / safeDistance;
              if (distToMouse < safeDistance) {
                p.current.addScaledVector(fleeVec, runSpeed * (1.0 + forceFactor * 2.5));
              }
              if (doRotation) p.rotationZ = THREE.MathUtils.lerp(p.rotationZ, Math.atan2(fleeVec.y, fleeVec.x) - Math.PI / 2, 0.25);
            }
          } else if (distToHome > snapThreshold) {
            homeVec.subVectors(p.home, p.current).setZ(0);
            if (homeVec.lengthSq() > 0.001) {
              homeVec.normalize();
              p.current.lerp(p.home, walkSpeed);
              if (doRotation) p.rotationZ = THREE.MathUtils.lerp(p.rotationZ, Math.atan2(homeVec.y, homeVec.x) - Math.PI / 2, 0.2);
            }
          } else {
            p.current.copy(p.home);
            if (doRotation) p.rotationZ = 0;
          }
        }

        dummy.position.copy(p.current);
        dummy.rotation.z = p.rotationZ;
        dummy.scale.set(baseScale, baseScale, 1);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
    };

    // Update all 3 instances
    updatePhysics(humansRef.current, humansMeshRef, 0.42, true);
    updatePhysics(dotsRef.current, dotsMeshRef, 1, false);
    updatePhysics(teethRef.current, teethMeshRef, 1, false);
  });

  return (
    <>
      <mesh visible={false} position={[0, 0, 0]} onPointerMove={(e) => mouse3D.current.copy(e.point)} onPointerLeave={() => mouse3D.current.set(-999, -999, 0)}>
        <planeGeometry args={[150, 150]} />
      </mesh>
      
      {/* 3 Separate Instanced Meshes for Humans, Dots, and Teeth */}
      <instancedMesh ref={humansMeshRef} args={[humanGeo, undefined, 10000]}>
        <meshBasicMaterial side={THREE.DoubleSide} />
      </instancedMesh>
      <instancedMesh ref={dotsMeshRef} args={[dotGeo, undefined, 10000]}>
        <meshBasicMaterial side={THREE.DoubleSide} />
      </instancedMesh>
      <instancedMesh ref={teethMeshRef} args={[teethGeo, undefined, 5000]}>
        <meshBasicMaterial side={THREE.DoubleSide} />
      </instancedMesh>
    </>
  );
}

export default function Portrait3D() {
  return (
    <div className="absolute inset-0 w-full h-full z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10.5], fov: 40 }} style={{ pointerEvents: 'auto' }} dpr={[1, 2]}>
        <ambientLight intensity={1} />
        <ParticleSwarm imageUrl="/img/Its ME.jpg" />
      </Canvas>
    </div>
  );
}