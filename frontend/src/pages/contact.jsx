import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Phone, Mail, Globe, MapPin, CheckCircle2, Clock, ShieldCheck, Zap, CalendarDays, X, Video, FileText } from 'lucide-react';
import { submitContact, getServices } from '@/lib/api';
import { toast } from '@/components/ui/toaster';
import { PageMeta } from '@/components/PageMeta';

// ── Calendly Configuration ──────────────────────────────────────────────────
// Replace this URL with your actual Calendly link once you create a free account
// at https://calendly.com  →  copy your personal scheduling link here
const CALENDLY_URL = 'https://calendly.com/zywu801/30min';

// Hook: dynamically loads Calendly widget script + CSS once
function useCalendly() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Load Calendly CSS
    if (!document.getElementById('calendly-css')) {
      const link = document.createElement('link');
      link.id   = 'calendly-css';
      link.rel  = 'stylesheet';
      link.href = 'https://assets.calendly.com/assets/external/widget.css';
      document.head.appendChild(link);
    }
    // Load Calendly JS
    if (!document.getElementById('calendly-js')) {
      const script  = document.createElement('script');
      script.id     = 'calendly-js';
      script.src    = 'https://assets.calendly.com/assets/external/widget.js';
      script.async  = true;
      script.onload = () => setReady(true);
      document.body.appendChild(script);
    } else if (window.Calendly) {
      setReady(true);
    }
  }, []);

  const openPopup = useCallback(() => {
    try {
      if (window.Calendly) {
        window.Calendly.initPopupWidget({ url: CALENDLY_URL });
      } else {
        window.open(CALENDLY_URL, '_blank');
      }
    } catch (e) {
      window.open(CALENDLY_URL, '_blank');
    }
  }, []);

  return { openPopup };
}

const fallbackServices = [
  'ASME Boiler & Pressure Vessel Design',
  'STAAD.Pro Structural Steel Analysis',
  'Tekla Fabrication & Steel Detailing',
  'API 560 Fired Heater General Arrangement',
  'EIL Compliance Drawing Scoping',
  'FEM/FEA Stress Verification',
  'Remaining Life Assessment (RLA) Study',
  'Other Services & Scoping Inquiry'
];

function validate(data) {
  const errors = {};
  if (!data.name?.trim()) errors.name = 'Name is required';
  if (!data.email?.trim()) errors.email = 'Email is required';
  else if (!/\S+@\S+\.\S+/.test(data.email)) errors.email = 'Enter a valid email';
  if (!data.message?.trim() || data.message.trim().length < 10)
    errors.message = 'Message must be at least 10 characters';
  return errors;
}

function getInitialMessageForService(serviceName) {
  if (!serviceName) return '';
  return `I would like to inquire about your "${serviceName}" engineering services. Please coordinate a technical discussion or share drawing layouts so we can align on standard compliance (ASME/API/IS) and scoping timelines.`;
}

export default function Contact() {
  const { openPopup } = useCalendly();
  const [submitted, setSubmitted] = useState(false);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const serviceSelectRef = useRef(null);
  const formContainerRef = useRef(null);
  const [highlightForm, setHighlightForm] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleScrollToForm = () => {
    const formEl = document.getElementById('contact-form');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setHighlightForm(true);
      setTimeout(() => {
        setHighlightForm(false);
      }, 2000);
      setTimeout(() => {
        if (serviceSelectRef.current) {
          serviceSelectRef.current.focus();
        }
      }, 850);
    }
  };
  
  // Parse URL query parameter for service pre-selection
  const queryParams = new URLSearchParams(window.location.search);
  const initialService = queryParams.get('service') || '';
  const initialMessage = initialService ? getInitialMessageForService(initialService) : '';

  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', service: initialService, message: initialMessage, targetCodes: '' });
  const [errors, setErrors] = useState({});
  const [wizardStep, setWizardStep] = useState(1);

  // Auto-scroll directly to form on service pre-selection
  useEffect(() => {
    if (initialService) {
      const timer = setTimeout(() => {
        const formEl = document.getElementById('contact-form');
        if (formEl) {
          formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setHighlightForm(true);
          setTimeout(() => {
            setHighlightForm(false);
          }, 2000);
          setTimeout(() => {
            if (serviceSelectRef.current) {
              serviceSelectRef.current.focus();
            }
          }, 850);
        }
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [initialService]);

  // Query database services dynamically
  const { data: dbServices } = useQuery({
    queryKey: ['services'],
    queryFn: getServices,
  });

  // Build the list of services for the dropdown dynamically
  const dropdownServices = useMemo(() => {
    const list = new Set();
    
    // 1. Add any dynamically loaded services from the backend
    if (dbServices && Array.isArray(dbServices)) {
      dbServices.forEach(s => {
        if (s.title) list.add(s.title);
      });
    }
    
    // 2. Add fallback services from fallbackServices data file (the core ones)
    const coreServices = [
      'Industrial Fired Heater Engineering',
      'Civil & Structural Engineering',
      'Building Structural Design',
      'Industrial Equipment Engineering',
      'Engineering Drawings & Shop Drawings',
      'Structural Steel Design & Detailing',
      'Shop Drawings & Fabrication Drawings',
      'Platform, Staircase, Ladder & Access Structure Design',
      'Chimney & Stack Engineering',
      'Foundation Engineering',
      'Construction Supervision',
      'Municipality Relation Services',
      'Remaining Life Assessment (RLA)',
      'Finite Element Analysis (FEA)',
      'Piping Support & Structural Support Design'
    ];
    coreServices.forEach(s => list.add(s));

    // 3. Add the old detailed contact-form specific options
    const detailServices = [
      'ASME Boiler & Pressure Vessel Design',
      'STAAD.Pro Structural Steel Analysis',
      'Tekla Fabrication & Steel Detailing',
      'API 560 Fired Heater General Arrangement',
      'EIL Compliance Drawing Scoping',
      'FEM/FEA Stress Verification',
      'Remaining Life Assessment (RLA) Study',
      'Other Services & Scoping Inquiry'
    ];
    detailServices.forEach(s => list.add(s));

    // 4. Ensure initialService is in the list
    if (initialService) {
      list.add(initialService);
    }

    return Array.from(list);
  }, [dbServices, initialService]);

  const mutation = useMutation({
    mutationFn: submitContact,
    onSuccess: () => {
      if (window.__uploadInterval) clearInterval(window.__uploadInterval);
      setUploadProgress(100);
      setTimeout(() => {
        setIsUploading(false);
        setSubmitted(true);
      }, 400);
    },
    onError: () => {
      if (window.__uploadInterval) clearInterval(window.__uploadInterval);
      setIsUploading(false);
      setUploadProgress(0);
    }
  });

  function handleChange(e) {
    if (e.target.name === 'service') {
      const selectedSvc = e.target.value;
      setForm((prev) => {
        const currentMsg = prev.message.trim();
        const wasEmpty = !currentMsg;
        const isDefaultTemplate = prev.service && currentMsg === getInitialMessageForService(prev.service);
        
        return {
          ...prev,
          service: selectedSvc,
          message: (wasEmpty || isDefaultTemplate) ? getInitialMessageForService(selectedSvc) : prev.message
        };
      });
      if (errors.service) setErrors((prev) => ({ ...prev, service: '' }));
      return;
    }

    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 15 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 15MB.",
          variant: "destructive",
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      if (selectedFile.size > 15 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 15MB.",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateStep1 = () => {
    const errs = {};
    if (!form.name?.trim()) errs.name = 'Name is required';
    if (!form.email?.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!form.service) errs.service = 'Please select a service';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  function handleSubmit(e) {
    e.preventDefault();
    if (wizardStep === 1) {
      if (validateStep1()) setWizardStep(2);
      return;
    }
    if (wizardStep === 2) {
      if (validateStep2()) setWizardStep(3);
      return;
    }

    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const messageWithCodes = form.targetCodes?.trim()
      ? `${form.message}\n\n[Design Codes: ${form.targetCodes.trim()}]`
      : form.message;

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('email', form.email);
    formData.append('phone', form.phone || '');
    formData.append('company', form.company || '');
    formData.append('service', form.service || '');
    formData.append('message', messageWithCodes);
    
    if (file) {
      formData.append('file', file);
      
      // Start upload progress simulation
      setIsUploading(true);
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 92) {
            clearInterval(interval);
            return 92;
          }
          return prev + Math.floor(Math.random() * 8) + 4;
        });
      }, 100);
      
      window.__uploadInterval = interval;
    }

    mutation.mutate(formData);
  }

  return (
    <div className="w-full">
      <PageMeta title="Contact Us" description="Get in touch with SLS Consultants for structural engineering, fired heater design, RLA studies, and FEM analysis. Based in Visakhapatnam, India. Call +91 98495 98424 or email slsind@gmail.com." />
      {/* Hero Section */}
      <section className="bg-slate-50 text-[#0a1628] pt-20 pb-12 relative overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-slate-400 mb-3">Global Engineering Delivery Center</p>
            <h1 className="text-3xl md:text-5xl font-extrabold max-w-3xl leading-tight mb-4 text-[#0a1628] mx-auto tracking-tight">
              Let's Discuss Your Engineering Project
            </h1>
            <p className="text-slate-500 text-xs md:text-sm max-w-xl leading-relaxed mx-auto font-medium">
              Choose the approach that best suits your project. Schedule a consultation with our engineers or submit your project details for a detailed technical review.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Two Consultation Method Cards */}
      <section className="bg-white border-b border-slate-100 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            
            {/* Left Card: 30-Minute Consultation */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 p-8 shadow-sm hover:shadow-md transition-all duration-300 rounded-sm flex flex-col justify-between hover:-translate-y-0.5 group cursor-default"
            >
              <div>
                <div className="w-12 h-12 rounded-full bg-[#0a1628]/5 flex items-center justify-center text-[#0a1628] mb-6 group-hover:scale-105 transition-transform duration-300">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#0a1628] mb-2">30-Minute Engineering Consultation</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-6">
                  Discuss your project requirements directly with our engineering team.
                </p>
                <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-6 bg-slate-100/60 inline-block px-2.5 py-1 rounded-sm">
                  Response expectation: Instant Scheduling
                </div>
              </div>
              <button
                id="calendly-book-btn"
                onClick={openPopup}
                className="w-full bg-[#0a1628] hover:bg-[#13233c] text-white py-3.5 px-6 font-bold uppercase tracking-widest text-[10px] shadow-sm hover:shadow transition-all duration-200 text-center flex items-center justify-center gap-2 rounded-sm"
              >
                <CalendarDays className="w-4 h-4" /> Book a Call →
              </button>
            </motion.div>

            {/* Right Card: Submit Project Details */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 p-8 shadow-sm hover:shadow-md transition-all duration-300 rounded-sm flex flex-col justify-between hover:-translate-y-0.5 group cursor-default"
            >
              <div>
                <div className="w-12 h-12 rounded-full bg-[#43648e]/10 flex items-center justify-center text-[#43648e] mb-6 group-hover:scale-105 transition-transform duration-300">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#0a1628] mb-2">Submit Your Project Requirements</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Share your project scope, drawings, specifications, and engineering requirements. Our team will review your submission and respond with the appropriate technical guidance.
                </p>
                
                {/* 4 Process Preview Steps */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 my-4 pt-4 border-t border-slate-100 text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                  <span className="flex items-center gap-1.5 text-[#43648e]/80"><CheckCircle2 className="w-3.5 h-3.5 text-[#43648e]" /> Select a Service</span>
                  <span className="flex items-center gap-1.5 text-[#43648e]/80"><CheckCircle2 className="w-3.5 h-3.5 text-[#43648e]" /> Describe Project</span>
                  <span className="flex items-center gap-1.5 text-[#43648e]/80"><CheckCircle2 className="w-3.5 h-3.5 text-[#43648e]" /> Upload Drawings</span>
                  <span className="flex items-center gap-1.5 text-[#43648e]/80"><CheckCircle2 className="w-3.5 h-3.5 text-[#43648e]" /> Tech Response</span>
                </div>
              </div>
              <button
                onClick={handleScrollToForm}
                className="w-full border border-slate-300 bg-white hover:bg-slate-50 text-[#0a1628] py-3.5 px-6 font-bold uppercase tracking-widest text-[10px] transition-all duration-200 text-center flex items-center justify-center gap-1.5 rounded-sm"
              >
                Complete the Form Below &darr;
              </button>
            </motion.div>

          </div>
        </div>
      </section>

      <section id="contact-form" className="py-20 bg-white">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-2xl font-bold text-[#0a1628] mb-2">Connect with Our Engineering Office</h2>
            <p className="text-sm text-gray-500 mb-8">Reach out through any channel — or submit your project details using the form.</p>
            <div className="space-y-5 mb-10">
              {[
                { icon: <Phone className="w-5 h-5 text-[#43648e] mt-0.5 shrink-0" />, label: 'Phone', value: '+91 98495 98424' },
                { icon: <Mail className="w-5 h-5 text-[#43648e] mt-0.5 shrink-0" />, label: 'Email', value: 'slsind@gmail.com\nslsvizag@gmail.com' },
                { icon: <Globe className="w-5 h-5 text-[#43648e] mt-0.5 shrink-0" />, label: 'Website', value: 'www.slsnexus.com' },
                { icon: <MapPin className="w-5 h-5 text-[#43648e] mt-0.5 shrink-0" />, label: 'Address', value: 'Visakhapatnam, Andhra Pradesh, India' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  {item.icon}
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{item.label}</p>
                    {item.value.split('\n').map((v) => (
                      <p key={v} className="text-sm font-medium text-gray-900">{v}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Embedded Google Map */}
            <div className="w-full h-56 bg-gray-100 border border-gray-200 shadow-sm relative overflow-hidden rounded-sm mb-10">
              <iframe
                title="SLS Consultants Office Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d121634.3411132644!2d83.136284!3d17.729263!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a39431389e6973f%3A0x92d9d69106cd2c4f!2sVisakhapatnam%2C+Andhra+Pradesh!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            
            <div className="bg-[#0a1628]/5 p-8 border-l-2 border-[#0a1628] rounded-sm">
              <h3 className="font-bold text-base text-[#0a1628] mb-5">Our Consultation Process</h3>
              <div className="space-y-5">
                {[
                  { step: "01", title: "Submit Specifications & Details", desc: "Share your scoping data and layout requirements. Confidential project information is handled securely." },
                  { step: "02", title: "Technical Scoping Call", desc: "Schedule a video scoping call with Mr. Subrahmanyam to align on connection codes and design standards." },
                  { step: "03", title: "Proposal Dispatch", desc: "Receive a detailed commercial proposal and drawing delivery schedule within 48 hours." }
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-[#0a1628] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#0a1628] mb-1">{item.title}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            ref={formContainerRef}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`p-6 md:p-8 rounded-lg transition-all duration-500 border ${
              highlightForm
                ? 'bg-blue-50/30 border-blue-500 shadow-xl scale-[1.01] ring-4 ring-blue-500/10'
                : 'bg-transparent border-transparent'
            }`}
          >
            {submitted ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center py-16">
                  <CheckCircle2 className="w-14 h-14 text-[#43648e] mx-auto mb-5" />
                  <h3 className="text-2xl font-bold text-[#0a1628] mb-3">Inquiry Received</h3>
                  <p className="text-gray-500 text-sm">
                    Thank you for contacting SLS Consultants. We will review your inquiry and get back to you shortly.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Stepped progress indicator */}
                <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                  {[
                    { nr: 1, label: 'Company Info' },
                    { nr: 2, label: 'Engineering Scope' },
                    { nr: 3, label: 'Message & Upload' }
                  ].map((s) => (
                    <div key={s.nr} className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors ${
                          wizardStep === s.nr
                            ? 'bg-[#0a1628] border-[#0a1628] text-white'
                            : wizardStep > s.nr
                            ? 'bg-green-600 border-green-600 text-white'
                            : 'bg-white border-gray-200 text-gray-400'
                        }`}
                      >
                        {wizardStep > s.nr ? '✓' : s.nr}
                      </div>
                      <span
                        className={`text-[9px] font-extrabold uppercase tracking-wider hidden sm:inline ${
                          wizardStep === s.nr ? 'text-[#0a1628]' : 'text-gray-400'
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Step 1: Company Profile */}
                {wizardStep === 1 && (
                  <div className="space-y-5 animate-fade-in">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 block">Name *</label>
                        <input
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#0a1628] transition-colors"
                          placeholder="Your name"
                        />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 block">Email *</label>
                        <input
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#0a1628] transition-colors"
                          placeholder="your@email.com"
                        />
                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 block">Phone</label>
                        <input
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#0a1628] transition-colors"
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 block">Company</label>
                        <input
                          name="company"
                          value={form.company}
                          onChange={handleChange}
                          className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#0a1628] transition-colors"
                          placeholder="Your company"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Engineering Scope */}
                {wizardStep === 2 && (
                  <div className="space-y-5 animate-fade-in">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 block flex items-center justify-between">
                        <span>Required Service *</span>
                      </label>
                      <select
                        ref={serviceSelectRef}
                        name="service"
                        value={form.service}
                        onChange={handleChange}
                        className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#0a1628] transition-colors bg-white text-gray-800"
                      >
                        <option value="">Select a service</option>
                        {dropdownServices.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {errors.service && <p className="text-xs text-red-500 mt-1">{errors.service}</p>}
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 block">
                        Target Codes &amp; Standards (e.g. ASME VIII, API 560, IS 800)
                      </label>
                      <input
                        name="targetCodes"
                        value={form.targetCodes}
                        onChange={handleChange}
                        className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#0a1628] transition-colors"
                        placeholder="ASME Sec VIII, API 560, IS 800, EIL specs..."
                      />
                      <span className="text-[10px] text-gray-400 block mt-1">Conforming design criteria ensures project safety compliance.</span>
                    </div>
                  </div>
                )}

                {/* Step 3: Message & Drawings Upload */}
                {wizardStep === 3 && (
                  <div className="space-y-5 animate-fade-in">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 block">
                        Upload Specifications / Drawings Layouts
                      </label>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf,.dwg,.dxf,.png,.jpg,.jpeg,.zip,.rar"
                      />
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        className="border border-dashed border-gray-300 p-5 text-center bg-gray-50 flex flex-col items-center justify-center rounded-sm hover:border-[#0a1628] transition-colors cursor-pointer"
                      >
                        {file ? (
                          <div className="flex flex-col items-center">
                            <CheckCircle2 className="w-6 h-6 text-green-600 mb-1.5" />
                            <span className="text-xs font-semibold text-gray-700 block max-w-[280px] truncate">
                              {file.name}
                            </span>
                            <span className="text-[10px] text-gray-400 mt-0.5">
                              ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                            </span>
                            <button
                              type="button"
                              onClick={handleRemoveFile}
                              className="mt-2 text-[10px] text-red-500 hover:text-red-700 underline font-bold uppercase tracking-wider"
                            >
                              Remove File
                            </button>
                          </div>
                        ) : (
                          <>
                            <ShieldCheck className="w-6 h-6 text-gray-400 mb-1.5" />
                            <span className="text-xs font-semibold text-gray-600 block">Drag &amp; Drop specification files here, or browse</span>
                            <span className="text-[10px] text-gray-400 mt-1">Confidential project layouts handled securely. Max size 15MB.</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 block">Inquiry Description *</label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows={4}
                        className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#0a1628] transition-colors resize-none"
                        placeholder="Describe your design parameters or scope requirements..."
                      />
                      {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                    </div>
                  </div>
                )}

                {isUploading && (
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#43648e]">
                      <span>Uploading Specifications...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200">
                      <div
                        className="bg-blue-600 h-full transition-all duration-300 ease-out animate-pulse"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {mutation.isError && (
                  <p className="text-xs text-red-500">Failed to submit enquiry. Please check your network and try again.</p>
                )}

                {/* Navigation controls */}
                <div className="flex justify-between items-center gap-4 pt-4 border-t border-slate-100">
                  {wizardStep > 1 ? (
                    <button
                      type="button"
                      onClick={() => setWizardStep((s) => s - 1)}
                      className="border border-slate-300 text-gray-600 hover:bg-slate-50 py-3 px-6 text-xs font-bold uppercase tracking-wider transition-colors rounded-sm"
                    >
                      Back
                    </button>
                  ) : (
                    <div />
                  )}

                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className={`text-white py-3.5 px-8 text-xs font-bold uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 rounded-sm ${
                      mutation.isPending
                        ? 'bg-slate-400 cursor-not-allowed opacity-80'
                        : 'bg-[#0a1628] hover:bg-[#1a2f4c]'
                    }`}
                  >
                    {mutation.isPending ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-t-transparent border-white rounded-full animate-spin" />
                        {isUploading ? 'Uploading Drawings...' : 'Submitting Enquiry...'}
                      </>
                    ) : wizardStep < 3 ? (
                      'Next Step →'
                    ) : (
                      'Submit Inquiry →'
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
