import { useEffect, lazy, Suspense } from 'react';
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
