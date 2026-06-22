import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { Phone, Mail, Globe, MapPin, CheckCircle2, Clock, ShieldCheck, Zap } from 'lucide-react';
import { submitContact } from '@/lib/api';

const services = [
  'Structural Engineering',
  'Industrial Projects',
  'FEM Analysis',
  'RLA Studies',
  'Project Consultancy',
  'Steel Detailing (Tekla)',
  'Software & AI Solutions',
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
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', service: '', message: '' });
  const [errors, setErrors] = useState({});

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
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    mutation.mutate({
      ...form,
      phone: form.phone || null,
      company: form.company || null,
      service: form.service || null,
    });
  }

  return (
    <div className="w-full">
      <section className="bg-[#0a1628] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Free Consultation — No Obligation</p>
            <h1 className="text-4xl md:text-6xl font-bold max-w-3xl leading-tight mb-5">
              Tell Us About<br />Your Project.
            </h1>
            <p className="text-white/60 text-sm md:text-base max-w-xl leading-relaxed mb-8">
              Our engineers have delivered 500+ projects across India. Fill in the form — we'll study your requirements and get back to you within 24 hours with expert guidance.
            </p>
            <div className="flex flex-wrap gap-6">
              {[
                { icon: <Clock className="w-4 h-4" />, text: 'Response within 24 hours' },
                { icon: <ShieldCheck className="w-4 h-4" />, text: '20+ years of expertise' },
                { icon: <Zap className="w-4 h-4" />, text: 'Cost-effective solutions' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2 text-xs text-white/50">
                  <span className="text-[#43648e]">{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-2xl font-bold text-[#0a1628] mb-2">Talk to Our Engineers</h2>
            <p className="text-sm text-gray-500 mb-8">Reach out through any channel — or simply fill the form on the right.</p>
            <div className="space-y-5 mb-10">
              {[
                { icon: <Phone className="w-5 h-5 text-[#43648e] mt-0.5 shrink-0" />, label: 'Phone', value: '+91 98495 98424' },
                { icon: <Mail className="w-5 h-5 text-[#43648e] mt-0.5 shrink-0" />, label: 'Email', value: 'slsind@gmail.com' },
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
            <div className="bg-gray-50 p-6 border-l-2 border-[#43648e]">
              <p className="text-sm text-gray-500 leading-relaxed font-medium mb-3">Why fill the form?</p>
              <div className="space-y-2">
                {[
                  'We respond to every inquiry personally — no bots.',
                  'Your project details go straight to our lead engineer.',
                  'Get a tailored quote, not a generic brochure.',
                ].map((point) => (
                  <div key={point} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#43648e] mt-0.5 shrink-0" />
                    <p className="text-sm text-gray-500">{point}</p>
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
                    {services.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
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
