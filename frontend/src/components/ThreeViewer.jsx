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
          const convGeo = new THREE.BoxGeometry(3.2, 5, 3.2);
          const convMesh = new THREE.Mesh(convGeo, blueprintMat);
          convMesh.position.y = 5.5;
          modelGroup.add(convMesh);

          const convWire = new THREE.Mesh(convGeo, wireMat);
          convWire.position.y = 5.5;
          convWire.scale.setScalar(1.01);
          modelGroup.add(convWire);

          // Header Boxes on the sides of the Convection Section (Left & Right)
          const hBoxGeo = new THREE.BoxGeometry(0.6, 4.8, 3.2);
          const hBoxLeft = new THREE.Mesh(hBoxGeo, blueprintMat);
          hBoxLeft.position.set(-1.9, 5.5, 0);
          modelGroup.add(hBoxLeft);

          const hBoxRight = new THREE.Mesh(hBoxGeo, blueprintMat);
          hBoxRight.position.set(1.9, 5.5, 0);
          modelGroup.add(hBoxRight);

          // Off-take duct connecting Convection Section to Stack
          const ductGeo = new THREE.CylinderGeometry(1.0, 1.4, 1.5, 16);
          const ductMesh = new THREE.Mesh(ductGeo, stackMat);
          ductMesh.position.y = 8.55;
          modelGroup.add(ductMesh);

          // Stack chimney (thin tall tube)
          const stackGeo = new THREE.CylinderGeometry(0.8, 1, 9, 16);
          const stackMesh = new THREE.Mesh(stackGeo, stackMat);
          stackMesh.position.y = 13.8;
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

        case 'roof': // Refinery Roof Structure (Conical Shell & Rafters)
          // Conical shell
          const coneGeo = new THREE.CylinderGeometry(1.5, 5, 2, 32, 1, true);
          const coneMesh = new THREE.Mesh(coneGeo, new THREE.MeshStandardMaterial({
            color: 0x43648e,
            roughness: 0.5,
            metalness: 0.7,
            transparent: true,
            opacity: 0.75,
            side: THREE.DoubleSide
          }));
          coneMesh.position.y = -1;
          modelGroup.add(coneMesh);

          // Center opening ring (collar)
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

        case 'staircase': // Stair Tower Assembly (Rectangular Structural Stair Tower - CORRECTED)
          // 4 Main columns of the rectangular tower
          const tColGeo = new THREE.BoxGeometry(0.2, 12, 0.2);
          for (let x of [-1.5, 1.5]) {
            for (let z of [-1.5, 1.5]) {
              const col = new THREE.Mesh(tColGeo, blueprintMat);
              col.position.set(x, 0, z);
              modelGroup.add(col);
            }
          }

          // Horizontal framing and diagonal bracing on tower faces
          for (let h of [-3.5, 0, 3.5]) {
            const hBeamGeo = new THREE.BoxGeometry(3.0, 0.15, 0.15);
            
            // X-direction beams
            const hb1 = new THREE.Mesh(hBeamGeo, blueprintMat);
            hb1.position.set(0, h, -1.5);
            modelGroup.add(hb1);
            const hb2 = new THREE.Mesh(hBeamGeo, blueprintMat);
            hb2.position.set(0, h, 1.5);
            modelGroup.add(hb2);

            // Z-direction beams
            const hb3 = new THREE.Mesh(hBeamGeo, blueprintMat);
            hb3.position.set(-1.5, h, 0);
            hb3.rotation.y = Math.PI / 2;
            modelGroup.add(hb3);
            const hb4 = new THREE.Mesh(hBeamGeo, blueprintMat);
            hb4.position.set(1.5, h, 0);
            hb4.rotation.y = Math.PI / 2;
            modelGroup.add(hb4);
          }

          // Landing platforms (rectangular plates) at levels
          const landingGeo = new THREE.BoxGeometry(1.5, 0.08, 1.5);
          const landings = [
            { x: -0.75, y: -3.5, z: -0.75 },
            { x: 0.75, y: 0, z: 0.75 },
            { x: -0.75, y: 3.5, z: -0.75 }
          ];

          landings.forEach(l => {
            const platform = new THREE.Mesh(landingGeo, stackMat);
            platform.position.set(l.x, l.y, l.z);
            modelGroup.add(platform);
          });

          // Straight stair runs connecting the platforms in a zig-zag configuration
          const createStairRun = (yStart, yEnd, xStart, xEnd, zPos) => {
            const length = Math.sqrt((yEnd - yStart)**2 + (xEnd - xStart)**2);
            const angle = Math.atan2(yEnd - yStart, xEnd - xStart);
            
            // Stringers
            const stringerGeo = new THREE.BoxGeometry(length, 0.2, 0.05);
            const stringer1 = new THREE.Mesh(stringerGeo, blueprintMat);
            stringer1.position.set((xStart + xEnd)/2, (yStart + yEnd)/2, zPos - 0.35);
            stringer1.rotation.z = angle;
            modelGroup.add(stringer1);

            const stringer2 = stringer1.clone();
            stringer2.position.z = zPos + 0.35;
            modelGroup.add(stringer2);

            // Steps
            const numSteps = 10;
            const stepBox = new THREE.BoxGeometry(0.7, 0.03, 0.2);
            for (let i = 0; i <= numSteps; i++) {
              const t = i / numSteps;
              const step = new THREE.Mesh(stepBox, stackMat);
              step.position.set(
                xStart + (xEnd - xStart) * t,
                yStart + (yEnd - yStart) * t + 0.05,
                zPos
              );
              modelGroup.add(step);
            }
          };

          // Run 1: Base to Mid Landing
          createStairRun(-5.5, -3.5, 0.8, -0.8, -0.75);
          // Run 2: Mid Landing to Upper Landing
          createStairRun(-3.5, 0, -0.8, 0.8, 0.0);
          // Run 3: Upper Landing to Top Platform
          createStairRun(0, 3.5, 0.8, -0.8, 0.75);
          break;

        case 'headerbox': // Tube Header Box (Corrected alignment)
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

          // Horizontal tube sheets with tube ends sticking out
          const sheetGeo = new THREE.BoxGeometry(3.6, 0.1, 1.8);
          for (let y of [-2.0, 2.0]) {
            const sheet = new THREE.Mesh(sheetGeo, stackMat);
            sheet.position.y = y;
            modelGroup.add(sheet);
          }

          // Horizontal tubes and return U-bends (ASME specifications)
          const bendMat = new THREE.MeshStandardMaterial({ color: 0xe63946, roughness: 0.3 });
          for (let y = -1.8; y <= 1.8; y += 1.2) {
            // Tubes protruding
            const tube1 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.8, 16), coilMat);
            tube1.rotation.x = Math.PI / 2;
            tube1.position.set(-0.8, y, -0.6);
            modelGroup.add(tube1);

            const tube2 = tube1.clone();
            tube2.position.set(0.8, y, -0.6);
            modelGroup.add(tube2);

            // Torus loop representing the return U-bend connecting the two tube runs
            const torusGeo = new THREE.TorusGeometry(0.8, 0.18, 12, 24, Math.PI);
            const torusMesh = new THREE.Mesh(torusGeo, bendMat);
            torusMesh.position.set(0, y, -0.2);
            modelGroup.add(torusMesh);
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

        case 'framing': // Main Support Steelwork (Corrected Portal Frame Configuration)
          // Heavy bottom concrete base plate foundation
          const baseGeo = new THREE.BoxGeometry(6.5, 0.4, 6.5);
          const basePlate = new THREE.Mesh(baseGeo, stackMat);
          basePlate.position.y = -4.8;
          modelGroup.add(basePlate);

          // 4 Heavy H-columns (boxes) arranged as a portal frame supporting the radiant chamber load
          const colGeo = new THREE.BoxGeometry(0.4, 9, 0.4);
          const cols = [];
          for (let x of [-2.4, 2.4]) {
            for (let z of [-2.4, 2.4]) {
              const col = new THREE.Mesh(colGeo, blueprintMat);
              col.position.set(x, -0.3, z);
              modelGroup.add(col);
              cols.push(col);
            }
          }

          // Top portal framing beams
          const beamGeo = new THREE.BoxGeometry(4.8, 0.4, 0.25);
          const crossBeams = [
            { x: 0, y: 4.2, z: -2.4, rotY: 0 },
            { x: 0, y: 4.2, z: 2.4, rotY: 0 },
            { x: -2.4, y: 4.2, z: 0, rotY: Math.PI / 2 },
            { x: 2.4, y: 4.2, z: 0, rotY: Math.PI / 2 },
            { x: 0, y: -0.2, z: -2.4, rotY: 0 },
            { x: 0, y: -0.2, z: 2.4, rotY: 0 },
            { x: -2.4, y: -0.2, z: 0, rotY: Math.PI / 2 },
            { x: 2.4, y: -0.2, z: 0, rotY: Math.PI / 2 },
          ];

          crossBeams.forEach(b => {
            const beam = new THREE.Mesh(beamGeo, blueprintMat);
            beam.position.set(b.x, b.y, b.z);
            beam.rotation.y = b.rotY;
            modelGroup.add(beam);
          });

          // Diagonal structural steel bracing members
          const braceGeo = new THREE.BoxGeometry(0.08, 6.2, 0.08);
          const braces = [
            { x: 0, y: 2.0, z: -2.4, rotY: 0, rotZ: 0.65 },
            { x: 0, y: 2.0, z: -2.4, rotY: 0, rotZ: -0.65 },
            { x: 0, y: 2.0, z: 2.4, rotY: 0, rotZ: 0.65 },
            { x: 0, y: 2.0, z: 2.4, rotY: 0, rotZ: -0.65 },
            { x: -2.4, y: 2.0, z: 0, rotY: Math.PI / 2, rotZ: 0.65 },
            { x: -2.4, y: 2.0, z: 0, rotY: Math.PI / 2, rotZ: -0.65 },
            { x: 2.4, y: 2.0, z: 0, rotY: Math.PI / 2, rotZ: 0.65 },
            { x: 2.4, y: 2.0, z: 0, rotY: Math.PI / 2, rotZ: -0.65 },
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

        case 'sootblower': { // Soot Blower Structure
          const beamGeo = new THREE.BoxGeometry(0.2, 0.4, 7);
          const beam = new THREE.Mesh(beamGeo, blueprintMat);
          beam.position.set(0, 0, 0);
          modelGroup.add(beam);

          const bracingColGeo = new THREE.BoxGeometry(0.15, 3.5, 0.15);
          const col1 = new THREE.Mesh(bracingColGeo, blueprintMat);
          col1.position.set(-1.2, -1.75, -2);
          modelGroup.add(col1);

          const col2 = col1.clone();
          col2.position.set(1.2, -1.75, -2);
          modelGroup.add(col2);

          const strutGeo = new THREE.BoxGeometry(0.15, 4.5, 0.15);
          const strut1 = new THREE.Mesh(strutGeo, blueprintMat);
          strut1.position.set(-0.6, -1.8, 1);
          strut1.rotation.x = 0.5;
          modelGroup.add(strut1);

          const strut2 = strut1.clone();
          strut2.position.x = 0.6;
          modelGroup.add(strut2);

          const lanceGeo = new THREE.CylinderGeometry(0.1, 0.1, 6.5, 16);
          const lance = new THREE.Mesh(lanceGeo, stackMat);
          lance.rotation.x = Math.PI / 2;
          lance.position.set(0, 0.25, 0.5);
          modelGroup.add(lance);

          const tipGeo = new THREE.CylinderGeometry(0.02, 0.12, 0.4, 16);
          const tip = new THREE.Mesh(tipGeo, stackMat);
          tip.rotation.x = Math.PI / 2;
          tip.position.set(0, 0.25, 3.9);
          modelGroup.add(tip);

          const cradleGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.1, 16, 1, true);
          for (let z of [-2.5, -0.5, 1.5]) {
            const cradle = new THREE.Mesh(cradleGeo, stackMat);
            cradle.rotation.x = Math.PI / 2;
            cradle.position.set(0, 0.25, z);
            modelGroup.add(cradle);
          }
          break;
        }

        case 'burnerfloor': { // Floor Plate & Burner Layout
          const floorGeo = new THREE.CylinderGeometry(4.5, 4.5, 0.2, 32);
          const floor = new THREE.Mesh(floorGeo, blueprintMat);
          floor.position.y = -3;
          modelGroup.add(floor);

          const floorWire = new THREE.Mesh(floorGeo, wireMat);
          floorWire.position.y = -3;
          floorWire.scale.setScalar(1.005);
          modelGroup.add(floorWire);

          const rBeamGeo = new THREE.BoxGeometry(8.6, 0.3, 0.15);
          for (let rot of [0, Math.PI / 4, Math.PI / 2, 3 * Math.PI / 4]) {
            const beam = new THREE.Mesh(rBeamGeo, blueprintMat);
            beam.position.y = -3.25;
            beam.rotation.y = rot;
            modelGroup.add(beam);
          }

          const portGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.3, 16);
          const burnerGasGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.8, 8);

          const numBurners = 6;
          const radius = 2.4;
          for (let i = 0; i < numBurners; i++) {
            const angle = (i / numBurners) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;

            const port = new THREE.Mesh(portGeo, stackMat);
            port.position.set(x, -3, z);
            modelGroup.add(port);

            const burner = new THREE.Mesh(burnerGasGeo, stackMat);
            burner.position.set(x, -2.5, z);
            modelGroup.add(burner);

            const capGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.15, 8);
            const cap = new THREE.Mesh(capGeo, blueprintMat);
            cap.position.set(x, -1.5, z);
            modelGroup.add(cap);
          }
          break;
        }

        case 'ladders': { // Refinery Stack Ladder & Cage
          const railGeo = new THREE.BoxGeometry(0.05, 12, 0.1);
          const rail1 = new THREE.Mesh(railGeo, blueprintMat);
          rail1.position.set(-0.3, 0, 0);
          modelGroup.add(rail1);

          const rail2 = rail1.clone();
          rail2.position.x = 0.3;
          modelGroup.add(rail2);

          const rungGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.6, 8);
          for (let y = -5.6; y <= 5.6; y += 0.4) {
            const rung = new THREE.Mesh(rungGeo, stackMat);
            rung.position.set(0, y, 0);
            rung.rotation.z = Math.PI / 2;
            modelGroup.add(rung);
          }

          const hoopGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.04, 24, 1, true);
          for (let y = -2; y <= 5.6; y += 1.2) {
            const hoop = new THREE.Mesh(hoopGeo, blueprintMat);
            hoop.position.set(0, y, 0.35);
            hoop.rotation.x = Math.PI / 2;
            modelGroup.add(hoop);
          }

          const strapGeo = new THREE.BoxGeometry(0.03, 7.8, 0.03);
          for (let angle of [-Math.PI / 4, 0, Math.PI / 4, Math.PI / 2, -Math.PI / 2]) {
            const strap = new THREE.Mesh(strapGeo, blueprintMat);
            const radius = 0.55;
            strap.position.set(
              Math.sin(angle) * radius,
              1.8,
              0.35 + Math.cos(angle) * radius
            );
            modelGroup.add(strap);
          }

          const bracketGeo = new THREE.BoxGeometry(0.08, 0.08, 0.8);
          for (let y of [-4, 0, 4]) {
            const b1 = new THREE.Mesh(bracketGeo, blueprintMat);
            b1.position.set(-0.3, y, -0.4);
            modelGroup.add(b1);

            const b2 = b1.clone();
            b2.position.x = 0.3;
            modelGroup.add(b2);
          }
          break;
        }

        case 'breechingdoor': { // Breeching Access Door
          const frameGeo = new THREE.BoxGeometry(3.2, 3.2, 0.15);
          const frame = new THREE.Mesh(frameGeo, blueprintMat);
          frame.position.set(0, 0, 0);
          modelGroup.add(frame);

          const innerOpenGeo = new THREE.BoxGeometry(2.6, 2.6, 0.05);
          const innerOpen = new THREE.Mesh(innerOpenGeo, new THREE.MeshStandardMaterial({
            color: 0x03070c,
            roughness: 0.9,
            metalness: 0.1
          }));
          innerOpen.position.set(0, 0, 0.06);
          modelGroup.add(innerOpen);

          const doorPlateGeo = new THREE.BoxGeometry(2.7, 2.7, 0.1);
          const doorPivot = new THREE.Group();
          doorPivot.position.set(-1.35, 0, 0.12);
          
          const doorMesh = new THREE.Mesh(doorPlateGeo, stackMat);
          doorMesh.position.set(1.35, 0, 0);
          doorPivot.add(doorMesh);

          const ribGeo = new THREE.BoxGeometry(3.6, 0.15, 0.06);
          const rib1 = new THREE.Mesh(ribGeo, blueprintMat);
          rib1.position.set(1.35, 0, 0.06);
          rib1.rotation.z = Math.PI / 4;
          doorPivot.add(rib1);

          const rib2 = rib1.clone();
          rib2.rotation.z = -Math.PI / 4;
          doorPivot.add(rib2);

          const clampBaseGeo = new THREE.BoxGeometry(0.15, 0.3, 0.1);
          const handleGeo = new THREE.BoxGeometry(0.4, 0.08, 0.08);

          for (let y of [-0.9, 0.9]) {
            const base = new THREE.Mesh(clampBaseGeo, blueprintMat);
            base.position.set(2.6, y, 0.1);
            doorPivot.add(base);

            const handle = new THREE.Mesh(handleGeo, blueprintMat);
            handle.position.set(2.8, y, 0.15);
            handle.rotation.y = 0.3;
            doorPivot.add(handle);
          }

          const hingeGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.4, 16);
          for (let y of [-1, 1]) {
            const hinge = new THREE.Mesh(hingeGeo, blueprintMat);
            hinge.position.set(-1.45, y, 0.08);
            modelGroup.add(hinge);
          }

          doorPivot.rotation.y = 0.5;
          modelGroup.add(doorPivot);
          break;
        }

        case 'frame3d': // Complete Structural Frame
        default:
          // Fully compiled refinery structural steel tower skeleton
          // Columns
          const frameColGeo = new THREE.BoxGeometry(0.2, 14, 0.2);
          for (let x of [-1.8, 1.8]) {
            for (let z of [-1.8, 1.8]) {
              const col = new THREE.Mesh(frameColGeo, blueprintMat);
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
