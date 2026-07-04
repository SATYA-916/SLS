import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { ShieldAlert, BookOpen, Fingerprint, HelpCircle } from 'lucide-react';

const legalContent = {
  '/privacy': {
    title: 'Privacy Policy',
    icon: <Fingerprint className="w-12 h-12 text-blue-500" />,
    lastUpdated: 'July 2026',
    sections: [
      {
        title: '1. Data Collection',
        content: 'We collect information you provide directly through our contact and consultation form, including your name, company, email address, phone number, and any project description or files you voluntarily submit. We do not use tracking pixels or harvest third-party private profile information.'
      },
      {
        title: '2. Use of Information',
        content: 'The information collected is used solely to respond to your engineering inquiries, schedule consultations, and prepare technical scoping proposals. We do not sell, rent, or lease your personal information to third parties.'
      },
      {
        title: '3. Data Security',
        content: 'We implement industry-standard 256-bit encryption for all file transfers. Your engineering specifications, coordinates, and CAD models are handled securely in our private network environment, protecting against unauthorized access, disclosure, or alteration.'
      },
      {
        title: '4. GDPR & CCPA Compliance',
        content: 'If you are visiting from the European Union or California, you have the right to request access to the personal data we hold about you, request corrections, or request deletion. To exercise these rights, please email projects@slsnexus.com.'
      }
    ]
  },
  '/terms': {
    title: 'Terms & Conditions',
    icon: <BookOpen className="w-12 h-12 text-blue-500" />,
    lastUpdated: 'July 2026',
    sections: [
      {
        title: '1. Scope of Services',
        content: 'SLS Consultants provides engineering design, structural analysis, and detailing consultancy services. All deliverables, drawings, and calculations are provided in accordance with project-specific scopes agreed upon in writing between SLS and the client.'
      },
      {
        title: '2. Intellectual Property',
        content: 'All engineering methodologies, custom software analyses, and CAD detailing macros developed by SLS remain the intellectual property of SLS Consultants. Client drawings, models, and inputs remain the exclusive property of the client, protected under mutual NDAs.'
      },
      {
        title: '3. Governing Law',
        content: 'These terms are governed by and construed in accordance with the laws of India. Any legal dispute arising from our services shall be subject to the exclusive jurisdiction of the courts of Visakhapatnam, Andhra Pradesh, India.'
      },
      {
        title: '4. Limitation of Liability',
        content: 'SLS Consultants shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use our engineering layouts, unless explicitly covered under the specific professional indemnity clauses of the signed project contract.'
      }
    ]
  },
  '/cookies': {
    title: 'Cookie Policy',
    icon: <ShieldAlert className="w-12 h-12 text-blue-500" />,
    lastUpdated: 'July 2026',
    sections: [
      {
        title: '1. What are Cookies?',
        content: 'Cookies are small text files placed on your device to collect standard internet log information and visitor behavior. We use them to optimize page load speeds and remember your preferences.'
      },
      {
        title: '2. How We Use Cookies',
        content: 'We use first-party cookies for essential session management (like preserving your active tabs on the drawings gallery) and basic analytics to understand page popularity.'
      },
      {
        title: '3. Managing Consent',
        content: 'You can accept or decline cookies at any time using our cookie consent banner. You can also configure your browser settings to reject all cookies or notify you when a cookie is being sent.'
      }
    ]
  },
  '/disclaimer': {
    title: 'Disclaimer',
    icon: <HelpCircle className="w-12 h-12 text-blue-500" />,
    lastUpdated: 'July 2026',
    sections: [
      {
        title: '1. Professional Engineering Advice',
        content: 'The information, diagrams, and programmatically rendered 3D models presented on this website are for general marketing and demonstration purposes only. They do not constitute specific structural or mechanical engineering advice.'
      },
      {
        title: '2. Drawing Limitations',
        content: 'All cropped drawings in our Gallery are logs of past projects. They lack critical dimensions, material notes, and approvals and must not be copied or used for any design, fabrication, or construction activities.'
      },
      {
        title: '3. Construction and Erection Verification',
        content: 'No design or layout obtained from this site should be used for refinery, power, or infrastructure execution without direct engineering vetting, calculations audit, and formal Approved-for-Construction (AFC) seal by a certified professional engineer.'
      }
    ]
  }
};

export default function Legal() {
  const [location] = useLocation();
  const pageContent = legalContent[location] || legalContent['/privacy'];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="w-full bg-white">
      <section className="bg-[#0a1628] text-white py-16 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">{pageContent.icon}</div>
          <h1 className="text-4xl font-bold">{pageContent.title}</h1>
          <p className="text-xs text-white/50 mt-2">Last Updated: {pageContent.lastUpdated}</p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl bg-white border border-gray-200 p-8 md:p-12 shadow-sm rounded-sm">
          <div className="space-y-8">
            {pageContent.sections.map((sec, idx) => (
              <div key={idx} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                <h3 className="font-bold text-lg text-[#0a1628] mb-3">{sec.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{sec.content}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-6 border-t border-gray-200 text-center">
            <Link href="/contact">
              <span className="text-xs font-bold uppercase text-blue-700 hover:text-blue-900 cursor-pointer">
                Inquire about compliance &rarr;
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
