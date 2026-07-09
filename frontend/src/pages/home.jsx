import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import ServiceConfirmationPanel from '@/components/ServiceConfirmationPanel';
import { PageMeta } from '@/components/PageMeta';
import { Skeleton } from '@/components/ui/skeleton';
import { getStats, getProjects, getServices } from '@/lib/api';
import { fallbackProjects } from '@/data/fallbackProjects';
import { fallbackServices } from '@/data/fallbackServices';
import {
  Building2, Factory, Grid3X3, Activity, ClipboardList, Layers,
  Phone, Mail, Globe, MapPin, ArrowRight, CheckCircle2,
  Clock, Briefcase, Users, Monitor, ShieldCheck, Zap, Fuel, FlaskConical, Wrench
} from 'lucide-react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const GLOBE_MARKERS = [
  { id: 48, name: "Evaporator Building Structure", location: "Visakhapatnam, India", lat: 17.686, lon: 83.218, desc: "Design & detailing of multi-level evaporator structure with complex structural columns, stairs, and platform layouts." },
  { id: 34, name: "2x100 TPH Boiler House Structures", location: "Mumbai, India", lat: 19.076, lon: 72.877, desc: "Civil and structural design for utility boiler house framing, de-aerator towers, and pipe racks under EIL specifications." },
  { id: 30, name: "1x80 T/Hr Boiler Structures", location: "Kochi, India", lat: 9.931, lon: 76.267, desc: "Utility boiler structure casing, support pillars, and connection joint detailing." },
  { id: 36, name: "Cylindrical Fired Heater", location: "Bina, India", lat: 24.168, lon: 78.204, desc: "Detailing of cylindrical radiant heater firebox with external buckstays and stack wind strakes." },
  { id: 21, name: "Cryogenic Plant Foundations", location: "Abadan, Iran", lat: 30.342, lon: 48.278, desc: "Subterranean piling grid template and pile cap concrete structures designed for heavy cryogenic equipment." },
  { id: 25, name: "Cold Box Foundation", location: "Roorkee, India", lat: 29.854, lon: 77.888, desc: "High-load concrete foundation mat, piles coordinate grid, and heavy base anchor templates." }
];

function GlobeCanvas({ onSelectMarker, activeId }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xd0dff0, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xf0f5ff, 1.8);
    keyLight.position.set(5, 5, 5);
    scene.add(keyLight);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Generate a procedural high-fidelity earth continent map texture on-the-fly
    const createEarthTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      // Ocean background - deep industrial slate navy
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 1024, 512);

      // Continent land color - clean textured mid-slate steel blue
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#38bdf8'; // Glowing sky-blue borders
      ctx.lineWidth = 1.5;

      const mapX = (lon) => (lon + 180) * (1024 / 360);
      const mapY = (lat) => (90 - lat) * (512 / 180);

      const drawLand = (coords) => {
        ctx.beginPath();
        coords.forEach((pt, idx) => {
          const x = mapX(pt[0]);
          const y = mapY(pt[1]);
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      };

      // Simplified continental polygons for clean CAD earth representation
      // North America
      drawLand([
        [-168, 65], [-120, 70], [-80, 70], [-60, 60], [-50, 48],
        [-80, 25], [-80, 9], [-90, 15], [-100, 20], [-110, 23],
        [-120, 33], [-125, 48], [-160, 55]
      ]);

      // Greenland
      drawLand([
        [-60, 80], [-40, 83], [-20, 75], [-40, 60], [-55, 60]
      ]);

      // South America
      drawLand([
        [-80, 9], [-72, 10], [-50, -5], [-40, -5], [-35, -7],
        [-40, -20], [-60, -40], [-70, -55], [-75, -50], [-70, -40],
        [-80, -15], [-80, -5]
      ]);

      // Africa
      drawLand([
        [-17, 32], [-5, 36], [10, 32], [30, 30], [32, 15],
        [51, 11], [40, -15], [20, -34], [15, -34], [10, -10],
        [0, 5], [-15, 15]
      ]);

      // Eurasia (Europe + Asia)
      drawLand([
        [-10, 65], [10, 70], [30, 72], [60, 75], [90, 77],
        [120, 77], [160, 75], [170, 65], [140, 35], [120, 20],
        [105, 20], [90, 10], [80, 8], [75, 20], [60, 25],
        [45, 15], [35, 30], [25, 40], [10, 40], [0, 50],
        [-10, 60]
      ]);
      
      // India sub-polygon
      drawLand([
        [68, 24], [72, 33], [78, 31], [88, 27], [92, 27],
        [88, 22], [80, 10], [77, 8], [72, 20]
      ]);

      // Australia
      drawLand([
        [113, -22], [115, -14], [125, -12], [135, -11], [142, -11],
        [148, -20], [153, -28], [150, -35], [140, -37], [130, -32],
        [115, -32]
      ]);

      return new THREE.CanvasTexture(canvas);
    };

    const globeTexture = createEarthTexture();
    const sphereGeo = new THREE.SphereGeometry(2.5, 48, 48);
    const sphereMat = new THREE.MeshStandardMaterial({
      map: globeTexture,
      roughness: 0.7,
      metalness: 0.15
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(sphere);

    const gridGeo = new THREE.SphereGeometry(2.51, 18, 18);
    const gridMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.25,
      wireframe: true
    });
    const globeGrid = new THREE.Mesh(gridGeo, gridMat);
    globeGroup.add(globeGrid);

    for (let h = -2.2; h <= 2.2; h += 0.3) {
      const radius = Math.sqrt(2.5 * 2.5 - h * h);
      const ringGeo = new THREE.RingGeometry(radius, radius + 0.02, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x1e3a8a, side: THREE.DoubleSide, transparent: true, opacity: 0.3 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.y = h;
      ring.rotation.x = Math.PI / 2;
      globeGroup.add(ring);
    }

    const pinGroup = new THREE.Group();
    globeGroup.add(pinGroup);

    const pinsList = [];
    GLOBE_MARKERS.forEach((m) => {
      const latRad = (m.lat * Math.PI) / 180;
      const lonRad = (-m.lon * Math.PI) / 180;
      const r = 2.5;
      const x = r * Math.cos(latRad) * Math.cos(lonRad);
      const y = r * Math.sin(latRad);
      const z = r * Math.cos(latRad) * Math.sin(lonRad);

      const pinGeo = new THREE.ConeGeometry(0.12, 0.35, 8);
      const isSelected = m.id === activeId;
      const pinMat = new THREE.MeshStandardMaterial({
        color: isSelected ? 0xef4444 : 0x10b981,
        emissive: isSelected ? 0xef4444 : 0x10b981,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.8
      });
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.set(x, y, z);

      const normal = new THREE.Vector3(x, y, z).normalize();
      pin.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

      pinGroup.add(pin);
      pinsList.push({ mesh: pin, data: m });
    });

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.0;

    let userInteracting = false;
    const onStart = () => {
      userInteracting = true;
      controls.autoRotate = false;
    };
    const onEnd = () => {
      userInteracting = false;
      setTimeout(() => {
        if (!userInteracting) controls.autoRotate = true;
      }, 3000);
    };
    controls.addEventListener('start', onStart);
    controls.addEventListener('end', onEnd);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(pinGroup.children);

      if (intersects.length > 0) {
        const hitPin = pinsList.find(p => p.mesh === intersects[0].object);
        if (hitPin) {
          onSelectMarker(hitPin.data);
        }
      }
    };

    renderer.domElement.addEventListener('click', handleClick);

    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      controls.removeEventListener('start', onStart);
      controls.removeEventListener('end', onEnd);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      controls.dispose();
      renderer.dispose();
    };
  }, [onSelectMarker, activeId]);

  return <div ref={mountRef} className="w-full h-[400px] cursor-grab active:cursor-grabbing" />;
}

const serviceIcons = {
  building: <Building2 className="w-8 h-8" />,
  factory: <Factory className="w-8 h-8" />,
  grid: <Grid3X3 className="w-8 h-8" />,
  activity: <Activity className="w-8 h-8" />,
  clipboard: <ClipboardList className="w-8 h-8" />,
  layers: <Layers className="w-8 h-8" />,
  monitor: <Monitor className="w-8 h-8" />,
};

const clients = [
  { name: 'L&T', full: 'Larsen & Toubro' },
  { name: 'BHEL', full: 'BHEL' },
  { name: 'HPCL', full: 'HPCL' },
  { name: 'DOOSAN', full: 'Doosan Babcock' },
  { name: 'Air Liquide', full: 'Air Liquide' },
];

const clientLogos = {
  'L&T': (
    <svg viewBox="0 0 120 40" className="h-7 w-auto fill-current">
      <circle cx="16" cy="20" r="13" fill="none" stroke="currentColor" strokeWidth="2" />
      <text x="16" y="24" textAnchor="middle" fontSize="9" fontWeight="900" fill="currentColor">L&T</text>
      <text x="35" y="23" fontSize="8" fontWeight="900" fill="currentColor" letterSpacing="0.3">LARSEN & TOUBRO</text>
    </svg>
  ),
  'BHEL': (
    <svg viewBox="0 0 120 40" className="h-7 w-auto fill-current">
      <rect x="2" y="6" width="30" height="28" rx="2" fill="currentColor" />
      <text x="17" y="23" textAnchor="middle" fontSize="9" fontWeight="900" fill="white">BHEL</text>
      <text x="38" y="23" fontSize="9" fontWeight="900" fill="currentColor" letterSpacing="0.8">बीएचईएल</text>
    </svg>
  ),
  'HPCL': (
    <svg viewBox="0 0 120 40" className="h-7 w-auto fill-current">
      <ellipse cx="20" cy="20" rx="18" ry="12" fill="none" stroke="currentColor" strokeWidth="2" />
      <text x="20" y="23" textAnchor="middle" fontSize="8" fontWeight="900" fill="currentColor">HPCL</text>
      <text x="45" y="23" fontSize="8" fontWeight="900" fill="currentColor" letterSpacing="0.3">HIN. PETROLEUM</text>
    </svg>
  ),
  'DOOSAN': (
    <svg viewBox="0 0 120 40" className="h-7 w-auto fill-current">
      <text x="10" y="24" fontSize="14" fontWeight="900" fill="currentColor" letterSpacing="0.5">DOOSAN</text>
      <text x="80" y="23" fontSize="6" fontWeight="700" fill="currentColor">Babcock</text>
    </svg>
  ),
  'Air Liquide': (
    <svg viewBox="0 0 120 40" className="h-7 w-auto fill-current">
      <path d="M 5 28 L 22 8 L 38 28 Z" fill="none" stroke="currentColor" strokeWidth="2" />
      <text x="45" y="23" fontSize="10" fontWeight="900" fill="currentColor" letterSpacing="0.3">AIR LIQUIDE</text>
    </svg>
  ),
};

const industries = [
  { name: 'Oil & Gas', icon: <Fuel className="w-5 h-5" /> },
  { name: 'Petrochemicals', icon: <FlaskConical className="w-5 h-5" /> },
  { name: 'Power Generation', icon: <Zap className="w-5 h-5" /> },
  { name: 'Chemical Plants', icon: <Factory className="w-5 h-5" /> },
  { name: 'Infrastructure', icon: <Building2 className="w-5 h-5" /> },
  { name: 'Steel Industry', icon: <Grid3X3 className="w-5 h-5" /> },
];

const SPOTLIGHT_META = {
  48: {
    threeId: 'evaporator-structure',
    blueprintRef: 'SLS-1011-16-GA-01',
    drawingFile: 'evaporator_ga.png',
    codes: 'IS 800 (Structural Design), IS 1893 (Seismic Loads)',
    software: 'AutoCAD, STAAD.Pro, Tekla Structures'
  },
  49: {
    threeId: 'dhdt-heater',
    blueprintRef: 'EIL-6879-211-05-42-0102',
    drawingFile: 'eil_ga_sheet1.png',
    codes: 'API 560 (Fired Heaters), API 530, ASME Sec VIII',
    software: 'STAAD.Pro, AutoCAD, ANSYS (FEA Thermal)'
  },
  50: {
    threeId: 'hds-heater',
    blueprintRef: 'EIL-6879-212-05-42-1202',
    drawingFile: 'hds_convection_sheet1.png',
    codes: 'API 560 (Fired Heaters), ASME Sec VIII, EIL Specs',
    software: 'STAAD.Pro, AutoCAD, ANSYS (FEA Structural)'
  }
};


function AnimatedSection({ children, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Animated counting number component
function AnimatedCounter({ target, duration = 1500, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const hasStarted = useRef(false);
  useEffect(() => {
    if (!isInView || hasStarted.current) return;
    hasStarted.current = true;
    const startTime = performance.now();
    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [isInView, target, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
}

export default function Home() {
  const [selectedMarker, setSelectedMarker] = useState(GLOBE_MARKERS[0]);
  const [activeServiceToBook, setActiveServiceToBook] = useState(null);
  const [, setLocation] = useLocation();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const { data: stats, isLoading: statsLoading } = useQuery({ queryKey: ['stats'], queryFn: getStats });
  const { data: projects, isLoading: projectsLoading } = useQuery({ 
    queryKey: ['projects'], 
    queryFn: getProjects,
    initialData: fallbackProjects
  });
  const { data: services, isLoading: servicesLoading } = useQuery({ 
    queryKey: ['services'], 
    queryFn: getServices,
    initialData: fallbackServices
  });

  const [spotlightProject, setSpotlightProject] = useState(null);

  useEffect(() => {
    if (projects && projects.length > 0) {
      const specialProjects = projects.filter(p => [48, 49, 50].includes(p.id));
      if (specialProjects.length > 0) {
        const randomProj = specialProjects[Math.floor(Math.random() * specialProjects.length)];
        setSpotlightProject(randomProj);
      }
    }
  }, [projects]);

  const featuredProjects = projects?.slice(0, 3);


  return (
    <div className="w-full bg-white">
      <PageMeta
        title="Home"
        description="SLS Consultants — Expert structural, mechanical, and industrial engineering since 2002. Fired heater design, RLA studies, FEM analysis, Tekla steel detailing. Based in Visakhapatnam."
      />

      {/* 1. HERO & STATS COMBINED */}
      <section 
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="grid md:grid-cols-2 min-h-[480px] relative overflow-hidden"
      >
        <div className="bg-slate-50 text-[#0a1628] px-10 md:px-16 py-16 md:py-20 flex flex-col justify-center relative overflow-hidden border-b border-slate-200">
          <div className="absolute inset-0 opacity-[0.05] text-[#0a1628] pointer-events-none">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="herogrid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#herogrid)" />
            </svg>
          </div>
          <div
            className="absolute inset-0 pointer-events-none hidden md:block opacity-[0.12]"
            style={{
              backgroundImage: 'radial-gradient(circle 180px at var(--mouse-x, 0px) var(--mouse-y, 0px), rgb(67, 100, 142) 0%, transparent 100%)',
              '--mouse-x': `${mousePos.x}px`,
              '--mouse-y': `${mousePos.y}px`
            }}
          />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }} className="relative z-10">
            <span className="inline-block text-[10px] font-bold tracking-[0.2em] uppercase text-slate-500 mb-5">
              Engineering Excellence Since 2002
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-[1.1] mb-6">
              Industrial Fired Heaters & Structural Engineering
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed mb-8 max-w-sm">
              Providing full-scale mechanical and structural engineering consultancy designed in accordance with project-specific international and regional standards.
            </p>

            {/* Inline Animated Stats Counter inside Hero */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4 mb-8 border-t border-slate-200 pt-6 max-w-lg">
              {[
                { target: stats?.yearsExperience || 20, label: 'Years Exp', sub: 'Since 2002' },
                { target: stats?.projectsCompleted || 500, label: 'Projects', sub: 'Delivered' },
                { target: stats?.clientsServed || 25, label: 'Clients', sub: 'Satisfied' },
                { target: stats?.softwarePlatforms || 5, label: 'Software', sub: 'Platforms' }
              ].map((stat, idx) => (
                <div key={idx} className="min-w-0 flex flex-col justify-end">
                  <div className="text-2xl font-black text-[#0a1628] leading-none mb-1.5">
                    <AnimatedCounter target={stat.target} suffix="+" duration={1200 + idx * 150} />
                  </div>
                  <div className="text-[9px] font-bold uppercase tracking-wider text-slate-500 leading-none mb-0.5">{stat.label}</div>
                  <div className="text-[8px] text-slate-400 truncate leading-none">{stat.sub}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/contact">
                <button className="flex items-center gap-2 bg-[#0a1628] text-white px-6 py-3 text-sm font-semibold hover:bg-[#1a2f4c] transition-colors rounded-sm shadow-sm">
                  Request a Consultation <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="/projects">
                <button className="flex items-center gap-2 border border-slate-300 text-[#0a1628] px-6 py-3 text-sm font-semibold hover:bg-slate-100 transition-colors rounded-sm">
                  View Our Projects <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative min-h-[350px] md:min-h-[480px] overflow-hidden bg-slate-100 border-l border-slate-200"
        >
          <img
            src="/hero_industrial_plant.png"
            alt="SLS Engineering Hero"
            className="absolute inset-0 w-full h-full object-cover opacity-95 transition-transform duration-700 hover:scale-105"
          />
        </motion.div>
      </section>

      {/* 2. COMPACT ABOUT & FOUNDER (SINGLE COMPACT MODULE) */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="bg-gray-50 border border-gray-100 p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 max-w-5xl mx-auto">
            <div className="max-w-xl">
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#43648e] block mb-2">Our Profile</span>
              <p className="text-[#0a1628] text-sm md:text-base leading-relaxed mb-4">
                Established in 2002, SLS Consultants provides premium structural design, stress analysis, and steel detailing solutions for heavy industrial refineries, boilers, and petrochemical facilities across India and global markets.
              </p>
              <Link href="/about">
                <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#43648e] cursor-pointer hover:text-[#0a1628] transition-colors">
                  Learn More About SLS &rarr;
                </span>
              </Link>
            </div>
            
            <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-gray-200 pt-6 md:pt-0 md:pl-8 shrink-0 w-full md:w-auto">
              <div className="w-14 h-14 bg-gray-200 overflow-hidden shrink-0 rounded-sm">
                <img
                  src="/founder_portrait.png"
                  alt="Mr. C. Subrahmanyam"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0a1628] leading-tight">Mr. C. Subrahmanyam</h4>
                <p className="text-[11px] text-gray-500 font-medium mt-0.5">Founder &amp; Principal Engineer</p>
                {/* Descriptive metadata — not a link */}
                <p className="text-[10px] text-gray-400 font-medium mt-1">Ex-BHEL (18 Yrs)&nbsp;&nbsp;|&nbsp;&nbsp;Ex-Doosan Babcock</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY SLS — DIFFERENTIATOR SECTION */}
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">Why Choose SLS</p>
              <h2 className="text-3xl font-bold text-[#0a1628] mb-4">The SLS Advantage</h2>
              <p className="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
                We aren't a generalist firm. Everything we do is centred around one domain: heavy industrial engineering — where standards are strict and margins for error are zero.
              </p>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <ShieldCheck className="w-8 h-8" />,
                title: 'Founder-Led Technical Depth',
                desc: 'Every project is supervised by Mr. C. Subrahmanyam — 18 years at BHEL + Doosan Babcock. No junior hand-off, no diluted expertise.'
              },
              {
                icon: <Layers className="w-8 h-8" />,
                title: 'Multi-Discipline Under One Roof',
                desc: 'Structural, mechanical, thermal, and steel detailing in one coordinated team. No coordination delays between sub-vendors.'
              },
              {
                icon: <Briefcase className="w-8 h-8" />,
                title: 'Code-Compliant Deliverables',
                desc: 'All drawings and calculations produced under API 560, ASME Section VIII/I, IS 800, IS 6533, and EIL specifications.'
              },
              {
                icon: <CheckCircle2 className="w-8 h-8" />,
                title: '500+ Projects Delivered',
                desc: 'Consistent track record for HPCL, L&T, BHEL, Air Liquide, and Doosan Babcock with zero statutory approvals failures.'
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-gray-50 border border-gray-200 p-6 flex flex-col gap-4"
              >
                <div className="w-14 h-14 bg-[#0a1628] text-white flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-[#0a1628] text-sm mb-2 leading-snug">{item.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED SERVICES (CAPPED AT 6 SERVICES WITH DETAIL LINK) */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">Core Capabilities</p>
              <h2 className="text-3xl font-bold text-[#0a1628]">Our Featured Services</h2>
            </div>
          </AnimatedSection>
          {servicesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-44" />)}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-12">
                {services?.slice(0, 6).map((svc, i) => (
                  <motion.div
                    key={svc.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: i * 0.06 }}
                    className="bg-white border border-gray-200 p-6 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-[#43648e] mb-4">
                        {serviceIcons[svc.icon] || <Building2 className="w-8 h-8" />}
                      </div>
                      <h3 className="font-bold text-[#0a1628] text-sm mb-2">{svc.title}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed mb-4">{svc.description}</p>
                    </div>
                    <div>
                      <button
                        onClick={() => setActiveServiceToBook(svc.title)}
                        className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-blue-700 cursor-pointer border-b border-transparent hover:border-blue-700 pb-0.5"
                      >
                        Book Service &rarr;
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="text-center">
                <Link href="/services">
                  <button className="inline-flex items-center gap-2 border border-gray-300 text-[#0a1628] px-8 py-3 text-sm font-semibold hover:bg-[#0a1628] hover:text-white hover:border-[#0a1628] transition-colors">
                    View All Services &rarr;
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 4. FEATURED CASE STUDY SPOTLIGHT (Randomized on every reload) */}
      <section className="py-20 bg-slate-50 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-blue-700 mb-3">Case Study Spotlight</p>
              <h2 className="text-3xl font-bold text-[#0a1628]">Project Case Study in Focus</h2>
              <p className="text-xs text-gray-500 max-w-xl mx-auto mt-2 leading-relaxed">
                Highlighting our specialized mechanical detailing, structural design, and code compliance work. Reload the page to view a different case study focus.
              </p>
            </div>
          </AnimatedSection>

          {spotlightProject && SPOTLIGHT_META[spotlightProject.id] ? (
            <div className="max-w-5xl mx-auto border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col lg:flex-row gap-8 lg:gap-0 rounded-sm">
              {/* Left Column: Blueprint Image preview with slight blur */}
              <div className="lg:w-1/2 relative bg-slate-100 border-b lg:border-b-0 lg:border-r border-gray-200 min-h-[320px] flex items-center justify-center overflow-hidden group">
                <img 
                  src={`/gallery/${SPOTLIGHT_META[spotlightProject.id].drawingFile}`} 
                  alt={spotlightProject.title}
                  className="absolute inset-0 w-full h-full object-cover filter blur-[1.5px] group-hover:blur-none transition-all duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[#0a1628]/10 group-hover:bg-transparent transition-colors duration-300" />
                <div className="absolute top-4 left-4 bg-blue-700 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 shadow rounded-sm">
                  Featured Case Study
                </div>
                <div className="absolute bottom-4 left-4 bg-[#0a1628]/80 backdrop-blur-sm text-white text-[9px] font-semibold px-2 py-1 rounded-sm">
                  Drawing Ref: {SPOTLIGHT_META[spotlightProject.id].blueprintRef}
                </div>
              </div>

              {/* Right Column: Case study details */}
              <div className="lg:w-1/2 p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-blue-700 bg-blue-50 px-2 py-0.5 rounded-sm">
                      {spotlightProject.category}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">
                      Est. {spotlightProject.year}
                    </span>
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-bold text-[#0a1628] leading-tight mb-4">
                    {spotlightProject.title}
                  </h3>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">The Challenge</span>
                      <p className="text-xs text-gray-600 leading-relaxed mt-0.5">
                        {spotlightProject.challenge}
                      </p>
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">SLS Engineering Solution</span>
                      <p className="text-xs text-gray-600 leading-relaxed mt-0.5">
                        {spotlightProject.solution}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-4 mb-6">
                    <div>
                      <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider block">Applicable Codes</span>
                      <span className="text-[10px] font-semibold text-slate-700 mt-0.5 block leading-tight">
                        {SPOTLIGHT_META[spotlightProject.id].codes}
                      </span>
                    </div>
                    <div>
                      <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider block">Design Software</span>
                      <span className="text-[10px] font-semibold text-slate-700 mt-0.5 block leading-tight">
                        {SPOTLIGHT_META[spotlightProject.id].software}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href={`/case-study/${spotlightProject.id}`} className="flex-1">
                    <button className="w-full bg-[#0a1628] hover:bg-[#1a2f4c] text-white py-3 text-xs font-bold uppercase tracking-wider transition-colors rounded-sm flex items-center justify-center gap-1 cursor-pointer">
                      Read Technical Case Study &rarr;
                    </button>
                  </Link>
                  <Link href={`/gallery?tab=models&model=${SPOTLIGHT_META[spotlightProject.id].threeId}`} className="flex-1">
                    <button className="w-full bg-white hover:bg-slate-100 border border-gray-300 text-slate-700 py-3 text-xs font-bold uppercase tracking-wider transition-colors rounded-sm flex items-center justify-center gap-1 cursor-pointer">
                      Open Interactive 3D Model
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto h-72 bg-gray-50 border border-gray-200 flex items-center justify-center rounded-sm">
              <Skeleton className="w-full h-full animate-pulse" />
            </div>
          )}
        </div>
      </section>

      {/* 5. FEATURED PROJECTS */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">Featured Projects</p>
              <h2 className="text-3xl font-bold text-[#0a1628]">Significant Projects Delivered</h2>
            </div>
          </AnimatedSection>

          {projectsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-56" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
              {featuredProjects?.map((proj, i) => (
                <motion.div
                  key={proj.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.07 }}
                  className="border border-gray-200 hover:shadow-md transition-shadow duration-200 group"
                >
                  <div className="w-full h-36 bg-gray-50 overflow-hidden flex items-center justify-center border-b border-gray-200 group-hover:bg-gray-100 transition-colors relative">
                    {proj.image ? (
                      <img
                        src={proj.image}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentNode.querySelector('.fallback-icon').style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      className="fallback-icon absolute inset-0 items-center justify-center bg-gray-100"
                      style={{ display: proj.image ? 'none' : 'flex' }}
                    >
                      <Building2 className="w-8 h-8 text-gray-200" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-[#0a1628] text-xs leading-snug mb-2">{proj.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{proj.description.substring(0, 90)}...</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center">
            <Link href="/projects">
              <button className="inline-flex items-center gap-2 border border-gray-300 text-[#0a1628] px-8 py-3 text-sm font-semibold hover:bg-[#0a1628] hover:text-white hover:border-[#0a1628] transition-colors">
                View All Projects <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* GLOBAL FOOTPRINT SECTION */}
      <section className="py-20 bg-gray-50 border-t border-b border-gray-150">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">Global Footprint</p>
              <h2 className="text-3xl font-bold text-[#0a1628]">Our Interactive Project Map</h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Globe Canvas Container */}
            <div className="lg:col-span-7 bg-white border border-gray-200/80 p-4 rounded-sm shadow-xs relative overflow-hidden flex items-center justify-center">
              <div className="absolute top-4 left-4 z-20 pointer-events-none">
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">Drag to rotate globe · Click pins</span>
              </div>
              <GlobeCanvas
                activeId={selectedMarker.id}
                onSelectMarker={(marker) => setSelectedMarker(marker)}
              />
            </div>

            {/* Selected Location Card */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedMarker.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white border border-gray-200 p-6 md:p-8 rounded-sm shadow-sm relative flex flex-col justify-between min-h-[300px]"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">{selectedMarker.location}</span>
                    </div>
                    <h3 className="text-sm font-bold text-[#0a1628] mb-3 leading-tight">{selectedMarker.name}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed mb-6">{selectedMarker.desc}</p>
                  </div>
                  <div>
                    <Link href={`/case-study/${selectedMarker.id}`}>
                      <button className="w-full bg-[#0a1628] hover:bg-[#1a2f4c] text-white py-3 text-xs font-bold uppercase tracking-wider transition-colors rounded-sm flex items-center justify-center gap-2 cursor-pointer">
                        Explore Case Study <ArrowRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
      {/* 5. CLIENT TESTIMONIALS (EXACTLY 2 CARDS SIDE-BY-SIDE) */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">Client Feedback</p>
            <h2 className="text-3xl font-bold text-[#0a1628]">What Our Clients Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                quote: "SLS Consultants has been a key detailing partner for our critical refinery packages. Their adherence to EIL standards and prompt engineering revisions under Mr. Subrahmanyam's guidance kept our projects on schedule.",
                author: "Senior Engineering Manager",
                company: "Larsen & Toubro"
              },
              {
                quote: "Their remaining life assessment and FEA reporting for our heater casing was thorough, well-documented, and crucial for our statutory approvals. Exceptional technical detailing capability.",
                author: "Mechanical Detailing Lead",
                company: "HPCL Vizag Refinery"
              }
            ].map((t, idx) => (
              <div key={idx} className="bg-white border border-gray-200 p-6 md:p-8 flex flex-col justify-between shadow-sm">
                <p className="text-gray-600 text-xs md:text-sm italic leading-relaxed mb-6">
                  “{t.quote}”
                </p>
                <div>
                  <h4 className="text-xs font-bold text-[#0a1628]">{t.author}</h4>
                  <p className="text-[10px] text-blue-700 font-semibold uppercase tracking-wider mt-0.5">{t.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CLIENT LOGOS & TARGET SECTORS */}
      <section className="py-16 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 text-center mb-8">
              Trusted by Leading Organizations
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-12">
              {clients.map((client) => (
                <div
                  key={client.name}
                  className="border border-gray-300 px-6 py-3 min-w-[160px] h-14 flex items-center justify-center bg-white"
                >
                  <div className="text-[#0a1628] flex items-center justify-center w-full">
                    {clientLogos[client.name] || (
                      <span className="text-sm font-bold tracking-wide">{client.name}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-10">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 text-center mb-6">
                Engineering Solutions Across Industrial Sectors
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {industries.map((ind) => (
                  <div key={ind.name} className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2">
                    <div className="text-blue-700">{ind.icon}</div>
                    <span className="text-[10px] font-bold text-[#0a1628] uppercase tracking-wider">{ind.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* 7. SOFTWARE EXPERTISE LOGO STRIP */}
      <section className="py-10 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <p className="text-[9px] font-bold uppercase tracking-widest text-center text-gray-400 mb-6">
            Powered by industry-standard tools
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 opacity-65">
            {['AutoCAD', 'STAAD.Pro', 'Tekla Structures', 'ANSYS', 'CATIA'].map((sw) => (
              <span key={sw} className="text-xs md:text-sm font-bold tracking-widest text-[#0a1628] uppercase">
                {sw}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CTA */}
      <section className="py-20 bg-slate-50 text-[#0a1628] relative overflow-hidden border-t border-slate-200">
        <div className="absolute inset-0 opacity-[0.05] text-[#0a1628] pointer-events-none">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="ctagrid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#ctagrid)" />
          </svg>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <AnimatedSection>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-500 mb-4">Project Consultation</p>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
              Have a Project in Mind?<br />
              <span className="text-[#43648e]">Let's Engineer It Together.</span>
            </h2>
            <p className="text-slate-600 text-sm md:text-base max-w-xl mx-auto mb-10 leading-relaxed">
              Share your project scope, connection codes, or drawing layouts with us. Our engineers will review your requirements and coordinate a technical proposal.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact">
                <button className="flex items-center gap-2 bg-[#0a1628] text-white px-8 py-4 text-sm font-bold uppercase tracking-wider hover:bg-[#1a2f4c] transition-colors rounded-sm shadow-md">
                  Request a Consultation <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <a href="tel:+919849598424" rel="external" className="flex items-center gap-2 border border-slate-300 bg-white text-[#0a1628] px-8 py-4 text-sm font-semibold hover:bg-slate-100 transition-colors rounded-sm shadow-sm">
                <Phone className="w-4 h-4" /> Call Us Now
              </a>
            </div>
            <p className="text-xs text-slate-400 mt-6">
              Confidential project information handled securely · Response within timezone working hours
            </p>
          </AnimatedSection>
        </div>
      </section>

      <AnimatePresence>
        {activeServiceToBook && (
          <ServiceConfirmationPanel
            serviceName={activeServiceToBook}
            onClose={() => setActiveServiceToBook(null)}
            onConfirm={() => {
              setActiveServiceToBook(null);
              setLocation(`/contact?service=${encodeURIComponent(activeServiceToBook)}`);
            }}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
