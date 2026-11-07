import { lazy, Suspense } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, Route, Routes } from 'react-router-dom';
import { CatalogueProvider } from './context/CatalogueContext.jsx';
import { useSession } from './context/AppContext.jsx';
import AppShell from './components/AppShell.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import PublicLayout from './components/PublicLayout.jsx';

const AdminPage = lazy(() => import('./pages/AdminPage.jsx'));
const AuthPage = lazy(() => import('./pages/AuthPage.jsx'));
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const DiscoverPage = lazy(() => import('./pages/DiscoverPage.jsx'));
const DocumentsPage = lazy(() => import('./pages/DocumentsPage.jsx'));
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const MatchesPage = lazy(() => import('./pages/MatchesPage.jsx'));
const NoticesPage = lazy(() => import('./pages/NoticesPage.jsx'));
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'));
const ResourcesPage = lazy(() => import('./pages/ResourcesPage.jsx'));
const SavedPage = lazy(() => import('./pages/SavedPage.jsx'));
const ScholarshipPage = lazy(() => import('./pages/ScholarshipPage.jsx'));
const TrackerPage = lazy(() => import('./pages/TrackerPage.jsx'));

function DiscoveryRoute() {
  const { session } = useSession();
  return session ? <AppShell><DiscoverPage /></AppShell> : <PublicLayout><DiscoverPage /></PublicLayout>;
}
function ScholarshipRoute() {
  const { session } = useSession();
  return session ? <AppShell><ScholarshipPage /></AppShell> : <PublicLayout><ScholarshipPage /></PublicLayout>;
}
function ResourcesRoute() {
  const { session } = useSession();
  return session ? <AppShell><ResourcesPage /></AppShell> : <PublicLayout><ResourcesPage /></PublicLayout>;
}
function NotFound() {
  const { session } = useSession();
  const content = <div className="not-found"><span>404</span><h1>We couldn’t find that page.</h1><p>It may have moved, or the route may not exist in this demo.</p><Link className="button button--primary" to={session ? '/dashboard' : '/'}><ArrowLeft size={16} /> Go back</Link></div>;
  return session ? <AppShell>{content}</AppShell> : <PublicLayout>{content}</PublicLayout>;
}

function RouteLoading() {
  return <div className="route-loading" role="status"><span className="route-loading__mark">G</span><span>Preparing your workspace…</span></div>;
}

export default function App() {
  return <CatalogueProvider><Suspense fallback={<RouteLoading />}><Routes>
    <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
    <Route path="/login" element={<AuthPage mode="login" />} />
    <Route path="/signup" element={<AuthPage mode="signup" />} />
    <Route path="/discover" element={<DiscoveryRoute />} />
    <Route path="/resources" element={<ResourcesRoute />} />
    <Route path="/scholarships/:scholarshipId" element={<ScholarshipRoute />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/matches" element={<MatchesPage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="/tracker" element={<TrackerPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/notices" element={<NoticesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Route>
    <Route element={<ProtectedRoute role="admin" />}><Route element={<AppShell />}><Route path="/admin" element={<AdminPage />} /></Route></Route>
    <Route path="/404" element={<NotFound />} />
    <Route path="*" element={<NotFound />} />
  </Routes></Suspense></CatalogueProvider>;
}
