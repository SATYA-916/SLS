import { Link } from 'wouter';
import { Phone, Mail, Globe, MapPin, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0a1628] text-white">
      <div className="container mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <h3 className="text-lg font-bold mb-2">SLS Consultants</h3>
          <p className="text-xs text-white/50 uppercase tracking-widest mb-6">
            Engineering. Structures. Industrial Solutions. Since 2002.
          </p>
          <div className="flex gap-3">
            <a
              href="mailto:slsind@gmail.com"
              className="w-8 h-8 border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <Mail className="w-4 h-4" />
            </a>
            <a
              href="https://www.slsnexus.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <Globe className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="w-8 h-8 border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-white/40 mb-5">Quick Links</h4>
          <ul className="space-y-2.5 text-sm">
            {[
              { href: '/', label: 'Home' },
              { href: '/about', label: 'About Us' },
              { href: '/services', label: 'Services' },
              { href: '/projects', label: 'Projects' },
              { href: '/gallery', label: 'Gallery' },
              { href: '/vision', label: 'Vision' },
              { href: '/contact', label: 'Contact' },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-white/60 hover:text-white transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-white/40 mb-5">Our Services</h4>
          <ul className="space-y-2.5 text-sm text-white/60">
            <li>Project Consultancy</li>
            <li>Special Products Design & Manufacturing</li>
            <li>RLA Studies</li>
            <li>Structural Engineering</li>
            <li>FEM Analysis</li>
            <li>Steel Detailing (Tekla)</li>
            <li>Liaisoning</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-white/40 mb-5">Contact Info</h4>
          <ul className="space-y-3.5 text-sm text-white/60">
            <li className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 shrink-0 mt-0.5 text-[#43648e]" />
              <span>+91 98495 98424</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 shrink-0 mt-0.5 text-[#43648e]" />
              <span>slsind@gmail.com</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Globe className="w-4 h-4 shrink-0 mt-0.5 text-[#43648e]" />
              <span>www.slsnexus.com</span>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-[#43648e]" />
              <span>Visakhapatnam, Andhra Pradesh, India</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/30">
          <p>© 2025 SLS Consultants. All Rights Reserved.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>|</span>
            <Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
            <span>|</span>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
            <span>|</span>
            <Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
            <span>|</span>
            <Link href="/admin" className="hover:text-white/60 transition-colors text-white/20">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
