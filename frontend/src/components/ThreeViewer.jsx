import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const HOTSPOTS_DATA = {
  heater: [
    { id: 1, pos: { x: 0, y: 5.5, z: 1.5 }, title: 'Convection Section', text: 'Top convection module housing finned tubes bundle to capture residual flue heat.' },
    { id: 2, pos: { x: 0, y: -2, z: 1.5 }, title: 'Radiant Firebox', text: 'Refractory-lined lower chamber where process coils absorb high radiant heat fluxes.' },
    { id: 3, pos: { x: -1.5, y: 1.5, z: 1.5 }, title: 'Tube Header Boxes', text: 'Side return enclosures with quick-open hinges for decoking inspections.' },
    { id: 4, pos: { x: 1.5, y: 0.0, z: -1.5 }, title: 'Burner Plenum Assembly', text: 'Secondary combustion air chamber distribution system at bottom floor.' },
    { id: 5, pos: { x: 0, y: 1.8, z: 1.5 }, title: 'Refractory Lining Deck', text: 'Thermal dividing deck lined with ceramic fiber modules for heat retention.' },
    { id: 6, pos: { x: 0, y: -4.5, z: 0 }, title: 'Fuel Gas Manifolds', text: 'Distribution piping supplying fuel gas to bottom-mounted burners.' }
  ],
  stack: [
    { id: 1, pos: { x: 0, y: 8, z: 1.0 }, title: 'Vortex wind strakes', text: 'Mitigates crosswind vortex shedding oscillations conforming to ASME STS-1.' },
    { id: 2, pos: { x: 0, y: -1, z: 1.8 }, title: 'Foundation Anchor Ring', text: 'Secures stack base plates against coastal cyclonic shear stresses.' },
    { id: 3, pos: { x: 0, y: 4.0, z: -1.0 }, title: 'Stack Access Platform', text: 'Circular sampling platform segment detailed under OSHA standards.' },
    { id: 4, pos: { x: -0.8, y: 1.5, z: 0.8 }, title: 'Counterweight Damper', text: 'Flue draft control damper balancing furnace air draft flow pressures.' },
    { id: 5, pos: { x: 0, y: 6.5, z: -0.8 }, title: 'Emission Sampling Nozzles', text: 'Built-in nozzles for flue gas monitors (CEMS) sensor instrumentation.' },
    { id: 6, pos: { x: 0, y: 11.2, z: 0 }, title: 'Rain Hood & Screen', text: 'Top exhaust opening fitted with mesh screen to prevent weather ingress.' }
  ],
  offtake: [
    { id: 1, pos: { x: 0, y: 1.5, z: 1.2 }, title: 'Expansion joints bellows', text: 'Absorbs vertical and lateral thermal movements between stack and convection section.' },
    { id: 2, pos: { x: 1.2, y: 0.5, z: 1.0 }, title: 'Breeching casing plates', text: 'Internal insulating castable lining designed to withstand hot flue gas flows.' },
    { id: 3, pos: { x: -1.0, y: -0.5, z: -1.0 }, title: 'Rigging lifting lugs', text: 'Heavy crane hook points calculated with 2.0x dynamic load safety factors.' },
    { id: 4, pos: { x: 0, y: 0.8, z: -1.2 }, title: 'Internal insulation liners', text: 'High-alloy anchor arrays securing monolithic ceramic blanket blocks.' }
  ],
  radiant: [
    { id: 1, pos: { x: 0, y: 1.5, z: 1.8 }, title: 'Vertical process coils', text: 'High-alloy tube bundle designed for high temperatures conforming to API 530.' },
    { id: 2, pos: { x: 1.8, y: -1.0, z: 1.5 }, title: 'Coil Hanger Brackets', text: 'Heat-resistant casting support hangers detailed to handle tube thermal growth.' },
    { id: 3, pos: { x: -1.5, y: 0.0, z: 1.5 }, title: 'Skin Thermocouples', text: 'Precision temperature sensor sockets welded to coil outer boundaries.' },
    { id: 4, pos: { x: 0, y: -2.5, z: -1.2 }, title: 'Refractory Floor blocks', text: 'Monolithic high-alumina block segments lined to insulate steel plates.' },
    { id: 5, pos: { x: 0, y: -3.2, z: 0 }, title: 'Burner Openings', text: 'Accurately detailed burner sleeves fitted with refractory throat rings.' },
    { id: 6, pos: { x: 0, y: 3.2, z: -1.8 }, title: 'Explosion Relief Door', text: 'Gravity relief latches designed to open and vent pressure during surges.' }
  ],
  burnerfloor: [
    { id: 1, pos: { x: 0, y: 0, z: 1.2 }, title: 'Burner mounting sleeve', text: 'A36 floor casing plate cutout detailed to secure vertically-fired gas burners.' },
    { id: 2, pos: { x: 1.5, y: -0.8, z: 1.5 }, title: 'Air register plenum', text: 'Plenum chamber ensuring uniform distribution of secondary combustion air.' },
    { id: 3, pos: { x: -1.2, y: -0.5, z: -1.2 }, title: 'Air register levers', text: 'Secondary draft control arms regulating fresh combustion air intake.' },
    { id: 4, pos: { x: 0.8, y: 0.2, z: -0.8 }, title: 'Refractory seal castable', text: 'Thermal seal barrier around burner neck joints to prevent heat leaks.' }
  ],
  headerbox: [
    { id: 1, pos: { x: -1.8, y: 1.0, z: 1.2 }, title: 'Quick-open access doors', text: 'Allows routine tube decoking and mechanical cleaning inspections.' },
    { id: 2, pos: { x: 0, y: -1.0, z: 1.5 }, title: 'Tube return bends (U-bends)', text: 'Process return fittings enclosed to prevent hazardous flue gas leakage.' },
    { id: 3, pos: { x: 1.8, y: 0.5, z: -1.2 }, title: 'Thermal seal packing', text: 'Insulating rope seals fitted to prevent flue gas escaping to casing sides.' },
    { id: 4, pos: { x: -0.8, y: -0.5, z: 0.8 }, title: 'Heavy duty toggle clamps', text: 'Toggle latch anchors locking the door panels securely against draft pressure.' }
  ],
  archplate: [
    { id: 1, pos: { x: 0, y: 1.0, z: 1.5 }, title: 'Monolithic refractory arch', text: 'Grade 26 refractory lining detailed to insulate the heater transition zone.' },
    { id: 2, pos: { x: 1.5, y: -0.5, z: 1.5 }, title: 'Insulation anchor pins', text: 'SS310 anchor hooks configured to retain monolithic castable block weight.' },
    { id: 3, pos: { x: -1.2, y: 0.5, z: -1.2 }, title: 'Anchor pattern spacing', text: 'Configured hook arrays to transfer block load into framing sheets.' },
    { id: 4, pos: { x: 0.8, y: 0.0, z: 0.8 }, title: 'Expansion joint packing', text: 'Compressed ceramic paper layers designed to yield during high temperature growth.' }
  ],
  convection: [
    { id: 1, pos: { x: 0, y: 2.0, z: 1.5 }, title: 'Finned tube bundle bank', text: 'High-density circular fin extensions to maximize convective heat recovery.' },
    { id: 2, pos: { x: 1.5, y: -0.5, z: 1.5 }, title: 'Intermediate support plates', text: 'High-temperature support sheets detailed to prevent pipe sagging.' },
    { id: 3, pos: { x: -1.2, y: 1.0, z: -1.2 }, title: 'Structural side columns', text: 'Heavy casing side channels designed to transfer bundle weight to firebox portal.' },
    { id: 4, pos: { x: 0, y: -1.2, z: 1.0 }, title: 'Refractory lining blocks', text: 'Castable insulation layer detailed to protect structural casing plates.' },
    { id: 5, pos: { x: 0, y: 0.8, z: 1.5 }, title: 'Finned Tube Pitch Layout', text: 'Triangular tube pitch spacing optimized to maximize waste heat recovery.' },
    { id: 6, pos: { x: -1.5, y: -0.5, z: 0 }, title: 'Tube Sheet Flange', text: 'Precision machined carbon steel tube sheet retaining convection tubes.' }
  ],
  sootblower: [
    { id: 1, pos: { x: 0, y: 1.5, z: 1.5 }, title: 'Catwalk support framing', text: 'Structural framework detailed to carry steam soot blower motorized carriage.' },
    { id: 2, pos: { x: 1.2, y: -0.5, z: 1.0 }, title: 'Lance penetration sleeve', text: 'Casing hole detailing allowing soot blower steam lance travel into tube banks.' },
    { id: 3, pos: { x: -1.0, y: 0.5, z: -1.0 }, title: 'Track runway rails', text: 'Guide channels ensuring linear travel alignment of soot blower lance.' },
    { id: 4, pos: { x: 0.8, y: -0.8, z: 0.8 }, title: 'Drive motor mount plate', text: 'Rigid base plate supporting heavy motor and chain drive system.' }
  ],
  framing: [
    { id: 1, pos: { x: 0, y: 2.0, z: 1.8 }, title: 'Portal structural frames', text: 'Heavy section columns and beams configured under IS 800 code.' },
    { id: 2, pos: { x: -1.8, y: -2.0, z: 1.8 }, title: 'Column splicing connection', text: 'Splicing joints designed to transfer vertical loads and wind moments.' },
    { id: 3, pos: { x: 1.5, y: 0.0, z: -1.5 }, title: 'Cross structural struts', text: 'Channel and angle steel members configured to distribute structural loads.' },
    { id: 4, pos: { x: -1.5, y: -1.0, z: -1.5 }, title: 'Gusset connection plate', text: 'Thick gusset plate connecting vertical columns to support girders.' }
  ],
  frame3d: [
    { id: 1, pos: { x: 0, y: 3.0, z: 1.8 }, title: 'Braced steel framework', text: 'Cross bracing systems to resist seismic and cyclonic shear forces.' },
    { id: 2, pos: { x: 1.8, y: -1.0, z: 1.8 }, title: 'Gusset plate connection', text: 'High-strength bolted connection detailing modeled using Tekla Structures.' },
    { id: 3, pos: { x: -1.8, y: 1.0, z: -1.8 }, title: 'Piping support brackets', text: 'Heavy welded brackets carrying high-pressure piping manifolds.' },
    { id: 4, pos: { x: 0, y: -2.5, z: 1.5 }, title: 'Anchor bolt shear ring', text: 'Reinforcing ring transfers base shear stress directly into concrete pedestal.' }
  ],
  roof: [
    { id: 1, pos: { x: 0, y: 1.0, z: 1.5 }, title: 'Roof truss framing', text: 'Gable portal configurations detailed for wind and canopy sheeting loads.' },
    { id: 2, pos: { x: 1.5, y: -1.0, z: 1.5 }, title: 'Purlins mounting clip', text: 'Secures horizontal purlins to truss members to support heavy roofing panels.' },
    { id: 3, pos: { x: -1.2, y: 0.0, z: -1.2 }, title: 'Truss splice plate', text: 'Gusset splice joints connecting multi-section trusses for easy shipping.' },
    { id: 4, pos: { x: 0.8, y: -0.5, z: 0.8 }, title: 'Canopy eave overhang', text: 'Calculated overhang to prevent rainwater ingress into furnace casing.' }
  ],
  ets: [
    { id: 1, pos: { x: 0, y: 2.5, z: 1.5 }, title: 'AISC modular framing', text: 'Movable rigid frame structure designed for dynamic crane hoist loads.' },
    { id: 2, pos: { x: 1.5, y: -3.0, z: 1.5 }, title: 'Rail wheel carriage', text: 'Double-flanged steel wheel base allowing shelter positioning along slip tracks.' },
    { id: 3, pos: { x: -1.5, y: 0.5, z: -1.5 }, title: 'Casing roof panels', text: 'Corrugated sheeting templates mapped to protect internal hardware.' },
    { id: 4, pos: { x: 0.8, y: -2.0, z: -0.8 }, title: 'Hydraulic slide cylinders', text: 'Mounting brackets for cylinders driving horizontal carriage slide movements.' }
  ],
  platforms: [
    { id: 1, pos: { x: 0, y: 1.0, z: 1.8 }, title: 'Safety Handrails Splice', text: 'OSHA-compliant interlocking joints designed for structural continuity.' },
    { id: 2, pos: { x: 1.5, y: -1.0, z: 1.5 }, title: 'Platform support hanger', text: 'Rigid cantilever brackets bolted to column face to carry live loads.' },
    { id: 3, pos: { x: -1.5, y: 0.0, z: -1.5 }, title: 'Grating clip clamps', text: 'M-clips securing flooring panels to steel support channels.' },
    { id: 4, pos: { x: 0.8, y: 0.5, z: 1.2 }, title: 'Handrail post socket', text: 'Welded angle brackets anchoring handrail upright posts to circular beams.' }
  ],
  staircase: [
    { id: 1, pos: { x: 0.8, y: 2.0, z: 1.2 }, title: 'Stair landing support', text: 'Channel beams detailed to support modular landing platform grates.' },
    { id: 2, pos: { x: -0.8, y: -2.0, z: 1.2 }, title: 'OSHA safety handrails', text: 'Continuous handrail pipes and kickplates ensuring safe vertical transit.' },
    { id: 3, pos: { x: 0.0, y: 0.0, z: -1.2 }, title: 'Mid-landing framing', text: 'Splice bracket joints carrying the weight of the intermediate stair landing.' },
    { id: 4, pos: { x: -0.5, y: 1.0, z: 0.5 }, title: 'Stringer connection joints', text: 'Double bolt splice plate linking staircase stringers to support frames.' }
  ],
  stackplatform: [
    { id: 1, pos: { x: 0, y: 0.8, z: 1.5 }, title: 'Annular platform floor', text: 'Circular floor grates surrounding the stack shell, detailed in modular segments.' },
    { id: 2, pos: { x: -1.2, y: -0.8, z: 1.2 }, title: 'Shell support brackets', text: 'Structural knee-braces welded directly to stack reinforcing rings.' },
    { id: 3, pos: { x: 1.2, y: 0.0, z: -1.2 }, title: 'Access opening gate', text: 'Self-closing swing safety gate preventing accidental platform exit.' },
    { id: 4, pos: { x: -0.8, y: 0.5, z: 0.8 }, title: 'Grating split joints', text: 'Bolted joints segmenting the circular platform for assembly installation.' }
  ],
  heatergrating: [
    { id: 1, pos: { x: 0, y: 0.5, z: 1.2 }, title: 'Serrated steel grating', text: 'Welded steel bars designed to facilitate wind pass-through and maximize grip.' },
    { id: 2, pos: { x: 1.2, y: -0.5, z: 1.2 }, title: 'Toe-plate border weld', text: '100mm border plate welded along edges to prevent objects from falling.' },
    { id: 3, pos: { x: -1.0, y: 0.0, z: -1.0 }, title: 'Band bar weld joint', text: 'Reinforced perimeter band bars preventing grating grid deformation.' },
    { id: 4, pos: { x: 0.5, y: 0.2, z: -0.5 }, title: 'Saddle clip fasteners', text: 'Galvanized clips locking the grate sheet down to supporting channels.' }
  ],
  ladders: [
    { id: 1, pos: { x: 0, y: 4.0, z: 1.0 }, title: 'Safety cage hoop', text: 'Cages designed to protect workers during high climbs (conforms to OSHA).' },
    { id: 2, pos: { x: 0, y: -2.0, z: 1.2 }, title: 'Shell mounting clip', text: 'Brackets anchoring ladder stringers directly to cylindrical casings.' },
    { id: 3, pos: { x: 0, y: 1.0, z: -1.0 }, title: 'Side grab bars extension', text: 'Continuous pipe loops extending 1.1m above platform floor for safety.' },
    { id: 4, pos: { x: -0.5, y: -1.0, z: 0.5 }, title: 'Expansion guide slots', text: 'Slotted support clips allowing ladder vertical expansion at high temperatures.' }
  ],
  breechingdoor: [
    { id: 1, pos: { x: 0, y: 1.0, z: 1.2 }, title: 'Refractory door plug', text: 'Insulating plug cast with high-temperature refractory cement.' },
    { id: 2, pos: { x: 1.2, y: -0.5, z: 1.0 }, title: 'Double hinge assembly', text: 'Heavy hinges ensuring tight seal closing to prevent flue gas leaks.' },
    { id: 3, pos: { x: -1.0, y: 0.0, z: -1.0 }, title: 'Latch anchor brackets', text: 'Heavy wedge latch brackets securing the door against furnace pressure.' },
    { id: 4, pos: { x: 0.5, y: 0.5, z: -0.5 }, title: 'Casing reinforcement ring', text: 'Stiffening frame plate surrounding door cutout to prevent distortion.' }
  ],
  maintenanceaccess: [
    { id: 1, pos: { x: 0, y: 1.0, z: 1.2 }, title: 'Swing door latch', text: 'Quick-release clamp handles for rapid access during heater shutdown.' },
    { id: 2, pos: { x: 1.0, y: -0.5, z: 1.0 }, title: 'Gasket seal packing', text: 'High-temperature ceramic fiber ropes ensuring a smoke-tight casing seal.' },
    { id: 3, pos: { x: -0.8, y: 0.2, z: -0.8 }, title: 'Observation window glass', text: 'Fused quartz sight glass window for high-temperature flame viewing.' },
    { id: 4, pos: { x: 0.5, y: 0.5, z: -0.5 }, title: 'Door handle lock pin', text: 'Safety locking pin preventing accidental latch release under load.' }
  ],
  evaporator: [
    { id: 1, pos: { x: -1.8, y: 0, z: 1.8 }, title: 'Primary Columns', text: 'IS 2062 heavy steel columns designed to transfer gravity loads and wind moments.' },
    { id: 2, pos: { x: 0, y: 4, z: 1.8 }, title: 'Operating Platforms', text: 'Multi-level maintenance walkways with anti-slip grating and safety handrails.' },
    { id: 3, pos: { x: 0, y: 2, z: 0 }, title: 'Evaporator Column', text: 'Central chemical processing evaporator vessel housed within the steel framing.' },
    { id: 4, pos: { x: 2.2, y: -2, z: 0 }, title: 'Staircase Access', text: 'Continuous steel stair tower providing safe access to all platform levels.' },
    { id: 5, pos: { x: 0, y: 8.2, z: 1.5 }, title: 'Roof Truss & Purlins', text: 'Triangular roof truss framing supporting the building canopy sheets.' },
    { id: 6, pos: { x: -1.8, y: 2, z: 0 }, title: 'Side Cladding Sag Rods', text: 'Side wall cladding runners and sag rods supporting external sheeting.' }
  ],
  dhdt: [
    { id: 1, pos: { x: 0, y: -2, z: 1.5 }, title: 'DHDT Radiant Zone', text: 'Refractory-lined lower firebox chamber where alloy tube coils absorb intense radiant heat.' },
    { id: 2, pos: { x: 0, y: 5.5, z: 1.5 }, title: 'EIL Convection Module', text: 'Upper waste heat recovery bank using finned tube bundles, conforming to EIL specs.' },
    { id: 3, pos: { x: 0, y: 1.5, z: 1.0 }, title: 'DHDT Process Coils', text: 'High-alloy TP347H process tube loops designed for thermal expansion under API 530.' },
    { id: 4, pos: { x: 0, y: 11.5, z: 0 }, title: 'EIL Exhaust Stack', text: 'Self-supporting stack fitted with helical wind strakes to mitigate vortex shedding.' },
    { id: 5, pos: { x: -1.6, y: 5.5, z: 0 }, title: 'Header Access Box', text: 'Return bend enclosures featuring quick-open hinged doors for decoking sweeps.' },
    { id: 6, pos: { x: 1.8, y: -4.8, z: 1.8 }, title: 'Column Base Plates', text: 'Heavy anchor plates securing structural columns against cyclonic wind forces.' }
  ],
  hds: [
    { id: 1, pos: { x: 0, y: -3, z: 2.2 }, title: 'HDS Cabin Radiant Casing', text: 'Wide rectangular firebox casing fitted with vertical buckstays for structural strength.' },
    { id: 2, pos: { x: -1.4, y: 1.5, z: 0 }, title: 'Twin Convection Modules', text: 'Dual convective modules side-by-side to optimize waste heat capture from cabin burners.' },
    { id: 3, pos: { x: 1.4, y: 6.5, z: 0 }, title: 'Twin Exhaust Stacks', text: 'Dual self-supporting stacks fitted with helical wind strakes for wind loading stability.' },
    { id: 4, pos: { x: 0, y: -0.5, z: 1.8 }, title: 'Process Header Manifold', text: 'Interconnecting piping manifolds linking the radiant section to dual convection banks.' },
    { id: 5, pos: { x: 0, y: -2, z: -2.1 }, title: 'Refractory Wall Lining', text: 'High-density monolithic refractory lining backing the cabin casing plates.' },
    { id: 6, pos: { x: 1.8, y: 0.8, z: -1.8 }, title: 'Moment Frame Connections', text: 'Heavy bolted structural beam-to-column joints providing high wind resistance.' }
  ],
  default: [
    { id: 1, pos: { x: 0, y: 2.5, z: 1.8 }, title: 'Refinery Section Coils', text: 'High-alloy convection tubes complying with API 560 thermal expansion limits.' },
    { id: 2, pos: { x: 1.5, y: -2, z: 1.5 }, title: 'Structural Support Bracket', text: 'Detailed base plates carrying full dead loads of structural modules.' },
    { id: 3, pos: { x: -1.5, y: 0.5, z: -1.5 }, title: 'Piping support anchor', text: 'Adjustable spring hanger anchors supporting hot process lines.' },
    { id: 4, pos: { x: 0.8, y: -1.0, z: 0.8 }, title: 'Wind girder brackets', text: 'Horizontal stiffener members protecting shell from vacuum buckling.' }
  ]
};

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
    case 'evaporator':
      settings.camPos.set(12, 6, 16);
      settings.lookAt.set(0, 0, 0);
      break;
    case 'dhdt':
      settings.camPos.set(12, 8, 18);
      settings.lookAt.set(0, 0, 0);
      break;
    case 'hds':
      settings.camPos.set(14, 8, 20);
      settings.lookAt.set(0, 0, 0);
      break;
    case 'santhipuram':
      settings.camPos.set(12, 10, 16);
      settings.lookAt.set(0, 0, 0);
      break;
    case 'tarachand':
      settings.camPos.set(14, 8, 16);
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
  const wrapperRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Loading Engineering Model...");
  const [touchInteracting, setTouchInteracting] = useState(false);
  const [blueprintMode, setBlueprintMode] = useState(false);
  const [feaMode, setFeaMode] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [projectedPositions, setProjectedPositions] = useState({});

  useEffect(() => {
    setActiveHotspot(null);
    setProjectedPositions({});
    setBlueprintMode(false);
    setFeaMode(false);
  }, [type]);

  const getActiveHotspots = () => {
    const t = type || 'default';
    return HOTSPOTS_DATA[t] || HOTSPOTS_DATA.default;
  };

  const activeHotspots = getActiveHotspots();
  const updateHotspotsRef = useRef(null);

  updateHotspotsRef.current = (camera, domElement, modelGroup) => {
    if (!domElement) return;
    const width = domElement.clientWidth;
    const height = domElement.clientHeight;
    const tempV = new THREE.Vector3();
    const newPositions = {};

    const box = modelGroup?.userData?.box;
    const size = modelGroup?.userData?.size;
    const center = modelGroup?.userData?.center;

    activeHotspots.forEach((hs) => {
      if (box && size && center) {
        // Map original hotspot Y (range -5 to 8) to actual model bounding box Y
        let normalizedY = (hs.pos.y + 5) / 13;
        normalizedY = Math.max(0.1, Math.min(0.9, normalizedY));
        const targetY = box.min.y + normalizedY * size.y;

        // Map original X (range -2 to 2) to actual model bounding box X
        let normalizedX = (hs.pos.x + 2) / 4;
        normalizedX = Math.max(0.15, Math.min(0.85, normalizedX));
        const targetX = box.min.x + normalizedX * size.x;

        // Map original Z (range -2 to 2) to actual model bounding box Z
        let normalizedZ = (hs.pos.z + 2) / 4;
        normalizedZ = Math.max(0.15, Math.min(0.85, normalizedZ));
        const targetZ = box.min.z + normalizedZ * size.z;

        tempV.set(targetX, targetY, targetZ);
      } else {
        tempV.set(hs.pos.x, hs.pos.y, hs.pos.z);
      }

      if (modelGroup) {
        tempV.applyMatrix4(modelGroup.matrixWorld);
      }
      tempV.project(camera);

      if (tempV.z > 1) {
        newPositions[hs.id] = { visible: false };
        return;
      }

      const x = (tempV.x * 0.5 + 0.5) * width;
      const y = (tempV.y * -0.5 + 0.5) * height;

      newPositions[hs.id] = {
        left: `${x}px`,
        top: `${y}px`,
        visible: x >= 0 && x <= width && y >= 0 && y <= height
      };
    });

    setProjectedPositions((prev) => {
      let changed = false;
      for (const id in newPositions) {
        if (!prev[id] ||
            prev[id].left !== newPositions[id].left ||
            prev[id].top !== newPositions[id].top ||
            prev[id].visible !== newPositions[id].visible) {
          changed = true;
          break;
        }
      }
      return changed ? newPositions : prev;
    });
  };

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

  // Handle wireframe, blueprintMode, and feaMode changes dynamically
  useEffect(() => {
    if (!activeScene.current) return;
    
    // Adjust scene background based on blueprint mode
    if (blueprintMode) {
      activeScene.current.background = new THREE.Color(0x0a182f);
    } else {
      activeScene.current.background = new THREE.Color(0x07111f);
    }

    activeScene.current.traverse(child => {
      if (child.isMesh) {
        // Retrieve original material if not stored
        if (!child.userData.origMaterial) {
          child.userData.origMaterial = child.material;
        }

        if (blueprintMode) {
          // CAD Blueprint styling: dark semi-transparent blue solid + white line outlines
          child.material = new THREE.MeshBasicMaterial({
            color: 0x091d36,
            transparent: true,
            opacity: 0.65,
            wireframe: false
          });
          if (child.userData.edgeHelper) {
            child.userData.edgeHelper.visible = true;
            child.userData.edgeHelper.material.color.setHex(0xffffff);
          }
        } else if (feaMode) {
          // FEA Stress Heatmap styling: color gradient based on elevation/names
          const y = child.position.y;
          let stressColor = 0x3b82f6; // Blue (low stress)
          
          if (child.name && (
            child.name.includes('col') || 
            child.name.includes('column') || 
            child.name.includes('beam') || 
            child.name.includes('support') ||
            child.name.includes('stanchion')
          )) {
            stressColor = 0xef4444; // High stress at joints (red)
          } else if (y < -3.5) {
            stressColor = 0xef4444; // High stress at ground bases
          } else if (y < 2.5) {
            stressColor = 0x10b981; // Medium stress (green)
          }

          child.material = new THREE.MeshStandardMaterial({
            color: stressColor,
            roughness: 0.4,
            metalness: 0.1,
            wireframe: false
          });
          if (child.userData.edgeHelper) {
            child.userData.edgeHelper.visible = true;
            child.userData.edgeHelper.material.color.setHex(stressColor);
          }
        } else {
          // Standard Mode: restore original material
          child.material = child.userData.origMaterial;
          child.material.wireframe = wireframe;
          if (child.userData.edgeHelper) {
            child.userData.edgeHelper.visible = false;
          }
        }
      }
    });
  }, [blueprintMode, feaMode, wireframe]);

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

        case 'evaporator': { // Evaporator Building Structure - Ultra Detailed Engineering Model
          // 1. Evaporator Column Vessel in center (tall shiny cylinder with features)
          // Main Cylindrical shell (height = 15, radius = 0.75)
          const vesselBodyGeo = new THREE.CylinderGeometry(0.75, 0.75, 15, 32);
          const vesselMat = new THREE.MeshPhysicalMaterial({
            color: 0x27435f,
            metalness: 0.85,
            roughness: 0.15,
            clearcoat: 0.6,
            clearcoatRoughness: 0.1,
            wireframe: wireframeRef.current
          });
          const vesselBody = new THREE.Mesh(vesselBodyGeo, vesselMat);
          vesselBody.position.y = 0.5;
          vesselBody.name = "vessel_body";
          modelGroup.add(vesselBody);

          // Top conical head (height = 1.2, base radius = 0.75, top radius = 0.15)
          const topConeGeo = new THREE.CylinderGeometry(0.15, 0.75, 1.2, 32);
          const topCone = new THREE.Mesh(topConeGeo, vesselMat);
          topCone.position.set(0, 8.6, 0);
          modelGroup.add(topCone);

          // Top nozzle flange
          const topFlangeGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.15, 24);
          const topFlange = new THREE.Mesh(topFlangeGeo, stackMat);
          topFlange.position.set(0, 9.25, 0);
          modelGroup.add(topFlange);

          // Bottom conical bottom cone (height = 1.0, base radius = 0.75, top radius = 0.1)
          const bottomConeGeo = new THREE.CylinderGeometry(0.75, 0.1, 1.0, 32);
          const bottomCone = new THREE.Mesh(bottomConeGeo, vesselMat);
          bottomCone.position.set(0, -7.5, 0);
          modelGroup.add(bottomCone);

          // Bottom drain flange
          const bottomFlangeGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.15, 24);
          const bottomFlange = new THREE.Mesh(bottomFlangeGeo, stackMat);
          bottomFlange.position.set(0, -8.05, 0);
          modelGroup.add(bottomFlange);

          // Flange rings at interface/platform elevations (Y = -4, 0, 4, 8)
          for (let h of [-4, 0, 4, 8]) {
            const fGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.12, 32);
            const fMesh = new THREE.Mesh(fGeo, stackMat);
            fMesh.position.set(0, h + 0.1, 0);
            modelGroup.add(fMesh);
          }

          // 3x Manholes: horizontal cylinders (radius = 0.22, length = 0.45) with blind flanges at ends
          const manholesData = [
            { y: -2, rotY: 0 },
            { y: 2, rotY: Math.PI * 2/3 },
            { y: 6, rotY: -Math.PI * 2/3 }
          ];
          manholesData.forEach((mh) => {
            const mhGroup = new THREE.Group();
            mhGroup.position.set(0, mh.y, 0);
            mhGroup.rotation.y = mh.rotY;

            // Protruding nozzle pipe
            const nozzleGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.4, 24);
            const nozzle = new THREE.Mesh(nozzleGeo, vesselMat);
            nozzle.position.set(0, 0, 0.8);
            nozzle.rotation.x = Math.PI / 2;
            mhGroup.add(nozzle);

            // Blind flange (large cap)
            const fGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.08, 24);
            const flange = new THREE.Mesh(fGeo, stackMat);
            flange.position.set(0, 0, 1.0);
            flange.rotation.x = Math.PI / 2;
            mhGroup.add(flange);

            // Add small bolts around the blind flange (6 tiny cylinders)
            for (let b = 0; b < 6; b++) {
              const angle = (b / 6) * Math.PI * 2;
              const boltGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.04, 8);
              const bolt = new THREE.Mesh(boltGeo, stackMat);
              bolt.position.set(Math.cos(angle) * 0.23, Math.sin(angle) * 0.23, 1.03);
              bolt.rotation.x = Math.PI / 2;
              mhGroup.add(bolt);
            }

            modelGroup.add(mhGroup);
          });

          // Level transmitter instrumentation line: thin bypass vertical pipe
          const ltGroup = new THREE.Group();
          ltGroup.position.set(-0.85, 0, 0.4);
          // Vertical tube
          const ltTubeGeo = new THREE.CylinderGeometry(0.025, 0.025, 12, 8);
          const ltTube = new THREE.Mesh(ltTubeGeo, stackMat);
          ltGroup.add(ltTube);
          // Horizontal hookups
          for (let h of [-5, 5]) {
            const hookGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.2, 8);
            const hook = new THREE.Mesh(hookGeo, stackMat);
            hook.position.set(0.08, h, -0.2);
            hook.rotation.z = Math.PI / 2;
            ltGroup.add(hook);
          }
          // Transmit enclosures (small control box)
          const boxGeo = new THREE.BoxGeometry(0.15, 0.3, 0.15);
          const controlBox = new THREE.Mesh(boxGeo, stackMat);
          controlBox.position.set(0, 0, 0);
          ltGroup.add(controlBox);
          modelGroup.add(ltGroup);

          // 2. Corner columns of the housing structure (I-beams)
          // Extending from Y = -8 to Y = 8 (total length = 16m)
          const colsData = [
            { x: -1.8, z: -1.8 },
            { x: 1.8, z: -1.8 },
            { x: 1.8, z: 1.8 },
            { x: -1.8, z: 1.8 }
          ];
          colsData.forEach((pos) => {
            // Main Column Member
            const col = createIBeam(16, 0.22, 0.03, blueprintMat);
            col.position.set(pos.x, 0, pos.z);
            col.rotation.x = Math.PI / 2;
            col.name = "columns";
            modelGroup.add(col);

            // Steel base plate at Y = -8
            const baseGeo = new THREE.BoxGeometry(0.45, 0.06, 0.45);
            const basePlate = new THREE.Mesh(baseGeo, stackMat);
            basePlate.position.set(pos.x, -8.0, pos.z);
            modelGroup.add(basePlate);

            // Anchor bolts (4 small cylinders per column base plate)
            for (let bx of [-0.16, 0.16]) {
              for (let bz of [-0.16, 0.16]) {
                const boltGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.15, 8);
                const bolt = new THREE.Mesh(boltGeo, stackMat);
                bolt.position.set(pos.x + bx, -7.88, pos.z + bz);
                modelGroup.add(bolt);
                
                // Hex nut
                const nutGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.04, 6);
                const nut = new THREE.Mesh(nutGeo, stackMat);
                nut.position.set(pos.x + bx, -7.8, pos.z + bz);
                modelGroup.add(nut);
              }
            }

            // Column splice plates at Y = 0 (structural reinforcement plates)
            const spliceGeo = new THREE.BoxGeometry(0.26, 0.35, 0.26);
            const splice = new THREE.Mesh(spliceGeo, stackMat);
            splice.position.set(pos.x, 0, pos.z);
            modelGroup.add(splice);
          });

          // 3. Multi-level operating platforms (elevations at Y = -4, 0, 4, 8)
          const platElevations = [-4, 0, 4, 8];
          platElevations.forEach((h) => {
            // Horizontal outer primary girders
            for (let z of [-1.8, 1.8]) {
              const g = createIBeam(3.6, 0.18, 0.025, blueprintMat);
              g.position.set(0, h, z);
              modelGroup.add(g);
            }
            for (let x of [-1.8, 1.8]) {
              const g = createIBeam(3.6, 0.18, 0.025, blueprintMat);
              g.position.set(x, h, 0);
              g.rotation.y = Math.PI / 2;
              modelGroup.add(g);
            }

            // Secondary internal floor joists (beams to support grating load)
            for (let offset of [-0.9, 0.9]) {
              const sg = createIBeam(3.6, 0.12, 0.02, blueprintMat);
              sg.position.set(offset, h - 0.02, 0);
              sg.rotation.y = Math.PI / 2;
              modelGroup.add(sg);
            }

            // Kick plates (toe-boards) along outer perimeter
            const kpTh = 0.015;
            const kpHt = 0.14;
            // North / South kick plates
            for (let z of [-1.84, 1.84]) {
              const kpGeo = new THREE.BoxGeometry(3.68, kpHt, kpTh);
              const kp = new THREE.Mesh(kpGeo, blueprintMat);
              kp.position.set(0, h + kpHt/2, z);
              modelGroup.add(kp);
            }
            // East / West kick plates
            for (let x of [-1.84, 1.84]) {
              const kpGeo = new THREE.BoxGeometry(kpTh, kpHt, 3.68);
              const kp = new THREE.Mesh(kpGeo, blueprintMat);
              kp.position.set(x, h + kpHt/2, 0);
              modelGroup.add(kp);
            }

            // Platform grating floor (subtle semi-transparent mesh wire)
            const floorPlatGeo = new THREE.BoxGeometry(3.6, 0.03, 3.6);
            const floorPlat = new THREE.Mesh(floorPlatGeo, wireMat);
            floorPlat.position.y = h;
            modelGroup.add(floorPlat);

            // Circular safety collar / sleeve around vessel penetration
            const collarGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.12, 32, 1, true);
            const collar = new THREE.Mesh(collarGeo, blueprintMat);
            collar.position.set(0, h + 0.06, 0);
            modelGroup.add(collar);

            // 4. Platform Perimeter Handrails (Safety systems)
            const postsPositions = [
              { x: -1.8, z: -1.8 }, { x: -0.6, z: -1.8 }, { x: 0.6, z: -1.8 }, { x: 1.8, z: -1.8 },
              { x: 1.8, z: -0.6 },  { x: 1.8, z: 0.6 },  { x: 1.8, z: 1.8 },
              { x: 0.6, z: 1.8 },  { x: -0.6, z: 1.8 }, { x: -1.8, z: 1.8 },
              { x: -1.8, z: 0.6 },  { x: -1.8, z: -0.6 }
            ];

            postsPositions.forEach((pos) => {
              // Skip certain posts to allow ladder/stairway entries
              if (h === -4 && pos.x === 1.8 && pos.z === -0.6) return; // Stair landing access
              if (h === 0 && pos.x === 1.8 && pos.z === 1.8) return;  // Upper landing access
              if (pos.x === -1.8 && pos.z === 0.6) return;            // Safety ladder hatch

              // Stanchion (vertical post)
              const postGeo = new THREE.CylinderGeometry(0.018, 0.018, 1.1, 8);
              const post = new THREE.Mesh(postGeo, blueprintMat);
              post.position.set(pos.x, h + 0.55, pos.z);
              modelGroup.add(post);
            });

            // Handrail loops (North, South, East, West lines)
            const railHtTop = 1.05;
            const railHtMid = 0.55;
            
            // Top and Mid Rails - North side (z = -1.8)
            const railN1 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 3.6, 8), blueprintMat);
            railN1.position.set(0, h + railHtTop, -1.8);
            railN1.rotation.z = Math.PI / 2;
            modelGroup.add(railN1);
            const railN2 = railN1.clone();
            railN2.position.y = h + railHtMid;
            modelGroup.add(railN2);

            // South side (z = 1.8)
            const railS1 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 3.6, 8), blueprintMat);
            railS1.position.set(0, h + railHtTop, 1.8);
            railS1.rotation.z = Math.PI / 2;
            modelGroup.add(railS1);
            const railS2 = railS1.clone();
            railS2.position.y = h + railHtMid;
            modelGroup.add(railS2);

            // West side (x = -1.8) - safety ladder entrance gap
            const railW1 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 3.6, 8), blueprintMat);
            railW1.position.set(-1.8, h + railHtTop, 0);
            railW1.rotation.x = Math.PI / 2;
            modelGroup.add(railW1);
            const railW2 = railW1.clone();
            railW2.position.y = h + railHtMid;
            modelGroup.add(railW2);

            // East side (x = 1.8) - staircase landing gaps
            if (h !== -4 && h !== 0) { // Solid handrail on levels without major stair landings
              const railE1 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 3.6, 8), blueprintMat);
              railE1.position.set(1.8, h + railHtTop, 0);
              railE1.rotation.x = Math.PI / 2;
              modelGroup.add(railE1);
              const railE2 = railE1.clone();
              railE2.position.y = h + railHtMid;
              modelGroup.add(railE2);
            } else {
              // Half-handrail to leave access gap
              const railEPart1 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.8, 8), blueprintMat);
              railEPart1.position.set(1.8, h + railHtTop, -0.9);
              railEPart1.rotation.x = Math.PI / 2;
              modelGroup.add(railEPart1);
              const railEPart2 = railEPart1.clone();
              railEPart2.position.y = h + railHtMid;
              modelGroup.add(railEPart2);
            }
          });

          // 4. Diagonal structural cross bracings
          const braceGeo = new THREE.CylinderGeometry(0.045, 0.045, 5.3, 8);
          const braceBays = [-6, -2, 2, 6];
          braceBays.forEach((bayY, bIdx) => {
            // Z = -1.8 face
            const bZ1 = new THREE.Mesh(braceGeo, blueprintMat);
            bZ1.position.set(0, bayY, -1.8);
            bZ1.rotation.z = 0.73;
            bZ1.name = "bracings";
            modelGroup.add(bZ1);
            const bZ2 = bZ1.clone();
            bZ2.rotation.z = -0.73;
            modelGroup.add(bZ2);

            // Z = 1.8 face
            const bZ3 = bZ1.clone();
            bZ3.position.z = 1.8;
            modelGroup.add(bZ3);
            const bZ4 = bZ2.clone();
            bZ4.position.z = 1.8;
            modelGroup.add(bZ4);

            // Back face X = -1.8 (stability bracing)
            if (bIdx % 2 === 0) {
              const bX1 = new THREE.Mesh(braceGeo, blueprintMat);
              bX1.position.set(-1.8, bayY, 0);
              bX1.rotation.x = 0.73;
              modelGroup.add(bX1);
              const bX2 = bX1.clone();
              bX2.rotation.x = -0.73;
              modelGroup.add(bX2);
            }
          });

          // 5. Roof Truss structure (triangular frames at Y = 8 to 9.6)
          const trussZPositions = [-1.8, 1.8];
          trussZPositions.forEach((tz) => {
            const trussGroup = new THREE.Group();
            trussGroup.position.set(0, 8.0, tz);

            // Bottom Chord (Tie runner)
            const bottomChord = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 3.6, 8), blueprintMat);
            bottomChord.rotation.z = Math.PI / 2;
            trussGroup.add(bottomChord);

            // Sloped Rafters (top chords forming the peak)
            const rafterL = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.1, 8), blueprintMat);
            rafterL.position.set(-0.9, 0.7, 0);
            rafterL.rotation.z = -0.66;
            trussGroup.add(rafterL);

            const rafterR = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.1, 8), blueprintMat);
            rafterR.position.set(0.9, 0.7, 0);
            rafterR.rotation.z = 0.66;
            trussGroup.add(rafterR);

            // Vertical King Post (center post)
            const kingPost = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.4, 8), blueprintMat);
            kingPost.position.set(0, 0.7, 0);
            trussGroup.add(kingPost);

            // Diagonal Web Struts (W truss design)
            const web1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.25, 8), blueprintMat);
            web1.position.set(-0.6, 0.45, 0);
            web1.rotation.z = 0.85;
            trussGroup.add(web1);

            const web2 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.25, 8), blueprintMat);
            web2.position.set(0.6, 0.45, 0);
            web2.rotation.z = -0.85;
            trussGroup.add(web2);

            // Gusset Plates (triangular metal sheet joints at ends and center peak)
            const g1 = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.24, 0.03), blueprintMat);
            g1.position.set(-1.6, 0.08, 0);
            trussGroup.add(g1);

            const g2 = g1.clone();
            g2.position.set(1.6, 0.08, 0);
            trussGroup.add(g2);

            const gPeak = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.03), blueprintMat);
            gPeak.position.set(0, 1.3, 0);
            trussGroup.add(gPeak);

            modelGroup.add(trussGroup);
          });

          // Horizontal roof purlins spanning between the trusses
          const purlinXPos = [-1.8, -0.9, 0, 0.9, 1.8];
          purlinXPos.forEach((px) => {
            const py = 8.0 + (1.4 - Math.abs(px) * 0.77);
            const purlin = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 3.8, 8), blueprintMat);
            purlin.position.set(px, py, 0);
            purlin.rotation.x = Math.PI / 2;
            modelGroup.add(purlin);
          });

          // Textured ribbed roofing sheets (corrugated metal panels) on top of purlins
          const roofPanelMat = new THREE.MeshStandardMaterial({
            color: 0x475569,
            roughness: 0.6,
            metalness: 0.8,
            wireframe: wireframeRef.current
          });

          // Left slope roof panel
          const roofSheetL = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.02, 3.95), roofPanelMat);
          roofSheetL.position.set(-0.95, 8.78, 0);
          roofSheetL.rotation.z = -0.66;
          modelGroup.add(roofSheetL);

          // Right slope roof panel
          const roofSheetR = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.02, 3.95), roofPanelMat);
          roofSheetR.position.set(0.95, 8.78, 0);
          roofSheetR.rotation.z = 0.66;
          modelGroup.add(roofSheetR);

          // Ridges/corrugation detailing on roofing (parallel rods/ribs on panels)
          for (let rz = -1.9; rz <= 1.95; rz += 0.25) {
            // Left ribs
            const ribL = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 2.1, 8), blueprintMat);
            ribL.position.set(-0.95, 8.8, rz);
            ribL.rotation.z = -0.66;
            modelGroup.add(ribL);

            // Right ribs
            const ribR = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 2.1, 8), blueprintMat);
            ribR.position.set(0.95, 8.8, rz);
            ribR.rotation.z = 0.66;
            modelGroup.add(ribR);
          }

          // 6. Vertical Safety Cage Ladder (X = -1.95, Z = 0.6 to -0.6)
          const ladderGroup = new THREE.Group();
          ladderGroup.position.set(-1.95, 0, 0.6); // outer side of structure
          
          // Side vertical rail channels
          const sideL = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 16.0, 8), blueprintMat);
          sideL.position.set(0, 0, -0.22);
          ladderGroup.add(sideL);
          const sideR = sideL.clone();
          sideR.position.set(0, 0, 0.22);
          ladderGroup.add(sideR);

          // Ladder rungs (steps) every 0.33m
          for (let ry = -8.0; ry <= 8.0; ry += 0.33) {
            const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.44, 8), stackMat);
            rung.position.set(0, ry, 0);
            rung.rotation.x = Math.PI / 2;
            ladderGroup.add(rung);
          }

          // Safety cages (hoops & straps) starting from Y = -4.5 to Y = 8.0
          const cageGroup = new THREE.Group();
          const hoopRadius = 0.38;
          for (let hy = -4.5; hy <= 8.0; hy += 1.5) {
            const hoopGeo = new THREE.CylinderGeometry(hoopRadius, hoopRadius, 0.04, 16, 1, true, 0, Math.PI);
            const hoop = new THREE.Mesh(hoopGeo, blueprintMat);
            hoop.position.set(-hoopRadius * 0.5, hy, 0);
            hoop.rotation.x = Math.PI / 2;
            hoop.rotation.y = Math.PI / 2; // Face outward from ladder
            cageGroup.add(hoop);
          }

          // Vertical straps connecting the hoops (5 straps)
          const strapGeo = new THREE.CylinderGeometry(0.012, 0.012, 12.5, 8);
          for (let sa = 0; sa <= 4; sa++) {
            const angle = (sa / 4) * Math.PI - Math.PI / 2;
            const strap = new THREE.Mesh(strapGeo, blueprintMat);
            strap.position.set(-hoopRadius * Math.cos(angle) - hoopRadius * 0.5, 1.75, hoopRadius * Math.sin(angle));
            cageGroup.add(strap);
          }

          ladderGroup.add(cageGroup);
          modelGroup.add(ladderGroup);

          // 7. Process Piping & Valve Loops (Premium detailed layouts)
          const pipeGroup = new THREE.Group();
          
          // Nozzle 1 connection from vessel Y = 5
          const n1Pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.9, 12), coilMat);
          n1Pipe.position.set(0.45, 5, 0);
          n1Pipe.rotation.z = Math.PI / 2;
          pipeGroup.add(n1Pipe);

          // Elbow 1 at X = 0.9, Y = 5, Z = 0
          const elb1 = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), stackMat);
          elb1.position.set(0.9, 5, 0);
          pipeGroup.add(elb1);

          // Vertical pipeline down through platforms
          const vPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 8.5, 12), coilMat);
          vPipe.position.set(0.9, 0.75, 0);
          pipeGroup.add(vPipe);

          // Elbow 2 at X = 0.9, Y = -3.5, Z = 0
          const elb2 = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), stackMat);
          elb2.position.set(0.9, -3.5, 0);
          pipeGroup.add(elb2);

          // Horizontal branch extending out through structure framing
          const hPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.4, 12), coilMat);
          hPipe.position.set(1.6, -3.5, 0);
          hPipe.rotation.z = Math.PI / 2;
          pipeGroup.add(hPipe);

          // Flange connectors along piping
          for (let fy of [3.8, 0.2, -3.3]) {
            const fMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.05, 16), stackMat);
            fMesh.position.set(0.9, fy, 0);
            pipeGroup.add(fMesh);
          }

          // Blue/Silver Valve assembly (utility steam)
          const utilityGroup = new THREE.Group();
          utilityGroup.position.set(0, -1.5, -0.9);
          
          // Tube
          const utilTube = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.5, 8), stackMat);
          utilTube.rotation.z = Math.PI / 2;
          utilityGroup.add(utilTube);

          // Valve body box
          const valveBody = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.14), blueprintMat);
          valveBody.position.set(0, 0, 0);
          utilityGroup.add(valveBody);

          // Stem
          const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.16, 8), stackMat);
          stem.position.set(0, 0.12, 0);
          utilityGroup.add(stem);

          // Yellow handwheel
          const wheelGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.02, 16);
          const wheelMat = new THREE.MeshStandardMaterial({
            color: 0xf59e0b,
            roughness: 0.4,
            metalness: 0.4
          });
          const handwheel = new THREE.Mesh(wheelGeo, wheelMat);
          handwheel.position.set(0, 0.21, 0);
          utilityGroup.add(handwheel);

          pipeGroup.add(utilityGroup);
          modelGroup.add(pipeGroup);

          // 8. Multi-flight Staircase assembly (rising from Y = -8 to Y = 0)
          // Lower Staircase: from Y = -8 to Y = -4
          const stairGroupL = new THREE.Group();
          stairGroupL.position.set(2.0, -6.0, -0.5);
          stairGroupL.rotation.y = Math.PI;

          // Diagonal stringers
          const strGeo = new THREE.BoxGeometry(0.05, 0.16, 5.0);
          const str1 = new THREE.Mesh(strGeo, blueprintMat);
          str1.position.set(-0.25, 0, 0);
          str1.rotation.x = -0.93;
          stairGroupL.add(str1);
          const str2 = str1.clone();
          str2.position.x = 0.25;
          stairGroupL.add(str2);

          // Individual step tread plates
          for (let step = 0; step < 12; step++) {
            const stepY = -1.8 + (step / 11) * 3.6;
            const stepZ = -1.8 + (step / 11) * 3.6;
            const stepMesh = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.015, 0.25), stackMat);
            stepMesh.position.set(0, stepY, stepZ);
            stairGroupL.add(stepMesh);
          }

          // Diagonal Handrail
          const stanchionL1 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.95, 8), blueprintMat);
          stanchionL1.position.set(0.25, -1.2, -1.2);
          stairGroupL.add(stanchionL1);
          const stanchionL2 = stanchionL1.clone();
          stanchionL2.position.set(0.25, 1.2, 1.2);
          stairGroupL.add(stanchionL2);

          const diagRail = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 5.0, 8), blueprintMat);
          diagRail.position.set(0.25, 0.45, 0);
          diagRail.rotation.x = -0.93;
          stairGroupL.add(diagRail);

          modelGroup.add(stairGroupL);

          // Intermediate landing platform at Y = -4 (cantilevered)
          const landGroup = new THREE.Group();
          landGroup.position.set(2.0, -4.05, -1.8);
          const landBase = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.06, 0.8), blueprintMat);
          landGroup.add(landBase);
          const landGrating = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.02, 0.78), wireMat);
          landGrating.position.y = 0.03;
          landGroup.add(landGrating);
          const kneeBrace = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.85, 8), blueprintMat);
          kneeBrace.position.set(0, -0.3, 0.3);
          kneeBrace.rotation.x = -0.7;
          landGroup.add(kneeBrace);

          modelGroup.add(landGroup);

          // Upper Staircase: from Y = -4 to Y = 0
          const stairGroupU = new THREE.Group();
          stairGroupU.position.set(2.0, -2.0, -1.1);
          stairGroupU.rotation.y = 0;

          // Diagonal stringers
          const strU1 = new THREE.Mesh(strGeo, blueprintMat);
          strU1.position.set(-0.25, 0, 0);
          strU1.rotation.x = -0.93;
          stairGroupU.add(strU1);
          const strU2 = strU1.clone();
          strU2.position.x = 0.25;
          stairGroupU.add(strU2);

          // Steps
          for (let step = 0; step < 12; step++) {
            const stepY = -1.8 + (step / 11) * 3.6;
            const stepZ = -1.8 + (step / 11) * 3.6;
            const stepMesh = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.015, 0.25), stackMat);
            stepMesh.position.set(0, stepY, stepZ);
            stairGroupU.add(stepMesh);
          }

          // Upper Diagonal Handrail
          const stanchionU1 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.95, 8), blueprintMat);
          stanchionU1.position.set(0.25, -1.2, -1.2);
          stairGroupU.add(stanchionU1);
          const stanchionU2 = stanchionU1.clone();
          stanchionU2.position.set(0.25, 1.2, 1.2);
          stairGroupU.add(stanchionU2);

          const diagRailU = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 5.0, 8), blueprintMat);
          diagRailU.position.set(0.25, 0.45, 0);
          diagRailU.rotation.x = -0.93;
          stairGroupU.add(diagRailU);

          modelGroup.add(stairGroupU);

          break;
        }

        case 'dhdt': { // DHDT Fired Heater - High Fidelity EIL Model
          // 1. Radiant Section Casing
          const radGeo = new THREE.CylinderGeometry(3.5, 3.5, 6, 32, 1, true);
          const radMesh = new THREE.Mesh(radGeo, shellMat);
          radMesh.position.y = -2;
          radMesh.name = "radiant";
          modelGroup.add(radMesh);

          // Buckstays (vertical structural channels on outer radiant shell)
          for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const beam = createIBeam(6, 0.25, 0.04, blueprintMat);
            beam.position.set(Math.cos(angle) * 3.62, -2, Math.sin(angle) * 3.62);
            beam.rotation.y = -angle;
            beam.rotation.x = Math.PI / 2;
            modelGroup.add(beam);
          }

          // 2. Burner Plenum floor below Y = -5
          const floorGeo = new THREE.CylinderGeometry(3.8, 3.8, 0.2, 32);
          const floorMesh = new THREE.Mesh(floorGeo, blueprintMat);
          floorMesh.position.y = -5.0;
          modelGroup.add(floorMesh);

          // Burner plenum box (A36 steel plenum)
          const plenumGeo = new THREE.CylinderGeometry(3.2, 3.2, 0.8, 32);
          const plenum = new THREE.Mesh(plenumGeo, shellMat);
          plenum.position.y = -5.5;
          modelGroup.add(plenum);

          // 4x Burners: small cylinders protruding downwards
          for (let bx of [-1.2, 1.2]) {
            for (let bz of [-1.2, 1.2]) {
              const burnerGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.6, 16);
              const burner = new THREE.Mesh(burnerGeo, stackMat);
              burner.position.set(bx, -6.0, bz);
              modelGroup.add(burner);
              
              // Fuel pipe hookup
              const pipeGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.6, 8);
              const pipe = new THREE.Mesh(pipeGeo, coilMat); // orange
              pipe.position.set(bx, -6.4, bz);
              modelGroup.add(pipe);
            }
          }

          // 3. Process coils inside radiant zone (revealed partially if exploded or wireframe)
          // Circular coil array of 24 tubes inside the radiant shell
          for (let c = 0; c < 24; c++) {
            const angle = (c / 24) * Math.PI * 2;
            const coilTubeGeo = new THREE.CylinderGeometry(0.08, 0.08, 5.8, 8);
            const coilTube = new THREE.Mesh(coilTubeGeo, coilMat);
            coilTube.position.set(Math.cos(angle) * 3.1, -2, Math.sin(angle) * 3.1);
            modelGroup.add(coilTube);
          }

          // 4. Transition Cone
          const transGeo = new THREE.CylinderGeometry(2, 3.5, 2, 32, 1, true);
          const transMesh = new THREE.Mesh(transGeo, shellMat);
          transMesh.position.y = 2;
          modelGroup.add(transMesh);

          // 5. Convection Module Bank
          const convGeo = new THREE.BoxGeometry(3.2, 5, 3.2);
          const convMesh = new THREE.Mesh(convGeo, shellMat);
          convMesh.position.y = 5.5;
          modelGroup.add(convMesh);

          // Convection horizontal rib stiffeners
          for (let cy of [3.5, 4.8, 6.1, 7.4]) {
            const rib = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.12, 3.4), blueprintMat);
            rib.position.y = cy;
            modelGroup.add(rib);
          }

          // Header Box assemblies
          const hBoxGeo = new THREE.BoxGeometry(0.6, 4.8, 3.2);
          const hBoxL = new THREE.Mesh(hBoxGeo, shellMat);
          hBoxL.position.set(-1.9, 5.5, 0);
          modelGroup.add(hBoxL);
          const hBoxR = hBoxL.clone();
          hBoxR.position.x = 1.9;
          modelGroup.add(hBoxR);

          // Hinged door handles on DHDT header boxes
          for (let dy of [4.0, 7.0]) {
            const clampL = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.3, 8), stackMat);
            clampL.position.set(-2.25, dy, 0.8);
            clampL.rotation.z = Math.PI / 2;
            modelGroup.add(clampL);

            const clampR = clampL.clone();
            clampR.position.x = 2.25;
            modelGroup.add(clampR);
          }

          // 6. Exhaust stack with helical strakes
          const stackGeo = new THREE.CylinderGeometry(1.0, 1.2, 10.0, 24);
          const stackMesh = new THREE.Mesh(stackGeo, shellMat);
          stackMesh.position.y = 13.0;
          modelGroup.add(stackMesh);

          // Helical wind strakes wrapping stack (a series of small tilted plates)
          for (let sy = 9.0; sy <= 17.5; sy += 0.4) {
            const angle = (sy - 9.0) * 0.8; // spiral angle
            const strakeGeo = new THREE.BoxGeometry(0.3, 0.08, 0.03);
            const strake = new THREE.Mesh(strakeGeo, stackMat);
            strake.position.set(Math.cos(angle) * 1.2, sy, Math.sin(angle) * 1.2);
            strake.rotation.y = -angle;
            strake.rotation.x = 0.5; // spiral tilt
            modelGroup.add(strake);
          }

          // Stack Platform Ring at Y = 11.0
          const ringGeo = new THREE.CylinderGeometry(2.2, 2.2, 0.05, 24, 1, true);
          const ring = new THREE.Mesh(ringGeo, wireMat);
          ring.position.y = 11.0;
          modelGroup.add(ring);
          
          // Handrail posts on stack platform
          for (let j = 0; j < 8; j++) {
            const angle = (j / 8) * Math.PI * 2;
            const post = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.0, 8), blueprintMat);
            post.position.set(Math.cos(angle) * 2.15, 11.5, Math.sin(angle) * 2.15);
            modelGroup.add(post);
          }

          // 7. Circular platform rings at Y = -2, 2, 8
          for (let py of [-2, 2, 8]) {
            const pRingGeo = new THREE.CylinderGeometry(4.8, 4.8, 0.08, 32, 1, true);
            const pRing = new THREE.Mesh(pRingGeo, wireMat);
            pRing.position.y = py;
            modelGroup.add(pRing);

            // Handrail loops on platforms
            const guardGeo = new THREE.CylinderGeometry(4.8, 4.8, 1.05, 32, 1, true);
            const guard = new THREE.Mesh(guardGeo, blueprintMat);
            guard.position.y = py + 0.52;
            modelGroup.add(guard);
          }

          break;
        }

        case 'hds': { // HDS Fired Heater - Twin Cabin Box Model
          // 1. Radiant Cabin: Rectangular box firebox at the bottom
          const radBoxGeo = new THREE.BoxGeometry(7.0, 5.0, 4.5);
          const radBox = new THREE.Mesh(radBoxGeo, shellMat);
          radBox.position.y = -2.5;
          radBox.name = "radiant_cabin";
          modelGroup.add(radBox);

          // Buckstays (vertical heavy I-beam framing on all sides of the box cabin)
          const bLocations = [
            // front/back faces
            { x: -3.52, z: -1.8 }, { x: -3.52, z: 0 }, { x: -3.52, z: 1.8 },
            { x: 3.52, z: -1.8 }, { x: 3.52, z: 0 }, { x: 3.52, z: 1.8 },
            // left/right faces
            { x: -1.8, z: -2.27 }, { x: 0, z: -2.27 }, { x: 1.8, z: -2.27 },
            { x: -1.8, z: 2.27 }, { x: 0, z: 2.27 }, { x: 1.8, z: 2.27 }
          ];
          bLocations.forEach((pos) => {
            const beam = createIBeam(5, 0.22, 0.035, blueprintMat);
            beam.position.set(pos.x, -2.5, pos.z);
            if (pos.z === -2.27 || pos.z === 2.27) {
              beam.rotation.y = Math.PI / 2;
            }
            beam.rotation.x = Math.PI / 2;
            modelGroup.add(beam);
          });

          // Burner plates at bottom floor of cabin
          for (let bx of [-2, 0, 2]) {
            const burner = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.5, 16), stackMat);
            burner.position.set(bx, -5.2, 0);
            modelGroup.add(burner);
          }

          // 2. Dual Convection Modules side-by-side on top of radiant cabin box
          const convBoxGeo = new THREE.BoxGeometry(2.6, 4.0, 3.2);
          
          // Left Convection Box (at X = -1.6)
          const convBoxL = new THREE.Mesh(convBoxGeo, shellMat);
          convBoxL.position.set(-1.6, 2.0, 0);
          modelGroup.add(convBoxL);

          // Right Convection Box (at X = 1.6)
          const convBoxR = new THREE.Mesh(convBoxGeo, shellMat);
          convBoxR.position.set(1.6, 2.0, 0);
          modelGroup.add(convBoxR);

          // Convection horizontal rib stiffeners
          for (let cy of [0.5, 2.0, 3.5]) {
            const ribL = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.12, 3.4), blueprintMat);
            ribL.position.set(-1.6, cy, 0);
            modelGroup.add(ribL);

            const ribR = ribL.clone();
            ribR.position.x = 1.6;
            modelGroup.add(ribR);
          }

          // 3. Twin Exhaust Stacks rising from each convection module
          const stackLGeo = new THREE.CylinderGeometry(0.8, 0.9, 8.0, 16);
          
          // Left Stack (at X = -1.6, Y = 10)
          const stackL = new THREE.Mesh(stackLGeo, shellMat);
          stackL.position.set(-1.6, 8.0, 0);
          modelGroup.add(stackL);

          // Right Stack (at X = 1.6, Y = 10)
          const stackR = new THREE.Mesh(stackLGeo, shellMat);
          stackR.position.set(1.6, 8.0, 0);
          modelGroup.add(stackR);

          // Helical wind strakes wrapping both stacks
          for (let sy = 5.0; sy <= 11.5; sy += 0.5) {
            const angle = (sy - 5.0) * 0.9;
            
            // Left stack strakes
            const strakeL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.08, 0.03), stackMat);
            strakeL.position.set(-1.6 + Math.cos(angle) * 0.95, sy, Math.sin(angle) * 0.95);
            strakeL.rotation.y = -angle;
            strakeL.rotation.x = 0.5;
            modelGroup.add(strakeL);

            // Right stack strakes
            const strakeR = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.08, 0.03), stackMat);
            strakeR.position.set(1.6 + Math.cos(angle) * 0.95, sy, Math.sin(angle) * 0.95);
            strakeR.rotation.y = -angle;
            strakeR.rotation.x = 0.5;
            modelGroup.add(strakeR);
          }

          // Twin Platform Rings at base of stacks (Y = 4.1)
          const platGeo = new THREE.BoxGeometry(6.5, 0.08, 4.2);
          const platform = new THREE.Mesh(platGeo, wireMat);
          platform.position.y = 4.1;
          modelGroup.add(platform);

          // Platforms Handrail Frame
          const railFrame = new THREE.Mesh(new THREE.BoxGeometry(6.6, 1.05, 4.3), blueprintMat);
          railFrame.position.y = 4.6;
          const railWire = new THREE.BoxHelper(railFrame, 0x5c80a6);
          modelGroup.add(railWire);

          // 4. Interconnecting Process manifolds (orange coil piping)
          const pipeLGeo = new THREE.CylinderGeometry(0.08, 0.08, 3.0, 12);
          const manifoldL = new THREE.Mesh(pipeLGeo, coilMat);
          manifoldL.position.set(-1.6, 0.5, 1.7);
          manifoldL.rotation.z = Math.PI / 2;
          modelGroup.add(manifoldL);

          const manifoldR = manifoldL.clone();
          manifoldR.position.x = 1.6;
          modelGroup.add(manifoldR);

          // Connection elbows
          const el1 = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), stackMat);
          el1.position.set(0, 0.5, 1.7);
          modelGroup.add(el1);
          // 5. Access staircase reaching the main platform (Y = 4.1)
          const stairGroupU = new THREE.Group();
          stairGroupU.position.set(2.8, -1.0, 2.2);
          stairGroupU.rotation.y = -Math.PI / 4;

          const strGeo = new THREE.BoxGeometry(0.05, 0.15, 6.0);
          const strU1 = new THREE.Mesh(strGeo, blueprintMat);
          strU1.position.set(-0.35, 0, 0);
          strU1.rotation.x = -0.85;
          stairGroupU.add(strU1);
          
          const strU2 = strU1.clone();
          strU2.position.x = 0.35;
          stairGroupU.add(strU2);

          // Steps
          for (let step = 0; step < 12; step++) {
            const stepY = -2.2 + (step / 11) * 4.4;
            const stepZ = -2.2 + (step / 11) * 4.4;
            const stepMesh = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.015, 0.28), stackMat);
            stepMesh.position.set(0, stepY, stepZ);
            stairGroupU.add(stepMesh);
          }

          // Handrails
          const stanchion1 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.95, 8), blueprintMat);
          stanchion1.position.set(0.35, -1.2, -1.2);
          stairGroupU.add(stanchion1);

          const stanchion2 = stanchion1.clone();
          stanchion2.position.set(0.35, 1.2, 1.2);
          stairGroupU.add(stanchion2);

          const diagRailU = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 6.0, 8), blueprintMat);
          diagRailU.position.set(0.35, 0.48, 0);
          diagRailU.rotation.x = -0.85;
          stairGroupU.add(diagRailU);

          modelGroup.add(stairGroupU);

          break;
        }

        case 'canopy_millennium': { // Millennium Canopy Space Frame
          // 7 support columns with base plates, gussets, and anchor bolt details!
          const colPositions = [
            { x: -5, z: -2 }, { x: 0, z: -2 }, { x: 5, z: -2 },
            { x: -3, z: 2 }, { x: 3, z: 2 },
            { x: -5, z: 0 }, { x: 5, z: 0 }
          ];
          colPositions.forEach(pos => {
            const colGeo = new THREE.CylinderGeometry(0.1, 0.22, 5.0, 16);
            const col = new THREE.Mesh(colGeo, blueprintMat);
            col.position.set(pos.x, -2.5, pos.z);
            modelGroup.add(col);
            
            // Base plate
            const base = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.08, 0.6), stackMat);
            base.position.set(pos.x, -5.0, pos.z);
            modelGroup.add(base);

            // 4 Base gussets (triangular ribs)
            for (let a = 0; a < 4; a++) {
              const angle = (a / 4) * Math.PI * 2;
              const gusset = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.4, 0.16), blueprintMat);
              gusset.position.set(pos.x + Math.cos(angle) * 0.18, -4.8, pos.z + Math.sin(angle) * 0.18);
              gusset.rotation.y = -angle;
              modelGroup.add(gusset);
            }
          });

          // Space frame truss canopy - actual structural node-and-member space frame grid!
          // Grid points: 9x5 grid at Y = 0 and Y = 0.6
          const gridNodeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.1 });
          const gridStrutMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.2 });

          const nodes = [];
          for (let x = -6; x <= 6; x += 1.5) {
            for (let z = -3; z <= 3; z += 1.5) {
              for (let y of [0, 0.6]) {
                nodes.push({ x, y, z });
                const nodeMesh = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), gridNodeMat);
                nodeMesh.position.set(x, y, z);
                modelGroup.add(nodeMesh);
              }
            }
          }

          // Draw diagonal struts connecting nodes (interlocking space frame grid!)
          for (let i = 0; i < nodes.length; i++) {
            const n1 = nodes[i];
            for (let j = i + 1; j < nodes.length; j++) {
              const n2 = nodes[j];
              const distSqr = (n1.x - n2.x)**2 + (n1.y - n2.y)**2 + (n1.z - n2.z)**2;
              if (distSqr > 0.05 && distSqr < 2.5) {
                const dx = n2.x - n1.x;
                const dy = n2.y - n1.y;
                const dz = n2.z - n1.z;
                const len = Math.sqrt(distSqr);
                
                const strutGeo = new THREE.CylinderGeometry(0.018, 0.018, len, 6);
                const strut = new THREE.Mesh(strutGeo, gridStrutMat);
                strut.position.set(n1.x + dx/2, n1.y + dy/2, n1.z + dz/2);
                
                const direction = new THREE.Vector3(dx, dy, dz).normalize();
                strut.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
                modelGroup.add(strut);
              }
            }
          }

          // Translucent roof sheets
          const roofPanel = new THREE.Mesh(new THREE.BoxGeometry(12.5, 0.04, 6.5), new THREE.MeshPhysicalMaterial({
            color: 0x5c80a6, roughness: 0.1, transmission: 0.6, opacity: 0.7, transparent: true, depthWrite: false
          }));
          roofPanel.position.y = 0.65;
          modelGroup.add(roofPanel);
          break;
        }

        case 'ac_shelter': { // Movable AC Shelter
          // Main structural portal frame (length 8, width 5, height 12)
          for (let x of [-2.5, 2.5]) {
            const col = createIBeam(10.0, 0.22, 0.035, blueprintMat);
            col.position.set(x, 0, 0);
            col.rotation.x = Math.PI / 2;
            modelGroup.add(col);

            // Double wheel casters on brackets at base of columns
            for (let z of [-1.2, 1.2]) {
              const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 0.4), stackMat);
              bracket.position.set(x, -5.2, z);
              modelGroup.add(bracket);

              for (let wx of [-0.15, 0.15]) {
                const wheelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.08, 16);
                const wheel = new THREE.Mesh(wheelGeo, stackMat);
                wheel.position.set(x + wx, -5.4, z);
                wheel.rotation.z = Math.PI / 2;
                modelGroup.add(wheel);
              }
            }
          }
          // Horizontal rafters and girts
          for (let y of [-5, -2, 1, 4, 5]) {
            const beam = createIBeam(5.0, 0.18, 0.03, blueprintMat);
            beam.position.set(0, y, 0);
            modelGroup.add(beam);
          }
          // Structural diagonal wall cross-bracings
          const braceGeo = new THREE.CylinderGeometry(0.03, 0.03, 11.2, 8);
          for (let z of [-1.2, 1.2]) {
            const brace1 = new THREE.Mesh(braceGeo, stackMat);
            brace1.position.set(0, 0, z);
            brace1.rotation.z = 1.1;
            modelGroup.add(brace1);

            const brace2 = brace1.clone();
            brace2.rotation.z = -1.1;
            modelGroup.add(brace2);
          }
          // Fabric tarpaulin cladding (semi-transparent green casing)
          const fabricGeo = new THREE.BoxGeometry(5.2, 10.2, 3.2);
          const fabric = new THREE.Mesh(fabricGeo, new THREE.MeshStandardMaterial({ color: 0x1e5030, transparent: true, opacity: 0.3, wireframe: true }));
          fabric.position.y = 0;
          modelGroup.add(fabric);
          break;
        }

        case 'mt_pool': { // MT Pool Portal Structure
          // Rigid structural steel columns
          for (let x of [-4.5, 4.5]) {
            for (let z of [-3, 0, 3]) {
              const col = createIBeam(8.0, 0.28, 0.04, blueprintMat);
              col.position.set(x, -1, z);
              col.rotation.x = Math.PI / 2;
              modelGroup.add(col);

              // Gusset knee brace at column top
              const knee = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.08), blueprintMat);
              knee.position.set(x - (x > 0 ? 0.3 : -0.3), 3.0, z);
              modelGroup.add(knee);
            }
          }
          // Heavy roof rafters crossing (X axis)
          for (let z of [-3, 0, 3]) {
            const rafter = createIBeam(9.0, 0.24, 0.03, blueprintMat);
            rafter.position.set(0, 3, z);
            modelGroup.add(rafter);
          }
          // Purlins running along Z axis on top of rafters
          for (let x = -4.0; x <= 4.0; x += 1.3) {
            const purlin = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.16, 7.0), blueprintMat);
            purlin.position.set(x, 3.2, 0);
            modelGroup.add(purlin);
          }
          // Diagonal stability wall bracings
          const braceGeo = new THREE.CylinderGeometry(0.035, 0.035, 9.5, 8);
          for (let x of [-4.5, 4.5]) {
            const brace1 = new THREE.Mesh(braceGeo, stackMat);
            brace1.position.set(x, -1, 0);
            brace1.rotation.x = 0.98;
            modelGroup.add(brace1);
            
            const brace2 = brace1.clone();
            brace2.rotation.x = -0.98;
            modelGroup.add(brace2);
          }
          break;
        }

        case 'shield_wall': { // Concrete Radiography Shield Wall
          // Stack of 6 modular concrete blocks with beveled/grooved detailing
          for (let y = -4; y <= 2; y += 1.2) {
            const blockGeo = new THREE.BoxGeometry(6.0, 1.1, 0.8);
            const block = new THREE.Mesh(blockGeo, new THREE.MeshStandardMaterial({ color: 0x8a99ad, roughness: 0.9 }));
            block.position.set(0, y, 0);
            modelGroup.add(block);

            // Add joint panel grooves (small thin boxes around block edges)
            const groove = new THREE.Mesh(new THREE.BoxGeometry(6.04, 0.04, 0.84), new THREE.MeshStandardMaterial({ color: 0x334155 }));
            groove.position.set(0, y - 0.55, 0);
            modelGroup.add(groove);

            // Hoisting lifting loops (Torus on top of each block)
            for (let x of [-2, 2]) {
              const hook = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.03, 8, 16), stackMat);
              hook.position.set(x, y + 0.6, 0);
              modelGroup.add(hook);
            }
          }
          break;
        }

        case 'sgp_shield': { // SGP Lead Shield
          // L-shaped lead box encased in bolted steel frames
          const baseLead = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.6, 2.0), shellMat);
          baseLead.position.set(0, -1.0, 0);
          modelGroup.add(baseLead);
          
          const vertLead = new THREE.Mesh(new THREE.BoxGeometry(0.6, 3.0, 2.0), shellMat);
          vertLead.position.set(-1.2, 0.8, 0);
          modelGroup.add(vertLead);

          // Angle iron frames (perimeter edges)
          for (let x of [-1.5, 1.5]) {
            const angle = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.62, 2.02), blueprintMat);
            angle.position.set(x, -1.0, 0);
            modelGroup.add(angle);
          }
          for (let y of [-0.7, 2.3]) {
            const angle = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.08, 2.02), blueprintMat);
            angle.position.set(-1.2, y, 0);
            modelGroup.add(angle);
          }

          // Lifting lugs with reinforcing backing plates
          const lugPlate = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.4, 0.4), blueprintMat);
          lugPlate.position.set(-1.52, 2.1, 0);
          modelGroup.add(lugPlate);

          const eye = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.05, 8, 16), stackMat);
          eye.position.set(-1.52, 2.3, 0);
          eye.rotation.y = Math.PI / 2;
          modelGroup.add(eye);

          // Heavy toggle clamps (cylinder shafts and red vinyl grips)
          for (let z of [-0.8, 0.8]) {
            const clampBase = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), stackMat);
            clampBase.position.set(1.3, -1.0, z);
            modelGroup.add(clampBase);

            const clampHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8), new THREE.MeshStandardMaterial({ color: 0xd97706 })); // orange grip
            clampHandle.position.set(1.35, -0.7, z);
            clampHandle.rotation.z = -0.5;
            modelGroup.add(clampHandle);
          }
          break;
        }

        case 'cseam_shield': { // C-Seam Arc Shield on Carriage
          // Curved 120-degree lead shield plate
          const arcGeo = new THREE.CylinderGeometry(3.0, 3.0, 2.0, 32, 1, true, 0, Math.PI * 0.66);
          const arc = new THREE.Mesh(arcGeo, shellMat);
          arc.position.set(0, 1.0, 0);
          arc.rotation.y = -Math.PI / 3;
          modelGroup.add(arc);

          // Outer stiffener vertical ribs on lead plate (5 channels)
          for (let i = 0; i < 5; i++) {
            const angle = (i / 4) * Math.PI * 0.66 - Math.PI / 3;
            const rib = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.02, 0.1), blueprintMat);
            rib.position.set(Math.cos(angle) * 3.05, 1.0, Math.sin(angle) * 3.05);
            rib.rotation.y = -angle;
            modelGroup.add(rib);
          }

          // Carriage support structure (Y = -0.5)
          const carFrame = new THREE.Group();
          for (let x of [-1.5, 1.5]) {
            const channel = createIBeam(3.2, 0.2, 0.03, blueprintMat);
            channel.position.set(x, -0.5, 0);
            carFrame.add(channel);
          }
          for (let z of [-1.5, 1.5]) {
            const channel = createIBeam(3.0, 0.16, 0.025, blueprintMat);
            channel.position.set(0, -0.5, z);
            channel.rotation.z = Math.PI / 2;
            carFrame.add(channel);
          }
          modelGroup.add(carFrame);

          // Rolling steel flanged wheels (4 wheels)
          for (let x of [-1.4, 1.4]) {
            for (let z of [-1.4, 1.4]) {
              const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.15, 16), stackMat);
              wheel.position.set(x, -1.0, z);
              wheel.rotation.z = Math.PI / 2;
              modelGroup.add(wheel);

              // Wheel flange ring
              const flange = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.03, 16), stackMat);
              flange.position.set(x + (x > 0 ? 0.07 : -0.07), -1.0, z);
              flange.rotation.z = Math.PI / 2;
              modelGroup.add(flange);
            }
          }
          break;
        }

        case 'marking_fixture': { // Pre-Camber Marking Fixture
          // Central structural pipe mandrel
          const mandrelGeo = new THREE.CylinderGeometry(1.2, 1.2, 6.0, 24);
          const mandrel = new THREE.Mesh(mandrelGeo, shellMat);
          mandrel.rotation.x = Math.PI / 2;
          modelGroup.add(mandrel);

          // Stiffening internal diaphragms (circles with holes)
          for (let z of [-2.8, 2.8]) {
            const plate = new THREE.Mesh(new THREE.CylinderGeometry(1.18, 1.18, 0.05, 24), blueprintMat);
            plate.position.z = z;
            plate.rotation.x = Math.PI / 2;
            modelGroup.add(plate);
          }

          // Circumferential alignment rings (Y = -2, 0, 2)
          for (let z of [-2, 0, 2]) {
            const ringGeo = new THREE.CylinderGeometry(1.35, 1.35, 0.15, 24, 1, true);
            const ring = new THREE.Mesh(ringGeo, blueprintMat);
            ring.position.set(0, 0, z);
            ring.rotation.x = Math.PI / 2;
            modelGroup.add(ring);

            // Radial locking toggle screws (6 per ring)
            for (let a = 0; a < 6; a++) {
              const angle = (a / 6) * Math.PI * 2;
              const boltGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.5, 8);
              const bolt = new THREE.Mesh(boltGeo, stackMat);
              bolt.position.set(Math.cos(angle) * 1.45, Math.sin(angle) * 1.45, z);
              bolt.rotation.z = angle + Math.PI / 2;
              modelGroup.add(bolt);

              // T-handle bar on each locking screw
              const handleGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.25, 8);
              const handle = new THREE.Mesh(handleGeo, new THREE.MeshStandardMaterial({ color: 0x475569 }));
              handle.position.set(Math.cos(angle) * 1.7, Math.sin(angle) * 1.7, z);
              handle.rotation.z = angle;
              modelGroup.add(handle);
            }
          }
          break;
        }

        case 'cold_box_found': { // Cold Box pile foundation
          // Ground concrete slab (mat)
          const slab = new THREE.Mesh(new THREE.BoxGeometry(8.0, 0.5, 8.0), new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.9 }));
          slab.position.y = -4.0;
          modelGroup.add(slab);

          // Piles extending below slab
          for (let x of [-3, 0, 3]) {
            for (let z of [-3, 0, 3]) {
              const pile = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2.5, 12), new THREE.MeshStandardMaterial({ color: 0x475569 }));
              pile.position.set(x, -5.5, z);
              modelGroup.add(pile);
            }
          }

          // 4x Raised Concrete Column Pedestals
          for (let x of [-2.5, 2.5]) {
            for (let z of [-2.5, 2.5]) {
              const ped = new THREE.Mesh(new THREE.BoxGeometry(1.3, 2.0, 1.3), new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.9 }));
              ped.position.set(x, -2.8, z);
              modelGroup.add(ped);

              // Base plate on pedestal
              const plate = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.08, 1.4), stackMat);
              plate.position.set(x, -1.76, z);
              modelGroup.add(plate);

              // Anchor bolts grouping protruding out (4 bolts per pedestal)
              for (let bx of [-0.45, 0.45]) {
                for (let bz of [-0.45, 0.45]) {
                  const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.35, 8), stackMat);
                  bolt.position.set(x + bx, -1.6, z + bz);
                  modelGroup.add(bolt);

                  const nut = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.06, 6), stackMat);
                  nut.position.set(x + bx, -1.45, z + bz);
                  modelGroup.add(nut);
                }
              }

              // Steel Columns rising up
              const col = createIBeam(5.8, 0.24, 0.035, blueprintMat);
              col.position.set(x, 1.1, z);
              col.rotation.x = Math.PI / 2;
              modelGroup.add(col);
            }
          }

          // Horizontal portal beams connecting columns
          for (let y of [0.5, 3.8]) {
            for (let x of [-2.5, 2.5]) {
              const beam = createIBeam(5.0, 0.22, 0.03, blueprintMat);
              beam.position.set(x, y, 0);
              modelGroup.add(beam);
            }
            for (let z of [-2.5, 2.5]) {
              const beam = createIBeam(5.0, 0.22, 0.03, blueprintMat);
              beam.position.set(0, y, z);
              beam.rotation.z = Math.PI / 2;
              modelGroup.add(beam);
            }
          }
          break;
        }

        case 'compressor_found': { // Compressor foundation block
          // Concrete foundation block
          const block = new THREE.Mesh(new THREE.BoxGeometry(6.2, 1.5, 4.2), new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9 }));
          block.position.y = -2.5;
          modelGroup.add(block);

          // Vibration isolation springs (6 heavy spring nests)
          for (let x of [-2.2, 0, 2.2]) {
            for (let z of [-1.4, 1.4]) {
              // Spring damper housing cylinder
              const housing = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.6, 16), stackMat);
              housing.position.set(x, -3.55, z);
              modelGroup.add(housing);

              // Helical spring coil inside (modeled as stacked thin toruses)
              for (let sy = -0.2; sy <= 0.2; sy += 0.1) {
                const coil = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.04, 8, 16), coilMat);
                coil.position.set(x, -3.55 + sy, z);
                coil.rotation.x = Math.PI / 2;
                modelGroup.add(coil);
              }
            }
          }

          // Heavy steel skid frame on top
          for (let x of [-2.2, 2.2]) {
            const beam = createIBeam(4.0, 0.25, 0.04, blueprintMat);
            beam.position.set(x, -1.6, 0);
            modelGroup.add(beam);
          }
          for (let z of [-1.8, 1.8]) {
            const beam = createIBeam(4.4, 0.2, 0.03, blueprintMat);
            beam.position.set(0, -1.6, z);
            beam.rotation.z = Math.PI / 2;
            modelGroup.add(beam);
          }

          // Compressor casing (procedurally modeled compressor cylinder blocks)
          const casing = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 2.8, 16), shellMat);
          casing.position.set(0, -0.3, 0);
          casing.rotation.x = Math.PI / 2;
          modelGroup.add(casing);

          // Horizontal piston cylinders (2 units)
          for (let z of [-0.8, 0.8]) {
            const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.2, 12), shellMat);
            cyl.position.set(1.0, -0.3, z);
            cyl.rotation.z = Math.PI / 2;
            modelGroup.add(cyl);

            // Flanged cylinder heads
            const head = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.56, 0.15, 12), stackMat);
            head.position.set(1.65, -0.3, z);
            head.rotation.z = Math.PI / 2;
            modelGroup.add(head);
          }
          break;
        }

        case 'boiler_house': { // Boiler House Skeletal Structure
          // Multi-story steel frame column array (3x3 grid)
          for (let x of [-4.0, 0, 4.0]) {
            for (let z of [-3.0, 0, 3.0]) {
              const col = createIBeam(15.0, 0.28, 0.045, blueprintMat);
              col.position.set(x, -0.5, z);
              col.rotation.x = Math.PI / 2;
              modelGroup.add(col);
            }
          }
          // Horizontal platform levels (Y = -3, 1, 5) with grating and handrails
          for (let py of [-3, 1, 5]) {
            const platformFloor = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.05, 6.2), wireMat);
            platformFloor.position.y = py;
            modelGroup.add(platformFloor);

            // Platform framing beams underneath
            for (let x of [-4.0, 0, 4.0]) {
              const beam = createIBeam(6.0, 0.2, 0.03, blueprintMat);
              beam.position.set(x, py - 0.12, 0);
              modelGroup.add(beam);
            }

            // Handrail loops around platforms
            const railGeo = new THREE.BoxGeometry(8.2, 1.0, 6.2);
            const rail = new THREE.Mesh(railGeo, new THREE.MeshStandardMaterial({ color: 0xd97706, wireframe: true })); // safety yellow/orange
            rail.position.y = py + 0.5;
            modelGroup.add(rail);
          }

          // Skeletal diagonal cross bracings
          const braceGeo = new THREE.CylinderGeometry(0.04, 0.04, 6.4, 8);
          for (let z of [-3.0, 3.0]) {
            const brace1 = new THREE.Mesh(braceGeo, stackMat);
            brace1.position.set(-2.0, -1.0, z);
            brace1.rotation.z = 0.9;
            modelGroup.add(brace1);

            const brace2 = brace1.clone();
            brace2.rotation.z = -0.9;
            modelGroup.add(brace2);
          }

          // Steam separator drum on top (Y = 7.5)
          const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 5.0, 16), shellMat);
          drum.position.set(0, 7.5, 0);
          drum.rotation.z = Math.PI / 2;
          modelGroup.add(drum);
          
          // Drum support saddles
          for (let x of [-1.8, 1.8]) {
            const saddle = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.6, 1.4), stackMat);
            saddle.position.set(x, 7.0, 0);
            modelGroup.add(saddle);
          }
          break;
        }

        case 'steel_chimney': { // Steel Stack/Chimney (Kochi/Bina style)
          // Base support anchor chairs and base ring (Y = -5)
          const baseRing = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 1.9, 0.15, 24), blueprintMat);
          baseRing.position.y = -5.0;
          modelGroup.add(baseRing);

          // Tapered base shell segment (diameter 3.6 to 2.4, height 4)
          const baseCylGeo = new THREE.CylinderGeometry(1.2, 1.8, 4.0, 32, 1, true);
          const baseCyl = new THREE.Mesh(baseCylGeo, shellMat);
          baseCyl.position.y = -3.0;
          modelGroup.add(baseCyl);

          // Upper stack column (diameter 1.2, height 12)
          const stackCylGeo = new THREE.CylinderGeometry(1.2, 1.2, 12.0, 32, 1, true);
          const stackCyl = new THREE.Mesh(stackCylGeo, shellMat);
          stackCyl.position.y = 5.0;
          modelGroup.add(stackCyl);

          // Helical wind strakes wrapping upper chimney (3-start helices)
          for (let sy = 0.0; sy <= 10.0; sy += 0.3) {
            for (let start = 0; start < 3; start++) {
              const angle = (sy * 0.8) + (start * Math.PI * 2 / 3);
              const strake = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.05, 0.02), stackMat);
              strake.position.set(Math.cos(angle) * 1.32, sy, Math.sin(angle) * 1.32);
              strake.rotation.y = -angle;
              strake.rotation.x = 0.55;
              modelGroup.add(strake);
            }
          }

          // Anchor chairs ring (heavy gussets at base ring Y = -5)
          for (let a = 0; a < 16; a++) {
            const angle = (a / 16) * Math.PI * 2;
            const chair = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.6, 0.3), blueprintMat);
            chair.position.set(Math.cos(angle) * 1.85, -4.7, Math.sin(angle) * 1.85);
            chair.rotation.y = -angle;
            modelGroup.add(chair);

            // Anchor bolt pins
            const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8), stackMat);
            pin.position.set(Math.cos(angle) * 1.85, -4.5, Math.sin(angle) * 1.85);
            modelGroup.add(pin);
          }

          // Access catwalk platforms (Y = 1.0 and Y = 8.0)
          for (let py of [1.0, 8.0]) {
            const platFloor = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.3, 8, 32), stackMat);
            platFloor.position.y = py;
            platFloor.rotation.x = Math.PI / 2;
            modelGroup.add(platFloor);

            // Outer handrail ring
            const handrail = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 1.9, 1.0, 24, 1, true), new THREE.MeshStandardMaterial({ color: 0xd97706, wireframe: true }));
            handrail.position.y = py + 0.5;
            modelGroup.add(handrail);
          }
          break;
        }

        case 'vfd_room': { // VFD Room skid module
          // Under-skid beam grid (X and Z channels)
          for (let x of [-2.4, -0.8, 0.8, 2.4]) {
            const beam = createIBeam(6.2, 0.28, 0.04, blueprintMat);
            beam.position.set(x, -3.0, 0);
            beam.rotation.x = Math.PI / 2;
            modelGroup.add(beam);
          }
          for (let z of [-3.0, 0, 3.0]) {
            const beam = createIBeam(5.0, 0.28, 0.04, blueprintMat);
            beam.position.set(0, -3.0, z);
            beam.rotation.z = Math.PI / 2;
            modelGroup.add(beam);
          }

          // Skid enclosure body with wall corrugated ribs
          const enclosure = new THREE.Mesh(new THREE.BoxGeometry(4.8, 3.6, 5.8), new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 }));
          enclosure.position.y = -1.2;
          modelGroup.add(enclosure);

          // Wall corrugated stiffeners (modeled as vertical ribs along wall sides)
          for (let z = -2.8; z <= 2.8; z += 0.4) {
            for (let x of [-2.42, 2.42]) {
              const rib = new THREE.Mesh(new THREE.BoxGeometry(0.04, 3.58, 0.08), blueprintMat);
              rib.position.set(x, -1.2, z);
              modelGroup.add(rib);
            }
          }

          // Lifting lugs on skid base corners (Torus rings with baseplates)
          for (let x of [-2.5, 2.5]) {
            for (let z of [-3.1, 3.1]) {
              const lugPlate = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.05), stackMat);
              lugPlate.position.set(x, -2.85, z);
              lugPlate.rotation.x = Math.PI / 2;
              modelGroup.add(lugPlate);

              const lug = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.04, 8, 16), stackMat);
              lug.position.set(x, -2.75, z);
              lug.rotation.y = Math.PI / 4;
              modelGroup.add(lug);
            }
          }
          break;
        }

        case 'retaining_wall': { // Stiffened Sheet Pile Retaining Wall
          // Interlocking corrugated sheet pile panels (12 panels)
          for (let x = -5.0; x <= 5.0; x += 0.9) {
            // Z-shaped corrugation profile using two offset boxes
            const panel1 = new THREE.Mesh(new THREE.BoxGeometry(0.45, 6.0, 0.08), blueprintMat);
            panel1.position.set(x - 0.22, -1.0, -0.15);
            modelGroup.add(panel1);

            const panel2 = new THREE.Mesh(new THREE.BoxGeometry(0.45, 6.0, 0.08), blueprintMat);
            panel2.position.set(x + 0.22, -1.0, 0.15);
            modelGroup.add(panel2);
          }

          // Capping channel running horizontally on top of piles (Y = 2.0)
          const capChannel = new THREE.Mesh(new THREE.BoxGeometry(10.8, 0.12, 0.45), stackMat);
          capChannel.position.set(0, 2.0, 0);
          modelGroup.add(capChannel);

          // Horizontal waler beams running along front (Y = -0.5)
          const waler = createIBeam(10.8, 0.22, 0.03, blueprintMat);
          waler.position.set(0, -0.5, 0.35);
          waler.rotation.z = Math.PI / 2;
          modelGroup.add(waler);

          // Tie-back rods extending backwards (Y = -0.5, 4 rods)
          for (let rx of [-4.0, -1.2, 1.2, 4.0]) {
            const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 5.0, 8), coilMat);
            rod.position.set(rx, -0.5, -2.15);
            rod.rotation.x = Math.PI / 2;
            modelGroup.add(rod);

            // Rod anchor washer assembly on waler face
            const plate = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.3, 0.3), stackMat);
            plate.position.set(rx, -0.5, 0.45);
            modelGroup.add(plate);

            const boltNut = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.12, 6), stackMat);
            boltNut.position.set(rx, -0.5, 0.52);
            boltNut.rotation.x = Math.PI / 2;
            modelGroup.add(boltNut);
          }
          break;
        }

        case 'air_duct': { // Primary Combustion Air Ducting
          // Main rectangular duct shell
          const duct = new THREE.Mesh(new THREE.BoxGeometry(3.0, 2.2, 7.0), shellMat);
          modelGroup.add(duct);

          // External reinforcement angle ribs (surrounding duct profile)
          for (let z of [-2.6, -1.3, 0, 1.3, 2.6]) {
            // Draw 4 perimeter box angles
            const t = 0.08;
            const w = 3.0;
            const h = 2.2;

            const rTop = new THREE.Mesh(new THREE.BoxGeometry(w + t*2, t, t), blueprintMat);
            rTop.position.set(0, h/2 + t/2, z);
            modelGroup.add(rTop);

            const rBottom = rTop.clone();
            rBottom.position.y = -(h/2 + t/2);
            modelGroup.add(rBottom);

            const rLeft = new THREE.Mesh(new THREE.BoxGeometry(t, h + t*2, t), blueprintMat);
            rLeft.position.set(-(w/2 + t/2), 0, z);
            modelGroup.add(rLeft);

            const rRight = rLeft.clone();
            rRight.position.x = w/2 + t/2;
            modelGroup.add(rRight);
          }

          // Expansion bellows convolutions at center (Z = 0)
          const bellowsGroup = new THREE.Group();
          for (let bz of [-0.3, 0, 0.3]) {
            const convolute = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.4, 0.15), stackMat);
            convolute.position.set(0, 0, bz);
            bellowsGroup.add(convolute);
          }
          modelGroup.add(bellowsGroup);
          break;
        }

        case 'monorail_hoist': { // Monorail Hoist & Runway beam
          // Horizontal runway I-beam
          const runway = createIBeam(8.0, 0.32, 0.045, blueprintMat);
          runway.position.set(0, 3.0, 0);
          modelGroup.add(runway);

          // Suspension hangers (3 structural plate hangers)
          for (let hx of [-3.0, 0, 3.0]) {
            const hanger = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.2, 0.4), stackMat);
            hanger.position.set(hx, 3.8, 0);
            modelGroup.add(hanger);

            // Connect bolts to roof structural supports
            const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.25, 8), stackMat);
            pin.position.set(hx, 4.3, 0);
            pin.rotation.z = Math.PI / 2;
            modelGroup.add(pin);
          }

          // Hoist rolling trolley casing (on lower flange of beam)
          const trolley = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.7), shellMat);
          trolley.position.set(1.2, 2.5, 0);
          modelGroup.add(trolley);

          // Rolling wheels on trolley (4 wheels resting on I-beam flange)
          for (let tx of [0.95, 1.45]) {
            for (let tz of [-0.22, 0.22]) {
              const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.06, 12), stackMat);
              wheel.position.set(tx, 2.75, tz);
              wheel.rotation.x = Math.PI / 2;
              modelGroup.add(wheel);
            }
          }

          // Wire rope hoist drum inside trolley
          const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.5, 12), coilMat);
          drum.position.set(1.2, 2.3, 0);
          drum.rotation.z = Math.PI / 2;
          modelGroup.add(drum);

          // Lifting steel hook block assembly hanging below (Y = 1.0)
          const block = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 0.2), stackMat);
          block.position.set(1.2, 1.4, 0);
          modelGroup.add(block);

          const hook = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.05, 8, 16, Math.PI * 1.5), stackMat);
          hook.position.set(1.2, 1.0, 0);
          modelGroup.add(hook);
          break;
        }

        case 'vessel_skid': { // Process Vessel Skid frame
          // Twin heavy skid channels (H-sections running on Z axis)
          for (let x of [-1.5, 1.5]) {
            const beam = createIBeam(6.5, 0.28, 0.04, blueprintMat);
            beam.position.set(x, -2.0, 0);
            modelGroup.add(beam);
          }
          // Cross-tie members (4 channels crossing)
          for (let z of [-2.8, -1.0, 1.0, 2.8]) {
            const tie = createIBeam(3.0, 0.2, 0.03, blueprintMat);
            tie.position.set(0, -2.0, z);
            tie.rotation.z = Math.PI / 2;
            modelGroup.add(tie);
          }
          // Saddles support blocks (gusseted plate saddles)
          for (let z of [-1.8, 1.8]) {
            const saddleBase = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.5, 0.3), stackMat);
            saddleBase.position.set(0, -1.6, z);
            modelGroup.add(saddleBase);

            // Curved wear plate
            const wearPlate = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.32, 24, 1, false, 0, Math.PI), stackMat);
            wearPlate.position.set(0, -1.4, z);
            wearPlate.rotation.x = Math.PI / 2;
            modelGroup.add(wearPlate);
          }

          // Cylindrical process vessel (diameter 1.8, length 5.5)
          const shell = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 5.5, 24), shellMat);
          shell.position.set(0, -0.5, 0);
          shell.rotation.x = Math.PI / 2;
          modelGroup.add(shell);

          // Dome heads on vessel ends
          for (let z of [-2.75, 2.75]) {
            const head = new THREE.Mesh(new THREE.SphereGeometry(0.9, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2), shellMat);
            head.position.set(0, -0.5, z);
            head.rotation.x = z > 0 ? Math.PI / 2 : -Math.PI / 2;
            modelGroup.add(head);
          }

          // Standard nozzle flange loops (3 units on top Y = 0.5)
          for (let z of [-1.5, 0, 1.5]) {
            const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.4, 12), coilMat);
            nozzle.position.set(0, 0.6, z);
            modelGroup.add(nozzle);

            const flange = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.08, 12), stackMat);
            flange.position.set(0, 0.8, z);
            modelGroup.add(flange);
          }
          break;
        }

        case 'damper_assembly': { // Louver Damper Assembly
          // Outer framing channels box (3.2 x 3.2 x 0.4)
          const frameGroup = new THREE.Group();
          for (let x of [-1.6, 1.6]) {
            const beam = createIBeam(3.2, 0.22, 0.03, blueprintMat);
            beam.position.set(x, 0, 0);
            beam.rotation.y = Math.PI / 2;
            frameGroup.add(beam);
          }
          for (let y of [-1.6, 1.6]) {
            const beam = createIBeam(3.0, 0.22, 0.03, blueprintMat);
            beam.position.set(0, y, 0);
            frameGroup.add(beam);
          }
          modelGroup.add(frameGroup);

          // 3 Louver blades with center shafts
          const bladePositions = [-1.0, 0, 1.0];
          bladePositions.forEach((pos) => {
            const blade = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.85, 0.04), shellMat);
            blade.position.set(0, pos, 0);
            blade.rotation.x = 0.65; // Louver opening angle
            modelGroup.add(blade);

            // Center shaft rod extending past frame for linkage
            const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 3.4, 8), stackMat);
            shaft.position.set(0, pos, 0);
            shaft.rotation.z = Math.PI / 2;
            modelGroup.add(shaft);

            // Linkage lever arm on shaft end (X = 1.7)
            const lever = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.3, 0.06), stackMat);
            lever.position.set(1.7, pos + 0.1, 0);
            lever.rotation.x = 0.65;
            modelGroup.add(lever);
          });

          // Mechanical drive bar connecting the three levers
          const driveBar = new THREE.Mesh(new THREE.BoxGeometry(0.04, 2.2, 0.04), stackMat);
          driveBar.position.set(1.7, 0, 0.15);
          modelGroup.add(driveBar);
          break;
        }

        case 'piping_manifold': { // Piping header manifold
          // Main header pipeline (horizontal Z axis, diameter 0.4)
          const mainPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 6.0, 16), stackMat);
          mainPipe.rotation.x = Math.PI / 2;
          modelGroup.add(mainPipe);

          // Header end flanges
          for (let z of [-3.0, 3.0]) {
            const flange = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.1, 16), stackMat);
            flange.position.set(0, 0, z);
            flange.rotation.x = Math.PI / 2;
            modelGroup.add(flange);
          }

          // 3 Branch pipes extending vertically (Y axis)
          for (let z of [-1.8, 0, 1.8]) {
            const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.8, 12), coilMat);
            branch.position.set(0, 0.9, z);
            modelGroup.add(branch);

            // Flange connection at header branch weld interface
            const weldFlange = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.08, 12), stackMat);
            weldFlange.position.set(0, 0.22, z);
            modelGroup.add(weldFlange);

            // Gate valve body
            const valveBody = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.4, 0.32), stackMat);
            valveBody.position.set(0, 1.0, z);
            modelGroup.add(valveBody);

            const valveBonnet = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.3, 8), stackMat);
            valveBonnet.position.set(0, 1.35, z);
            modelGroup.add(valveBonnet);

            // Gate valve wheel on each branch (red wheel)
            const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.05, 12), new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.8 }));
            wheel.position.set(0, 1.5, z);
            wheel.rotation.x = Math.PI / 2;
            modelGroup.add(wheel);
          }
          break;
        }

        case 'refractory_anchor': { // Refractory Casing Anchor Grid
          // Base backing steel casing plate
          const plate = new THREE.Mesh(new THREE.BoxGeometry(6.0, 4.0, 0.06), blueprintMat);
          modelGroup.add(plate);

          // Stiffener ribs on casing backside (Y = -0.04)
          for (let x of [-2.0, 0, 2.0]) {
            const rib = new THREE.Mesh(new THREE.BoxGeometry(0.1, 4.0, 0.08), blueprintMat);
            rib.position.set(x, 0, -0.07);
            modelGroup.add(rib);
          }

          // Grid pattern of V-shaped refractory wire anchors (16 anchors)
          for (let x = -2.25; x <= 2.25; x += 1.5) {
            for (let y = -1.5; y <= 1.5; y += 1.0) {
              // Draw V-anchor: 2 cylinders intersecting at base plate
              const wireGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.4, 8);
              
              const leg1 = new THREE.Mesh(wireGeo, stackMat);
              leg1.position.set(x - 0.08, y, 0.2);
              leg1.rotation.z = -0.35;
              leg1.rotation.y = 0.15;
              modelGroup.add(leg1);

              const leg2 = new THREE.Mesh(wireGeo, stackMat);
              leg2.position.set(x + 0.08, y, 0.2);
              leg2.rotation.z = 0.35;
              leg2.rotation.y = 0.15;
              modelGroup.add(leg2);

              // Welding washer base dot
              const washer = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.02, 8), stackMat);
              washer.position.set(x, y, 0.035);
              washer.rotation.x = Math.PI / 2;
              modelGroup.add(washer);
            }
          }
          break;
        }

        case 'tube_sheet': { // Convection Section Tube Sheet
          // Main structural tubesheet plate
          const plate = new THREE.Mesh(new THREE.BoxGeometry(4.0, 5.0, 0.15), blueprintMat);
          modelGroup.add(plate);

          // Perimeter reinforcement flat bar frame
          const frameWire = new THREE.BoxHelper(plate, 0x0a1628);
          modelGroup.add(frameWire);

          // Triangular pitch grid holes (24 tube guide sleeves)
          for (let row = 0; row < 6; row++) {
            const y = -1.8 + row * 0.7;
            const cols = row % 2 === 0 ? [-1.2, 0, 1.2] : [-0.6, 0.6];
            cols.forEach((x) => {
              // Guide sleeves/collars extending from plate
              const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.3, 16), stackMat);
              collar.position.set(x, y, 0);
              collar.rotation.x = Math.PI / 2;
              modelGroup.add(collar);

              // Inside tube passage (dark core)
              const tubeCore = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.32, 12), new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 1.0 }));
              tubeCore.position.set(x, y, 0);
              tubeCore.rotation.x = Math.PI / 2;
              modelGroup.add(tubeCore);
            });
          }
          break;
        }

        case 'crossover_piping': { // Crossover Process Piping
          // Long piping lines running between levels (diameter 0.24)
          const run1 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 7.0, 16), coilMat);
          run1.position.set(-1.2, 0, 0);
          modelGroup.add(run1);

          const run2 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 4.0, 16), coilMat);
          run2.position.set(0.6, -1.5, 0);
          modelGroup.add(run2);

          // 180-degree expansion loop (torus segment Y = 3.5)
          const loop = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.12, 12, 24, Math.PI), coilMat);
          loop.position.set(-0.3, 3.5, 0);
          loop.rotation.z = Math.PI / 2;
          modelGroup.add(loop);

          // Standard 90-degree elbows connecting pipelines
          const elb1 = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.12, 12, 16, Math.PI / 2), coilMat);
          elb1.position.set(0.3, -3.5, 0);
          elb1.rotation.z = 0;
          modelGroup.add(elb1);

          // Constant load spring hanger supports (cylinders + heavy spring cages)
          const hangerRod = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.2, 8), stackMat);
          hangerRod.position.set(0.6, 4.1, 0);
          modelGroup.add(hangerRod);

          const hangerCasing = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.8, 0.35), stackMat);
          hangerCasing.position.set(0.6, 4.5, 0);
          modelGroup.add(hangerCasing);
          break;
        }

        case 'sag_rod': { // Roof purlin sag rod assembly
          // Horizontal purlin channel profiles running on Z axis
          for (let x of [-1.8, 1.8]) {
            const purlin = createIBeam(5.0, 0.18, 0.02, blueprintMat);
            purlin.position.set(x, 1.0, 0);
            modelGroup.add(purlin);
          }

          // Diagonal and vertical sag rods connecting the purlins (X axis)
          const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 3.6, 8), stackMat);
          rod.position.set(0, 1.0, 0);
          rod.rotation.z = Math.PI / 2;
          modelGroup.add(rod);

          // Turnbuckle body at the center of the rod (box sleeve)
          const turnbuckle = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.08, 0.08), stackMat);
          turnbuckle.position.set(0, 1.0, 0);
          modelGroup.add(turnbuckle);

          // Hex lock nuts on each end of the turnbuckle
          for (let tx of [-0.2, 0.2]) {
            const nut = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.05, 6), stackMat);
            nut.position.set(tx, 1.0, 0);
            nut.rotation.z = Math.PI / 2;
            modelGroup.add(nut);
          }
          break;
        }

        case 'expansion_bellows': { // Duct expansion bellows
          // Duct transition cones on each side of bellows
          for (let z of [-1.5, 1.5]) {
            const cone = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.0, 0.8, 32, 1, false), shellMat);
            cone.position.set(0, 0, z);
            cone.rotation.x = Math.PI / 2;
            modelGroup.add(cone);
          }

          // Corrugated bellows core (Z axis)
          const bellowCore = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 2.2, 32), shellMat);
          bellowCore.rotation.x = Math.PI / 2;
          modelGroup.add(bellowCore);

          // Bellows rings (5 corrugations torus loops)
          for (let z = -0.8; z <= 0.8; z += 0.4) {
            const ring = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.12, 12, 32), stackMat);
            ring.position.set(0, 0, z);
            modelGroup.add(ring);
          }

          // 4x Structural limit tie-rods running on perimeter (diameter 0.06)
          for (let a = 0; a < 4; a++) {
            const angle = (a / 4) * Math.PI * 2;
            const rx = Math.cos(angle) * 2.15;
            const ry = Math.sin(angle) * 2.15;

            const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 3.2, 8), blueprintMat);
            rod.position.set(rx, ry, 0);
            rod.rotation.x = Math.PI / 2;
            modelGroup.add(rod);

            // Double lock nuts on rod ends
            for (let rz of [-1.6, 1.6]) {
              const nut = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.08, 6), stackMat);
              nut.position.set(rx, ry, rz);
              nut.rotation.x = Math.PI / 2;
              modelGroup.add(nut);
            }
          }
          break;
        }

        case 'breeching_casing': { // Transition breeching casing box
          // Tapered transition casing box
          const casing = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 3.0, 3.5, 4, 1, false, 0.785), shellMat);
          casing.rotation.y = Math.PI / 4;
          modelGroup.add(casing);

          // External reinforcing structural angle channels
          for (let y of [-1.2, 0, 1.2]) {
            const stiffener = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.12, 4.2), blueprintMat);
            stiffener.position.y = y;
            const wire = new THREE.BoxHelper(stiffener, 0x5c80a6);
            modelGroup.add(wire);
          }

          // Casing base perimeter bolted mounting flange
          const flange = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.15, 4.4), blueprintMat);
          flange.position.y = -1.75;
          modelGroup.add(flange);
          break;
        }

        case 'skid_piping': { // Chemical Dosing Skid Piping
          // Under-skid framing channels (X and Z)
          for (let x of [-1.2, 0, 1.2]) {
            const beam = createIBeam(5.0, 0.18, 0.03, blueprintMat);
            beam.position.set(x, -2.0, 0);
            modelGroup.add(beam);
          }

          // Dosing pump motor body
          const pumpMotor = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.6, 12), shellMat);
          pumpMotor.position.set(-0.6, -1.6, -1.0);
          modelGroup.add(pumpMotor);

          const pumpHead = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), stackMat);
          pumpHead.position.set(-0.6, -1.6, -0.4);
          modelGroup.add(pumpHead);

          // Suction and discharge piping loops running around skid
          const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 4.6, 12), coilMat);
          pipe.position.set(0.4, -1.3, 0);
          pipe.rotation.x = Math.PI / 2;
          modelGroup.add(pipe);

          // Pulsation damper bottle (dome cylinder Y = -0.5)
          const damper = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.6, 12), stackMat);
          damper.position.set(0.4, -0.8, -0.6);
          modelGroup.add(damper);

          const damperDome = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), stackMat);
          damperDome.position.set(0.4, -0.5, -0.6);
          modelGroup.add(damperDome);

          // Dial pressure gauges (2 units with needles)
          for (let z of [-1.0, 1.0]) {
            const gauge = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.08, 12), stackMat);
            gauge.position.set(0.4, -0.8, z);
            gauge.rotation.x = Math.PI / 2;
            modelGroup.add(gauge);

            // Dial scale (dark circle inside face)
            const dialFace = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.02, 12), new THREE.MeshStandardMaterial({ color: 0xf8fafc }));
            dialFace.position.set(0.4, -0.75, z);
            dialFace.rotation.x = Math.PI / 2;
            modelGroup.add(dialFace);
          }
          break;
        }

        case 'stair_tower': { // Multi-level stair tower
          // 4 Main Columns I-beams
          for (let x of [-1.5, 1.5]) {
            for (let z of [-1.5, 1.5]) {
              const col = createIBeam(12.0, 0.2, 0.03, blueprintMat);
              col.position.set(x, -1.0, z);
              col.rotation.x = Math.PI / 2;
              modelGroup.add(col);
            }
          }

          // Horizontal portal beams (3 levels Y = -4, 0, 4)
          for (let y of [-4, 0, 4]) {
            const platformFrame = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.08, 3.0), wireMat);
            platformFrame.position.y = y;
            modelGroup.add(platformFrame);

            // Access landing steel gratings (half block)
            const grating = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.02, 3.0), stackMat);
            grating.position.set(0.75, y, 0);
            modelGroup.add(grating);
          }

          // Stair flights winding between landing levels
          const stairGroup = new THREE.Group();
          for (let level = 0; level < 2; level++) {
            const yOffset = -4.0 + level * 4.0;
            // 8 treads per flight
            for (let t = 0; t < 8; t++) {
              const ty = yOffset + t * 0.5 + 0.25;
              const tz = -1.2 + t * 0.3;
              const tread = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.02, 0.25), stackMat);
              tread.position.set(-0.75, ty, tz);
              stairGroup.add(tread);

              // Safety toe-plate
              const toe = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.08, 0.25), stackMat);
              toe.position.set(-0.16, ty + 0.04, tz);
              stairGroup.add(toe);
            }
          }
          modelGroup.add(stairGroup);
          break;
        }

        case 'cage_ladder': { // Cage Ladder assembly
          // Vertical side rails (2 channel bars)
          for (let x of [-0.25, 0.25]) {
            const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 8.0, 8), blueprintMat);
            rail.position.set(x, 0, 0);
            modelGroup.add(rail);
          }
          // Ladder Rungs (Y axis spacing 0.3)
          for (let y = -3.8; y <= 3.8; y += 0.3) {
            const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.5, 8), stackMat);
            rung.position.set(0, y, 0);
            rung.rotation.z = Math.PI / 2;
            modelGroup.add(rung);
          }
          // Circular safety hoops
          for (let y = -2.0; y <= 3.8; y += 0.9) {
            const hoop = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.04, 8, 24, Math.PI * 1.5), blueprintMat);
            hoop.position.set(0, y, 0.24);
            hoop.rotation.x = Math.PI / 2;
            hoop.rotation.z = -Math.PI / 4;
            modelGroup.add(hoop);
          }
          // Vertical straps connecting safety hoops (5 straps surrounding cage)
          for (let s = 0; s < 5; s++) {
            const angle = (s / 4) * Math.PI * 1.5 - Math.PI / 4;
            const strap = new THREE.Mesh(new THREE.BoxGeometry(0.03, 5.8, 0.01), blueprintMat);
            strap.position.set(Math.cos(angle) * 0.48, 0.9, 0.24 + Math.sin(angle) * 0.48);
            modelGroup.add(strap);
          }
          break;
        }

        case 'piling_grid': { // Pile Foundation Grid layout
          // Grid layout of 6 piles
          const pilePositions = [
            { x: -2.0, z: -1.5 }, { x: 0, z: -1.5 }, { x: 2.0, z: -1.5 },
            { x: -2.0, z: 1.5 }, { x: 0, z: 1.5 }, { x: 2.0, z: 1.5 }
          ];
          pilePositions.forEach((pos) => {
            // Concrete pile cap with chamfers
            const cap = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.8), new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.9 }));
            cap.position.set(pos.x, -2.5, pos.z);
            modelGroup.add(cap);

            // Concrete pile shaft extending downwards (Y = -5)
            const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 3.0, 16), new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.9 }));
            shaft.position.set(pos.x, -4.3, pos.z);
            modelGroup.add(shaft);

            // Protruding rebar templates (4 steel rods extending from top of pile cap)
            for (let rx of [-0.2, 0.2]) {
              for (let rz of [-0.2, 0.2]) {
                const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.4, 8), stackMat);
                bar.position.set(pos.x + rx, -2.0, pos.z + rz);
                modelGroup.add(bar);
              }
            }
          });
          break;
        }

        case 'flare_tip': { // Flare tip gas stack
          // Flare chimney tip body
          const tipBody = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.0, 3.0, 24), shellMat);
          tipBody.position.y = 1.0;
          modelGroup.add(tipBody);

          // Steam nozzle header ring (around top outlet Y = 2.4)
          const header = new THREE.Mesh(new THREE.TorusGeometry(0.92, 0.06, 8, 24), stackMat);
          header.position.y = 2.4;
          header.rotation.x = Math.PI / 2;
          modelGroup.add(header);

          // Steam injection pilot nozzle tubes (8 tubes)
          for (let a = 0; a < 8; a++) {
            const angle = (a / 8) * Math.PI * 2;
            const rx = Math.cos(angle) * 0.92;
            const rz = Math.sin(angle) * 0.92;

            const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.4, 8), coilMat);
            nozzle.position.set(rx, 2.6, rz);
            modelGroup.add(nozzle);
          }

          // Windshield shroud ring surrounding top header
          const shroud = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.8, 24, 1, true), blueprintMat);
          shroud.position.y = 2.2;
          modelGroup.add(shroud);
          break;
        }

        case 'preheater_rotor': { // Air Preheater Rotor core sector
          // Center shaft cylindrical hub
          const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 3.5, 24), stackMat);
          modelGroup.add(hub);

          // Outer frame circular rim shell (diameter 6)
          const rim = new THREE.Mesh(new THREE.CylinderGeometry(3.0, 3.0, 3.0, 32, 1, true), blueprintMat);
          modelGroup.add(rim);

          // Radial diaphragms (sector division plates - 12 plates)
          for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const plate = new THREE.Mesh(new THREE.BoxGeometry(0.04, 3.0, 2.4), blueprintMat);
            plate.position.set(Math.cos(angle) * 1.8, 0, Math.sin(angle) * 1.8);
            plate.rotation.y = -angle + Math.PI / 2;
            modelGroup.add(plate);

            // Sector elements pack (heat transfer element sheets modeled as thin boxes)
            const pack = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.9, 1.4), new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.8, wireframe: true }));
            pack.position.set(Math.cos(angle + 0.26) * 1.8, 0, Math.sin(angle + 0.26) * 1.8);
            pack.rotation.y = -angle + Math.PI / 2;
            modelGroup.add(pack);
          }
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

        case 'santhipuram': { // Santhipuram Residential Complex - RCC structure
          const concreteMat = new THREE.MeshStandardMaterial({
            color: 0x94a3b8,
            roughness: 0.9,
            metalness: 0.1,
            wireframe: wireframeRef.current
          });
          const rebarMat = new THREE.MeshStandardMaterial({
            color: 0xd97706,
            roughness: 0.4,
            metalness: 0.7,
            wireframe: wireframeRef.current
          });

          // 1. Grid of columns: 4x4 columns (spaced at x = -3, -1, 1, 3 and z = -3, -1, 1, 3)
          // Height of columns = 9.0m, centered at Y = 0
          const colGeo = new THREE.BoxGeometry(0.24, 9.0, 0.24);
          const colPositions = [];
          for (let x of [-3.0, -1.0, 1.0, 3.0]) {
            for (let z of [-3.0, -1.0, 1.0, 3.0]) {
              const col = new THREE.Mesh(colGeo, concreteMat);
              col.position.set(x, 0, z);
              col.name = "column";
              modelGroup.add(col);
              colPositions.push({ x, z });

              // Isolated concrete footings (pads) at base of every column (Y = -4.5)
              const footingGeo = new THREE.BoxGeometry(0.7, 0.4, 0.7);
              const footing = new THREE.Mesh(footingGeo, concreteMat);
              footing.position.set(x, -4.5, z);
              footing.name = "footing";
              modelGroup.add(footing);
            }
          }

          // 2. Floor beams linking the columns (3 levels: Y = -3, 0, 3)
          const beamLength = 2.0;
          const beamGeoX = new THREE.BoxGeometry(beamLength, 0.18, 0.12);
          const beamGeoZ = new THREE.BoxGeometry(0.12, 0.18, beamLength);

          for (let y of [-3.0, 0, 3.0]) {
            // Horizontal beams in X direction
            for (let z of [-3.0, -1.0, 1.0, 3.0]) {
              for (let x = -2.0; x <= 2.0; x += 2.0) {
                const beam = new THREE.Mesh(beamGeoX, concreteMat);
                beam.position.set(x, y + 0.4, z); // sit slightly below floor level
                beam.name = "beam";
                modelGroup.add(beam);
              }
            }

            // Horizontal beams in Z direction
            for (let x of [-3.0, -1.0, 1.0, 3.0]) {
              for (let z = -2.0; z <= 2.0; z += 2.0) {
                const beam = new THREE.Mesh(beamGeoZ, concreteMat);
                beam.position.set(x, y + 0.4, z);
                beam.name = "beam";
                modelGroup.add(beam);
              }
            }

            // 3. Concrete floor slabs (thin plates with central cutout for stair/liftwell)
            // Left slab: from X = -3.0 to 1.0, Z = -3.0 to 3.0
            const slabGeoLeft = new THREE.BoxGeometry(4.0, 0.08, 6.0);
            const slabLeft = new THREE.Mesh(slabGeoLeft, concreteMat);
            slabLeft.position.set(-1.0, y + 0.5, 0);
            slabLeft.name = "slab";
            modelGroup.add(slabLeft);

            // Right slab: X = 1.0 to 3.0, Z = -3.0 to 3.0 (with stair cutout at X=1 to 3, Z=-1 to 1)
            const slabGeoRight1 = new THREE.BoxGeometry(2.0, 0.08, 2.0); // Z = 1 to 3
            const slabRight1 = new THREE.Mesh(slabGeoRight1, concreteMat);
            slabRight1.position.set(2.0, y + 0.5, 2.0);
            slabRight1.name = "slab";
            modelGroup.add(slabRight1);

            const slabGeoRight2 = new THREE.BoxGeometry(2.0, 0.08, 2.0); // Z = -3 to -1
            const slabRight2 = new THREE.Mesh(slabGeoRight2, concreteMat);
            slabRight2.position.set(2.0, y + 0.5, -2.0);
            slabRight2.name = "slab";
            modelGroup.add(slabRight2);
          }

          // 4. Central lift-well/stair shear wall core
          // Concrete shear walls around center (X = 1.0 to 3.0, Z = -1.0 to 1.0)
          // We can construct three walls: Back wall (X=3), Left wall (Z=-1), Right wall (Z=1)
          const wallGeoBack = new THREE.BoxGeometry(0.12, 9.0, 2.0);
          const wallBack = new THREE.Mesh(wallGeoBack, concreteMat);
          wallBack.position.set(3.0, 0, 0);
          wallBack.name = "shearwall";
          modelGroup.add(wallBack);

          const wallGeoSide = new THREE.BoxGeometry(2.0, 9.0, 0.12);
          const wallSideL = new THREE.Mesh(wallGeoSide, concreteMat);
          wallSideL.position.set(2.0, 0, -1.0);
          wallSideL.name = "shearwall";
          modelGroup.add(wallSideL);

          const wallSideR = new THREE.Mesh(wallGeoSide, concreteMat);
          wallSideR.position.set(2.0, 0, 1.0);
          wallSideR.name = "shearwall";
          modelGroup.add(wallSideR);

          // 5. Some structural details: rebars poking out from columns at top (Y = 4.7m)
          for (let pos of colPositions) {
            for (let rx of [-0.08, 0.08]) {
              for (let rz of [-0.08, 0.08]) {
                const rebarGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.5, 8);
                const rebar = new THREE.Mesh(rebarGeo, rebarMat);
                rebar.position.set(pos.x + rx, 4.75, pos.z + rz);
                rebar.name = "rebar";
                modelGroup.add(rebar);
              }
            }
          }
          break;
        }

        case 'tarachand': { // Tarachand Logistics Hub - Heavy steel warehouse framing
          const concreteMat = new THREE.MeshStandardMaterial({
            color: 0x8a9ba8,
            roughness: 0.9,
            metalness: 0.1,
            wireframe: wireframeRef.current
          });

          // 1. Heavy steel columns: 2 rows of 6 columns (spaced at X = -3.5, 3.5; Z = -5.0 to 5.0 with step 2.0)
          // Height of columns = 7.0m, Y centered at 0
          const colsCount = 6;
          const zStep = 2.0;
          const colPositions = [];
          for (let x of [-3.5, 3.5]) {
            for (let i = 0; i < colsCount; i++) {
              const z = -5.0 + i * zStep;
              const col = createIBeam(7.0, 0.3, 0.04, blueprintMat);
              col.position.set(x, 0, z);
              col.rotation.x = Math.PI / 2;
              col.name = "column";
              modelGroup.add(col);
              colPositions.push({ x, z });

              // Concrete Pile Caps at the base of columns (Y = -3.5)
              const capGeo = new THREE.BoxGeometry(0.8, 0.5, 0.8);
              const cap = new THREE.Mesh(capGeo, concreteMat);
              cap.position.set(x, -3.75, z);
              cap.name = "pilecap";
              modelGroup.add(cap);

              // 4 anchor bolts on columns bases
              const bolts = createBoltCircle(0.2, 4, 0.15, 0.03);
              bolts.position.set(x, -3.5, z);
              modelGroup.add(bolts);
            }
          }

          // 2. Gantry crane runway girders (heavy I-beams spanning longitudinally at Y = 2.0m)
          // Left crane girder
          const craneGirderL = createIBeam(10.2, 0.35, 0.05, stackMat);
          craneGirderL.position.set(-3.25, 2.0, 0);
          craneGirderL.rotation.y = Math.PI / 2;
          craneGirderL.name = "gantry_girder";
          modelGroup.add(craneGirderL);

          // Right crane girder
          const craneGirderR = createIBeam(10.2, 0.35, 0.05, stackMat);
          craneGirderR.position.set(3.25, 2.0, 0);
          craneGirderR.rotation.y = Math.PI / 2;
          craneGirderR.name = "gantry_girder";
          modelGroup.add(craneGirderR);

          // Cantilever support brackets connecting columns to crane girders
          for (let pos of colPositions) {
            const bracket = createIBeam(0.4, 0.2, 0.02, blueprintMat);
            const dir = pos.x > 0 ? -1 : 1;
            bracket.position.set(pos.x + dir * 0.2, 1.8, pos.z);
            bracket.rotation.y = pos.x > 0 ? Math.PI : 0;
            bracket.name = "bracket";
            modelGroup.add(bracket);
          }

          // 3. Triangular Roof Trusses spanning across columns at Y = 3.5m (6 trusses total)
          for (let i = 0; i < colsCount; i++) {
            const z = -5.0 + i * zStep;
            const truss = new THREE.Group();
            truss.position.set(0, 3.5, z);

            // Bottom chord spanning from column to column
            const bottomChord = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 7.0, 8), blueprintMat);
            bottomChord.rotation.z = Math.PI / 2;
            bottomChord.name = "truss_chord";
            truss.add(bottomChord);

            // Sloped top chords rafters meeting in peak at Y = 1.5m
            const rafterL = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 3.9, 8), blueprintMat);
            rafterL.position.set(-1.75, 0.75, 0);
            rafterL.rotation.z = -0.4;
            rafterL.name = "truss_rafter";
            truss.add(rafterL);

            const rafterR = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 3.9, 8), blueprintMat);
            rafterR.position.set(1.75, 0.75, 0);
            rafterR.rotation.z = 0.4;
            rafterR.name = "truss_rafter";
            truss.add(rafterR);

            // Vertical King post in center
            const king = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.5, 8), blueprintMat);
            king.position.set(0, 0.75, 0);
            king.name = "truss_web";
            truss.add(king);

            // W-web diagonal struts (4 struts)
            for (let dir of [-1, 1]) {
              const strut1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.8, 8), blueprintMat);
              strut1.position.set(dir * 0.9, 0.4, 0);
              strut1.rotation.z = -dir * 0.5;
              strut1.name = "truss_web";
              truss.add(strut1);

              const strut2 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.0, 8), blueprintMat);
              strut2.position.set(dir * 2.5, 0.5, 0);
              strut2.rotation.z = -dir * 0.35;
              strut2.name = "truss_web";
              truss.add(strut2);
            }

            modelGroup.add(truss);
          }

          // 4. Roof purlins (longitudinal bars spanning over trusses)
          const purlinXPositions = [-3.5, -2.1, -0.7, 0.7, 2.1, 3.5];
          purlinXPositions.forEach((px) => {
            const py = 3.5 + (1.5 - Math.abs(px) * 0.43);
            const purlin = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 10.2, 8), blueprintMat);
            purlin.position.set(px, py, 0);
            purlin.rotation.x = Math.PI / 2;
            purlin.name = "purlin";
            modelGroup.add(purlin);
          });

          // 5. Diagonal bracing on wall sides (X = -3.5 & 3.5, spanning Z bays)
          const braceGeo = new THREE.CylinderGeometry(0.03, 0.03, 2.8, 8);
          for (let x of [-3.5, 3.5]) {
            for (let i = 0; i < colsCount - 1; i++) {
              if (i % 2 === 0) {
                const zCenter = -4.0 + i * zStep;
                const b1 = new THREE.Mesh(braceGeo, blueprintMat);
                b1.position.set(x, 0, zCenter);
                b1.rotation.x = 0.78;
                b1.name = "bracing";
                modelGroup.add(b1);

                const b2 = b1.clone();
                b2.rotation.x = -0.78;
                modelGroup.add(b2);
              }
            }
          }
          break;
        }
      }

      // Add shadow settings and prepare blueprint/FEA properties for all models
      modelGroup.traverse(child => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;

          // Store the original material for toggles
          if (!child.userData.origMaterial) {
            child.userData.origMaterial = child.material;
          }

          // Generate an EdgesGeometry outline helper
          const edgesGeo = new THREE.EdgesGeometry(child.geometry);
          const edgesMat = new THREE.LineBasicMaterial({ color: 0xffffff });
          const edgesMesh = new THREE.LineSegments(edgesGeo, edgesMat);
          edgesMesh.visible = false;
          child.add(edgesMesh);
          child.userData.edgeHelper = edgesMesh;
        }
      });

      // Calculate model's true bounding box and auto-frame the camera
      const box = new THREE.Box3().setFromObject(modelGroup);
      const size = new THREE.Vector3();
      box.getSize(size);
      const center = new THREE.Vector3();
      box.getCenter(center);

      // Store model bounding box on modelGroup for the hotspot projection function
      modelGroup.userData.box = box;
      modelGroup.userData.size = size;
      modelGroup.userData.center = center;

      // Adjust grid position to sit exactly below the model
      gridHelper.position.y = box.min.y - 0.05;

      // Calculate perfect camera distance to frame the entire model
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = camera.fov * (Math.PI / 180);
      let cameraDistance = Math.abs(maxDim / 2 / Math.tan(fov / 2));
      
      // Clamp camera distance dynamically between 6 and 60 units, with a safe 1.45x bounding buffer
      cameraDistance = Math.max(6, Math.min(60, cameraDistance * 1.45));

      // Position the camera at a nice isometric angle looking at center
      const offsetDirection = new THREE.Vector3(1.2, 0.8, 1.4).normalize();
      targetCamPos.current.copy(center).add(offsetDirection.multiplyScalar(cameraDistance));
      targetLookAt.current.copy(center);

      // Force camera interpolation to start
      isTransitioningRef.current = true;
      transitionFrames.current = 0;

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
      if (updateHotspotsRef.current) {
        updateHotspotsRef.current(camera, renderer.domElement, modelGroup);
      }
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
      {/* Dynamic CAD & FEA Control Overlay */}
      {!loading && (
        <div className="absolute top-3 left-3 z-30 flex flex-wrap gap-2 pointer-events-auto">
          {/* CAD Blueprint Toggle */}
          <button
            onClick={() => {
              setBlueprintMode(prev => {
                const next = !prev;
                if (next) setFeaMode(false);
                return next;
              });
            }}
            title="Toggle Technical CAD Blueprint Mode"
            className={`px-2.5 py-1.5 rounded-sm border text-[9px] font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              blueprintMode
                ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                : 'bg-slate-900/90 border-slate-700/80 text-blue-400 hover:text-white'
            }`}
          >
            <span>📐</span> {blueprintMode ? 'Blueprint On' : 'CAD Blueprint'}
          </button>

          {/* FEA Stress Toggle */}
          <button
            onClick={() => {
              setFeaMode(prev => {
                const next = !prev;
                if (next) setBlueprintMode(false);
                return next;
              });
            }}
            title="Toggle FEM/FEA Stress Heatmap Simulation"
            className={`px-2.5 py-1.5 rounded-sm border text-[9px] font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              feaMode
                ? 'bg-red-600 border-red-500 text-white shadow-md'
                : 'bg-slate-900/90 border-slate-700/80 text-red-400 hover:text-white'
            }`}
          >
            <span>🔥</span> {feaMode ? 'FEA Stress On' : 'FEA Stress Sim'}
          </button>
        </div>
      )}

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
        onClick={() => setActiveHotspot(null)}
        className={`w-full h-full cursor-grab active:cursor-grabbing relative z-10 transition-opacity duration-500 ease-out ${
          loading ? 'opacity-0' : 'opacity-100'
        } ${touchInteracting ? 'touch-none' : 'touch-auto md:touch-none'}`}
      />

      {/* 3D Hotspots Overlay */}
      {!loading && activeHotspots.map((hs) => {
        const pos = projectedPositions[hs.id];
        if (!pos || !pos.visible) return null;
        const isActive = activeHotspot?.id === hs.id;
        return (
          <div
            key={hs.id}
            className="absolute z-30 -translate-x-1/2 -translate-y-1/2"
            style={{ top: pos.top, left: pos.left }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveHotspot(isActive ? null : hs);
              }}
              aria-label={`View detail: ${hs.title}`}
              className="w-5 h-5 rounded-full bg-[#0a1628] border border-blue-400 text-blue-400 font-mono text-[9px] font-bold flex items-center justify-center relative cursor-pointer shadow-lg hover:scale-110 active:scale-95 transition-all duration-200"
            >
              <span className="absolute inset-0 rounded-full bg-blue-400/30 animate-ping pointer-events-none" />
              {hs.id}
            </button>

            {/* Tooltip Card */}
            {isActive && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="absolute top-7 left-1/2 -translate-x-1/2 w-48 bg-slate-900/95 border border-slate-700 text-white p-3 shadow-2xl rounded-sm text-left"
              >
                <div className="flex items-center justify-between mb-1.5 border-b border-slate-800 pb-1">
                  <span className="text-[9px] font-black uppercase tracking-wider text-blue-400">Spec Detail</span>
                  <button 
                    onClick={() => setActiveHotspot(null)}
                    className="text-gray-400 hover:text-white text-[10px] leading-none"
                  >
                    ✕
                  </button>
                </div>
                <h4 className="text-xs font-bold text-white mb-1">{hs.title}</h4>
                <p className="text-[10px] text-gray-300 leading-normal font-medium">{hs.text}</p>
              </div>
            )}
          </div>
        );
      })}
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
