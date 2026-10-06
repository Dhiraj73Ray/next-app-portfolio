"use client";

import { useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// --- Geometries (module scope so they're created once, ever) ---
const humanGeo = (() => {
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
})();
const dotGeo = new THREE.CircleGeometry(0.036, 6);
const teethGeo = new THREE.CircleGeometry(0.04, 8);

// Capacity of each instanced mesh
const MAX_HUMANS = 25000;
const MAX_DOTS = 15000;
const MAX_TEETH = 4000;
const MAX_WANDERERS = 16;

// Physics constants (same as the ORIGINAL file: panicRadius = 0.40)
const PANIC_RADIUS = 0.4;
const SAFE_DISTANCE = 1.1;
const RUN_SPEED = 0.16;
const WALK_SPEED = 0.09;
const SNAP_THRESHOLD = 0.04;

const NO_MOUSE = -999;

interface Particle {
  home: THREE.Vector3;
  current: THREE.Vector3;
  color: THREE.Color;
  isPanicking: boolean;
  settled: boolean; // true = sitting at home, matrix already uploaded
  rotationZ: number;
  isWanderer: boolean;
  wanderPhase: number;
  wanderSpeed: number;
}

function makeParticle(x: number, y: number, color: THREE.Color): Particle {
  return {
    home: new THREE.Vector3(x, y, 0),
    current: new THREE.Vector3(x, y, 0),
    color,
    isPanicking: false,
    settled: false, // false so the very first frame writes its matrix
    rotationZ: 0,
    isWanderer: false,
    wanderPhase: 0,
    wanderSpeed: 0,
  };
}

function CrowdScene({ imageUrl }: { imageUrl: string }) {
  const { gl, camera } = useThree();

  const humansRef = useRef<THREE.InstancedMesh>(null);
  const dotsRef = useRef<THREE.InstancedMesh>(null);
  const teethRef = useRef<THREE.InstancedMesh>(null);
  const wanderersRef = useRef<THREE.InstancedMesh>(null);

  const humans = useRef<Particle[]>([]);
  const dots = useRef<Particle[]>([]);
  const teeth = useRef<Particle[]>([]);
  const wanderers = useRef<Particle[]>([]);
  const visible = useRef(true);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const mouse3D = useRef(new THREE.Vector3(NO_MOUSE, NO_MOUSE, 0));
  const fleeVec = useMemo(() => new THREE.Vector3(), []);
  const homeVec = useMemo(() => new THREE.Vector3(), []);

  // Pointer -> world (window-level listener, like the original file)
  const ndc = useRef(new THREE.Vector2());
  const hasPointer = useRef(false);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
    [],
  );
  const hit = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    const el = gl.domElement;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect(); // includes CSS scale, so mapping stays correct while zooming
      if (!r.width || !r.height) return;
      ndc.current.set(
        ((e.clientX - r.left) / r.width) * 2 - 1,
        -((e.clientY - r.top) / r.height) * 2 + 1,
      );
      hasPointer.current = true;
    };
    const onLeave = () => {
      hasPointer.current = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [gl]);

  // --- Parse the image ONCE ---
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "Anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxDimension = 200;
      let { width, height } = img;

      // Only DOWNscale (same as the original file; never upscale)
      if (width > height) {
        if (width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        }
      } else if (height > maxDimension) {
        width = Math.round((width * maxDimension) / height);
        height = maxDimension;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, width, height);
      const imgData = ctx.getImageData(0, 0, width, height).data;

      const parsedHumans: Particle[] = [];
      const parsedDots: Particle[] = [];
      const parsedTeeth: Particle[] = [];

      const baseSpacing = 0.038;
      const scale = 1.2;

      const leftFadeZoneEnd = width * 0.1;
      const rightFadeZoneStart = width * 0.8;
      const totalHorizFadeWidth = width * 0.2;
      const bottomFadeZoneStart = height * 0.95;
      const totalFadeZoneHeight = height - bottomFadeZoneStart;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (x < leftFadeZoneEnd && Math.random() > x / leftFadeZoneEnd)
            continue;
          if (
            x > rightFadeZoneStart &&
            Math.random() > 1 - (x - rightFadeZoneStart) / totalHorizFadeWidth
          )
            continue;
          if (
            y > bottomFadeZoneStart &&
            Math.random() > 1 - (y - bottomFadeZoneStart) / totalFadeZoneHeight
          )
            continue;

          const i = (y * width + x) * 4;
          const r = imgData[i] / 255;
          const g = imgData[i + 1] / 255;
          const b = imgData[i + 2] / 255;
          const alpha = imgData[i + 3];
          if (alpha < 50) continue;

          let xPos = (x - width / 2) * baseSpacing;
          let yPos = -(y - height / 2) * baseSpacing + 0.25;

          xPos = xPos * (scale + 0.05);
          yPos = yPos * scale;

          const distanceFromCenter = Math.sqrt(
            xPos * xPos + (yPos - 0.3 * scale) * (yPos - 0.3 * scale),
          );
          const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;

          const isWhitePixel = r > 0.8 && g > 0.8 && b > 0.75;
          const isLightPixel = r > 0.7 && g > 0.65 && b > 0.6;
          const isMouthArea =
            Math.abs(xPos) < 0.4 * scale &&
            yPos > -0.2 * scale &&
            yPos < 0.15 * scale;
          const isFaceCenter = distanceFromCenter <= 0.7 * scale;
          const isToothPixel =
            (isWhitePixel || isLightPixel) && (isMouthArea || isFaceCenter);
          const isBackgroundWhite =
            r > 0.75 &&
            g > 0.75 &&
            b > 0.72 &&
            distanceFromCenter > 0.55 * scale &&
            !isToothPixel;

          if (isBackgroundWhite) continue;

          const isSkinTone = r > b * 1.22 && r > 0.22;
          const isFineFacialFeature =
            (brightness > 0.15 && brightness < 0.72 && isSkinTone) ||
            isToothPixel;

          // sRGB input -> working (linear) colour, same as THREE.Color('rgb(...)')
          const p = makeParticle(
            xPos,
            yPos,
            new THREE.Color().setRGB(r, g, b, THREE.SRGBColorSpace),
          );

          if (isToothPixel) parsedTeeth.push(p);
          else if (isFineFacialFeature) parsedDots.push(p);
          else parsedHumans.push(p);
        }
      }

      // Wanderers (own tiny mesh so the big human buffer isn't re-uploaded every frame)
      const wandererPositions = [
        { x: -4.2, y: 2.8 },
        { x: -3.8, y: 1.2 },
        { x: -4.5, y: -2.0 },
        { x: -3.0, y: -3.5 },
        { x: 3.9, y: 3.2 },
        { x: 4.5, y: 1.5 },
        { x: 3.5, y: -1.5 },
        { x: 4.2, y: -3.2 },
      ];
      const parsedWanderers = wandererPositions.map((pos) => {
        const p = makeParticle(
          pos.x,
          pos.y,
          new THREE.Color().setRGB(1, 1, 1, THREE.SRGBColorSpace),
        );
        p.isWanderer = true;
        p.wanderPhase = Math.random() * 100;
        p.wanderSpeed = 0.15 + Math.random() * 0.3;
        return p;
      });

      humans.current = parsedHumans;
      dots.current = parsedDots;
      teeth.current = parsedTeeth;
      wanderers.current = parsedWanderers;

      const initMesh = (
        mesh: THREE.InstancedMesh | null,
        data: Particle[],
        cap: number,
      ) => {
        if (!mesh) return;
        const count = Math.min(data.length, cap);
        mesh.count = count;
        const colorArray = new Float32Array(cap * 3);
        for (let i = 0; i < count; i++)
          data[i].color.toArray(colorArray, i * 3);
        mesh.instanceColor = new THREE.InstancedBufferAttribute(colorArray, 3);
        mesh.instanceColor.needsUpdate = true;
        (mesh.material as THREE.Material).needsUpdate = true;
      };

      initMesh(humansRef.current, parsedHumans, MAX_HUMANS);
      initMesh(dotsRef.current, parsedDots, MAX_DOTS);
      initMesh(teethRef.current, parsedTeeth, MAX_TEETH);
      initMesh(wanderersRef.current, parsedWanderers, MAX_WANDERERS);
    };

    img.src = imageUrl;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl]);

  // Tab visibility
  useEffect(() => {
    const onVis = () => {
      visible.current = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVis);
    onVis();
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useFrame((state) => {
    if (!visible.current) return;
    const time = state.clock.getElapsedTime();

    // Pointer -> point on the z=0 plane
    if (hasPointer.current) {
      raycaster.setFromCamera(ndc.current, camera);
      if (raycaster.ray.intersectPlane(plane, hit)) {
        mouse3D.current.copy(hit);
      } else {
        mouse3D.current.set(NO_MOUSE, NO_MOUSE, 0);
      }
    } else {
      mouse3D.current.set(NO_MOUSE, NO_MOUSE, 0);
    }
    const mouse = mouse3D.current;
    const mouseActive = mouse.x > -900;

    const panicR2 = PANIC_RADIUS * PANIC_RADIUS;
    const safeR2 = SAFE_DISTANCE * SAFE_DISTANCE;

    const writeMatrix = (
      mesh: THREE.InstancedMesh,
      i: number,
      p: Particle,
      baseScale: number,
    ) => {
      dummy.position.copy(p.current);
      dummy.rotation.z = p.rotationZ;
      dummy.scale.set(baseScale, baseScale, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    };

    const updateGroup = (
      particles: Particle[],
      mesh: THREE.InstancedMesh | null,
      baseScale: number,
      doRotation: boolean,
    ) => {
      if (!mesh) return;
      const count = Math.min(particles.length, mesh.count);
      let dirty = false;

      for (let i = 0; i < count; i++) {
        const p = particles[i];

        // Fast path: sitting at home and mouse is far away -> nothing to do
        if (p.settled) {
          if (!mouseActive) continue;
          const dx = p.current.x - mouse.x;
          const dy = p.current.y - mouse.y;
          if (dx * dx + dy * dy >= panicR2) continue;
          p.settled = false;
        }

        const dMouseSq = p.current.distanceToSquared(mouse);
        const dHomeSq = p.current.distanceToSquared(p.home);
        const mouseToHomeSq = p.home.distanceToSquared(mouse);

        if (!p.isPanicking && dMouseSq < panicR2) p.isPanicking = true;
        if (p.isPanicking && dMouseSq > safeR2 && mouseToHomeSq > safeR2)
          p.isPanicking = false;

        if (p.isPanicking) {
          fleeVec.subVectors(p.current, mouse).setZ(0);
          if (fleeVec.lengthSq() > 0.001) {
            fleeVec.normalize();
            if (dMouseSq < safeR2) {
              const distToMouse = Math.sqrt(dMouseSq);
              const forceFactor = (SAFE_DISTANCE - distToMouse) / SAFE_DISTANCE;
              p.current.addScaledVector(
                fleeVec,
                RUN_SPEED * (1.0 + forceFactor * 2.5),
              );
            }
            if (doRotation)
              p.rotationZ = THREE.MathUtils.lerp(
                p.rotationZ,
                Math.atan2(fleeVec.y, fleeVec.x) - Math.PI / 2,
                0.25,
              );
          }
        } else if (dHomeSq > SNAP_THRESHOLD * SNAP_THRESHOLD) {
          homeVec.subVectors(p.home, p.current).setZ(0);
          if (homeVec.lengthSq() > 0.001) {
            homeVec.normalize();
            p.current.lerp(p.home, WALK_SPEED);
            if (doRotation)
              p.rotationZ = THREE.MathUtils.lerp(
                p.rotationZ,
                Math.atan2(homeVec.y, homeVec.x) - Math.PI / 2,
                0.2,
              );
          }
        } else {
          p.current.copy(p.home);
          if (doRotation) p.rotationZ = 0;
          p.settled = true; // matrix is written below one last time, then skipped
        }

        writeMatrix(mesh, i, p, baseScale);
        dirty = true;
      }

      if (dirty) mesh.instanceMatrix.needsUpdate = true;
    };

    // Wanderers: always moving, but only 8 instances (tiny upload)
    const wm = wanderersRef.current;
    if (wm) {
      const list = wanderers.current;
      const n = Math.min(list.length, wm.count);
      for (let i = 0; i < n; i++) {
        const p = list[i];
        p.current.x =
          p.home.x + Math.sin(time * p.wanderSpeed + p.wanderPhase) * 0.5;
        p.current.y =
          p.home.y +
          Math.cos(time * p.wanderSpeed * 0.7 + p.wanderPhase) * 0.4;
        p.rotationZ = Math.sin(time * p.wanderSpeed) * 0.15;
        writeMatrix(wm, i, p, 0.42);
      }
      wm.instanceMatrix.needsUpdate = true;
    }

    updateGroup(humans.current, humansRef.current, 0.42, true);
    updateGroup(dots.current, dotsRef.current, 1, false);
    updateGroup(teeth.current, teethRef.current, 1, false);
  });

  return (
    <>
      <instancedMesh
        ref={humansRef}
        args={[humanGeo, undefined, MAX_HUMANS]}
        count={0}
        frustumCulled={false}
      >
        <meshBasicMaterial side={THREE.DoubleSide} toneMapped={false} />
      </instancedMesh>
      <instancedMesh
        ref={dotsRef}
        args={[dotGeo, undefined, MAX_DOTS]}
        count={0}
        frustumCulled={false}
      >
        <meshBasicMaterial side={THREE.DoubleSide} toneMapped={false} />
      </instancedMesh>
      <instancedMesh
        ref={teethRef}
        args={[teethGeo, undefined, MAX_TEETH]}
        count={0}
        frustumCulled={false}
      >
        <meshBasicMaterial side={THREE.DoubleSide} toneMapped={false} />
      </instancedMesh>
      <instancedMesh
        ref={wanderersRef}
        args={[humanGeo, undefined, MAX_WANDERERS]}
        count={0}
        frustumCulled={false}
      >
        <meshBasicMaterial side={THREE.DoubleSide} toneMapped={false} />
      </instancedMesh>
    </>
  );
}

export default function WelcomeCrowd({
  imageUrl,
  active = true,
}: {
  imageUrl: string;
  active?: boolean;
}) {
  return (
    <Canvas
      // Render loop fully stops when the hero is scrolled away
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 10.5], fov: 40 }}
      dpr={[1, 2]}
      // flat = no ACES tone mapping -> colours identical to the raw WebGLRenderer version
      flat
      // Use offsetWidth/Height so the parent's CSS scale() never triggers canvas resizes
      resize={{ offsetSize: true, scroll: false }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
    >
      <CrowdScene imageUrl={imageUrl} />
    </Canvas>
  );
}