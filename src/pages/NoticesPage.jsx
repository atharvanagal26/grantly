import { useMemo, useState } from 'react';
import { ArrowRight, Bell, CalendarDays, Check, CircleAlert, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCatalogue } from '../context/CatalogueContext.jsx';
import { useAppData } from '../context/AppContext.jsx';
import { DemoBadge, EmptyState, NoticeBanner, PageHeading } from '../components/UI.jsx';
import { formatDate } from '../utils/formatters.js';

export default function NoticesPage() {
  const { notices } = useCatalogue();
  const { readNoticeIds, markNoticeRead } = useAppData();
  const [filter, setFilter] = useState('All');
  const decorated = useMemo(() => notices.map((notice) => ({ ...notice, read: readNoticeIds.includes(notice.id) })).filter((notice) => filter === 'All' || (filter === 'Unread' ? !notice.read : notice.type === filter.toLowerCase())), [notices, readNoticeIds, filter]);
  return <div className="page-content"><PageHeading eyebrow="FUNDING RADAR" title="Stay aware of your next steps." description="A single place for upcoming demo dates and opportunity highlights. Nothing here is a live provider announcement." action={<DemoBadge />} />
    <NoticeBanner tone="warm" icon={CircleAlert}>Every notice below is synthetic and based on sample records. It is not a live scholarship announcement, reminder or deadline alert.</NoticeBanner>
    <div className="radar-summary"><span className="radar-summary__icon"><Bell size={19} /></span><div><strong>{notices.filter((item) => !readNoticeIds.includes(item.id)).length}</strong><span>demo notices to review</span></div><p>Open a notice to see the related sample award and its illustrative criteria.</p></div>
    <div className="notice-filters" role="group" aria-label="Filter Funding Radar notices">{['All', 'Unread', 'Deadline', 'Spotlight'].map((item) => <button key={item} className={filter === item ? 'is-active' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div>
    {decorated.length === 0 ? <EmptyState icon={Bell} title="No notices in this view" description="Choose another filter to review the illustrative sample notices." action={<button className="button button--outline" onClick={() => setFilter('All')}>Show all notices</button>} /> : <div className="notice-list">{decorated.map((notice) => <article className={`notice-card panel ${notice.read ? 'is-read' : ''}`} key={notice.id}><div className={`notice-icon notice-icon--${notice.type}`}>{notice.type === 'deadline' ? <CalendarDays size={19} /> : <Sparkles size={19} />}</div><div className="notice-card__content"><div className="notice-card__meta"><DemoBadge /><span>{formatDate(notice.date)}</span>{!notice.read && <span className="unread-dot-label">New to you</span>}</div><h2><Link to={`/scholarships/${notice.scholarshipId}`} onClick={() => markNoticeRead(notice.id)}>{notice.title}</Link></h2><p>{notice.body}</p><Link className="text-action" to={`/scholarships/${notice.scholarshipId}`} onClick={() => markNoticeRead(notice.id)}>Open related sample <ArrowRight size={15} /></Link></div><button className={`notice-read-button ${notice.read ? 'is-read' : ''}`} onClick={() => markNoticeRead(notice.id)} aria-label={notice.read ? `${notice.title} has been read` : `Mark ${notice.title} as read`}>{notice.read ? <Check size={15} /> : 'Mark read'}</button></article>)}</div>}
  </div>;
}
