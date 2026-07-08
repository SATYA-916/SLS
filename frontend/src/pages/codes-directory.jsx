import { useState, useMemo } from 'react';
import { PageMeta } from '@/components/PageMeta';
import { Search, X, CheckCircle2, ShieldAlert, Award } from 'lucide-react';

const CODES_DATA = [
  {
    code: 'API 560',
    title: 'Fired Heaters for General Refinery Service',
    category: 'API',
    description: 'Specifies requirements and gives recommendations for design, materials, fabrication, inspection, testing, preparation for shipment, and erection of fired heaters, air preheaters, fans, and burners for general refinery service.',
    appliesTo: 'Fired Heaters, Casings, Radiant & Convection Sections'
  },
  {
    code: 'API 530',
    title: 'Calculation of Heater-Tube Thickness in Petroleum Refineries',
    category: 'API',
    description: 'Provides procedures and design criteria for calculating the required wall thickness of new tubes for petroleum refinery heaters. Includes creep-rupture strength data for commonly used materials.',
    appliesTo: 'Heater Tubes, Radiant Coils, Convection Coils'
  },
  {
    code: 'ASME Section VIII Div 1',
    title: 'Rules for Construction of Pressure Vessels',
    category: 'ASME',
    description: 'Provides detailed requirements for the design, fabrication, inspection, testing, and certification of pressure vessels operating at either internal or external pressures exceeding 15 psig.',
    appliesTo: 'Boiler Drums, Steam Headers, Pressure Piping, Flanges'
  },
  {
    code: 'ASME STS-1',
    title: 'Steel Stacks Standard',
    category: 'ASME',
    description: 'Governs the design, fabrication, assembly, erection, and maintenance of steel stacks (chimneys). Details structural wind loads, vortex shedding, and seismic load analyses.',
    appliesTo: 'Self-Supporting Steel Chimneys, Flues, Guyed Stacks'
  },
  {
    code: 'IS 800 (2007)',
    title: 'Code of Practice for General Construction in Steel',
    category: 'IS',
    description: 'The primary Indian Standard governing the design and fabrication of general steel structures. Employs limit state design method for tension, compression, and member design.',
    appliesTo: 'Structural Framing, Columns, I-Beams, Support Detailing'
  },
  {
    code: 'IS 875 Part 3',
    title: 'Design Loads for Buildings and Structures - Wind Loads',
    category: 'IS',
    description: 'Specifies wind design criteria, velocity profiles, force coefficients, and structural response factors for buildings and tall industrial structures across various wind zones in India.',
    appliesTo: 'Self-Supporting Stacks, Platforms, High-Rise Framing'
  },
  {
    code: 'IS 1893 Part 4',
    title: 'Criteria for Earthquake Resistant Design of Industrial Structures',
    category: 'IS',
    description: 'Defines seismic analysis parameters, zone factors, dynamic response spectra, and structural validation specifications for heavy refinery concrete and steel foundations.',
    appliesTo: 'Cryogenic Cold Box Foundations, Heater Supports, Tall Columns'
  },
  {
    code: 'IS 6533',
    title: 'Code of Practice for Design and Construction of Steel Chimneys',
    category: 'IS',
    description: 'Standard covering mechanical design, dynamic structural response under wind, lining specifications, and structural steel selection parameters for industrial chimneys.',
    appliesTo: 'Heater Stack Chimneys, Steel Flues, Guyed Stacks'
  },
  {
    code: 'EIL Standard 7-12-0001',
    title: 'Standard Specifications for Steel Fabrication & Detailing',
    category: 'EIL',
    description: 'Engineers India Limited (EIL) proprietary standards governing standard connection detailing, welding procedures, bolts pitch, and surface preparation for Indian refinery projects.',
    appliesTo: 'Refinery Steel Detailing, Tekla Modeling, Bolted Connections'
  },
  {
    code: 'ASME B31.3',
    title: 'Process Piping Code',
    category: 'ASME',
    description: 'Rules for piping typically found in petroleum refineries, chemical, pharmaceutical, textile, paper, and cryogenic plants, including design, materials, and inspection requirements.',
    appliesTo: 'Piping Isometric Layouts, Stress Analysis, Nozzle Loading'
  },
  {
    code: 'API 537',
    title: 'Flare Details for General Refinery and Petrochemical Service',
    category: 'API',
    description: 'Specifies requirements and guidance for selection, design, specification, operation, and maintenance of flare equipment used in refinery gas relief systems.',
    appliesTo: 'Flare Stacks, Gas Vent Outlets, Support Steel'
  },
  {
    code: 'IS 456 (2000)',
    title: 'Plain and Reinforced Concrete - Code of Practice',
    category: 'IS',
    description: 'Governs design, concrete grade selection, reinforcement layouts, and fabrication parameters for plain and reinforced concrete structures.',
    appliesTo: 'Dynamic Compressor Bases, Cold Box Foundations, Pile Caps'
  }
];

export default function CodesDirectory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filtered = useMemo(() => {
    return CODES_DATA.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        item.code.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.appliesTo.toLowerCase().includes(q);

      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="w-full">
      <PageMeta
        title="Codes &amp; Standards Directory"
        description="Search through industrial design codes and standards SLS Consultants conforms to — ASME pressure vessel codes, API refinery guidelines, Indian Standards (IS), and EIL specifications."
      />

      <section className="bg-slate-50 text-[#0a1628] py-16 relative overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="codes_grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#codes_grid)" />
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-slate-500 mb-3">Engineering Compliance</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-[#0a1628]">Codes &amp; Design Standards</h1>
          <p className="mt-3 text-sm text-slate-600 max-w-xl leading-relaxed">
            Industrial safety and structural reliability are built on absolute compliance. We design, detail, and validate structural assemblies under regional and international standard guidelines.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-10">
            {/* Search Box */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search code name, title, scope..."
                className="w-full pl-10 pr-10 py-3 text-sm border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#0a1628] focus:outline-none focus:ring-1 focus:ring-[#0a1628]/20 transition-all rounded-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {['All', 'ASME', 'API', 'IS', 'EIL'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider border rounded-sm transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#0a1628] text-white border-[#0a1628]'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-[#0a1628] hover:text-[#0a1628]'
                  }`}
                >
                  {cat === 'All' ? 'All Codes' : `${cat} Standards`}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-400 mb-6">{filtered.length} standard{filtered.length !== 1 ? 's' : ''} directory matches found</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div
                key={item.code}
                className="border border-gray-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow bg-gray-50/50 rounded-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-[#0a1628] bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-sm">
                      {item.code}
                    </span>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#43648e]">
                      {item.category} Standards
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-[#0a1628] leading-snug mb-3">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>
                <div className="border-t border-gray-100 pt-3 mt-4 text-[10px] text-gray-500">
                  <span className="font-bold uppercase tracking-wider text-gray-400 block mb-1">Applicable Area</span>
                  <span className="font-medium text-gray-700">{item.appliesTo}</span>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400 border border-dashed border-gray-200">
              <ShieldAlert className="w-10 h-10 mx-auto text-gray-300 mb-3" />
              <h3 className="font-semibold text-sm mb-1">No Design Standards Found</h3>
              <p className="text-xs">Adjust your filters or try a different search keyword.</p>
            </div>
          )}
        </div>
      </section>

      {/* Trust banner */}
      <section className="bg-slate-50 border-t border-gray-200 py-16 text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <Award className="w-8 h-8 text-[#43648e] mx-auto mb-4" />
          <h2 className="text-lg font-bold text-[#0a1628] mb-2">Statutory &amp; Third-Party Validation Compliant</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            All design calculations and detailed layouts prepared by SLS Consultants undergo strict verification parameters. We routinely interface with third-party inspectors like Bureau Veritas, TUV, and EIL to obtain statutory clearances.
          </p>
        </div>
      </section>
    </div>
  );
}
