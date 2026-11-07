import { useMemo, useState } from 'react';
import { ArrowRight, CalendarDays, Check, CircleAlert, ListFilter, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppData } from '../context/AppContext.jsx';
import { useCatalogue } from '../context/CatalogueContext.jsx';
import { DemoBadge, EmptyState, NoticeBanner, PageHeading } from '../components/UI.jsx';
import { formatDate } from '../utils/formatters.js';

const stages = ['Interested', 'Preparing Documents', 'Ready to Apply', 'Submitted', 'Under Review', 'Approved', 'Rejected'];
const closed = ['Approved', 'Rejected'];

export default function TrackerPage() {
  const { applications, updateApplication, removeApplication } = useAppData();
  const { scholarships } = useCatalogue();
  const [filter, setFilter] = useState('All stages');
  const records = useMemo(() => applications.map((application) => ({ ...application, scholarship: scholarships.find((item) => item.id === application.scholarshipId) })).filter((item) => item.scholarship).filter((item) => filter === 'All stages' || item.stage === filter), [applications, scholarships, filter]);
  const confirmRemove = (application) => {
    if (window.confirm(`Remove “${application.scholarship.name}” from your application tracker?`)) removeApplication(application.id);
  };
  const openDeadlines = applications.map((app) => ({ ...app, scholarship: scholarships.find((item) => item.id === app.scholarshipId) })).filter((app) => app.scholarship && !closed.includes(app.stage)).sort((a, b) => new Date(a.scholarship.deadline) - new Date(b.scholarship.deadline)).slice(0, 3);
  return <div className="page-content"><PageHeading eyebrow="YOUR APPLICATION JOURNEY" title="Keep every next step in view." description="Update your progress as you prepare. Dates and opportunity details below are synthetic demo data." action={<DemoBadge />} />
    <NoticeBanner tone="warm" icon={CircleAlert}>This tracker is saved in browser storage on this device. It does not submit applications or send reminders to providers.</NoticeBanner>
    <div className="tracker-overview"><div className="tracker-total"><span className="tracker-total__icon"><ListFilter size={20} /></span><div><strong>{applications.length}</strong><span>opportunities in your tracker</span></div></div><div className="tracker-next-deadline"><span className="tracker-total__icon tracker-total__icon--yellow"><CalendarDays size={20} /></span><div><small>UPCOMING TRACKED DATES</small><strong>{openDeadlines.length ? openDeadlines.map((item) => formatDate(item.scholarship.deadline, { day: 'numeric', month: 'short' })).join(' · ') : 'No active entries'}</strong></div></div></div>
    <div className="tracker-controls"><div><p className="eyebrow">APPLICATIONS</p><h2>Your progress board</h2></div><label className="sort-control"><span>Show</span><select value={filter} onChange={(event) => setFilter(event.target.value)}><option>All stages</option>{stages.map((stage) => <option key={stage}>{stage}</option>)}</select></label></div>
    {records.length === 0 ? <EmptyState icon={ListFilter} title={filter === 'All stages' ? 'No applications yet' : `No ${filter.toLowerCase()} applications`} description={filter === 'All stages' ? 'Add an opportunity from its details page or discovery card. It will appear here for you to organize.' : 'Try another status filter or add a new opportunity to your tracker.'} action={<Link className="button button--primary" to="/discover">Explore opportunities <ArrowRight size={16} /></Link>} /> : <div className="tracker-list">{records.map(({ id, scholarship, stage, appliedOn, note }) => {
      const stageIndex = stages.indexOf(stage);
      const isFinal = closed.includes(stage);
      return <article className="tracker-card panel" key={id}><div className="tracker-card__heading"><div><DemoBadge /><h3><Link to={`/scholarships/${scholarship.id}`}>{scholarship.name}</Link></h3><p>{scholarship.provider}</p></div><button className="icon-button icon-button--danger" aria-label={`Remove ${scholarship.name} from tracker`} onClick={() => confirmRemove({ scholarship })}><Trash2 size={17} /></button></div>
        <div className="tracker-progress" aria-label={`Application stage ${stageIndex + 1} of ${stages.length}: ${stage}`}>{stages.map((item, index) => <span key={item} className={`tracker-progress__step ${index <= stageIndex ? 'is-complete' : ''} ${item === stage ? 'is-current' : ''} ${isFinal && item !== stage && index > stageIndex ? 'is-muted' : ''}`} title={item}><i>{index < stageIndex || (isFinal && item === stage && item === 'Approved') ? <Check size={11} /> : index + 1}</i></span>)}</div><div className="tracker-step-labels"><span>Interested</span><span>Submitted</span><span>Decision</span></div>
        <div className="tracker-fields"><label>Current stage<select value={stage} onChange={(event) => updateApplication(id, { stage: event.target.value })}>{stages.map((item) => <option key={item}>{item}</option>)}</select></label><label>Application date<input type="date" value={appliedOn || ''} onChange={(event) => updateApplication(id, { appliedOn: event.target.value })} /></label><div className="tracker-deadline"><CalendarDays size={15} /><span>Demo deadline</span><strong>{formatDate(scholarship.deadline)}</strong></div></div>
        <label className="tracker-note">Personal note<textarea rows="2" value={note || ''} onChange={(event) => updateApplication(id, { note: event.target.value })} placeholder="Add a reminder for yourself…" /></label><div className="tracker-card__footer"><span>{isFinal ? <><Check size={14} /> Decision recorded as {stage}</> : <>Progress saves automatically in this browser</>}</span><Link className="text-action" to={`/scholarships/${scholarship.id}`}>Open details <ArrowRight size={14} /></Link></div>
      </article>;
    })}</div>}
  </div>;
}
