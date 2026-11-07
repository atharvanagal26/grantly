import { useMemo } from 'react';
import { Check, FileCheck2, Info, LockKeyhole } from 'lucide-react';
import { useAppData } from '../context/AppContext.jsx';
import { PageHeading, NoticeBanner } from '../components/UI.jsx';

const items = [
  { name: 'Aadhaar or identity proof', group: 'Identity & eligibility', hint: 'Keep identification secure; never upload it to this demo.' },
  { name: 'Income certificate', group: 'Identity & eligibility', hint: 'May be required for income-based criteria.' },
  { name: 'Caste certificate', group: 'Identity & eligibility', hint: 'Where applicable and requested by the official provider.' },
  { name: 'Domicile certificate', group: 'Identity & eligibility', hint: 'May support state-specific eligibility.' },
  { name: 'Academic marksheets', group: 'Academic records', hint: 'Check the relevant academic year and format.' },
  { name: 'Bonafide certificate', group: 'Academic records', hint: 'Confirm the provider’s requested institution format.' },
  { name: 'Bank details', group: 'Application details', hint: 'Use secure official channels only.' },
  { name: 'Passport-size photograph', group: 'Application details', hint: 'Check image size and format requirements.' },
];
const groups = ['Identity & eligibility', 'Academic records', 'Application details'];

export default function DocumentsPage() {
  const { documents, setDocumentReady } = useAppData();
  const ready = Object.values(documents).filter(Boolean).length;
  const total = items.length;
  const percent = Math.round(ready / total * 100);
  const grouped = useMemo(() => groups.map((group) => ({ group, items: items.filter((item) => item.group === group) })), []);
  return <div className="page-content"><PageHeading eyebrow="DOCUMENT READINESS" title="Prepare one step at a time." description="Mark what you have ready. This checklist helps you organize, but the official scholarship provider sets the final document requirements." />
    <NoticeBanner tone="warm" icon={LockKeyhole}>Demo mode does not collect or upload Aadhaar, identity documents, certificates or bank details. This checklist stores only ready/pending status in your browser.</NoticeBanner>
    <section className="document-progress-panel panel"><div className="document-progress-copy"><div><p className="eyebrow">YOUR PREPARATION PROGRESS</p><h2>{ready} of {total} items marked ready</h2><p>Requirements vary by scholarship. Review each official checklist before applying.</p></div><div className="progress-percent"><strong>{percent}%</strong><span>ready</span></div></div><div className="progress-track" role="progressbar" aria-label="Document readiness" aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100"><span style={{ width: `${percent}%` }} /></div></section>
    <div className="document-groups">{grouped.map(({ group, items: groupItems }) => <section className="document-group panel" key={group}><div className="document-group__heading"><div><span className="document-group__icon"><FileCheck2 size={18} /></span><div><h2>{group}</h2><p>{groupItems.filter((item) => documents[item.name]).length} of {groupItems.length} ready</p></div></div><span className="document-group__completion">{groupItems.every((item) => documents[item.name]) ? <><Check size={14} /> Complete</> : 'In progress'}</span></div><div className="document-items">{groupItems.map((item) => <label key={item.name} className={`document-item ${documents[item.name] ? 'is-ready' : ''}`}><input type="checkbox" checked={Boolean(documents[item.name])} onChange={(event) => setDocumentReady(item.name, event.target.checked)} /><span className="document-check"><Check size={14} /></span><span className="document-item__copy"><strong>{item.name}</strong><small>{item.hint}</small></span><span className={`document-status ${documents[item.name] ? 'is-ready' : ''}`}>{documents[item.name] ? 'Ready' : 'Pending'}</span></label>)}</div></section>)}</div>
    <div className="document-reminder"><Info size={18} /><p><strong>Before you submit:</strong> compare this progress list with the official requirements for each opportunity. Some providers request additional documents or different formats.</p></div>
  </div>;
}
