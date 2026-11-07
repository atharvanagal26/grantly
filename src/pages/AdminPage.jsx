import { useMemo, useState } from 'react';
import { AlertTriangle, ArrowRight, BellPlus, Check, Pencil, Plus, Save, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCatalogue } from '../context/CatalogueContext.jsx';
import { DemoBadge, NoticeBanner, PageHeading } from '../components/UI.jsx';
import { formatDate, formatMoney } from '../utils/formatters.js';

const blank = { name: '', provider: '', amount: '', deadline: '', category: 'merit', course: 'Engineering', educationLevel: 'Undergraduate' };

export default function AdminPage() {
  const { scholarships, notices, saveAdminScholarship, removeAdminScholarship, addAdminNotice } = useCatalogue();
  const [form, setForm] = useState(blank);
  const [drafts, setDrafts] = useState({});
  const [status, setStatus] = useState('');
  const ordered = useMemo(() => [...scholarships].sort((a, b) => new Date(a.deadline) - new Date(b.deadline)), [scholarships]);
  const updateDraft = (item, key, value) => setDrafts((current) => ({ ...current, [item.id]: { ...(current[item.id] || { deadline: item.deadline, amount: item.amount }), [key]: value } }));
  const saveEdit = (item) => {
    saveAdminScholarship({ ...item, ...(drafts[item.id] || {}) });
    setStatus(`Saved the demo record “${item.name}” in this browser.`);
  };
  const remove = (item) => {
    if (window.confirm(`Remove the demo catalogue record “${item.name}”?`)) {
      removeAdminScholarship(item.id);
      setStatus(`Removed “${item.name}” from this demo catalogue in this browser.`);
    }
  };
  const createScholarship = (event) => {
    event.preventDefault();
    const date = new Date(`${form.deadline}T12:00:00`);
    if (!form.name.trim() || !form.provider.trim() || !form.deadline || Number(form.amount) <= 0 || Number.isNaN(date.getTime())) {
      setStatus('Enter a name, provider, positive award amount and valid sample deadline.');
      return;
    }
    const id = `admin-demo-${Date.now()}`;
    const amount = Number(form.amount);
    const item = {
      id, name: form.name.trim(), provider: form.provider.trim(), amount, category: form.category,
      courses: [form.course], educationLevels: [form.educationLevel], states: [], minPercentage: null, maxFamilyIncome: null,
      deadline: form.deadline, startDate: new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10),
      description: 'An administrator-created illustrative demo record. Confirm any real scholarship details with its provider.',
      eligibility: `Illustrative criteria: ${form.educationLevel} students studying ${form.course}.`,
      documents: ['Academic marksheets', 'Bonafide certificate'],
      applicationSteps: ['Review the demo criteria.', 'Confirm the official application process with the provider.'],
      sourceUrl: 'https://scholarships.gov.in/', sourceLabel: 'National Scholarship Portal (general reference)',
      sampleNote: 'Synthetic administrator-created demo record; the linked portal is a general reference and does not verify this award.',
      isDemo: true, verifiedAt: null,
      criteria: { educationLevels: [form.educationLevel], courses: [form.course], states: [], minPercentage: null, maxFamilyIncome: null },
    };
    saveAdminScholarship(item);
    setForm(blank);
    setStatus(`Added “${item.name}” as an unverified demo record.`);
  };
  const createNotice = () => {
    const target = scholarships[0];
    if (!target) return;
    addAdminNotice({ id: `notice-admin-${Date.now()}`, scholarshipId: target.id, title: `Admin demo update: ${target.name}`, body: 'A demo-only notice created in this browser. It is not a live announcement.', type: 'spotlight', date: new Date().toISOString().slice(0, 10), isDemo: true });
    setStatus('Added a demo notice linked to the first catalogue example.');
  };

  return <div className="page-content admin-page"><PageHeading eyebrow="ROLE-GATED DEMO PREVIEW" title="Catalogue management." description="A local-only preview of admin-ready controls for demo records." action={<DemoBadge>Admin demo</DemoBadge>} />
    <NoticeBanner tone="warning" icon={AlertTriangle}>This is not secure production administration. Changes stay in this browser and are not written to a shared backend. Demo role gating is not real authorization; ordinary student navigation does not expose these controls.</NoticeBanner>
    <section className="admin-summary-row"><div className="admin-summary panel"><span className="admin-summary__icon"><Pencil size={18} /></span><div><strong>{scholarships.length}</strong><span>visible demo records</span></div></div><div className="admin-summary panel"><span className="admin-summary__icon"><BellPlus size={18} /></span><div><strong>{notices.length}</strong><span>illustrative notices</span></div></div><div className="admin-summary panel"><span className="admin-summary__icon"><Check size={18} /></span><div><strong>Local only</strong><span>not published</span></div></div></section>
    <section className="admin-section panel"><div className="admin-section-heading"><div><p className="eyebrow">SAMPLE RECORDS</p><h2>Update dates or amounts</h2><p>All catalogue records remain clearly labelled as synthetic demo data.</p></div><button className="button button--outline" onClick={createNotice}><BellPlus size={16} /> Add demo notice</button></div><div className="admin-record-list">{ordered.map((item) => <article className="admin-record" key={item.id}><div className="admin-record__info"><DemoBadge /><h3><Link to={`/scholarships/${item.id}`}>{item.name}</Link></h3><p>{item.provider} · {formatMoney(item.amount)} · deadline {formatDate(item.deadline)}</p></div><div className="admin-record__fields"><label>Sample deadline<input type="date" value={drafts[item.id]?.deadline ?? item.deadline} onChange={(event) => updateDraft(item, 'deadline', event.target.value)} /></label><label>Amount (₹)<input type="number" min="1" value={drafts[item.id]?.amount ?? item.amount} onChange={(event) => updateDraft(item, 'amount', Number(event.target.value))} /></label><button className="icon-button" onClick={() => saveEdit(item)} aria-label={`Save changes to ${item.name}`}><Save size={16} /></button><button className="icon-button icon-button--danger" onClick={() => remove(item)} aria-label={`Remove ${item.name}`}><Trash2 size={16} /></button></div></article>)}</div></section>
    <section className="admin-section panel"><div className="admin-section-heading"><div><p className="eyebrow">ADD A SAMPLE</p><h2>Create a demo opportunity</h2><p>New records are marked synthetic and stored only in this browser.</p></div></div><form className="admin-create-form" onSubmit={createScholarship}><label>Scholarship name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Illustrative award name" /></label><label>Provider<input value={form.provider} onChange={(event) => setForm({ ...form, provider: event.target.value })} placeholder="Illustrative provider" /></label><label>Amount (₹)<input type="number" min="1" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} /></label><label>Sample deadline<input type="date" value={form.deadline} onChange={(event) => setForm({ ...form, deadline: event.target.value })} /></label><label>Course<select value={form.course} onChange={(event) => setForm({ ...form, course: event.target.value })}>{['Engineering', 'Computer Science', 'Science', 'Arts', 'Commerce', 'Design'].map((course) => <option key={course}>{course}</option>)}</select></label><label>Education level<select value={form.educationLevel} onChange={(event) => setForm({ ...form, educationLevel: event.target.value })}>{['Undergraduate', 'Postgraduate', 'Diploma'].map((level) => <option key={level}>{level}</option>)}</select></label><label>Category<select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}><option value="merit">Merit-based</option><option value="need">Need-based</option></select></label><button className="button button--primary" type="submit"><Plus size={17} /> Add demo record</button></form></section>
    {status && <p className="form-success admin-status" role="status">{status}</p>}
    <div className="admin-footnote"><ArrowRight size={15} /><span>For production admin access, configure secure authentication, persistent storage and server-side role checks before enabling management operations.</span></div>
  </div>;
}
