import { useMemo } from 'react';
import { ArrowRight, Bell, Bookmark, CalendarClock, CheckCircle2, CircleDollarSign, FileCheck2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAppData } from '../context/AppContext.jsx';
import { useCatalogue } from '../context/CatalogueContext.jsx';
import { DemoBadge, NoticeBanner, ScholarshipCard } from '../components/UI.jsx';
import { evaluateScholarship, rankScholarships } from '../utils/smartMatch.js';
import { formatDate, formatMoney } from '../utils/formatters.js';

const finalStages = ['Approved', 'Rejected'];
const pieColors = ['#f5b82e', '#737694', '#bbd7cc', '#e59e7e', '#d9d3c5', '#668f89', '#a7aac0'];

export default function DashboardPage() {
  const { profile, savedIds, applications, documents } = useAppData();
  const { scholarships, notices } = useCatalogue();
  const activeCount = applications.filter((item) => !finalStages.includes(item.stage)).length;
  const ranked = useMemo(() => rankScholarships(profile, scholarships), [profile, scholarships]);
  const matched = ranked.filter(({ match }) => match.status !== 'Unlikely Match').length;
  const readyCount = Object.values(documents).filter(Boolean).length;
  const readiness = Object.keys(documents).length ? Math.round(readyCount / Object.keys(documents).length * 100) : 0;
  const distribution = ['Interested', 'Preparing Documents', 'Ready to Apply', 'Submitted', 'Under Review', 'Approved', 'Rejected'].map((stage) => ({ stage, count: applications.filter((item) => item.stage === stage).length }));
  const matchBars = ranked.slice(0, 5).map(({ scholarship, match }) => ({ name: scholarship.name.length > 21 ? `${scholarship.name.slice(0, 19)}…` : scholarship.name, score: match.score }));
  const deadlines = scholarships.filter((item) => new Date(item.deadline) >= new Date(new Date().toDateString())).sort((a, b) => new Date(a.deadline) - new Date(b.deadline)).slice(0, 3);
  const recommended = ranked.slice(0, 2);
  const noticeCount = notices.filter((item) => item.isDemo).length;
  const matchProfile = evaluateScholarship(profile, scholarships[0] || {});

  return <div className="dashboard-page">
    <div className="dashboard-welcome"><div><p className="eyebrow">YOUR STUDENT WORKSPACE</p><h1>Good to see you, {profile.name?.split(' ')[0] || 'student'}.</h1><p>Here’s your scholarship journey at a glance. Your demo progress is saved in this browser.</p></div><div className="welcome-match"><span className="welcome-match__icon"><Sparkles size={19} /></span><div><small>YOUR PROFILE SNAPSHOT</small><strong>{matchProfile.score}% sample match score</strong><span>Based on the first listed demo example</span></div></div></div>
    <NoticeBanner tone="warm">Everything shown here is demo data. Scholarship records, notices and deadlines are illustrative; verify current details with the official provider.</NoticeBanner>
    <div className="stats-grid">
      <article className="stat-card"><span className="stat-icon stat-icon--gold"><CompassIcon /></span><div><span>Demo opportunities</span><strong>{scholarships.length}</strong><small>Illustrative records</small></div><Link to="/discover" aria-label="Browse demo opportunities"><ArrowRight size={18} /></Link></article>
      <article className="stat-card"><span className="stat-icon stat-icon--mint"><Sparkles size={18} /></span><div><span>Potential matches</span><strong>{matched}</strong><small>From your profile</small></div><Link to="/matches" aria-label="View SmartMatch results"><ArrowRight size={18} /></Link></article>
      <article className="stat-card"><span className="stat-icon stat-icon--rose"><Bookmark size={18} /></span><div><span>Saved</span><strong>{savedIds.length}</strong><small>Opportunities to revisit</small></div><Link to="/saved" aria-label="View saved opportunities"><ArrowRight size={18} /></Link></article>
      <article className="stat-card"><span className="stat-icon stat-icon--blue"><FileCheck2 size={18} /></span><div><span>Active applications</span><strong>{activeCount}</strong><small>{readiness}% documents ready</small></div><Link to="/tracker" aria-label="Manage applications"><ArrowRight size={18} /></Link></article>
    </div>
    <div className="dashboard-grid dashboard-grid--wide-left">
      <section className="panel match-chart-panel"><div className="panel-heading"><div><p className="eyebrow">PROFILE-BASED RANKING</p><h2>Your closest sample fits</h2></div><Link className="text-action" to="/matches">See all <ArrowRight size={15} /></Link></div><p className="panel-help">Calculated from the details in your demo profile—not an official eligibility decision.</p><div className="chart-wrap chart-wrap--bar"><ResponsiveContainer width="100%" height={228}><BarChart data={matchBars} layout="vertical" margin={{ top: 4, right: 16, left: 6, bottom: 2 }}><CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#ecebe7" /><XAxis type="number" domain={[0, 100]} tick={{ fill: '#85868d', fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis type="category" dataKey="name" width={146} tick={{ fill: '#4c4d59', fontSize: 11 }} axisLine={false} tickLine={false} /><Tooltip cursor={{ fill: '#f8f6ef' }} formatter={(value) => [`${value}%`, 'Sample fit']} /><Bar dataKey="score" fill="#f5b82e" radius={[0, 7, 7, 0]} barSize={18} /></BarChart></ResponsiveContainer></div><Link className="chart-note" to="/profile">Update profile details to refine this comparison <ArrowRight size={14} /></Link></section>
      <section className="panel stage-panel"><div className="panel-heading"><div><p className="eyebrow">YOUR APPLICATIONS</p><h2>Progress overview</h2></div><Link className="icon-button" to="/tracker" aria-label="Open application tracker"><ArrowRight size={17} /></Link></div><div className="chart-wrap chart-wrap--pie"><ResponsiveContainer width="100%" height={158}><PieChart><Pie data={distribution.filter((item) => item.count > 0)} dataKey="count" nameKey="stage" cx="50%" cy="50%" innerRadius={48} outerRadius={69} paddingAngle={3}>{distribution.filter((item) => item.count > 0).map((entry) => <Cell key={entry.stage} fill={pieColors[distribution.findIndex((item) => item.stage === entry.stage)]} />)}</Pie><Tooltip formatter={(value, name) => [value, name]} /></PieChart></ResponsiveContainer><div className="chart-center"><strong>{applications.length}</strong><span>tracked</span></div></div><div className="stage-legend">{distribution.filter((item) => item.count > 0).map((item) => <span key={item.stage}><i style={{ background: pieColors[distribution.findIndex((entry) => entry.stage === item.stage)] }} />{item.stage}<b>{item.count}</b></span>)}{applications.length === 0 && <span className="empty-chart-label">No applications yet</span>}</div></section>
    </div>
    <div className="dashboard-grid dashboard-grid--equal"><section className="panel deadline-panel"><div className="panel-heading"><div><p className="eyebrow">PLAN AHEAD</p><h2>Upcoming sample dates</h2></div><Link className="text-action" to="/notices">Funding Radar <ArrowRight size={15} /></Link></div><div className="deadline-list">{deadlines.map((item) => <Link className="deadline-row" to={`/scholarships/${item.id}`} key={item.id}><span className="deadline-date"><strong>{new Date(`${item.deadline}T12:00:00`).getDate()}</strong><small>{new Date(`${item.deadline}T12:00:00`).toLocaleDateString('en-IN', { month: 'short' })}</small></span><span className="deadline-title"><strong>{item.name}</strong><small><DemoBadge /></small></span><span className="deadline-amount">{formatMoney(item.amount)}<small>{formatDate(item.deadline, { day: 'numeric', month: 'short' })}</small></span></Link>)}</div><p className="panel-footnote"><CalendarClock size={15} /> Dates are generated sample dates, not active provider deadlines.</p></section>
      <section className="panel readiness-panel"><div className="panel-heading"><div><p className="eyebrow">SMALL STEPS ADD UP</p><h2>Document readiness</h2></div><Link className="icon-button" to="/documents" aria-label="Open document checklist"><ArrowRight size={17} /></Link></div><div className="readiness-ring"><div className="readiness-ring__visual" style={{ '--progress': `${readiness}%` }}><span><strong>{readiness}%</strong><small>ready</small></span></div><div className="readiness-copy"><strong>{readyCount} of {Object.keys(documents).length} items marked ready</strong><p>Use the checklist to prepare, but always follow each provider’s official list.</p><Link to="/documents" className="text-action">Open checklist <ArrowRight size={15} /></Link></div></div><div className="doc-mini-progress"><span style={{ width: `${readiness}%` }} /></div></section></div>
    <div className="section-heading-row dashboard-recommend-heading"><div><p className="eyebrow">A PLACE TO START</p><h2>Suggested sample opportunities</h2></div><DemoBadge /></div><div className="featured-scholarships dashboard-recommendations">{recommended.map(({ scholarship, match }) => <ScholarshipCard key={scholarship.id} scholarship={scholarship} match={match} />)}</div>
    <div className="dashboard-bottom-callout"><div className="callout-icon"><CircleDollarSign size={22} /></div><div><strong>Every real scholarship has its own rules.</strong><p>Use our verified links to reach official resources. Confirm current amounts, eligibility and dates before you apply.</p></div><Link className="button button--outline" to="/resources">Open resources <ArrowRight size={16} /></Link></div>
    {noticeCount > 0 && <div className="dashboard-small-note"><Bell size={15} />Funding Radar contains {noticeCount} illustrative notices; they are not live announcements.</div>}
  </div>;
}

function CompassIcon() { return <CircleDollarSign size={18} />; }
