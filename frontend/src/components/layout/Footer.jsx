import { Link } from 'wouter';
import { Phone, Mail, Globe, MapPin, Linkedin } from 'lucide-react';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-800">
      <div className="container mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <h3 className="text-lg font-bold mb-2 text-[#0a1628]">SLS Consultants</h3>
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-6">
            Engineering. Structures. Industrial Solutions. Since 2002.
          </p>
          <div className="flex gap-3">
            <a
              href="mailto:slsind@gmail.com"
              rel="external"
              aria-label="Email SLS Consultants"
              className="w-8 h-8 border border-slate-300 text-slate-600 flex items-center justify-center hover:bg-slate-200/50 hover:text-[#0a1628] transition-colors"
            >
              <Mail className="w-4 h-4" />
            </a>
            <a
              href="https://www.slsnexus.com"
              target="_blank"
              rel="noreferrer"
              aria-label="SLS Nexus website"
              className="w-8 h-8 border border-slate-300 text-slate-600 flex items-center justify-center hover:bg-slate-200/50 hover:text-[#0a1628] transition-colors"
            >
              <Globe className="w-4 h-4" />
            </a>
            <a
              href="https://wa.me/919849598424"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp SLS Consultants"
              className="w-8 h-8 border border-slate-300 text-slate-600 flex items-center justify-center hover:bg-slate-200/50 hover:text-[#0a1628] transition-colors"
            >
              {/* WhatsApp icon */}
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-slate-500 mb-5">Quick Links</h4>
          <ul className="space-y-2.5 text-sm">
            {[
              { href: '/', label: 'Home' },
              { href: '/about', label: 'About Us' },
              { href: '/services', label: 'Services' },
              { href: '/projects', label: 'Projects' },
              { href: '/codes', label: 'Codes & Standards' },
              { href: '/gallery', label: 'Gallery' },
              { href: '/contact', label: 'Contact' },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-slate-600 hover:text-[#0a1628] transition-colors font-medium">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-slate-500 mb-5">Our Services</h4>
          <ul className="space-y-2.5 text-sm text-slate-600 font-medium">
            <li>Project Consultancy</li>
            <li>Special Products Design &amp; Manufacturing</li>
            <li>RLA Studies</li>
            <li>Structural Engineering</li>
            <li>FEM Analysis</li>
            <li>Steel Detailing (Tekla)</li>
            <li>Liaisoning</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-slate-500 mb-5">Contact Info</h4>
          <ul className="space-y-3.5 text-sm text-slate-600 font-medium">
            <li className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 shrink-0 mt-0.5 text-[#43648e]" />
              <a href="tel:+919849598424" className="hover:text-[#0a1628] transition-colors">+91 98495 98424</a>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 shrink-0 mt-0.5 text-[#43648e]" />
              <a href="mailto:slsind@gmail.com" className="hover:text-[#0a1628] transition-colors">slsind@gmail.com</a>
            </li>
            <li className="flex items-start gap-2.5">
              <Globe className="w-4 h-4 shrink-0 mt-0.5 text-[#43648e]" />
              <a href="https://www.slsnexus.com" target="_blank" rel="noreferrer" className="hover:text-[#0a1628] transition-colors">www.slsnexus.com</a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-[#43648e]" />
              <span>Visakhapatnam, Andhra Pradesh, India</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200 py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {year} SLS Consultants. All Rights Reserved.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/privacy" className="hover:text-[#0a1628] transition-colors font-medium">Privacy Policy</Link>
            <span>|</span>
            <Link href="/terms" className="hover:text-[#0a1628] transition-colors font-medium">Terms &amp; Conditions</Link>
            <span>|</span>
            <Link href="/cookies" className="hover:text-[#0a1628] transition-colors font-medium">Cookie Policy</Link>
            <span>|</span>
            <Link href="/disclaimer" className="hover:text-[#0a1628] transition-colors font-medium">Disclaimer</Link>
            <span>|</span>
            <Link href="/admin" className="hover:text-[#0a1628] transition-colors text-slate-300 font-medium">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
