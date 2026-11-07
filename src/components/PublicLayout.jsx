import { useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BrandMark } from './UI.jsx';
import { useSession } from '../context/AppContext.jsx';

export default function PublicLayout({ children }) {
  const [open, setOpen] = useState(false);
  const { session } = useSession();
  const close = () => setOpen(false);
  return (
    <div className="public-site">
      <div className="top-ribbon"><span>Built for the scholarship journey, not just the search.</span><Link to="/resources">Browse official resources <ArrowRight size={14} /></Link></div>
      <header className="public-header">
        <div className="public-header__inner"><BrandMark />
          <button className="mobile-menu-button" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
          <nav className={`public-nav ${open ? 'is-open' : ''}`} aria-label="Main navigation">
            <a href="#how-it-works" onClick={close}>How it works</a><a href="#features" onClick={close}>Platform</a><Link to="/discover" onClick={close}>Scholarships</Link>
            {session ? <Link className="button button--nav" to="/dashboard" onClick={close}>Open dashboard <ArrowRight size={15} /></Link> : <><Link className="nav-signin" to="/login" onClick={close}>Sign in</Link><Link className="button button--nav" to="/signup" onClick={close}>Get started <ArrowRight size={15} /></Link></>}
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="public-footer">
        <div className="public-footer__main"><div className="footer-brand"><BrandMark light /><p>Scholarship clarity for every next step.</p></div>
          <div className="footer-column"><h3>Explore</h3><Link to="/discover">Find scholarships</Link><Link to="/resources">Student resources</Link><Link to="/login">Demo workspace</Link></div>
          <div className="footer-column"><h3>Official resources</h3><a href="https://scholarships.gov.in/" target="_blank" rel="noreferrer noopener">National Scholarship Portal</a><a href="https://www.aicte.gov.in/schemes/students-development-schemes" target="_blank" rel="noreferrer noopener">AICTE student schemes</a></div>
        </div>
        <div className="public-footer__bottom"><span>© {new Date().getFullYear()} GRANTLY · Demo platform</span><span>Always verify eligibility and dates with the official provider.</span></div>
      </footer>
    </div>
  );
}
