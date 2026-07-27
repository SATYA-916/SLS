import { useEffect, lazy, Suspense, Component } from 'react';
import { Switch, Route, useLocation } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ShieldAlert } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { Layout } from '@/components/layout/Layout';
import Home from '@/pages/home';
import CookieBanner from '@/components/CookieBanner';
import NotFound from '@/pages/not-found';

// Lazy load non-landing pages for route-based bundle splitting
const About = lazy(() => import('@/pages/about'));
const Expertise = lazy(() => import('@/pages/expertise'));
const Projects = lazy(() => import('@/pages/projects'));
const CaseStudy = lazy(() => import('@/pages/case-study'));
const Software = lazy(() => import('@/pages/software'));
const Contact = lazy(() => import('@/pages/contact'));
const Gallery = lazy(() => import('@/pages/gallery'));
const AdminLogin = lazy(() => import('@/pages/admin-login'));
const Legal = lazy(() => import('@/pages/legal'));
const AdminDashboard = lazy(() => import('@/pages/admin-dashboard'));

function PageLoader() {
  return (
    <Layout>
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-6 h-6 border-2 border-t-[#0a1628] border-slate-200 rounded-full animate-spin mb-3" />
        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Loading Section...</p>
      </div>
    </Layout>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 8000),
      staleTime: 30000,
      refetchOnWindowFocus: false,
    },
  },
});

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('[SLS ErrorBoundary]', error, info);
  }
  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center px-4">
          <div className="max-w-md text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-6 h-6 text-red-500" />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-2">Page could not be loaded</h2>
            <p className="text-xs text-gray-400 mb-6 max-w-xs mx-auto leading-relaxed">
              SLS Consultants encountered an error while rendering this page. Please try again or return to the homepage.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={this.handleRetry}
                className="px-5 py-2.5 bg-[#0a1628] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1a2f4c] transition-colors rounded-sm"
              >
                Try Again
              </button>
              <a
                href="/"
                className="px-5 py-2.5 border border-gray-200 text-gray-600 text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors rounded-sm"
              >
                Home
              </a>
            </div>
            <p className="text-[9px] text-gray-300 mt-6 font-mono">
              {this.state.error?.message || ''}
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Switch>
            <Route path="/admin/dashboard">
              <AdminDashboard />
            </Route>
            <Route path="/admin">
              <AdminLogin />
            </Route>
            <Route path="/about">
              <Layout><About /></Layout>
            </Route>
            <Route path="/services">
              <Layout><Expertise /></Layout>
            </Route>
            <Route path="/case-study/:id">
              <Layout><CaseStudy /></Layout>
            </Route>
            <Route path="/projects/:id">
              <Layout><CaseStudy /></Layout>
            </Route>
            <Route path="/projects">
              <Layout><Projects /></Layout>
            </Route>
            <Route path="/gallery">
              <Layout><Gallery /></Layout>
            </Route>
            <Route path="/software">
              <Layout><Software /></Layout>
            </Route>
            <Route path="/contact">
              <Layout><Contact /></Layout>
            </Route>
            <Route path="/privacy">
              <Layout><Legal /></Layout>
            </Route>
            <Route path="/terms">
              <Layout><Legal /></Layout>
            </Route>
            <Route path="/cookies">
              <Layout><Legal /></Layout>
            </Route>
            <Route path="/disclaimer">
              <Layout><Legal /></Layout>
            </Route>
            <Route path="/">
              <Layout><Home /></Layout>
            </Route>
            <Route>
              <Layout><NotFound /></Layout>
            </Route>
          </Switch>
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
      <CookieBanner />
    </QueryClientProvider>
  );
}
