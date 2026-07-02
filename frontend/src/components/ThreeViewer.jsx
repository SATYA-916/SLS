import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function ThreeViewer({ type }) {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    setLoading(true);

    // 1. Setup Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050b14); // Dark blueprint background

    // Grid Helper
    const gridHelper = new THREE.GridHelper(30, 30, 0x1d3557, 0x112240);
    gridHelper.position.y = -5;
    scene.add(gridHelper);

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(12, 12, 18);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Clear old contents
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    // 2. Setup Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 20, 15);
    scene.add(dirLight);

    const dirLight2 = new THREE.DirectionalLight(0x43648e, 0.5);
    dirLight2.position.set(-10, -5, -10);
    scene.add(dirLight2);

    // 3. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.1; // Don't go too far below ground
    controls.minDistance = 3;
    controls.maxDistance = 40;

    // 4. Create Group for models
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // Helper Materials
    const blueprintMat = new THREE.MeshStandardMaterial({
      color: 0x43648e,
      roughness: 0.4,
      metalness: 0.8,
      transparent: true,
      opacity: 0.85
    });

    const coilMat = new THREE.MeshStandardMaterial({
      color: 0xe63946, // Red/Copper coils
      roughness: 0.2,
      metalness: 0.9,
    });

    const stackMat = new THREE.MeshStandardMaterial({
      color: 0x8d99ae,
      roughness: 0.6,
      metalness: 0.5
    });

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x58c4ff,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });

    // 5. Generate Custom Geometries based on selected component
    const buildModel = () => {
      // Clean previous meshes
      while (modelGroup.children.length > 0) {
        modelGroup.remove(modelGroup.children[0]);
      }

      switch (type) {
        case 'heater': // Complete Fired Heater
          // Radiant chamber (cylindrical bottom)
          const radGeo = new THREE.CylinderGeometry(3.5, 3.5, 6, 32);
          const radMesh = new THREE.Mesh(radGeo, blueprintMat);
          radMesh.position.y = -2;
          modelGroup.add(radMesh);

          const radWire = new THREE.Mesh(radGeo, wireMat);
          radWire.position.y = -2;
          radWire.scale.setScalar(1.01);
          modelGroup.add(radWire);

          // Transition section cone
          const transGeo = new THREE.CylinderGeometry(2, 3.5, 2, 32);
          const transMesh = new THREE.Mesh(transGeo, blueprintMat);
          transMesh.position.y = 2;
          modelGroup.add(transMesh);

          // Convection section (rectangular top)
          const convGeo = new THREE.BoxGeometry(3.8, 5, 3.8);
          const convMesh = new THREE.Mesh(convGeo, blueprintMat);
          convMesh.position.y = 5.5;
          modelGroup.add(convMesh);

          const convWire = new THREE.Mesh(convGeo, wireMat);
          convWire.position.y = 5.5;
          convWire.scale.setScalar(1.01);
          modelGroup.add(convWire);

          // Stack chimney (thin tall tube)
          const stackGeo = new THREE.CylinderGeometry(0.8, 1, 9, 16);
          const stackMesh = new THREE.Mesh(stackGeo, stackMat);
          stackMesh.position.y = 12.5;
          modelGroup.add(stackMesh);

          // Circular Platforms
          for (let h of [-4, -1, 2, 4.5, 7.8, 11]) {
            const size = h > 2 ? 2.8 : 4.8;
            const ringGeo = new THREE.RingGeometry(size - 0.1, size + 0.8, 32);
            const ringMesh = new THREE.Mesh(ringGeo, stackMat);
            ringMesh.rotation.x = -Math.PI / 2;
            ringMesh.position.y = h;
            modelGroup.add(ringMesh);
            
            // Handrails
            const railGeo = new THREE.CylinderGeometry(size + 0.8, size + 0.8, 0.8, 32, 1, true);
            const railMesh = new THREE.Mesh(railGeo, wireMat);
            railMesh.position.y = h + 0.4;
            modelGroup.add(railMesh);
          }
          break;

        case 'radiant': // Radiant Section
          // Cylindrical casing cut-open (using cylinder with theta length)
          const casingGeo = new THREE.CylinderGeometry(4, 4, 8, 32, 1, true, 0, Math.PI * 1.5);
          const casingMesh = new THREE.Mesh(casingGeo, blueprintMat);
          casingMesh.material.side = THREE.DoubleSide;
          modelGroup.add(casingMesh);

          const casingWire = new THREE.Mesh(casingGeo, wireMat);
          casingWire.scale.setScalar(1.005);
          modelGroup.add(casingWire);

          // Vertical Coils inside
          const coilRadius = 3.2;
          for (let i = 0; i < 16; i++) {
            const angle = (i / 16) * Math.PI * 1.5;
            const tubeGeo = new THREE.CylinderGeometry(0.15, 0.15, 7.6, 8);
            const tubeMesh = new THREE.Mesh(tubeGeo, coilMat);
            tubeMesh.position.set(Math.cos(angle) * coilRadius, 0, Math.sin(angle) * coilRadius);
            modelGroup.add(tubeMesh);
          }

          // Burners at floor
          const burnerGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.6, 16);
          const burnerMat = new THREE.MeshStandardMaterial({ color: 0x3a0ca3 });
          for (let x of [-1.5, 0, 1.5]) {
            for (let z of [-1.5, 0, 1.5]) {
              if (Math.sqrt(x*x + z*z) < 3) {
                const bMesh = new THREE.Mesh(burnerGeo, burnerMat);
                bMesh.position.set(x, -3.7, z);
                modelGroup.add(bMesh);
              }
            }
          }
          break;

        case 'convection': // Convection Section Module
          // Outer box casing semi-transparent
          const convBoxGeo = new THREE.BoxGeometry(6, 6, 8);
          const convBoxMesh = new THREE.Mesh(convBoxGeo, new THREE.MeshStandardMaterial({
            color: 0x1d3557,
            transparent: true,
            opacity: 0.2,
            roughness: 0.5,
            metalness: 0.5,
            side: THREE.DoubleSide
          }));
          modelGroup.add(convBoxMesh);

          // Frame outlines
          const boxFrame = new THREE.BoxHelper(convBoxMesh, 0x58c4ff);
          modelGroup.add(boxFrame);

          // Horizontal tube bundle grid
          for (let y = -2.2; y <= 2.2; y += 1.1) {
            for (let x = -2.2; x <= 2.2; x += 1.1) {
              const tubeGeo = new THREE.CylinderGeometry(0.18, 0.18, 7.8, 12);
              const tubeMesh = new THREE.Mesh(tubeGeo, coilMat);
              tubeMesh.rotation.x = Math.PI / 2; // Lie horizontal along Z
              tubeMesh.position.set(x, y, 0);
              modelGroup.add(tubeMesh);

              // Add fin details dynamically as rings along the tubes
              for (let z = -3.5; z <= 3.5; z += 0.5) {
                const finGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.03, 8);
                const finMesh = new THREE.Mesh(finGeo, stackMat);
                finMesh.rotation.x = Math.PI / 2;
                finMesh.position.set(x, y, z);
                modelGroup.add(finMesh);
              }
            }
          }
          break;

        case 'roof': // Refinery Roof Structure
          // Center opening ring
          const ringGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 32);
          const centerRing = new THREE.Mesh(ringGeo, blueprintMat);
          modelGroup.add(centerRing);

          // Outer perimeter ring
          const ringGeo2 = new THREE.CylinderGeometry(5, 5, 0.5, 32);
          const outerRing = new THREE.Mesh(ringGeo2, blueprintMat);
          outerRing.position.y = -2;
          modelGroup.add(outerRing);

          // Beams radiating (16 rafters)
          for (let i = 0; i < 16; i++) {
            const angle = (i / 16) * Math.PI * 2;
            const rafterGeo = new THREE.BoxGeometry(0.15, 0.3, 3.6);
            const rafterMesh = new THREE.Mesh(rafterGeo, blueprintMat);
            
            rafterMesh.rotation.y = -angle;
            // Angle down from center ring to outer ring
            rafterMesh.rotation.x = 0.5; 
            
            const midRadius = 3.25;
            rafterMesh.position.set(Math.cos(angle) * midRadius, -1, Math.sin(angle) * midRadius);
            modelGroup.add(rafterMesh);
          }
          break;

        case 'platforms': // Platform Walkway System
          // Circular platforms with support brackets
          const innerR = 4;
          const outerR = 5.2;
          
          const floorGeo = new THREE.RingGeometry(innerR, outerR, 32);
          const floorMesh = new THREE.Mesh(floorGeo, new THREE.MeshStandardMaterial({
            color: 0x8d99ae,
            roughness: 0.8,
            metalness: 0.2,
            side: THREE.DoubleSide
          }));
          floorMesh.rotation.x = -Math.PI / 2;
          modelGroup.add(floorMesh);

          // Platform grid wireframe helper
          const floorWire = new THREE.Mesh(floorGeo, wireMat);
          floorWire.rotation.x = -Math.PI / 2;
          floorWire.position.y = 0.01;
          modelGroup.add(floorWire);

          // Handrails (outer circle posts and rails)
          for (let i = 0; i < 24; i++) {
            const angle = (i / 24) * Math.PI * 2;
            const postGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 8);
            const postMesh = new THREE.Mesh(postGeo, blueprintMat);
            postMesh.position.set(Math.cos(angle) * outerR, 0.6, Math.sin(angle) * outerR);
            modelGroup.add(postMesh);
          }

          // Top rail ring
          const topRail = new THREE.CylinderGeometry(outerR, outerR, 0.04, 32, 1, true);
          const topRailMesh = new THREE.Mesh(topRail, blueprintMat);
          topRailMesh.position.y = 1.2;
          modelGroup.add(topRailMesh);

          // Mid rail ring
          const midRailMesh = topRailMesh.clone();
          midRailMesh.position.y = 0.6;
          modelGroup.add(midRailMesh);

          // Support triangular brackets underneath
          for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const bracketGeo = new THREE.BoxGeometry(1.2, 0.1, 0.1);
            const bracketMesh = new THREE.Mesh(bracketGeo, blueprintMat);
            bracketMesh.position.set(Math.cos(angle) * (innerR + 0.6), -0.1, Math.sin(angle) * (innerR + 0.6));
            bracketMesh.rotation.y = -angle;
            modelGroup.add(bracketMesh);

            const strutGeo = new THREE.BoxGeometry(0.1, 1.0, 0.1);
            const strutMesh = new THREE.Mesh(strutGeo, blueprintMat);
            strutMesh.position.set(Math.cos(angle) * (innerR + 0.1), -0.6, Math.sin(angle) * (innerR + 0.1));
            strutMesh.rotation.y = -angle;
            strutMesh.rotation.z = 0.6; // Angle bracing strut
            modelGroup.add(strutMesh);
          }
          break;

        case 'staircase': // Stair Tower Assembly
          // 4 Main legs of the tower
          const legGeo = new THREE.BoxGeometry(0.15, 12, 0.15);
          for (let x of [-2, 2]) {
            for (let z of [-2, 2]) {
              const leg = new THREE.Mesh(legGeo, blueprintMat);
              leg.position.set(x, 0, z);
              modelGroup.add(leg);
            }
          }

          // Dynamic stair steps climbing up
          const stepGeo = new THREE.BoxGeometry(0.8, 0.05, 0.25);
          for (let i = 0; i < 24; i++) {
            const h = -5.5 + (i * 0.48);
            const angle = (i / 8) * Math.PI * 2;
            const step = new THREE.Mesh(stepGeo, stackMat);
            
            // Spiral distribution around center
            const r = 1.2;
            step.position.set(Math.cos(angle) * r, h, Math.sin(angle) * r);
            step.rotation.y = -angle;
            modelGroup.add(step);
          }
          break;

        case 'headerbox': // Tube Header Box
          // Casing box
          const boxGeo = new THREE.BoxGeometry(4, 5, 2);
          const boxMesh = new THREE.Mesh(boxGeo, new THREE.MeshStandardMaterial({
            color: 0x1d3557,
            transparent: true,
            opacity: 0.15,
            roughness: 0.5,
            metalness: 0.5,
            side: THREE.DoubleSide
          }));
          modelGroup.add(boxMesh);

          const boxFrame2 = new THREE.BoxHelper(boxMesh, 0x58c4ff);
          modelGroup.add(boxFrame2);

          // U-bends connecting horizontal coils (pipes coming out and looping back)
          const bendMat = new THREE.MeshStandardMaterial({ color: 0xe63946, roughness: 0.3 });
          for (let y = -1.8; y <= 1.8; y += 1.2) {
            // Torus / half ring loops representing pipe U-bends
            const torusGeo = new THREE.TorusGeometry(0.5, 0.18, 12, 24, Math.PI);
            const torusMesh = new THREE.Mesh(torusGeo, bendMat);
            torusMesh.position.set(-0.6, y, 0.4);
            torusMesh.rotation.y = Math.PI / 2;
            modelGroup.add(torusMesh);

            const torusMesh2 = new THREE.Mesh(torusGeo, bendMat);
            torusMesh2.position.set(0.6, y, 0.4);
            torusMesh2.rotation.y = -Math.PI / 2;
            modelGroup.add(torusMesh2);
          }

          // Door hinges detailing on sides
          const doorGeo = new THREE.BoxGeometry(1.8, 4.4, 0.05);
          const door1 = new THREE.Mesh(doorGeo, blueprintMat);
          door1.position.set(-0.9, 0, 1.0);
          modelGroup.add(door1);

          const door2 = new THREE.Mesh(doorGeo, blueprintMat);
          door2.position.set(0.9, 0, 1.0);
          modelGroup.add(door2);
          break;

        case 'framing': // Main Support Steelwork
          // Base support frame
          const baseGeo = new THREE.BoxGeometry(6, 0.15, 6);
          const basePlate = new THREE.Mesh(baseGeo, blueprintMat);
          basePlate.position.y = -4.9;
          modelGroup.add(basePlate);

          // 4 Heavy H-columns (boxes)
          const colGeo = new THREE.BoxGeometry(0.4, 10, 0.4);
          const cols = [];
          for (let x of [-2.4, 2.4]) {
            for (let z of [-2.4, 2.4]) {
              const col = new THREE.Mesh(colGeo, blueprintMat);
              col.position.set(x, 0, z);
              modelGroup.add(col);
              cols.push(col);
            }
          }

          // Horizontal portal beams connecting columns
          const beamGeo = new THREE.BoxGeometry(4.8, 0.3, 0.25);
          const crossBeams = [
            { x: 0, y: 4.8, z: -2.4, rotY: 0 },
            { x: 0, y: 4.8, z: 2.4, rotY: 0 },
            { x: -2.4, y: 4.8, z: 0, rotY: Math.PI / 2 },
            { x: 2.4, y: 4.8, z: 0, rotY: Math.PI / 2 },
            { x: 0, y: 0, z: -2.4, rotY: 0 },
            { x: 0, y: 0, z: 2.4, rotY: 0 },
            { x: -2.4, y: 0, z: 0, rotY: Math.PI / 2 },
            { x: 2.4, y: 0, z: 0, rotY: Math.PI / 2 },
          ];

          crossBeams.forEach(b => {
            const beam = new THREE.Mesh(beamGeo, blueprintMat);
            beam.position.set(b.x, b.y, b.z);
            beam.rotation.y = b.rotY;
            modelGroup.add(beam);
          });

          // Diagonal structural steel bracing members (lines/thin bars)
          const braceGeo = new THREE.BoxGeometry(0.08, 6.8, 0.08);
          const braces = [
            { x: 0, y: 2.4, z: -2.4, rotY: 0, rotZ: 0.65 },
            { x: 0, y: 2.4, z: -2.4, rotY: 0, rotZ: -0.65 },
            { x: 0, y: 2.4, z: 2.4, rotY: 0, rotZ: 0.65 },
            { x: 0, y: 2.4, z: 2.4, rotY: 0, rotZ: -0.65 },
            { x: -2.4, y: 2.4, z: 0, rotY: Math.PI / 2, rotZ: 0.65 },
            { x: -2.4, y: 2.4, z: 0, rotY: Math.PI / 2, rotZ: -0.65 },
            { x: 2.4, y: 2.4, z: 0, rotY: Math.PI / 2, rotZ: 0.65 },
            { x: 2.4, y: 2.4, z: 0, rotY: Math.PI / 2, rotZ: -0.65 },
          ];

          braces.forEach(b => {
            const brace = new THREE.Mesh(braceGeo, blueprintMat);
            brace.position.set(b.x, b.y, b.z);
            brace.rotation.y = b.rotY;
            brace.rotation.z = b.rotZ;
            modelGroup.add(brace);
          });
          break;

        case 'doors': // Access & Observation Doors
          // Frame plate
          const frameGeo = new THREE.BoxGeometry(4.5, 4.5, 0.15);
          const outerFrame = new THREE.Mesh(frameGeo, blueprintMat);
          modelGroup.add(outerFrame);

          // Central circular door block
          const doorPlateGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.4, 32);
          const doorPlate = new THREE.Mesh(doorPlateGeo, blueprintMat);
          doorPlate.rotation.x = Math.PI / 2;
          doorPlate.position.z = 0.2;
          modelGroup.add(doorPlate);

          // Hinges detailing (small cylinders and brackets)
          const hingePinGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.8, 16);
          const pin1 = new THREE.Mesh(hingePinGeo, stackMat);
          pin1.position.set(-1.8, 0, 0.4);
          modelGroup.add(pin1);

          // Hinge brackets
          const bracketGeo2 = new THREE.BoxGeometry(0.8, 0.3, 0.3);
          const br1 = new THREE.Mesh(bracketGeo2, stackMat);
          br1.position.set(-1.4, 0.5, 0.3);
          modelGroup.add(br1);
          const br2 = new THREE.Mesh(bracketGeo2, stackMat);
          br2.position.set(-1.4, -0.5, 0.3);
          modelGroup.add(br2);

          // Latch handle locks
          const handleBar = new THREE.BoxGeometry(1.8, 0.1, 0.1);
          const handle = new THREE.Mesh(handleBar, stackMat);
          handle.position.set(1.1, 0, 0.5);
          handle.rotation.z = 0.5; // Turn handle down slightly
          modelGroup.add(handle);
          break;

        case 'frame3d': // Complete Structural Frame
        default:
          // Fully compiled refinery structural steel tower skeleton
          // Columns
          const tColGeo = new THREE.BoxGeometry(0.2, 14, 0.2);
          for (let x of [-1.8, 1.8]) {
            for (let z of [-1.8, 1.8]) {
              const col = new THREE.Mesh(tColGeo, blueprintMat);
              col.position.set(x, -1, z);
              modelGroup.add(col);
            }
          }

          // Horizontal girders (tiers at different heights)
          const gBeamGeo = new THREE.BoxGeometry(3.6, 0.15, 0.15);
          for (let h of [-7, -4.5, -2, 1, 3.5, 5.8]) {
            const tiers = [
              { x: 0, y: h, z: -1.8, rotY: 0 },
              { x: 0, y: h, z: 1.8, rotY: 0 },
              { x: -1.8, y: h, z: 0, rotY: Math.PI / 2 },
              { x: 1.8, y: h, z: 0, rotY: Math.PI / 2 },
            ];
            tiers.forEach(t => {
              const b = new THREE.Mesh(gBeamGeo, blueprintMat);
              b.position.set(t.x, t.y, t.z);
              b.rotation.y = t.rotY;
              modelGroup.add(b);
            });
          }

          // Platform frames (boxes mapped circular underneath stack)
          const stackPlat = new THREE.CylinderGeometry(2.5, 2.5, 0.15, 32, 1, true);
          const stackPlatMesh = new THREE.Mesh(stackPlat, blueprintMat);
          stackPlatMesh.position.y = 5.9;
          modelGroup.add(stackPlatMesh);
          break;
      }

      setLoading(false);
    };

    buildModel();

    // 6. Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Auto-rotation when not interacting
      if (!controls.state === -1) {
        modelGroup.rotation.y += 0.002;
      }
      
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 7. Handle Resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
    };
  }, [type]);

  return (
    <div className="w-full h-full relative">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#050b14]/80 text-white z-20">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <span className="text-[10px] uppercase tracking-wider text-gray-400">Loading 3D Model...</span>
          </div>
        </div>
      )}
    </div>
  );
}
