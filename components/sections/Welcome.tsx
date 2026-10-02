"use client";

import React, { useEffect, useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import * as THREE from 'three';

export default function Welcome() {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  // Refs for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const crowdSystemRef = useRef<any>(null);
  const isRunningRef = useRef(true);
  const animationFrameRef = useRef<number | null>(null);
  const raycasterRef = useRef<THREE.Raycaster | null>(null);
  const mouse3DRef = useRef<THREE.Vector3 | null>(null);
  const mouse2DRef = useRef<THREE.Vector2 | null>(null);
  const interactionPlaneRef = useRef<THREE.Mesh | null>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });

  const crowdScale = useTransform(scrollYProgress, [0, 0.25], [1, 1.8]);
  const crowdSpread = useTransform(scrollYProgress, [0, 0.25], [0, 100]);
  const crowdOpacity = useTransform(scrollYProgress, [0, 0.25, 0.3], [1, 1, 0]);

  // The Animation Loop
  const animate = (time: number) => {
    if (!isRunningRef.current) {
      animationFrameRef.current = null;
      return;
    }

    const raycaster = raycasterRef.current;
    const camera = cameraRef.current;
    const scene = sceneRef.current;
    const renderer = rendererRef.current;
    const crowdSystem = crowdSystemRef.current;
    const mouse2D = mouse2DRef.current;
    const mouse3D = mouse3DRef.current;
    const interactionPlane = interactionPlaneRef.current;

    if (!scene || !camera || !renderer || !raycaster || !mouse2D || !mouse3D || !interactionPlane || !crowdSystem) return;

    raycaster.setFromCamera(mouse2D, camera);
    const intersects = raycaster.intersectObject(interactionPlane);

    if (intersects.length > 0) {
      mouse3D.copy(intersects[0].point);
    } else {
      mouse3D.set(-999, -999, 0);
    }

    crowdSystem.update(mouse3D, time * 0.001);
    renderer.render(scene, camera);

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    let cleanupHandler: (() => void) | null = null;

    const init = async () => {
      // parsePortraitImage function
      const parsePortraitImage = (imageSrc: string, maxDimension = 150, samplingStep = 3, spacing = 0.15) => {
        return new Promise<any[]>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "Anonymous";

          img.onload = () => {
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > maxDimension) {
                height = Math.round((height * maxDimension) / width);
                width = maxDimension;
              }
            } else {
              if (height > maxDimension) {
                width = Math.round((width * maxDimension) / height);
                height = maxDimension;
              }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
              reject(new Error("Could not create 2D canvas context."));
              return;
            }

            ctx.drawImage(img, 0, 0, width, height);
            const imgData = ctx.getImageData(0, 0, width, height).data;
            const parsedPoints = [];

            const leftFadeZoneEnd = width * 0.10;
            const rightFadeZoneStart = width * 0.80;
            const totalHorizFadeWidth = width * 0.20;
            const bottomFadeZoneStart = height * 0.95;
            const totalFadeZoneHeight = height - bottomFadeZoneStart;

            for (let y = 0; y < height; y += samplingStep) {
              for (let x = 0; x < width; x += samplingStep) {

                if (x < leftFadeZoneEnd) {
                  const survivalProbability = x / leftFadeZoneEnd;
                  if (Math.random() > survivalProbability) continue;
                }

                if (x > rightFadeZoneStart) {
                  const distanceIntoFadeZone = x - rightFadeZoneStart;
                  const survivalProbability = 1 - (distanceIntoFadeZone / totalHorizFadeWidth);
                  if (Math.random() > survivalProbability) continue;
                }

                if (y > bottomFadeZoneStart) {
                  const distanceIntoFadeZone = y - bottomFadeZoneStart;
                  const survivalProbability = 1 - (distanceIntoFadeZone / totalFadeZoneHeight);
                  if (Math.random() > survivalProbability) continue;
                }

                const pixelIndex = (y * width + x) * 4;
                const r = imgData[pixelIndex];
                const g = imgData[pixelIndex + 1];
                const b = imgData[pixelIndex + 2];
                const alpha = imgData[pixelIndex + 3];

                if (alpha < 50) continue;

                const brightness = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

                const ThreedX = (x - width / 2) * spacing;
                const ThreedZ = (y - height / 2) * spacing;
                const ThreedY = 0;

                parsedPoints.push({
                  homePos: new THREE.Vector3(ThreedX, ThreedY, ThreedZ),
                  color: new THREE.Color(`rgb(${r}, ${g}, ${b})`),
                  brightness: brightness
                });
              }
            }

            resolve(parsedPoints);
          };

          img.onerror = (err) => {
            reject(new Error(`Failed to load portrait image: ${err}`));
          };

          img.src = imageSrc;
        });
      };

      // CrowdSystem Class
      class CrowdSystem {
        crowd: any[];
        panicRadius: number;
        safeDistance: number;
        runSpeed: number;
        walkSpeed: number;
        snapThreshold: number;

        constructor() {
          this.crowd = [];
          this.panicRadius = 0.40;
          this.safeDistance = 1.1;
          this.runSpeed = 0.16;
          this.walkSpeed = 0.09;
          this.snapThreshold = 0.04;
        }

        registerAgent(mesh: THREE.Mesh, homeX: number, homeY: number, homeZ: number, isHuman = false, isWanderer = false) {
          this.crowd.push({
            mesh: mesh,
            homePos: new THREE.Vector3(homeX, homeY, homeZ),
            isPanicking: false,
            isHuman: isHuman,
            isWanderer: isWanderer,
            wanderPhase: Math.random() * 100,
            wanderSpeed: 0.15 + Math.random() * 0.3
          });
        }

        update(mouse3D: THREE.Vector3, time: number) {
          const fleeVec = new THREE.Vector3();
          const homeVec = new THREE.Vector3();

          for (let i = 0; i < this.crowd.length; i++) {
            const agent = this.crowd[i];

            if (agent.isWanderer) {
              agent.mesh.position.x = agent.homePos.x + Math.sin(time * agent.wanderSpeed + agent.wanderPhase) * 0.5;
              agent.mesh.position.y = agent.homePos.y + Math.cos(time * agent.wanderSpeed * 0.7 + agent.wanderPhase) * 0.4;
              agent.mesh.rotation.z = Math.sin(time * agent.wanderSpeed) * 0.15;
              continue;
            }

            const distToMouse = agent.mesh.position.distanceTo(mouse3D);
            const distToHome = agent.mesh.position.distanceTo(agent.homePos);
            const mouseDistToMyHome = agent.homePos.distanceTo(mouse3D);

            if (!agent.isPanicking && distToMouse < this.panicRadius) {
              agent.isPanicking = true;
            }
            if (agent.isPanicking && distToMouse > this.safeDistance && mouseDistToMyHome > this.safeDistance) {
              agent.isPanicking = false;
            }

            if (agent.isPanicking) {
              fleeVec.subVectors(agent.mesh.position, mouse3D);
              fleeVec.z = 0;

              if (fleeVec.lengthSq() > 0.001) {
                fleeVec.normalize();
                const forceFactor = (this.safeDistance - distToMouse) / this.safeDistance;
                const dynamicSpeed = this.runSpeed * (1.0 + forceFactor * 2.5);

                if (distToMouse < this.safeDistance) {
                  agent.mesh.position.addScaledVector(fleeVec, dynamicSpeed);
                }

                if (agent.isHuman) {
                  const angle = Math.atan2(fleeVec.y, fleeVec.x) - Math.PI / 2;
                  agent.mesh.rotation.z = THREE.MathUtils.lerp(agent.mesh.rotation.z, angle, 0.25);
                }
              }
            }
            else if (distToHome > this.snapThreshold) {
              homeVec.subVectors(agent.homePos, agent.mesh.position);
              homeVec.z = 0;

              if (homeVec.lengthSq() > 0.001) {
                homeVec.normalize();
                agent.mesh.position.lerp(agent.homePos, this.walkSpeed);

                if (agent.isHuman) {
                  const angle = Math.atan2(homeVec.y, homeVec.x) - Math.PI / 2;
                  agent.mesh.rotation.z = THREE.MathUtils.lerp(agent.mesh.rotation.z, angle, 0.2);
                }
              }
            }
            else {
              agent.mesh.position.copy(agent.homePos);
              agent.mesh.rotation.z = 0;
            }
          }
        }
      }

      function createHumanSilhouetteGeometry() {
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
      }

      const container = containerRef.current;
      if (!container) return;

      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
      camera.position.set(0, 0, 10.5);
      camera.lookAt(0, 0, 0);
      cameraRef.current = camera;

      const interactionPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(150, 150),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      scene.add(interactionPlane);
      interactionPlaneRef.current = interactionPlane;

      const crowdSystem = new CrowdSystem();
      crowdSystemRef.current = crowdSystem;

      const mouse2D = new THREE.Vector2(-999, -999);
      const mouse3D = new THREE.Vector3(-999, -999, 0);
      const raycaster = new THREE.Raycaster();
      mouse2DRef.current = mouse2D;
      mouse3DRef.current = mouse3D;
      raycasterRef.current = raycaster;

      const humanGeo = createHumanSilhouetteGeometry();
      const dotGeo = new THREE.CircleGeometry(0.036, 6); // Smaller dots for higher res
      const baseSpacing = 0.038; // Tighter packing (was 0.054)
      const maxDimension = 200; // Higher internal resolution (was 130)

      parsePortraitImage('/img/Its ME.jpg', maxDimension, 1, baseSpacing)
        .then((agentDataPoints) => {
          agentDataPoints.forEach((point) => {
            const colorObj = point.color;
            let xPos = point.homePos.x;
            let yPos = -point.homePos.z + 0.25;
            const zPos = 0;

            const scale = 1.2;
            xPos = xPos * (scale + 0.05);
            yPos = yPos * scale;

            const distanceFromCenter = Math.sqrt(xPos * xPos + (yPos - 0.3 * scale) * (yPos - 0.3 * scale));

            const isWhitePixel = (colorObj.r > 0.80 && colorObj.g > 0.80 && colorObj.b > 0.75);
            const isLightPixel = (colorObj.r > 0.70 && colorObj.g > 0.65 && colorObj.b > 0.60);
            const isMouthArea = (Math.abs(xPos) < 0.4 * scale) && (yPos > -0.2 * scale && yPos < 0.15 * scale);
            const isFaceCenter = distanceFromCenter <= 0.7 * scale;
            const isToothPixel = (isWhitePixel || isLightPixel) && (isMouthArea || isFaceCenter);
           // Lowered the RGB threshold slightly and pulled the center radius in from 0.8 to 0.55
const isBackgroundWhite = (colorObj.r > 0.75 && colorObj.g > 0.75 && colorObj.b > 0.72) &&
              distanceFromCenter > 0.55 * scale &&
              !isToothPixel;
            if (isBackgroundWhite) return;

            const isSkinTone = (colorObj.r > colorObj.b * 1.22) && (colorObj.r > 0.22);
            const isTeethZone = isToothPixel;
            const isFineFacialFeature = (point.brightness > 0.15 && point.brightness < 0.72 && isSkinTone) || isTeethZone;

            if (isFineFacialFeature) {
              const finalDotGeo = isTeethZone ? new THREE.CircleGeometry(0.04, 8) : dotGeo;
              const mat = new THREE.MeshBasicMaterial({ color: colorObj });
              const mesh = new THREE.Mesh(finalDotGeo, mat);
              mesh.position.set(xPos, yPos, zPos);
              scene.add(mesh);
              crowdSystem.registerAgent(mesh, xPos, yPos, zPos, false);
            } else {
              const mat = new THREE.MeshBasicMaterial({ color: colorObj, side: THREE.DoubleSide });
              const mesh = new THREE.Mesh(humanGeo, mat);
              mesh.position.set(xPos, yPos, zPos);
              mesh.scale.set(0.42, 0.42, 1);
              scene.add(mesh);
              crowdSystem.registerAgent(mesh, xPos, yPos, zPos, true);
            }
          });

          const wandererPositions = [
            { x: -4.2, y: 2.8 }, { x: -3.8, y: 1.2 }, { x: -4.5, y: -2.0 }, { x: -3.0, y: -3.5 },
            { x: 3.9, y: 3.2 }, { x: 4.5, y: 1.5 }, { x: 3.5, y: -1.5 }, { x: 4.2, y: -3.2 }
          ];

          wandererPositions.forEach((pos) => {
            const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
            const mesh = new THREE.Mesh(humanGeo, mat);
            mesh.position.set(pos.x, pos.y, 0);
            mesh.scale.set(0.42, 0.42, 1);
            scene.add(mesh);
            crowdSystem.registerAgent(mesh, pos.x, pos.y, 0, true, true);
          });
        })
        .catch(err => console.error("Error loading portrait:", err));

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      rendererRef.current = renderer;

      container.innerHTML = '';
      container.appendChild(renderer.domElement);

      const handleMouseMove = (event: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        mouse2D.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse2D.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      };
      window.addEventListener('mousemove', handleMouseMove);

      const handleResize = () => {
        if (!container) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', handleResize);

      cleanupHandler = () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        if (container) {
          container.innerHTML = '';
        }
        if (renderer) {
          renderer.dispose();
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    init();

    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const shouldRun = latest < 0.3;
      isRunningRef.current = shouldRun;

      if (shouldRun && !animationFrameRef.current) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    });

    return () => {
      unsubscribe();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (cleanupHandler) {
        cleanupHandler();
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  const words = useMemo(() => [
    "Agile", "Breakthrough", "Champion", "Conceptualize", "Dedication", "Evolve",
    "Foundation", "Grit", "High-performance", "Ingenuity", "Iteration", "Junction",
    "Kinetic", "Leverage", "Milestone", "Nexus", "Overcome", "Paradigm",
    "Quantifiable", "Resilience", "Solution-oriented", "Tactical", "Ultimate",
    "Velocity", "Zeal", "Abstract", "Byte", "Capacity", "Deployment", "Efficiency",
    "Framework", "Generation", "Hypothesis", "Implementation", "Journey", "Kernel",
    "Latency", "Methodical", "Node", "Operational", "Pipeline", "Quality",
    "Real-time", "Scalability", "Threshold", "Utilitarian", "Virtualization",
    "Web-scale", "X-factor", "Yield", "Architected", "Resilient", "Automated",
    "Tenacity", "Refactored", "Strategist", "Scalable", "Persistence", "Engineered",
    "Mastery", "Analytical", "Legacy", "Streamlined", "Precision", "Boss-fight",
    "Modular", "Unapologetic", "Deployment", "Hustle", "Algorithmic", "Protagonist",
    "Optimized", "Endurance", "Dynamic", "Syntax", "Catalyst", "Visionary",
    "Level-up", "Robust", "Synergy", "Immersive", "Debugged", "Disciplined",
    "Quest", "Documentation", "Empowered", "Logic", "Grinding", "Deployment",
    "Versatile", "Awakening", "Performance", "Lifecycle", "Meticulous",
    "Optimization", "Adaptive", "Impact", "Coffee-to-code", "Infrastructure",
    "Workflow"
  ], []);

  return (
    <motion.section
      ref={targetRef}
      // 1. Swapped the dark gradient for your theme's cream background and ink border
      className="relative h-[100vh] w-full overflow-hidden bg-cream border-b-4 border-ink"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        
        {/* Word Cloud */}
        <div className="absolute inset-0 select-none overflow-hidden font-sans pointer-events-none">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1, // Upped opacity since we control it per-word now
                transition: { staggerChildren: 0.05 }
              }
            }}
            className="absolute inset-0 p-10 flex flex-wrap content-center gap-6 z-0"
          >
            {words.map((word, i) => {
              // 2. Swapped sky-blue/slate for transparent versions of Ink, Olive, and Burnt
              const colors = ["text-ink/10", "text-olive/15", "text-burnt/10"];
              const sizes = ["text-2xl", "text-4xl", "text-5xl"];
              return (
                <motion.span
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className={`${colors[i % colors.length]} ${sizes[i % sizes.length]} font-black uppercase`}
                >
                  {word}
                </motion.span>
              );
            })}
          </motion.div>
        </div>

        {/* 3D Canvas */}
        <motion.div
          ref={containerRef}
          className="absolute inset-0 w-full h-full z-10"
          style={{
            scale: crowdScale,
            x: crowdSpread,
            y: crowdSpread,
            opacity: crowdOpacity
          }}
        />

        {/* Giant Background Text */}
        <div className="absolute inset-0 flex items-end justify-center pb-24 lg:pb-28 z-[-1] pointer-events-none">
          <motion.h1
            // 3. Changed text-white and drop-shadow to your Ink color with a subtle opacity
            className="text-5xl md:text-7xl lg:text-[7.5rem] text-burnt font-black tracking-[0.2em] uppercase text-center"
            style={{ opacity: useTransform(scrollYProgress, [0, 0.2, 0.3], [0.55, 0.55, 0]) }}
          >
            DHIRAJ RAY
          </motion.h1>
        </div>

        {/* Scroll Indicator */}
        {/* 4. Changed text-slate-400 to text-olive to match your secondary labels */}
        <div className="absolute bottom-10 left-10 z-30 text-olive text-xs font-mono tracking-widest uppercase flex items-center gap-1.5 pointer-events-auto">
          <span>Scroll Down</span>
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          >
            ↓
          </motion.span>
        </div>
      </div>
    </motion.section>
  );
}