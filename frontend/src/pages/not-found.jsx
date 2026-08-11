import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md mx-4 rounded-lg border border-gray-200 bg-white shadow-sm p-6">
        <div className="flex mb-4 gap-2">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
        </div>
        <p className="mt-4 text-sm text-gray-600">The page you are looking for does not exist or has been moved.</p>
        <div className="mt-6">
          <a
            href="/"
            className="inline-flex items-center justify-center px-4 py-2 bg-[#0a1628] text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#1a2f4c] transition-colors"
          >
            Return to Homepage
          </a>
        </div>
      </div>
    </div>
  );
}
