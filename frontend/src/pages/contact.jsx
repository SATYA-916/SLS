import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Phone, Mail, Globe, MapPin, CheckCircle2, X } from 'lucide-react';
import { submitContact, getServices } from '@/lib/api';

const fallbackServices = [
  'Blueprint Design',
  'Industrial Design & Support',
  'Engineering & Architecture Design',
  'Construction Supervision',
  'Municipality Relation Services',
  'Remaining Life Assessment (RLA)',
  'Software & AI Solutions',
  "Project Management & Owner's Engineering",
  'Other',
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

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  
  // Parse URL query parameter for service pre-selection
  const queryParams = new URLSearchParams(window.location.search);
  const initialService = queryParams.get('service') || '';

  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', service: initialService, message: '' });
  const [errors, setErrors] = useState({});

  // Query database services dynamically
  const { data: dbServices } = useQuery({
    queryKey: ['services'],
    queryFn: getServices,
  });

  const dropdownServices = dbServices 
    ? [...dbServices.map((s) => s.title), 'Other'] 
    : fallbackServices;

  const mutation = useMutation({
    mutationFn: submitContact,
    onSuccess: () => setSubmitted(true),
  });

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    mutation.mutate(form);
  }

  return (
    <div className="w-full bg-white">
      {/* HEADER */}
      <section className="bg-[#0a1628] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="contact_grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#contact_grid)" />
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Contact Us</p>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight max-w-2xl">
              Connect With Our Engineering Team
            </h1>
          </motion.div>
        </div>
      </section>

      {/* TWO-COLUMN CONTACT BLOCK */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* LEFT COLUMN: Contact Cards & Google Maps */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 space-y-6"
            >
              <div className="bg-white border border-gray-200 p-8 shadow-sm">
                <h2 className="text-xl font-bold text-[#0a1628] mb-1">Visakhapatnam HQ</h2>
                <p className="text-xs text-gray-400 mb-6">Principal Office & Engineering Detailing Hub</p>
                
                <div className="space-y-6">
                  {[
                    { icon: <Phone className="w-5 h-5 text-[#43648e] shrink-0 mt-0.5" />, label: 'Phone Support', value: '+91 98495 98424' },
                    { icon: <Mail className="w-5 h-5 text-[#43648e] shrink-0 mt-0.5" />, label: 'Inquiries Email', value: 'slsind@gmail.com' },
                    { icon: <Globe className="w-5 h-5 text-[#43648e] shrink-0 mt-0.5" />, label: 'Corporate Website', value: 'www.slsnexus.com' },
                    { icon: <MapPin className="w-5 h-5 text-[#43648e] shrink-0 mt-0.5" />, label: 'Headquarters Address', value: 'Visakhapatnam, Andhra Pradesh, India' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-50/50 flex items-center justify-center rounded-full shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider block mb-0.5">{item.label}</span>
                        <span className="text-sm font-semibold text-[#0a1628]">{item.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Google Maps Integration (Visakhapatnam coordinates) */}
              <div className="bg-white border border-gray-200 p-2 shadow-sm rounded-sm overflow-hidden aspect-video relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d121639.46781254332!2d83.15613328227655!3d17.714249673892706!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a39431389e6973f%3A0x92d9d1ec9c12b1ec!2sVisakhapatnam%2C%20Andhra%20Pradesh%2C%20India!5e0!3m2!1sen!2sus!4v1719927600000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="SLS Headquarters Map"
                  className="w-full h-full opacity-90"
                />
              </div>
            </motion.div>

            {/* RIGHT COLUMN: Inquiry Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 bg-white border border-gray-200 p-8 md:p-10 shadow-sm"
            >
              {submitted ? (
                <div className="py-20 text-center">
                  <CheckCircle2 className="w-14 h-14 text-blue-600 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-[#0a1628] mb-3">Project Inquiry Received</h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                    Thank you for contacting SLS Consultants. A senior design engineer will review your project parameters and get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-8 border border-gray-300 text-gray-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="border-b border-gray-100 pb-4 mb-4">
                    <h3 className="text-lg font-bold text-[#0a1628]">Project Consultation Form</h3>
                    <p className="text-xs text-gray-400 mt-1">Fields marked with (*) are required for sizing and quotation purposes.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">Full Name *</label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className={`w-full border px-4 py-3 text-xs focus:outline-none transition-colors rounded-sm ${
                          errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#0a1628]'
                        }`}
                        placeholder="Your name"
                      />
                      {errors.name && <p className="text-[10px] text-red-500 mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">Corporate Email *</label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        className={`w-full border px-4 py-3 text-xs focus:outline-none transition-colors rounded-sm ${
                          errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#0a1628]'
                        }`}
                        placeholder="corporate@email.com"
                      />
                      {errors.email && <p className="text-[10px] text-red-500 mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">Contact Phone</label>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full border border-gray-200 px-4 py-3 text-xs focus:outline-none focus:border-[#0a1628] transition-colors rounded-sm"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">Company Name</label>
                      <input
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        className="w-full border border-gray-200 px-4 py-3 text-xs focus:outline-none focus:border-[#0a1628] transition-colors rounded-sm"
                        placeholder="Your company"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">Service Category Required</label>
                    <select
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                      className="w-full border border-gray-200 px-4 py-3 text-xs focus:outline-none focus:border-[#0a1628] transition-colors bg-white rounded-sm cursor-pointer"
                    >
                      <option value="">Select a service category</option>
                      {dropdownServices.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">Scope & Specifications *</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      className={`w-full border px-4 py-3 text-xs focus:outline-none transition-colors resize-none rounded-sm ${
                        errors.message ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#0a1628]'
                      }`}
                      placeholder="Please provide dimensions, pressure conditions, design codes (ASME, API, IS), or general scope..."
                    />
                    {errors.message && <p className="text-[10px] text-red-500 mt-1">{errors.message}</p>}
                  </div>

                  {mutation.isError && (
                    <p className="text-xs text-red-500">Failed to send. Please verify connections and try again.</p>
                  )}

                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full bg-[#0a1628] text-white hover:bg-blue-700 py-4 text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-60 rounded-sm shadow-sm"
                  >
                    {mutation.isPending ? 'Submitting Details...' : 'Request Free Engineering Consultation →'}
                  </button>
                </form>
              )}
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
}
