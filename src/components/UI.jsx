import { ArrowDownRight, ArrowRight, Bookmark, CalendarDays, Check, ExternalLink, IndianRupee, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppData } from '../context/AppContext.jsx';
import { deadlineLabel, formatDate, formatMoney } from '../utils/formatters.js';

export function BrandMark({ light = false, compact = false }) {
  return (
    <Link className={`brand-lockup ${light ? 'brand-lockup--light' : ''}`} to="/" aria-label="GRANTLY home">
      <span className="brand-symbol" aria-hidden="true"><span /><i /></span>
      {!compact && <span className="brand-word">GRANTLY</span>}
    </Link>
  );
}

export function DemoBadge({ children = 'Demo example' }) {
  return <span className="demo-badge"><span className="demo-dot" />{children}</span>;
}

export function PageHeading({ eyebrow, title, description, action }) {
  return <div className="page-heading">
    <div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{description && <p className="page-description">{description}</p>}</div>
    {action && <div className="heading-action">{action}</div>}
  </div>;
}

export function NoticeBanner({ children, tone = 'warm', icon: Icon = Sparkles }) {
  return <div className={`notice-banner notice-banner--${tone}`} role="note"><Icon size={18} aria-hidden="true" /><p>{children}</p></div>;
}

export function EmptyState({ icon: Icon = ArrowDownRight, title, description, action }) {
  return <div className="empty-state"><span className="empty-icon"><Icon size={22} /></span><h3>{title}</h3><p>{description}</p>{action}</div>;
}

export function ScholarshipCard({ scholarship, match, onEligibility }) {
  const { savedIds, toggleSaved, applications, addApplication } = useAppData();
  const saved = savedIds.includes(scholarship.id);
  const tracked = applications.some((item) => item.scholarshipId === scholarship.id);
  return (
    <article className="scholarship-card">
      <div className="scholarship-card__top">
        <div className="provider-mark" aria-hidden="true">{scholarship.name.slice(0, 1)}</div>
        <div className="card-top-copy"><p className="card-provider">{scholarship.provider}{scholarship.providerType && <span> · {scholarship.providerType}</span>}</p><DemoBadge /></div>
        <button className={`icon-button bookmark-button ${saved ? 'is-active' : ''}`} aria-label={saved ? `Remove ${scholarship.name} from saved scholarships` : `Save ${scholarship.name}`} aria-pressed={saved} onClick={() => toggleSaved(scholarship.id)}>
          <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
      <h3><Link to={`/scholarships/${scholarship.id}`}>{scholarship.name}</Link></h3>
      <div className="scholarship-amount"><IndianRupee size={17} aria-hidden="true" />{formatMoney(scholarship.amount)}<span> / year (demo)</span></div>
      <p className="eligibility-summary">{scholarship.eligibility}</p>
      <div className="card-meta-row">
        <span className={`category-pill category-pill--${scholarship.category}`}>{scholarship.category === 'need' ? 'Need-based' : 'Merit-based'}</span>
        <span className="deadline-meta"><CalendarDays size={14} aria-hidden="true" />{deadlineLabel(scholarship.deadline)}</span>
      </div>
      {match && <div className="match-strip"><span><Sparkles size={15} /> Match</span><strong>{match.score}%</strong><span className="match-strip__label">{match.status}</span><span className="match-meter"><i style={{ width: `${match.score}%` }} /></span></div>}
      <div className="card-actions">
        <Link className="text-action" to={`/scholarships/${scholarship.id}`}>View details <ArrowRight size={16} /></Link>
        {onEligibility && <button className="text-action text-action--quiet" onClick={() => onEligibility(scholarship)}>Check fit</button>}
        {tracked ? <span className="tracked-indicator"><Check size={14} /> In tracker</span> : <button className="text-action text-action--quiet" onClick={() => addApplication(scholarship.id)}>+ Track</button>}
      </div>
      <p className="card-deadline">Application deadline: {formatDate(scholarship.deadline)}</p>
    </article>
  );
}

export function InlineExternalLink({ href, children }) {
  return <a href={href} target="_blank" rel="noreferrer noopener">{children}<ExternalLink size={14} aria-hidden="true" /></a>;
}
