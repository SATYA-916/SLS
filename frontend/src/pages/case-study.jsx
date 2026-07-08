import { useParams, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { PageMeta } from '@/components/PageMeta';
import { getProjects } from '@/lib/api';
import { fallbackProjects } from '@/data/fallbackProjects';
import { 
  ArrowLeft, Building2, Calendar, User, MapPin, 
  Tag, ShieldCheck, ClipboardList, CheckCircle2, ChevronRight 
} from 'lucide-react';

function getProjectTechnicalSpecs(proj) {
  const category = proj.category || '';
  const title = proj.title || '';
  const desc = proj.description || '';

  const specs = {
    codes: 'IS 800 (Structural Design), IS 456 (Concrete)',
    software: 'AutoCAD, STAAD.Pro',
    deliverables: 'Structural design calculations & construction fabrication details'
  };

  if (category === 'Fired Heaters' || title.toLowerCase().includes('heater') || desc.toLowerCase().includes('heater')) {
    specs.codes = 'API 560 (Fired Heaters), API 530 (Tube Thickness Calc), ASME Section VIII (Pressure Parts)';
    specs.software = 'AutoCAD, STAAD.Pro, ANSYS (FEA Thermal Modeling)';
    specs.deliverables = 'Thermal & Structural Calculations, General Arrangement & Shell Detail Drawings, Nozzle Load Verification Reports';
  } else if (category === 'Cryogenic Plants' || desc.toLowerCase().includes('cryogenic') || desc.toLowerCase().includes('cold box')) {
    specs.codes = 'ASME Section VIII Div 1, AD 2000, IS 1893 (Seismic Design)';
    specs.software = 'STAAD.Pro, ANSYS (Dynamic foundation FEA)';
    specs.deliverables = 'Heavy Dynamic Foundation design reports, Anchor Bolt layout drawings, RCC Pile load capacity analysis';
  } else if (category === 'Boilers & Chimneys' || title.toLowerCase().includes('stack') || title.toLowerCase().includes('chimney') || desc.toLowerCase().includes('chimney')) {
    specs.codes = 'IS 6533 (Steel Chimneys), IS 875 Part 3 (Wind Loads), ASME STS-1 (Steel Stacks)';
    specs.software = 'AutoCAD, STAAD.Pro (Finite element chimney shell model)';
    specs.deliverables = 'Vortex shedding dynamic analysis reports, Helical strake layout sheets, Foundation reaction reports';
  } else if (category === 'Special Structures' || desc.toLowerCase().includes('shield') || desc.toLowerCase().includes('fixture')) {
    specs.codes = 'ASME Section VIII, AISC 360, IS 800 (Steel structures)';
    specs.software = 'AutoCAD, ANSYS (Lifting & structural integrity FEA)';
    specs.deliverables = 'Radiographic cordoning shielding design sheets, Heavy lifting rigging plans, FEA structural stress verification reports';
  }

  return specs;
}

export default function CaseStudy() {
  const params = useParams();
  const projectId = parseInt(params.id);

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
    initialData: fallbackProjects,
  });

  const project = projects?.find((p) => p.id === projectId);

  if (!project) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 bg-white">
        <ShieldCheck className="w-10 h-10 text-red-500" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Case Study Not Found</h2>
        <Link href="/projects" className="text-xs text-blue-700 underline font-bold uppercase tracking-widest">&larr; Back to Portfolio</Link>
      </div>
    );
  }

  const specs = getProjectTechnicalSpecs(project);

  return (
    <div className="w-full bg-white">
      <PageMeta
        title={`${project.title} — Case Study`}
        description={`Read the full structural engineering case study for "${project.title}" by SLS Consultants. Challenge description, design solutions, applicable codes, and engineering drawings.`}
      />

      <section className="bg-slate-50 border-b border-slate-200 py-12">
        <div className="container mx-auto px-4">
          <Link href="/projects" className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-[#0a1628] transition-colors mb-6 cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Projects
          </Link>
          <div className="max-w-3xl">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-blue-700 block mb-2">{project.category}</span>
            <h1 className="text-3xl md:text-5xl font-bold text-[#0a1628] leading-tight mb-4">{project.title}</h1>
            <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-xs text-gray-500 font-medium">
              <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-slate-400" /> Client: <strong>{project.client}</strong></span>
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-400" /> Year: <strong>{project.year}</strong></span>
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" /> Location: <strong>Visakhapatnam, India</strong></span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Case Study Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Image banner */}
            <div className="w-full h-80 sm:h-96 bg-gray-50 border border-gray-200 overflow-hidden rounded-sm flex items-center justify-center relative">
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="w-12 h-12 text-gray-200" />
              )}
            </div>

            {/* Content Blocks */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-black uppercase tracking-wider text-[#0a1628] border-l-3 border-[#0a1628] pl-3 mb-3">Project Summary</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{project.description}</p>
              </div>

              {project.challenge && (
                <div>
                  <h2 className="text-lg font-black uppercase tracking-wider text-[#0a1628] border-l-3 border-amber-600 pl-3 mb-3">The Challenge</h2>
                  <p className="text-sm text-gray-600 leading-relaxed bg-amber-50/20 border border-amber-100 p-4 rounded-sm">{project.challenge}</p>
                </div>
              )}

              {project.solution && (
                <div>
                  <h2 className="text-lg font-black uppercase tracking-wider text-[#0a1628] border-l-3 border-green-600 pl-3 mb-3">Our Solution</h2>
                  <p className="text-sm text-gray-600 leading-relaxed bg-green-50/20 border border-green-100 p-4 rounded-sm">{project.solution}</p>
                </div>
              )}

              {project.slsAction && (
                <div>
                  <h2 className="text-lg font-black uppercase tracking-wider text-[#0a1628] border-l-3 border-blue-600 pl-3 mb-3">Consulting Scope &amp; Deliverables</h2>
                  <p className="text-sm text-gray-600 leading-relaxed bg-blue-50/10 border border-blue-100 p-4 rounded-sm">{project.slsAction}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Technical Specifications Card */}
          <div className="lg:col-span-1">
            <div className="bg-slate-50 border border-slate-200 p-6 sticky top-24 rounded-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-5 pb-3 border-b border-slate-200 flex items-center gap-1.5">
                <ClipboardList className="w-4 h-4 text-slate-400" /> Engineering Specs
              </h3>

              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1">Applicable Codes</span>
                  <span className="text-xs font-medium text-gray-700 leading-relaxed block">{specs.codes}</span>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1">Design Software</span>
                  <span className="text-xs font-medium text-gray-700 leading-relaxed block">{specs.software}</span>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1">Deliverables Log</span>
                  <span className="text-xs font-medium text-gray-700 leading-relaxed block">{specs.deliverables}</span>
                </div>
                <div className="pt-4 border-t border-slate-200">
                  <div className="bg-[#0a1628]/5 p-4 border border-[#0a1628]/10 rounded-sm">
                    <h4 className="text-xs font-bold text-[#0a1628] mb-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" /> Need similar specs?
                    </h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed mb-3">
                      We offer full feasibility reviews and sizing calculations for similar projects.
                    </p>
                    <Link href={`/contact?service=${encodeURIComponent(project.category)}`}>
                      <button className="w-full bg-[#0a1628] hover:bg-[#1a2f4c] text-white py-2 text-[10px] font-bold uppercase tracking-wider transition-colors rounded-sm flex items-center justify-center gap-1">
                        Inquire Specs <ChevronRight className="w-3 h-3" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
