import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function getCameraSettings(type) {
  const settings = {
    camPos: new THREE.Vector3(10, 8, 14),
    lookAt: new THREE.Vector3(0, 0, 0)
  };

  switch (type) {
    case 'heater':
      settings.camPos.set(12, 8, 18);
      settings.lookAt.set(0, 0, 0);
      break;
    case 'stack':
      settings.camPos.set(0, 8, 18);
      settings.lookAt.set(0, 2, 0);
      break;
    case 'offtake':
      settings.camPos.set(8, 6, 12);
      settings.lookAt.set(0, 1.5, 2);
      break;
    case 'radiant':
      settings.camPos.set(10, 2, 12);
      settings.lookAt.set(0, -2, 0);
      break;
    case 'burnerfloor':
      settings.camPos.set(8, 2, 10);
      settings.lookAt.set(0, -3, 0);
      break;
    case 'headerbox':
      settings.camPos.set(6, 4, 8);
      settings.lookAt.set(0, 0, 0);
      break;
    case 'archplate':
      settings.camPos.set(6, 4, 8);
      settings.lookAt.set(0, 0, 0);
      break;
    case 'convection':
      settings.camPos.set(8, 6, 12);
      settings.lookAt.set(0, 4, 0);
      break;
    case 'sootblower':
      settings.camPos.set(6, 4, 8);
      settings.lookAt.set(0, 0, 0);
      break;
    case 'framing':
      settings.camPos.set(10, 4, 14);
      settings.lookAt.set(0, 0, 0);
      break;
    case 'frame3d':
      settings.camPos.set(12, 6, 16);
      settings.lookAt.set(0, 0, 0);
      break;
    case 'roof':
      settings.camPos.set(8, 4, 10);
      settings.lookAt.set(0, -1, 0);
      break;
    case 'ets':
      settings.camPos.set(8, 4, 10);
      settings.lookAt.set(0, 0, 0);
      break;
    case 'platforms':
      settings.camPos.set(10, 6, 14);
      settings.lookAt.set(0, 2, 0);
      break;
    case 'staircase':
      settings.camPos.set(10, 4, 14);
      settings.lookAt.set(0, 0, 0);
      break;
    case 'stackplatform':
      settings.camPos.set(8, 4, 10);
      settings.lookAt.set(0, 0, 0);
      break;
    case 'heatergrating':
      settings.camPos.set(8, 4, 10);
      settings.lookAt.set(0, 0, 0);
      break;
    case 'ladders':
      settings.camPos.set(8, 8, 12);
      settings.lookAt.set(0, 8, 0);
      break;
    case 'breechingdoor':
      settings.camPos.set(4, 2, 6);
      settings.lookAt.set(0, 0, 0);
      break;
    case 'maintenanceaccess':
      settings.camPos.set(6, 4, 8);
      settings.lookAt.set(0, 0, 0);
      break;
    default:
      settings.camPos.set(10, 8, 14);
      settings.lookAt.set(0, 0, 0);
  }
  return settings;
}

export default function ThreeViewer({ type, exploded, wireframe, resetKey, autoRotate, modelName }) {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Loading Engineering Model...");
  const [touchInteracting, setTouchInteracting] = useState(false);

  // Refs for smooth camera interpolation
  const targetCamPos = useRef(new THREE.Vector3(12, 12, 18));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const isTransitioningRef = useRef(true);
  const transitionFrames = useRef(0);

  // Exploded view interpolation refs
  const explodedFactor = useRef(0);
  const explodedRef = useRef(exploded);
  useEffect(() => {
    explodedRef.current = exploded;
  }, [exploded]);

  // Wireframe configuration ref
  const wireframeRef = useRef(wireframe);
  useEffect(() => {
    wireframeRef.current = wireframe;
  }, [wireframe]);

  // Auto rotate configuration ref
  const autoRotateRef = useRef(autoRotate);
  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  // Track scene for dynamic material updates
  const activeScene = useRef(null);

  // Cycling loading messages
  useEffect(() => {
    if (!loading) return;
    const texts = [
      "Loading Engineering Model...",
      "Preparing Structural Assembly...",
      "Generating Interactive View...",
      "Loading Industrial Components..."
    ];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % texts.length;
      setLoadingText(texts[idx]);
    }, 850);
    return () => clearInterval(interval);
  }, [loading]);

  // Reset Camera listener
  const resetKeyRef = useRef(resetKey);
  useEffect(() => {
    if (resetKey !== resetKeyRef.current) {
      resetKeyRef.current = resetKey;
      isTransitioningRef.current = true;
      transitionFrames.current = 0;
      const settings = getCameraSettings(type);
      targetCamPos.current.copy(settings.camPos);
      targetLookAt.current.copy(settings.lookAt);
    }
  }, [resetKey, type]);

  // Handle wireframe changes dynamically
  useEffect(() => {
    if (!activeScene.current) return;
    activeScene.current.traverse(child => {
      if (child.isMesh) {
        child.material.wireframe = wireframe;
      }
    });
  }, [wireframe]);

  useEffect(() => {
    if (!containerRef.current) return;

    isTransitioningRef.current = true; // Ensure transition runs on model changes
    transitionFrames.current = 0;
    setLoading(true);

    // 1. Setup Scene, Camera, Renderer
    const scene = new THREE.Scene();
    activeScene.current = scene;
    scene.background = new THREE.Color(0x07111f); // Deep industrial night background
    scene.fog = new THREE.FogExp2(0x07111f, 0.018); // Subtle depth fog

    // Grid Helper — subtle blueprint grid
    const gridHelper = new THREE.GridHelper(30, 30, 0x0e2a4a, 0x091c36);
    gridHelper.position.y = -5.41;
    scene.add(gridHelper);

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    // Initial camera position
    camera.position.set(12, 12, 18);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // Tone mapping helps metals read properly without a full HDRI env map
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    
    // Clear old contents
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    // 2. Setup Lights — Proper 3-point industrial rig
    // Ambient: strong enough so no surface goes pure black (critical for metallic PBR without env map)
    const ambientLight = new THREE.AmbientLight(0xd0dff0, 0.9);
    scene.add(ambientLight);

    // Hemisphere: sky-blue top, warm concrete ground, for natural gradient fill
    const hemiLight = new THREE.HemisphereLight(0xbfd4f2, 0x4a3f35, 0.7);
    scene.add(hemiLight);

    // Key light: cool-white, upper-front-right — primary modelling light
    const keyLight = new THREE.DirectionalLight(0xf0f5ff, 2.2);
    keyLight.position.set(10, 18, 14);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.001;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 80;
    scene.add(keyLight);

    // Fill light: soft warm-grey, lower-left opposite key — reveals shadow-side detail
    const fillLight = new THREE.DirectionalLight(0xfff0e0, 0.8);
    fillLight.position.set(-12, 4, -8);
    scene.add(fillLight);

    // Front-low fill: prevents front faces going dark (common with top key light only)
    const frontFill = new THREE.DirectionalLight(0xe8eeff, 0.5);
    frontFill.position.set(0, -4, 16);
    scene.add(frontFill);

    // Rim/accent: subtle teal-blue silhouette accent — brand colour, NOT dominant
    const rimLight = new THREE.DirectionalLight(0x4a90d9, 0.3);
    rimLight.position.set(-8, 8, -14);
    scene.add(rimLight);

    // 3. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.1; 
    controls.minDistance = 2;
    controls.maxDistance = 150;

    // Set camera interpolation targets based on selected type
    const settings = getCameraSettings(type);
    targetCamPos.current.copy(settings.camPos);
    targetLookAt.current.copy(settings.lookAt);

    // 4. Create Group for models
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // ─────────────────────────────────────────────────────────────────
    // MATERIALS — Industrial Steel PBR Palette
    // Tech: MeshPhysicalMaterial (shell/body) + MeshStandardMaterial (structural)
    // Blue is ACCENT ONLY — not used as base fill color.
    // Metalness kept at 0.6–0.75 so diffuse is visible without an HDRI env map.
    // ─────────────────────────────────────────────────────────────────

    // Shell / primary body — deep slate blue
    const shellMat = new THREE.MeshPhysicalMaterial({
      color: 0x3a4f66,
      roughness: 0.55,
      metalness: 0.6,
      clearcoat: 0.3,
      clearcoatRoughness: 0.4,
      wireframe: wireframeRef.current,
    });

    // Structural framing, I-beams, columns — galvanized brand blue-steel
    const blueprintMat = new THREE.MeshStandardMaterial({
      color: 0x5c80a6,
      roughness: 0.5,
      metalness: 0.7,
      wireframe: wireframeRef.current,
    });

    // Process tubes / coils — bright industrial orange
    const coilMat = new THREE.MeshStandardMaterial({
      color: 0xe65c00,
      roughness: 0.3,
      metalness: 0.6,
      wireframe: wireframeRef.current,
    });

    // Secondary metal — flanges, bolts, hangers — polished chrome silver
    const stackMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.2,
      metalness: 0.9,
      wireframe: wireframeRef.current,
    });

    // Wireframe accent overlay — thin cyan blueprint edge lines (brand accent only)
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      wireframe: true,
      transparent: true,
      opacity: 0.18
    });

    // 5. Generate Custom Geometries based on selected component
    const buildModel = () => {
      // Clean previous meshes
      while (modelGroup.children.length > 0) {
        modelGroup.remove(modelGroup.children[0]);
      }

      // Helper utilities for premium industrial detailing
      const createIBeam = (length, size = 0.25, thickness = 0.04, mat) => {
        const g = new THREE.Group();
        // Web
        const webGeo = new THREE.BoxGeometry(thickness, size - thickness * 2, length);
        const web = new THREE.Mesh(webGeo, mat);
        g.add(web);
        // Flanges
        const flangeGeo = new THREE.BoxGeometry(size, thickness, length);
        const f1 = new THREE.Mesh(flangeGeo, mat);
        f1.position.y = (size - thickness) / 2;
        const f2 = new THREE.Mesh(flangeGeo, mat);
        f2.position.y = -(size - thickness) / 2;
        g.add(f1);
        g.add(f2);
        return g;
      };

      const createBoltCircle = (radius, count, boltHeight = 0.15, boltRadius = 0.035) => {
        const g = new THREE.Group();
        const boltGeo = new THREE.CylinderGeometry(boltRadius, boltRadius, boltHeight, 8);
        const nutGeo = new THREE.CylinderGeometry(boltRadius * 1.5, boltRadius * 1.5, boltHeight * 0.4, 6);
        for (let i = 0; i < count; i++) {
          const a = (i / count) * Math.PI * 2;
          const bMesh = new THREE.Mesh(boltGeo, stackMat);
          bMesh.position.set(Math.cos(a) * radius, 0, Math.sin(a) * radius);
          const nMesh = new THREE.Mesh(nutGeo, blueprintMat);
          nMesh.position.set(Math.cos(a) * radius, boltHeight * 0.3, Math.sin(a) * radius);
          g.add(bMesh);
          g.add(nMesh);
        }
        return g;
      };

      const createBoltFlange = (outerR, innerR, height, boltsCount, mat, boltMat) => {
        const g = new THREE.Group();
        const flangeGeo = new THREE.CylinderGeometry(outerR, outerR, height, 32);
        const flange = new THREE.Mesh(flangeGeo, mat);
        g.add(flange);

        // Bolts around ring
        const boltGeo = new THREE.CylinderGeometry(0.04, 0.04, height + 0.15, 8);
        const midR = (outerR + innerR) / 2;
        for (let i = 0; i < boltsCount; i++) {
          const a = (i / boltsCount) * Math.PI * 2;
          const bolt = new THREE.Mesh(boltGeo, boltMat);
          bolt.position.set(Math.cos(a) * midR, 0, Math.sin(a) * midR);
          g.add(bolt);
        }
        return g;
      };

      const createFinnedTube = (length, tubeR = 0.06, finR = 0.12, finPitch = 0.12) => {
        const g = new THREE.Group();
        const tubeGeo = new THREE.CylinderGeometry(tubeR, tubeR, length, 8);
        const tube = new THREE.Mesh(tubeGeo, coilMat);
        tube.rotation.x = Math.PI / 2;
        g.add(tube);

        // Multiple small fin rings along tube length
        const finGeo = new THREE.CylinderGeometry(finR, finR, 0.015, 8);
        for (let z = -length / 2 + 0.1; z < length / 2 - 0.1; z += finPitch) {
          const fin = new THREE.Mesh(finGeo, stackMat);
          fin.position.z = z;
          fin.rotation.x = Math.PI / 2;
          g.add(fin);
        }
        return g;
      };

      const createIndustrialBurner = (radius = 0.35, height = 0.5) => {
        const g = new THREE.Group();
        const burnerGeo = new THREE.CylinderGeometry(radius, radius, height, 16);
        const burnerTile = new THREE.Mesh(burnerGeo, new THREE.MeshStandardMaterial({
          color: 0xc8a97e, // Beige refractory color
          roughness: 0.8,
          metalness: 0.1
        }));
        g.add(burnerTile);

        const tipGeo = new THREE.CylinderGeometry(0.03, 0.03, height + 0.15, 8);
        const gasTip = new THREE.Mesh(tipGeo, coilMat);
        gasTip.position.y = 0.1;
        g.add(gasTip);

        const vanesGeo = new THREE.BoxGeometry(0.015, height * 0.4, radius * 0.4);
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
          const vane = new THREE.Mesh(vanesGeo, blueprintMat);
          vane.position.set(Math.cos(a) * radius * 0.75, -height * 0.3, Math.sin(a) * radius * 0.75);
          vane.rotation.y = a + 0.4;
          g.add(vane);
        }
        return g;
      };

      switch (type) {
        case 'heater': { // Complete Fired Heater
          // Radiant chamber — main shell body (gunmetal)
          const radGeo = new THREE.CylinderGeometry(3.5, 3.5, 6, 32, 1, true);
          const radMesh = new THREE.Mesh(radGeo, shellMat);
          radMesh.position.y = -2;
          radMesh.name = "radiant";
          modelGroup.add(radMesh);

          // Buckstays (vertical structural I-beams on outer shell — graphite framing)
          for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const beam = createIBeam(6, 0.25, 0.04, blueprintMat);
            beam.position.set(Math.cos(angle) * 3.65, -2, Math.sin(angle) * 3.65);
            beam.rotation.y = -angle;
            beam.rotation.x = Math.PI / 2;
            beam.name = "radiant";
            modelGroup.add(beam);
          }

          // Transition cone — shell body
          const transGeo = new THREE.CylinderGeometry(2, 3.5, 2, 32, 1, true);
          const transMesh = new THREE.Mesh(transGeo, shellMat);
          transMesh.position.y = 2;
          transMesh.name = "transition";
          modelGroup.add(transMesh);

          // Convection section module — shell body
          const convGeo = new THREE.BoxGeometry(3.2, 5, 3.2);
          const convMesh = new THREE.Mesh(convGeo, shellMat);
          convMesh.position.y = 5.5;
          convMesh.name = "convection";
          modelGroup.add(convMesh);

          // Convection stiffeners (horizontal framing)
          for (let h of [3.5, 5.5, 7.5]) {
            const stiffGeo = new THREE.BoxGeometry(3.4, 0.15, 3.4);
            const stiff = new THREE.Mesh(stiffGeo, wireMat);
            stiff.position.y = h;
            stiff.name = "convection";
            modelGroup.add(stiff);
          }

          // Header Boxes Left & Right — shell body
          const hBoxGeo = new THREE.BoxGeometry(0.6, 4.8, 3.2);
          const hBoxLeft = new THREE.Mesh(hBoxGeo, shellMat);
          hBoxLeft.position.set(-1.9, 5.5, 0);
          hBoxLeft.name = "headerbox-left";
          hBoxLeft.userData = { origX: -1.9 };
          modelGroup.add(hBoxLeft);

          const hBoxRight = new THREE.Mesh(hBoxGeo, shellMat);
          hBoxRight.position.set(1.9, 5.5, 0);
          hBoxRight.name = "headerbox-right";
          hBoxRight.userData = { origX: 1.9 };
          modelGroup.add(hBoxRight);

          // Off-take duct — shell body
          const ductGeo = new THREE.CylinderGeometry(1.0, 1.4, 1.5, 16);
          const ductMesh = new THREE.Mesh(ductGeo, shellMat);
          ductMesh.position.y = 8.55;
          ductMesh.name = "offtake";
          modelGroup.add(ductMesh);

          // Chimney stack — shell body
          const stackGeo = new THREE.CylinderGeometry(0.8, 1, 9, 16);
          const stackMesh = new THREE.Mesh(stackGeo, shellMat);
          stackMesh.position.y = 13.8;
          stackMesh.name = "stack";
          modelGroup.add(stackMesh);

          // Stack flanges
          for (let h of [9.5, 13.8, 17.8]) {
            const flange = createBoltFlange(1.1, 0.8, 0.15, 12, stackMat, blueprintMat);
            flange.position.y = h;
            flange.name = "stack";
            modelGroup.add(flange);
          }

          // Spiral wind strakes on stack (high detail)
          for (let h = 9.8; h < 18.0; h += 0.3) {
            const angle = h * 2.0;
            const r = 1.05;
            const strakeBox = new THREE.BoxGeometry(0.12, 0.05, 0.4);
            const strake = new THREE.Mesh(strakeBox, blueprintMat);
            strake.position.set(Math.cos(angle) * r, h, Math.sin(angle) * r);
            strake.rotation.y = -angle;
            strake.rotation.x = 0.6;
            strake.name = "stack";
            modelGroup.add(strake);
          }

          // Platform walkways
          for (let h of [-4, -1, 2, 4.5, 7.8, 11]) {
            const size = h > 2 ? 2.8 : 4.8;
            const ringGeo = new THREE.RingGeometry(size - 0.1, size + 0.8, 32);
            const ringMesh = new THREE.Mesh(ringGeo, stackMat);
            ringMesh.rotation.x = -Math.PI / 2;
            ringMesh.position.y = h;
            ringMesh.name = h > 7.5 ? "stack" : (h > 2.5 ? "convection" : "radiant");
            modelGroup.add(ringMesh);

            // Handrail loops
            const railGeo = new THREE.CylinderGeometry(size + 0.8, size + 0.8, 0.8, 32, 1, true);
            const railMesh = new THREE.Mesh(railGeo, wireMat);
            railMesh.position.y = h + 0.4;
            railMesh.name = h > 7.5 ? "stack" : (h > 2.5 ? "convection" : "radiant");
            modelGroup.add(railMesh);
          }

          // Bottom concrete base
          const baseGeo = new THREE.BoxGeometry(9, 0.4, 9);
          const basePlate = new THREE.Mesh(baseGeo, stackMat);
          basePlate.position.y = -5.2;
          modelGroup.add(basePlate);
          break;
        }

        case 'radiant': { // Radiant Section
          // Cylindrical casing — primary shell (gunmetal)
          const casingGeo = new THREE.CylinderGeometry(4, 4, 8, 32, 1, true, 0, Math.PI * 1.55);
          const casingMesh = new THREE.Mesh(casingGeo, shellMat);
          casingMesh.material.side = THREE.DoubleSide;
          modelGroup.add(casingMesh);

          // Internal refractory lining layer (beige cylinder lining casing)
          const liningGeo = new THREE.CylinderGeometry(3.8, 3.8, 7.8, 32, 1, true, 0, Math.PI * 1.55);
          const liningMesh = new THREE.Mesh(liningGeo, new THREE.MeshStandardMaterial({
            color: 0xc8a97e,
            roughness: 0.9,
            metalness: 0.05,
            side: THREE.DoubleSide
          }));
          modelGroup.add(liningMesh);

          // Buckstays (vertical structural I-beams surrounding the shell outer perimeter)
          for (let angle = 0; angle < Math.PI * 1.55; angle += Math.PI / 4) {
            const beam = createIBeam(8, 0.3, 0.04, blueprintMat);
            beam.position.set(Math.cos(angle) * 4.15, 0, Math.sin(angle) * 4.15);
            beam.rotation.y = -angle;
            beam.rotation.x = Math.PI / 2;
            modelGroup.add(beam);
          }

          // Dense circular layout of vertical radiant tubes (API 530 tubes inside chamber)
          // Full 360° peripheral ring — tubes run all the way around the circumference
          const coilRadius = 3.6; // Close to refractory wall (lining inner radius ≈ 3.8, clearance ~0.2m)
          const numTubes = 28;
          for (let i = 0; i < numTubes; i++) {
            const angle = (i / numTubes) * Math.PI * 2; // Full 360° ring
            const tubeGeo = new THREE.CylinderGeometry(0.1, 0.1, 7.6, 8);
            const tubeMesh = new THREE.Mesh(tubeGeo, coilMat);
            tubeMesh.position.set(Math.cos(angle) * coilRadius, 0, Math.sin(angle) * coilRadius);
            modelGroup.add(tubeMesh);

            // Alloy support hangers (clips holding each tube at the roof arch)
            const hookGeo = new THREE.BoxGeometry(0.04, 0.4, 0.15);
            const hook = new THREE.Mesh(hookGeo, stackMat);
            hook.position.set(Math.cos(angle) * coilRadius, 3.9, Math.sin(angle) * coilRadius);
            modelGroup.add(hook);
          }

          // Floor-fired burners — cylindrical heaters use 1–3 central burners
          // in a linear array along the centre axis, NOT a 2×2 grid (that's a box heater)
          for (let z of [-1.2, 1.2]) {
            const burner = createIndustrialBurner(0.42, 0.65);
            burner.position.set(0, -3.7, z); // Centreline, equally spaced
            modelGroup.add(burner);
          }
          break;
        }

        case 'convection': { // Convection Section Module
          // Outer rectangular structural framework (4 columns and cross-beams)
          const colGeo = new THREE.BoxGeometry(0.2, 6, 0.2);
          for (let x of [-3, 3]) {
            for (let z of [-2.1, 2.1]) {
              const col = new THREE.Mesh(colGeo, blueprintMat);
              col.position.set(x, 0, z);
              modelGroup.add(col);
            }
          }

          // Horizontal girders framing the box casing
          for (let y of [-3, 0, 3]) {
            const beamW = new THREE.BoxGeometry(6, 0.2, 0.2);
            const b1 = new THREE.Mesh(beamW, blueprintMat);
            b1.position.set(0, y, -2.1);
            modelGroup.add(b1);

            const b2 = b1.clone();
            b2.position.z = 2.1;
            modelGroup.add(b2);

            const beamD = new THREE.BoxGeometry(4.2, 0.2, 0.2);
            const b3 = new THREE.Mesh(beamD, blueprintMat);
            b3.position.set(-3, y, 0);
            b3.rotation.y = Math.PI / 2;
            modelGroup.add(b3);

            const b4 = b3.clone();
            b4.position.x = 3;
            modelGroup.add(b4);
          }

          // Tube sheets (thick steel plates at both ends with grids of tube holes)
          const sheetGeo = new THREE.BoxGeometry(0.1, 5.4, 3.8);
          for (let x of [-2.9, 2.9]) {
            const sheet = new THREE.Mesh(sheetGeo, stackMat);
            sheet.position.x = x;
            modelGroup.add(sheet);
          }

          // Grid of 6x6 horizontal finned tubes (spanned longitudinally)
          for (let y = -2.0; y <= 2.0; y += 0.8) {
            for (let z = -1.5; z <= 1.5; z += 0.6) {
              const tube = createFinnedTube(5.7, 0.07, 0.12, 0.12);
              tube.position.set(0, y, z);
              modelGroup.add(tube);
            }
          }

          // Intermediate support plates (cutting vertical partitions in convection bank - horizontal baffles/sheets at different Y heights)
          const supportPlateGeo = new THREE.BoxGeometry(5.8, 0.08, 3.6);
          for (let y of [-1.0, 1.0]) {
            const sup = new THREE.Mesh(supportPlateGeo, wireMat);
            sup.position.set(0, y, 0);
            modelGroup.add(sup);
          }
          break;
        }

        case 'roof': { // Refinery Roof Structure
          // Conical shell deck plate — use shellMat (gunmetal, semi-transparent)
          const shellRoofMat = new THREE.MeshPhysicalMaterial({
            color: 0x6e7d8c,
            roughness: 0.5,
            metalness: 0.7,
            clearcoat: 0.3,
            clearcoatRoughness: 0.4,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide
          });
          const coneGeo = new THREE.CylinderGeometry(1.5, 5, 2, 32, 1, true);
          const coneMesh = new THREE.Mesh(coneGeo, shellRoofMat);
          coneMesh.position.y = -1;
          modelGroup.add(coneMesh);

          // Center compression ring flange
          const ringFlange = createBoltFlange(1.6, 1.3, 0.25, 16, stackMat, blueprintMat);
          ringFlange.position.y = 0;
          modelGroup.add(ringFlange);

          // Outer circular base ring (girder)
          const baseRingGeo = new THREE.CylinderGeometry(5.0, 5.0, 0.3, 32, 1, true);
          const baseRing = new THREE.Mesh(baseRingGeo, blueprintMat);
          baseRing.position.y = -2;
          modelGroup.add(baseRing);

          // 12 structural I-beam rafters radiating outwards
          for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const rafter = createIBeam(3.6, 0.2, 0.03, blueprintMat);
            rafter.rotation.y = -angle;
            rafter.rotation.x = 0.53; // Rafter slope matching cone pitch
            
            const midR = 3.25;
            rafter.position.set(Math.cos(angle) * midR, -1, Math.sin(angle) * midR);
            modelGroup.add(rafter);

            // Gusset plate connectors at outer base
            const gussetGeo = new THREE.BoxGeometry(0.04, 0.4, 0.3);
            const gusset = new THREE.Mesh(gussetGeo, stackMat);
            gusset.position.set(Math.cos(angle) * 4.9, -1.9, Math.sin(angle) * 4.9);
            gusset.rotation.y = -angle;
            modelGroup.add(gusset);
          }
          break;
        }

        case 'platforms': { // Platform Walkway System
          const innerR = 4.0;
          const outerR = 5.2;

          // Platform walking surface ring
          const ringGeo = new THREE.RingGeometry(innerR, outerR, 48);
          const platformFloor = new THREE.Mesh(ringGeo, new THREE.MeshStandardMaterial({
            color: 0x3a4a5c,
            roughness: 0.65,
            metalness: 0.45,
            side: THREE.DoubleSide
          }));
          platformFloor.rotation.x = -Math.PI / 2;
          modelGroup.add(platformFloor);

          // Grating texture wireframe layer
          const gridWire = new THREE.Mesh(ringGeo, wireMat);
          gridWire.rotation.x = -Math.PI / 2;
          gridWire.position.y = 0.01;
          modelGroup.add(gridWire);

          // Outer toe-plate vertical metal rim
          const toeGeo = new THREE.CylinderGeometry(outerR, outerR, 0.15, 48, 1, true);
          const toePlate = new THREE.Mesh(toeGeo, blueprintMat);
          toePlate.position.y = 0.075;
          modelGroup.add(toePlate);

          // 24 Handrail stanchions (vertical posts)
          const postGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.1, 8);
          for (let i = 0; i < 24; i++) {
            const angle = (i / 24) * Math.PI * 2;
            const post = new THREE.Mesh(postGeo, blueprintMat);
            post.position.set(Math.cos(angle) * (outerR - 0.05), 0.55, Math.sin(angle) * (outerR - 0.05));
            modelGroup.add(post);
          }

          // Top safety rail circular ring
          const topRailGeo = new THREE.CylinderGeometry(outerR - 0.05, outerR - 0.05, 0.03, 48, 1, true);
          const topRail = new THREE.Mesh(topRailGeo, blueprintMat);
          topRail.position.y = 1.1;
          modelGroup.add(topRail);

          // Mid safety rail circular ring
          const midRail = topRail.clone();
          midRail.position.y = 0.55;
          modelGroup.add(midRail);

          // 12 structural cantilever support brackets underneath
          for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const bracket = createIBeam(1.2, 0.15, 0.025, blueprintMat);
            bracket.position.set(Math.cos(angle) * (innerR + 0.6), -0.075, Math.sin(angle) * (innerR + 0.6));
            bracket.rotation.y = -angle;
            modelGroup.add(bracket);

            // Diagonal bracing support strut
            const strutGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.1, 8);
            const strut = new THREE.Mesh(strutGeo, blueprintMat);
            strut.position.set(Math.cos(angle) * (innerR + 0.25), -0.5, Math.sin(angle) * (innerR + 0.25));
            strut.rotation.y = -angle;
            strut.rotation.z = 0.65;
            modelGroup.add(strut);
          }
          break;
        }

        case 'staircase': { // Stair Tower Assembly
          // 4 main vertical columns built using extruded I-beams
          for (let x of [-1.5, 1.5]) {
            for (let z of [-1.5, 1.5]) {
              const col = createIBeam(12, 0.24, 0.035, blueprintMat);
              col.position.set(x, 0, z);
              col.rotation.x = Math.PI / 2;
              modelGroup.add(col);
            }
          }

          // Horizontal portal beams and diagonal truss members on faces
          for (let h of [-4, 0, 4]) {
            const hBeamGeo = new THREE.BoxGeometry(3.0, 0.18, 0.18);
            for (let z of [-1.5, 1.5]) {
              const hb = new THREE.Mesh(hBeamGeo, blueprintMat);
              hb.position.set(0, h, z);
              modelGroup.add(hb);

              // Diagonal bracing members
              const diagGeo = new THREE.BoxGeometry(3.8, 0.08, 0.08);
              const diag = new THREE.Mesh(diagGeo, wireMat);
              diag.position.set(0, h + 2, z);
              diag.rotation.z = 0.9;
              modelGroup.add(diag);
            }
            for (let x of [-1.5, 1.5]) {
              const hb = new THREE.Mesh(hBeamGeo, blueprintMat);
              hb.position.set(x, h, 0);
              hb.rotation.y = Math.PI / 2;
              modelGroup.add(hb);
            }
          }

          // Landing platforms (rectangular grids)
          const landingGeo = new THREE.BoxGeometry(1.4, 0.08, 1.4);
          const landings = [
            { x: -0.75, y: -4.0, z: -0.75 },
            { x: 0.75, y: 0, z: 0.75 },
            { x: -0.75, y: 4.0, z: -0.75 }
          ];
          landings.forEach(l => {
            const platform = new THREE.Mesh(landingGeo, stackMat);
            platform.position.set(l.x, l.y, l.z);
            modelGroup.add(platform);
          });

          // Helper for detailed stair flight runs
          const createStairRun = (yS, yE, xS, xE, zP) => {
            const len = Math.sqrt((yE - yS)**2 + (xE - xS)**2);
            const ang = Math.atan2(yE - yS, xE - xS);

            // Channel stringers on sides
            const stringerGeo = new THREE.BoxGeometry(len, 0.18, 0.04);
            const str1 = new THREE.Mesh(stringerGeo, blueprintMat);
            str1.position.set((xS + xE)/2, (yS + yE)/2, zP - 0.35);
            str1.rotation.z = ang;
            modelGroup.add(str1);

            const str2 = str1.clone();
            str2.position.z = zP + 0.35;
            modelGroup.add(str2);

            // Grating steps/treads
            const numSteps = 12;
            const stepBox = new THREE.BoxGeometry(0.75, 0.02, 0.22);
            for (let i = 0; i <= numSteps; i++) {
              const t = i / numSteps;
              const step = new THREE.Mesh(stepBox, shellMat);
              step.position.set(
                xS + (xE - xS) * t,
                yS + (yE - yS) * t + 0.04,
                zP
              );
              modelGroup.add(step);
            }
          };

          createStairRun(-6.0, -4.0, 0.8, -0.8, -0.75);
          createStairRun(-4.0, 0, -0.8, 0.8, 0.0);
          createStairRun(0, 4.0, 0.8, -0.8, 0.75);
          break;
        }

        case 'headerbox': { // Tube Header Box
          // Main casing — very subtle ghost shell so tubes inside are visible
          const boxGeo = new THREE.BoxGeometry(4.2, 5.2, 2.2);
          const boxMesh = new THREE.Mesh(boxGeo, new THREE.MeshPhysicalMaterial({
            color: 0x5a6878,
            transparent: true,
            opacity: 0.12,
            roughness: 0.5,
            metalness: 0.6,
            side: THREE.DoubleSide
          }));
          modelGroup.add(boxMesh);

          // Casing stiffener edge frame — accent blue outline
          const boxFrame = new THREE.BoxHelper(boxMesh, 0x4a90d9);
          modelGroup.add(boxFrame);

          // Dual doors — shell body material
          const doorGeo = new THREE.BoxGeometry(1.95, 4.8, 0.08);
          const doorL = new THREE.Mesh(doorGeo, shellMat);
          doorL.position.set(-1.0, 0, 1.1);
          modelGroup.add(doorL);

          const doorR = new THREE.Mesh(doorGeo, shellMat);
          doorR.position.set(1.0, 0, 1.1);
          modelGroup.add(doorR);

          // Refractory lining ceramic fiber modules inside doors
          const blockGeo = new THREE.BoxGeometry(1.8, 4.6, 0.15);
          const insulationL = new THREE.Mesh(blockGeo, new THREE.MeshStandardMaterial({ color: 0xd4c5b0, roughness: 0.9 }));
          insulationL.position.set(-1.0, 0, 0.95);
          modelGroup.add(insulationL);

          const insulationR = insulationL.clone();
          insulationR.position.x = 1.0;
          modelGroup.add(insulationR);

          // Return U-bends (ASME piping coils) connecting tube terminals
          for (let y = -2.0; y <= 2.0; y += 1.0) {
            // Tubes protruding from sheet
            const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.8, 16), coilMat);
            p1.rotation.x = Math.PI / 2;
            p1.position.set(-0.7, y, -0.6);
            modelGroup.add(p1);

            const p2 = p1.clone();
            p2.position.x = 0.7;
            modelGroup.add(p2);

            // Torus U-bends
            const torusGeo = new THREE.TorusGeometry(0.7, 0.12, 12, 24, Math.PI);
            const bend = new THREE.Mesh(torusGeo, coilMat);
            bend.position.set(0, y, -0.2);
            modelGroup.add(bend);
          }

          // Heavy door double-hinges detailing
          for (let y = -1.8; y <= 1.8; y += 3.6) {
            const pinGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.6, 8);
            const pin = new THREE.Mesh(pinGeo, stackMat);
            pin.position.set(-2.05, y, 1.1);
            modelGroup.add(pin);

            const pinR = pin.clone();
            pinR.position.x = 2.05;
            modelGroup.add(pinR);
          }
          break;
        }

        case 'framing': { // Main Support Steelwork
          // Concrete foundation pad
          const padGeo = new THREE.BoxGeometry(6.6, 0.4, 6.6);
          const pad = new THREE.Mesh(padGeo, stackMat);
          pad.position.y = -4.8;
          modelGroup.add(pad);

          // 4 Heavy columns built using extruded I-beam profiles
          const cols = [];
          for (let x of [-2.4, 2.4]) {
            for (let z of [-2.4, 2.4]) {
              const col = createIBeam(9.2, 0.36, 0.05, blueprintMat);
              col.position.set(x, -0.2, z);
              col.rotation.x = Math.PI / 2;
              modelGroup.add(col);
              cols.push(col);

              // Base plate on pad
              const basePlat = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.08, 0.6), blueprintMat);
              basePlat.position.set(x, -4.55, z);
              modelGroup.add(basePlat);

              // 4 Anchor bolts per base plate
              const bolts = createBoltCircle(0.22, 4, 0.18, 0.035);
              bolts.position.set(x, -4.5, z);
              modelGroup.add(bolts);
            }
          }

          // Top frame layout (heavy girder beams connecting column heads)
          const girderGeo = new THREE.BoxGeometry(4.8, 0.4, 0.2);
          for (let h of [-0.2, 4.4]) {
            const g1 = new THREE.Mesh(girderGeo, blueprintMat);
            g1.position.set(0, h, -2.4);
            modelGroup.add(g1);

            const g2 = g1.clone();
            g2.position.z = 2.4;
            modelGroup.add(g2);

            const g3 = new THREE.Mesh(girderGeo, blueprintMat);
            g3.position.set(-2.4, h, 0);
            g3.rotation.y = Math.PI / 2;
            modelGroup.add(g3);

            const g4 = g3.clone();
            g4.position.x = 2.4;
            modelGroup.add(g4);
          }

          // Tubular Diagonal cross bracings with detailed gusset junctions
          const braceGeo = new THREE.CylinderGeometry(0.08, 0.08, 6.2, 8);
          const diagonalPlacements = [
            { x: 0, y: 2.1, z: -2.4, rotY: 0, rotZ: 0.65 },
            { x: 0, y: 2.1, z: -2.4, rotY: 0, rotZ: -0.65 },
            { x: 0, y: 2.1, z: 2.4, rotY: 0, rotZ: 0.65 },
            { x: 0, y: 2.1, z: 2.4, rotY: 0, rotZ: -0.65 },
            { x: -2.4, y: 2.1, z: 0, rotY: Math.PI / 2, rotZ: 0.65 },
            { x: -2.4, y: 2.1, z: 0, rotY: Math.PI / 2, rotZ: -0.65 },
            { x: 2.4, y: 2.1, z: 0, rotY: Math.PI / 2, rotZ: 0.65 },
            { x: 2.4, y: 2.1, z: 0, rotY: Math.PI / 2, rotZ: -0.65 }
          ];

          diagonalPlacements.forEach(dp => {
            const brace = new THREE.Mesh(braceGeo, stackMat);
            brace.position.set(dp.x, dp.y, dp.z);
            brace.rotation.y = dp.rotY;
            brace.rotation.z = dp.rotZ;
            modelGroup.add(brace);
          });
          break;
        }

        case 'doors': { // Access & Observation Doors
          // Outer mounting frame with bolting circle
          const frameGeo = new THREE.BoxGeometry(4.4, 4.4, 0.2);
          const frame = new THREE.Mesh(frameGeo, blueprintMat);
          modelGroup.add(frame);

          // Bolts securing frame to shell plate
          const boltBox = createBoltCircle(1.9, 16, 0.25, 0.04);
          boltBox.rotation.x = Math.PI / 2;
          modelGroup.add(boltBox);

          // Pivoting door plug containing thick insulation block
          const plugGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.6, 32);
          const plug = new THREE.Mesh(plugGeo, stackMat);
          plug.rotation.x = Math.PI / 2;
          plug.position.z = 0.2;
          modelGroup.add(plug);

          const refractoryGeo = new THREE.CylinderGeometry(1.3, 1.3, 0.4, 32);
          const refractoryBlock = new THREE.Mesh(refractoryGeo, new THREE.MeshStandardMaterial({ color: 0xc8a97e, roughness: 0.9 }));
          refractoryBlock.rotation.x = Math.PI / 2;
          refractoryBlock.position.z = -0.2;
          modelGroup.add(refractoryBlock);

          // Double hinge arm pivot connection
          const hingeBarGeo = new THREE.BoxGeometry(1.6, 0.2, 0.2);
          const bar = new THREE.Mesh(hingeBarGeo, blueprintMat);
          bar.position.set(-0.8, 0, 0.6);
          modelGroup.add(bar);

          const hingePin = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.2, 8), blueprintMat);
          hingePin.position.set(-1.6, 0, 0.5);
          modelGroup.add(hingePin);

          // Quick lock screw latch wheel
          const handleHub = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.4, 8), stackMat);
          handleHub.rotation.x = Math.PI / 2;
          handleHub.position.set(0.8, 0, 0.6);
          modelGroup.add(handleHub);

          const wheelGeo = new THREE.TorusGeometry(0.35, 0.04, 8, 16);
          const handWheel = new THREE.Mesh(wheelGeo, stackMat);
          handWheel.position.set(0.8, 0, 0.8);
          modelGroup.add(handWheel);
          break;
        }

        case 'sootblower': { // Soot Blower Structure
          // Dual main cantilever rails (channels) running along X-axis
          const railGeo = new THREE.BoxGeometry(8.0, 0.3, 0.1);
          const r1 = new THREE.Mesh(railGeo, blueprintMat);
          r1.position.set(0, 0, -0.35);
          modelGroup.add(r1);

          const r2 = r1.clone();
          r2.position.z = 0.35;
          modelGroup.add(r2);

          // Cross braces along rails
          const braceGeo = new THREE.BoxGeometry(0.1, 0.04, 0.8);
          for (let x = -3.5; x <= 3.5; x += 1.0) {
            const cross = new THREE.Mesh(braceGeo, blueprintMat);
            cross.position.set(x, -0.1, 0);
            modelGroup.add(cross);
          }

          // Soot blower lance tube (metallic tube inserting along X-axis)
          const lanceGeo = new THREE.CylinderGeometry(0.08, 0.08, 7.8, 16);
          const lance = new THREE.Mesh(lanceGeo, coilMat);
          lance.rotation.z = Math.PI / 2;
          lance.position.set(0.2, 0.1, 0);
          modelGroup.add(lance);

          // Lance jet tip nozzle
          const jetTip = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.09, 0.3, 12), stackMat);
          jetTip.rotation.z = -Math.PI / 2;
          jetTip.position.set(4.1, 0.1, 0);
          modelGroup.add(jetTip);

          // Support wall box sleeve flange
          const sleeveFlange = createBoltFlange(0.7, 0.2, 0.2, 8, stackMat, blueprintMat);
          sleeveFlange.position.set(-3.9, 0.1, 0);
          sleeveFlange.rotation.z = Math.PI / 2;
          modelGroup.add(sleeveFlange);

          // Carriage driver assembly box (motor unit on rails)
          const carGeo = new THREE.BoxGeometry(1.0, 0.6, 0.9);
          const carriage = new THREE.Mesh(carGeo, blueprintMat);
          carriage.position.set(-1.5, 0.25, 0);
          modelGroup.add(carriage);
          break;
        }

        case 'burnerfloor': { // Floor Plate & Burner Layout
          // Circular refractory deck plate
          const floorGeo = new THREE.CylinderGeometry(4.5, 4.5, 0.25, 32);
          const floor = new THREE.Mesh(floorGeo, new THREE.MeshStandardMaterial({
            color: 0xc8a97e,
            roughness: 0.9,
            metalness: 0.1
          }));
          floor.position.y = -3;
          modelGroup.add(floor);

          // Heavy cross structural grid beams underneath
          for (let rot of [0, Math.PI / 4, Math.PI / 2, 3 * Math.PI / 4]) {
            const beam = createIBeam(9.2, 0.3, 0.04, blueprintMat);
            beam.position.y = -3.25;
            beam.rotation.y = rot;
            modelGroup.add(beam);
          }

          // Center burner (primary design)
          const centerBurner = createIndustrialBurner(0.55, 0.8);
          centerBurner.position.set(0, -2.6, 0);
          modelGroup.add(centerBurner);

          const centerPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.2, 8), stackMat);
          centerPipe.position.set(0, -3.9, 0);
          modelGroup.add(centerPipe);

          // 4 surrounding burners in a compact central circle (radius = 1.5)
          const numBurners = 4;
          const radius = 1.5;
          for (let i = 0; i < numBurners; i++) {
            const angle = (i / numBurners) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;

            const burner = createIndustrialBurner(0.5, 0.8);
            burner.position.set(x, -2.6, z);
            modelGroup.add(burner);

            // Combustion gas piping loop feeding each burner port
            const pipeGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.2, 8);
            const pipe = new THREE.Mesh(pipeGeo, stackMat);
            pipe.position.set(x, -3.9, z);
            modelGroup.add(pipe);
          }
          break;
        }

        case 'ladders': { // Refinery Stack Ladder & Cage
          // Vertical stringers (rails)
          const railGeo = new THREE.BoxGeometry(0.04, 12.0, 0.08);
          const r1 = new THREE.Mesh(railGeo, blueprintMat);
          r1.position.set(-0.35, 0, 0);
          modelGroup.add(r1);

          const r2 = r1.clone();
          r2.position.x = 0.35;
          modelGroup.add(r2);

          // Rungs at 0.3m spacing
          const rungGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.7, 8);
          for (let y = -5.8; y <= 5.8; y += 0.3) {
            const rung = new THREE.Mesh(rungGeo, stackMat);
            rung.position.set(0, y, 0);
            rung.rotation.z = Math.PI / 2;
            modelGroup.add(rung);
          }

          // Safety cage hoops (U-shaped arches)
          const hoopGeo = new THREE.TorusGeometry(0.48, 0.02, 8, 24, Math.PI);
          for (let y = -3.0; y <= 5.8; y += 1.2) {
            const hoop = new THREE.Mesh(hoopGeo, blueprintMat);
            hoop.position.set(0, y, 0.24);
            hoop.rotation.x = Math.PI / 2;
            modelGroup.add(hoop);
          }

          // Vertical safety straps tying hoops together
          const strapGeo = new THREE.BoxGeometry(0.02, 9.0, 0.04);
          for (let angle = -Math.PI / 2; angle <= Math.PI / 2; angle += Math.PI / 4) {
            const strap = new THREE.Mesh(strapGeo, blueprintMat);
            strap.position.set(Math.cos(angle) * 0.48, 1.4, 0.24 + Math.sin(angle) * 0.48);
            modelGroup.add(strap);
          }
          break;
        }

        case 'breechingdoor': { // Breeching Access Door
          // Casing flange plate
          const flangeGeo = new THREE.BoxGeometry(3.5, 4.5, 0.15);
          const flange = new THREE.Mesh(flangeGeo, blueprintMat);
          modelGroup.add(flange);

          // Flange bolt pattern
          const bolts = createBoltCircle(1.8, 14, 0.2, 0.035);
          bolts.rotation.x = Math.PI / 2;
          modelGroup.add(bolts);

          // Rectangular access door leaf
          const leafGeo = new THREE.BoxGeometry(2.2, 3.2, 0.08);
          const leaf = new THREE.Mesh(leafGeo, blueprintMat);
          leaf.position.z = 0.15;
          modelGroup.add(leaf);

          // Refractory lining block
          const blockGeo = new THREE.BoxGeometry(2.0, 3.0, 0.25);
          const lining = new THREE.Mesh(blockGeo, new THREE.MeshStandardMaterial({ color: 0xc8a97e, roughness: 0.9 }));
          lining.position.z = -0.1;
          modelGroup.add(lining);

          // Hinges and handle
          const pinGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.5, 8);
          for (let y of [-1.2, 1.2]) {
            const pin = new THREE.Mesh(pinGeo, stackMat);
            pin.position.set(-1.15, y, 0.15);
            modelGroup.add(pin);
          }

          const lockHandle = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.08, 0.08), stackMat);
          lockHandle.position.set(1.15, 0, 0.25);
          lockHandle.rotation.z = -0.4;
          modelGroup.add(lockHandle);
          break;
        }

        case 'stack': { // Complete Stack / Chimney
          // Stack body (tall cylinder)
          const stackGeo = new THREE.CylinderGeometry(1.2, 1.4, 15, 32);
          const stackMesh = new THREE.Mesh(stackGeo, stackMat);
          stackMesh.position.y = 2.5;
          modelGroup.add(stackMesh);

          // Helical strakes (coiled small boxes spiraling around it)
          for (let h = -5; h < 7; h += 0.2) {
            const angle = h * 1.5;
            const r = 1.35;
            const x = Math.cos(angle) * r;
            const z = Math.sin(angle) * r;
            const boxGeo = new THREE.BoxGeometry(0.15, 0.02, 0.2);
            const box = new THREE.Mesh(boxGeo, blueprintMat);
            box.position.set(x, h, z);
            box.rotation.y = -angle;
            box.rotation.x = 0.5;
            modelGroup.add(box);
          }

          // Stack platform
          const stackPlat = new THREE.CylinderGeometry(2.2, 2.2, 0.15, 32, 1, false);
          const platMesh = new THREE.Mesh(stackPlat, blueprintMat);
          platMesh.position.y = 5.0;
          modelGroup.add(platMesh);

          // Platform handrails
          const railGeo = new THREE.CylinderGeometry(2.2, 2.2, 1.0, 32, 1, true);
          const railMesh = new THREE.Mesh(railGeo, wireMat);
          railMesh.position.y = 5.5;
          modelGroup.add(railMesh);
          break;
        }

        case 'offtake': { // Off-Take Duct
          // Bottom transition adapter box (4-sided shape)
          const baseDuctGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.5, 4);
          const baseDuct = new THREE.Mesh(baseDuctGeo, blueprintMat);
          baseDuct.position.set(0, -0.5, 0);
          baseDuct.rotation.y = Math.PI / 4; // Align square sides
          modelGroup.add(baseDuct);

          // Middle transition reducer (rectangular-to-circular layout)
          // 4-sided pyramid frustum represents the sheet transition
          const transDuctGeo = new THREE.CylinderGeometry(0.9, 1.6, 2.2, 4);
          const transDuct = new THREE.Mesh(transDuctGeo, blueprintMat);
          transDuct.position.set(0, 0.85, 0);
          transDuct.rotation.y = Math.PI / 4;
          modelGroup.add(transDuct);

          // Top circular flange collar connecting to the stack
          const flangeGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.4, 32);
          const flange = new THREE.Mesh(flangeGeo, stackMat);
          flange.position.set(0, 2.15, 0);
          modelGroup.add(flange);
          break;
        }

        case 'pressureparts': { // Pressure Parts Assembly
          // Create vertical radiant tubes (cylinders around outer boundary)
          for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 12) {
            const x = Math.cos(angle) * 3.0;
            const z = Math.sin(angle) * 3.0;
            const tubeGeo = new THREE.CylinderGeometry(0.08, 0.08, 8, 8);
            const tube = new THREE.Mesh(tubeGeo, coilMat);
            tube.position.set(x, -2, z);
            modelGroup.add(tube);
          }

          // Create convection section coils (grid of horizontal tubes)
          for (let y = 3; y < 6; y += 0.5) {
            for (let x = -2; x <= 2; x += 0.6) {
              const coil = createFinnedTube(5.0, 0.06, 0.1, 0.12);
              coil.position.set(x, y, 0);
              modelGroup.add(coil);
            }
          }
          break;
        }

        case 'heatergrating': { // Heater Grating System
          // Circular ring for platform walkway - flat ring structure
          const gratingRingGeo = new THREE.RingGeometry(3.6, 5.0, 48);
          const gratingMesh = new THREE.Mesh(gratingRingGeo, wireMat);
          gratingMesh.rotation.x = -Math.PI / 2;
          gratingMesh.position.y = -1;
          gratingMesh.material.side = THREE.DoubleSide;
          modelGroup.add(gratingMesh);

          // Outer and inner structural steel kickplates
          const outerRim = new THREE.Mesh(new THREE.CylinderGeometry(5.0, 5.0, 0.15, 48, 1, true), blueprintMat);
          outerRim.position.y = -0.925;
          modelGroup.add(outerRim);

          const innerRim = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.6, 0.15, 48, 1, true), blueprintMat);
          innerRim.position.y = -0.925;
          modelGroup.add(innerRim);

          // Add radial grating load bars
          for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 36) {
            const x = Math.cos(angle) * 4.3;
            const z = Math.sin(angle) * 4.3;
            const barGeo = new THREE.BoxGeometry(0.02, 0.1, 1.4);
            const bar = new THREE.Mesh(barGeo, stackMat);
            bar.position.set(x, -1.0, z);
            bar.rotation.y = -angle;
            modelGroup.add(bar);
          }
          break;
        }

        case 'stackplatform': { // Stack Platform System
          // Platform rings mounted at stack height - flat ring walkways
          const stackPlatGeo = new THREE.RingGeometry(1.3, 2.5, 32);
          
          for (let y of [2.0, 8.0]) {
            const plat = new THREE.Mesh(stackPlatGeo, blueprintMat);
            plat.rotation.x = -Math.PI / 2;
            plat.position.y = y;
            plat.material.side = THREE.DoubleSide;
            modelGroup.add(plat);

            // Circular handrails
            const rail = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 1.1, 32, 1, true), wireMat);
            rail.position.y = y + 0.55;
            modelGroup.add(rail);

            // Outer toe-plate vertical metal rim
            const toe = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 0.15, 32, 1, true), stackMat);
            toe.position.y = y + 0.075;
            modelGroup.add(toe);

            // Stanchions (vertical posts)
            for (let i = 0; i < 16; i++) {
              const angle = (i / 16) * Math.PI * 2;
              const post = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.1, 8), blueprintMat);
              post.position.set(Math.cos(angle) * 2.45, y + 0.55, Math.sin(angle) * 2.45);
              modelGroup.add(post);
            }
          }
          break;
        }

        case 'archplate': { // Arch Plate Assembly
          // Flat horizontal separator deck (annular plate with central opening)
          const ringGeo = new THREE.RingGeometry(2.0, 3.6, 48);
          const archMesh = new THREE.Mesh(ringGeo, blueprintMat);
          archMesh.rotation.x = -Math.PI / 2;
          archMesh.position.y = 2.0;
          archMesh.material.side = THREE.DoubleSide;
          modelGroup.add(archMesh);

          // Ring lining (insulation layer on top)
          const liningGeo = new THREE.RingGeometry(2.02, 3.58, 48);
          const lining = new THREE.Mesh(liningGeo, new THREE.MeshStandardMaterial({
            color: 0xc8a97e,
            roughness: 0.9,
            metalness: 0.05,
            side: THREE.DoubleSide
          }));
          lining.rotation.x = -Math.PI / 2;
          lining.position.y = 2.03;
          modelGroup.add(lining);

          // Inner flange/collar for flue opening (throat)
          const flueGeo = new THREE.CylinderGeometry(2.0, 2.0, 0.6, 32, 1, true);
          const flue = new THREE.Mesh(flueGeo, stackMat);
          flue.position.y = 2.0;
          flue.material.side = THREE.DoubleSide;
          modelGroup.add(flue);
          break;
        }

        case 'ets': { // ETS Structure
          // Heavy outer portal frame around convection module
          const etsLegGeo = new THREE.BoxGeometry(0.3, 10, 0.3);
          for (let x of [-3, 3]) {
            for (let z of [-2, 2]) {
              const leg = createIBeam(10, 0.3, 0.04, blueprintMat);
              leg.position.set(x, 1, z);
              leg.rotation.x = Math.PI / 2;
              modelGroup.add(leg);
            }
          }

          // Diagonal cross bracing
          const diagonalGeo = new THREE.BoxGeometry(0.1, 10.4, 0.1);
          const d1 = new THREE.Mesh(diagonalGeo, blueprintMat);
          d1.position.set(0, 1, -2);
          d1.rotation.z = Math.PI / 6;
          modelGroup.add(d1);

          const d2 = new THREE.Mesh(diagonalGeo, blueprintMat);
          d2.position.set(0, 1, -2);
          d2.rotation.z = -Math.PI / 6;
          modelGroup.add(d2);
          break;
        }

        case 'maintenanceaccess': { // Maintenance Access System
          // Nested assembly of stairs, platforms, ladders
          // Platform base
          const basePlatGeo = new THREE.BoxGeometry(6, 0.2, 6);
          const basePlat = new THREE.Mesh(basePlatGeo, wireMat);
          basePlat.position.y = -2;
          modelGroup.add(basePlat);

          // Staircase flights rising up
          const flightGeo = new THREE.BoxGeometry(0.8, 0.1, 4.2);
          const flight = new THREE.Mesh(flightGeo, blueprintMat);
          flight.position.set(1.5, 0, 1);
          flight.rotation.x = Math.PI / 6;
          modelGroup.add(flight);

          // Intermediate landing
          const landingGeo = new THREE.BoxGeometry(1.6, 0.2, 1.6);
          const landing = new THREE.Mesh(landingGeo, blueprintMat);
          landing.position.set(1.5, 1, -1.5);
          modelGroup.add(landing);

          // Upper ladder rising from landing
          const ladGeo = new THREE.BoxGeometry(0.6, 6, 0.1);
          const lad = new THREE.Mesh(ladGeo, blueprintMat);
          lad.position.set(1.5, 4, -1.5);
          modelGroup.add(lad);
          break;
        }

        case 'frame3d': { // Complete Structural Frame
          // Columns
          for (let x of [-1.8, 1.8]) {
            for (let z of [-1.8, 1.8]) {
              const col = createIBeam(14, 0.25, 0.04, blueprintMat);
              col.position.set(x, -1, z);
              col.rotation.x = Math.PI / 2;
              modelGroup.add(col);
            }
          }

          // Horizontal girders (girders at different heights)
          for (let h of [-7, -4.5, -2, 1, 3.5, 5.8]) {
            for (let z of [-1.8, 1.8]) {
              const g = createIBeam(3.6, 0.2, 0.03, blueprintMat);
              g.position.set(0, h, z);
              modelGroup.add(g);
            }
            for (let x of [-1.8, 1.8]) {
              const g = createIBeam(3.6, 0.2, 0.03, blueprintMat);
              g.position.set(x, h, 0);
              g.rotation.y = Math.PI / 2;
              modelGroup.add(g);
            }
          }

          // Diagonal bracing panels on all faces
          const diagGeo = new THREE.CylinderGeometry(0.06, 0.06, 4.8, 8);
          for (let h of [-5.75, -3.25, -0.5, 2.25, 4.65]) {
            for (let z of [-1.8, 1.8]) {
              const d1 = new THREE.Mesh(diagGeo, stackMat);
              d1.position.set(0, h, z);
              d1.rotation.z = 0.8;
              modelGroup.add(d1);

              const d2 = d1.clone();
              d2.rotation.z = -0.8;
              modelGroup.add(d2);
            }
          }
          break;
        }
      }

      // Add shadow settings for all models
      modelGroup.traverse(child => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      setLoading(false);
    };

    buildModel();

    // 6. Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Interpolate camera position and target controls smoothly during transition
      if (isTransitioningRef.current) {
        if (controls.state !== -1) {
          isTransitioningRef.current = false;
        } else {
          transitionFrames.current += 1;
          camera.position.lerp(targetCamPos.current, 0.05);
          controls.target.lerp(targetLookAt.current, 0.05);

          const distCam = camera.position.distanceTo(targetCamPos.current);
          const distTarget = controls.target.distanceTo(targetLookAt.current);
          if ((distCam < 0.05 && distTarget < 0.05) || transitionFrames.current > 50) {
            camera.position.copy(targetCamPos.current);
            controls.target.copy(targetLookAt.current);
            isTransitioningRef.current = false;
          }
        }
      }

      // Interpolate exploded views
      const targetExplode = explodedRef.current ? 1.0 : 0.0;
      explodedFactor.current = THREE.MathUtils.lerp(explodedFactor.current, targetExplode, 0.08);

      // Apply exploded view offsets to specific child meshes
      modelGroup.traverse(child => {
        // 1. Legacy name-based explosions (for complete-heater group children)
        if (child.name) {
          const factor = explodedFactor.current;
          if (child.name === 'stack') {
            child.position.y = 13.8 + factor * 5.0;
          } else if (child.name === 'offtake') {
            child.position.y = 8.55 + factor * 3.5;
          } else if (child.name === 'convection') {
            child.position.y = 5.5 + factor * 2.0;
          } else if (child.name === 'headerbox-left') {
            child.position.x = -1.9 - factor * 1.5;
          } else if (child.name === 'headerbox-right') {
            child.position.x = 1.9 + factor * 1.5;
          } else if (child.name === 'transition') {
            child.position.y = 2.0 + factor * 0.5;
          } else if (child.name === 'radiant') {
            child.position.y = -2.0 - factor * 2.0;
          }
        }

        // 2. Generic userData.explode animation for other models
        if (child.userData && child.userData.explode) {
          const factor = explodedFactor.current;
          const { x = 0, y = 0, z = 0 } = child.userData.explode;
          if (!child.userData.origPos) {
            child.userData.origPos = child.position.clone();
          }
          child.position.x = child.userData.origPos.x + x * factor;
          child.position.y = child.userData.origPos.y + y * factor;
          child.position.z = child.userData.origPos.z + z * factor;
        }
      });

      // Auto-rotation when not interacting and autoRotate is active
      if (autoRotateRef.current && controls.state === -1) {
        modelGroup.rotation.y += 0.003;
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
    <div
      ref={wrapperRef}
      className="w-full h-full relative"
    >
      {/* Mobile Touch Interaction Overlay Selector */}
      {!touchInteracting && !loading && (
        <div 
          className="absolute inset-0 bg-slate-950/25 backdrop-blur-xs flex items-center justify-center z-25 md:hidden cursor-pointer"
          onClick={() => setTouchInteracting(true)}
        >
          <div className="bg-slate-900/90 border border-slate-700/80 px-4 py-2.5 rounded-sm shadow-xl text-center flex items-center gap-2 max-w-[240px]">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0" />
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-white leading-tight">
              Tap to Rotate Model
            </span>
          </div>
        </div>
      )}

      {/* Mobile Lock Camera Floating Button */}
      {touchInteracting && !loading && (
        <button
          onClick={() => setTouchInteracting(false)}
          className="absolute top-16 right-3 z-35 md:hidden bg-slate-900/90 border border-slate-750 px-3 py-1.5 rounded-sm shadow-md text-white text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5"
        >
          <span>Lock Camera 🔒</span>
        </button>
      )}

      <div
        ref={containerRef}
        className={`w-full h-full cursor-grab active:cursor-grabbing relative z-10 transition-opacity duration-500 ease-out ${
          loading ? 'opacity-0' : 'opacity-100'
        } ${touchInteracting ? 'touch-none' : 'touch-auto md:touch-none'}`}
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#050c18]/95 backdrop-blur-sm text-white z-20">
          <div className="text-center max-w-xs px-6">
            <div className="relative w-14 h-14 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full border-2 border-blue-500/20" />
              <div className="absolute inset-0 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
              <div className="absolute inset-2 rounded-full border border-cyan-400/30 border-b-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
            </div>
            {modelName && (
              <p className="text-[11px] font-bold text-white/90 mb-1 truncate">{modelName}</p>
            )}
            <span className="text-[9px] uppercase tracking-widest font-bold text-blue-400/80">{loadingText}</span>
            <div className="mt-4 h-0.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse rounded-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
