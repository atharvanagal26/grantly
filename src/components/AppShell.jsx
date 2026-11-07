import { useState } from 'react';
import { Activity, Bell, Bookmark, BookOpenCheck, Compass, FileCheck2, House, LogOut, Menu, Search, UserRound, X, Sparkles, Newspaper, ShieldCheck } from 'lucide-react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BrandMark, DemoBadge } from './UI.jsx';
import { useAppData, useSession } from '../context/AppContext.jsx';

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: House },
  { to: '/discover', label: 'Discover', icon: Compass },
  { to: '/matches', label: 'SmartMatch', icon: Sparkles },
  { to: '/saved', label: 'Saved', icon: Bookmark },
  { to: '/tracker', label: 'Applications', icon: Activity },
  { to: '/documents', label: 'Documents', icon: FileCheck2 },
  { to: '/notices', label: 'Funding Radar', icon: Bell },
  { to: '/resources', label: 'Resources', icon: Newspaper },
];

export default function AppShell({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { session, logout } = useSession();
  const { profile, applications } = useAppData();
  const location = useLocation();
  const navigate = useNavigate();
  const displayName = session?.name || profile.name || 'Student';
  const roleLabel = session?.role === 'admin' ? 'Admin demo' : 'Student workspace';
  const pageTitle = navItems.find((item) => location.pathname === item.to)?.label || (location.pathname === '/admin' ? 'Admin demo' : location.pathname.startsWith('/scholarships/') ? 'Scholarship details' : 'Workspace');
  const exit = () => { logout(); navigate('/'); };
  const links = navItems.filter((item) => item.label !== 'Overview' || session);

  return (
    <div className="app-shell">
      <button className="mobile-shell-trigger" aria-label={menuOpen ? 'Close app menu' : 'Open app menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}<span>GRANTLY</span></button>
      {menuOpen && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
      <aside className={`app-sidebar ${menuOpen ? 'is-open' : ''}`}>
        <div className="sidebar-brand"><BrandMark /></div>
        <div className="sidebar-user"><div className="avatar">{displayName.slice(0, 1)}</div><div><strong>{displayName}</strong><span>{roleLabel}</span></div></div>
        <nav className="sidebar-nav" aria-label="Student workspace">
          <p className="sidebar-section-label">YOUR JOURNEY</p>
          {links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} onClick={() => setMenuOpen(false)} className={({ isActive }) => `sidebar-link ${isActive ? 'is-active' : ''}`}><Icon size={18} strokeWidth={1.8} /><span>{label}</span>{label === 'Applications' && applications.length > 0 && <i className="nav-count">{applications.length}</i>}</NavLink>)}
          <p className="sidebar-section-label sidebar-section-label--space">ACCOUNT</p>
          <NavLink to="/profile" onClick={() => setMenuOpen(false)} className={({ isActive }) => `sidebar-link ${isActive ? 'is-active' : ''}`}><UserRound size={18} /><span>My profile</span></NavLink>
          {session?.role === 'admin' && <NavLink to="/admin" onClick={() => setMenuOpen(false)} className={({ isActive }) => `sidebar-link ${isActive ? 'is-active' : ''}`}><ShieldCheck size={18} /><span>Admin demo</span></NavLink>}
        </nav>
        <div className="sidebar-bottom"><div className="demo-side-card"><span className="demo-spark"><BookOpenCheck size={18} /></span><strong>One place. Every step.</strong><p>Your demo workspace saves progress in this browser.</p><Link to="/discover" onClick={() => setMenuOpen(false)}>Explore awards <span>→</span></Link></div>
          <button className="sidebar-logout" onClick={exit}><LogOut size={17} /><span>Exit demo</span></button>
        </div>
      </aside>
      <div className="app-main-column">
        <header className="app-topbar"><div className="breadcrumbs"><Link to={session?.role === 'admin' ? '/admin' : '/dashboard'}>Workspace</Link><span>/</span><strong>{pageTitle}</strong></div><div className="topbar-tools"><DemoBadge /><Link className="topbar-profile" to="/profile" aria-label="Open profile"><span className="avatar avatar--small">{displayName.slice(0, 1)}</span><span>{displayName}</span></Link></div></header>
        <main className="app-main">{children || <Outlet />}</main>
        <footer className="app-footer"><span>GRANTLY demo · Progress saves in this browser</span><Link to="/resources">Verify details with official providers</Link></footer>
      </div>
    </div>
  );
}
