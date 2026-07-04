import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Phone, Mail, Globe, MapPin, CheckCircle2, Clock, ShieldCheck, Zap, CalendarDays, X, Video } from 'lucide-react';
import { submitContact, getServices } from '@/lib/api';
import { toast } from '@/components/ui/toaster';

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
    if (window.Calendly) {
      window.Calendly.initPopupWidget({ url: CALENDLY_URL });
    } else {
      // Fallback: open Calendly directly in new tab if script blocked
      window.open(CALENDLY_URL, '_blank', 'noopener,noreferrer');
    }
  }, [ready]);

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
  
  // Parse URL query parameter for service pre-selection
  const queryParams = new URLSearchParams(window.location.search);
  const initialService = queryParams.get('service') || '';
  const initialMessage = initialService ? getInitialMessageForService(initialService) : '';

  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', service: initialService, message: initialMessage });
  const [errors, setErrors] = useState({});

  // Auto-scroll directly to form on service pre-selection
  useEffect(() => {
    if (initialService) {
      const timer = setTimeout(() => {
        const formEl = document.getElementById('contact-form');
        if (formEl) {
          formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
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
      'Blueprint Design',
      'Industrial Design & Support',
      'Engineering & Architecture Design',
      'Construction Supervision',
      'Municipality Relation Services',
      'Remaining Life Assessment (RLA)',
      'Software & AI Solutions',
      'Finite Element Analysis (FEA)',
      'Piping Design & Stress Analysis'
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
    onSuccess: () => setSubmitted(true),
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

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('email', form.email);
    formData.append('phone', form.phone || '');
    formData.append('company', form.company || '');
    formData.append('service', form.service || '');
    formData.append('message', form.message);
    if (file) {
      formData.append('file', file);
    }

    mutation.mutate(formData);
  }

  return (
    <div className="w-full">
      <section className="bg-slate-50 text-[#0a1628] py-20 relative overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-slate-500 mb-4">Global Engineering Delivery Center</p>
            <h1 className="text-4xl md:text-6xl font-bold max-w-3xl leading-tight mb-5 text-[#0a1628]">
              Request an Engineering<br />Consultation.
            </h1>
            <p className="text-slate-600 text-sm md:text-base max-w-xl leading-relaxed mb-8">
              Providing round-the-clock design and detailing support. Fill in the form — we will study your requirements and get back to you to schedule a technical scoping discussion.
            </p>
            <div className="flex flex-wrap gap-6">
              {[
                { icon: <Clock className="w-4 h-4" />, text: 'Timezone-neutral communication' },
                { icon: <ShieldCheck className="w-4 h-4" />, text: 'ASME & API code compliance' },
                { icon: <Zap className="w-4 h-4" />, text: 'Coordinated engineering packages' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="text-[#43648e]">{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Direct Scheduling Strip (Replaced redundant RFQ card) ── */}
      <section className="bg-white border-b border-slate-200 py-6">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-slate-50 border border-slate-200 rounded-sm"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
                <CalendarDays className="w-5 h-5 text-[#43648e]" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Direct Scheduling</p>
                <h3 className="text-base font-bold text-[#0a1628] mb-1">Book a Consultation Call</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Pick a time slot — 30‑min technical scoping session with Mr. Subrahmanyam.
                </p>
              </div>
            </div>
            <button
              id="calendly-book-btn"
              onClick={openPopup}
              className="shrink-0 bg-[#0a1628] hover:bg-[#1a2f4c] text-white px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 rounded-sm whitespace-nowrap"
            >
              <CalendarDays className="w-3.5 h-3.5" /> Book a Slot
            </button>
          </motion.div>
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

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
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
              <form onSubmit={handleSubmit} className="space-y-5">
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
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 block">Service Required</label>
                  <select
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#0a1628] transition-colors bg-white"
                  >
                    <option value="">Select a service</option>
                    {dropdownServices.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 block">
                    Upload Drawings & Specifications (Optional)
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
                        <span className="text-xs font-semibold text-gray-600 block">Drag & Drop files here, or browse</span>
                        <span className="text-[10px] text-gray-400 mt-1">Confidential project information handled securely. Max size 15MB.</span>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 block">Message *</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#0a1628] transition-colors resize-none"
                    placeholder="Describe your project or inquiry..."
                  />
                  {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                </div>
                {mutation.isError && (
                  <p className="text-xs text-red-500">Failed to send inquiry. Please try again or contact us directly.</p>
                )}
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full bg-[#0a1628] text-white py-4 text-sm font-bold uppercase tracking-wider hover:bg-[#0a1628]/90 transition-colors disabled:opacity-60"
                >
                  {mutation.isPending ? 'Sending...' : 'Request My Free Consultation →'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
