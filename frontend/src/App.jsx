import { useState, useEffect, lazy, Suspense, Component } from 'react';
import { Switch, Route, useLocation } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
const CodesDirectory = lazy(() => import('@/pages/codes-directory'));
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

const queryClient = new QueryClient();

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error('[SLS ErrorBoundary]', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <Layout>
          <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Something went wrong loading this page</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-[#0a1628] text-white text-xs font-bold uppercase tracking-wider rounded-sm"
            >
              Try Again
            </button>
          </div>
        </Layout>
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
            <Route path="/codes">
              <Layout><CodesDirectory /></Layout>
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
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('temp_auth') === 'true';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim() === 'sls' && password === 'pwd') {
      sessionStorage.setItem('temp_auth', 'true');
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid username or password');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-slate-100 shadow-2xl p-8 rounded-sm text-[#0a1628]">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black tracking-wider uppercase mb-2">SLS Consultants</h1>
            <p className="text-xs font-bold uppercase tracking-widest text-[#43648e]">Engineering Portal Access</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-2 border-red-500 text-red-700 p-3 text-xs font-medium rounded-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full px-4 py-3 text-sm border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#0a1628] focus:outline-none focus:ring-1 focus:ring-[#0a1628]/20 transition-all rounded-sm"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 text-sm border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#0a1628] focus:outline-none focus:ring-1 focus:ring-[#0a1628]/20 transition-all rounded-sm"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-[#0a1628] text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#12233c] transition-colors rounded-sm shadow-md"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
      <CookieBanner />
    </QueryClientProvider>
  );
}
