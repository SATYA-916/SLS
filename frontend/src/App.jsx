import { useEffect } from 'react';
import { Switch, Route, useLocation } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Layout } from '@/components/layout/Layout';
import Home from '@/pages/home';
import About from '@/pages/about';
import Expertise from '@/pages/expertise';
import Projects from '@/pages/projects';
import Software from '@/pages/software';
import Vision from '@/pages/vision';
import Contact from '@/pages/contact';
import AdminLogin from '@/pages/admin-login';
import AdminDashboard from '@/pages/admin-dashboard';
import NotFound from '@/pages/not-found';

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
        <Route path="/software">
          <Layout><Software /></Layout>
        </Route>
        <Route path="/vision">
          <Layout><Vision /></Layout>
        </Route>
        <Route path="/contact">
          <Layout><Contact /></Layout>
        </Route>
        <Route path="/">
          <Layout><Home /></Layout>
        </Route>
        <Route>
          <Layout><NotFound /></Layout>
        </Route>
      </Switch>
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}
