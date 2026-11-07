import { useState } from 'react';
import { ArrowRight, Eye, Info, Save, ShieldCheck, UserRound } from 'lucide-react';
import { useAppData } from '../context/AppContext.jsx';
import { PageHeading, NoticeBanner } from '../components/UI.jsx';
import { profileSchema } from '../utils/validation.js';

const levelOptions = ['Undergraduate', 'Postgraduate', 'Diploma'];
const courseOptions = ['Engineering', 'Computer Science', 'Science', 'Medicine', 'Arts', 'Commerce', 'Law', 'Design', 'Business', 'Other'];
const stateOptions = ['Andhra Pradesh', 'Bihar', 'Delhi', 'Gujarat', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal', 'Other'];

export default function ProfilePage() {
  const { profile, updateProfile } = useAppData();
  const [form, setForm] = useState({ ...profile, annualFamilyIncome: profile.annualFamilyIncome ?? '', percentage: profile.percentage ?? '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');
  const change = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = (event) => {
    event.preventDefault();
    const result = profileSchema.safeParse(form);
    if (!result.success) {
      setErrors(Object.fromEntries(result.error.issues.map((issue) => [issue.path[0], issue.message])));
      setStatus('');
      return;
    }
    setErrors({});
    updateProfile({ ...form, annualFamilyIncome: form.annualFamilyIncome === '' ? '' : Number(form.annualFamilyIncome), percentage: form.percentage === '' ? '' : Number(form.percentage), interests: form.interests || ['merit', 'need'] });
    setStatus('Profile saved on this device. SmartMatch uses these details for sample criteria only.');
  };
  return <div className="page-content"><PageHeading eyebrow="YOUR DETAILS" title="My profile" description="A clearer profile helps SmartMatch explain which details fit the sample criteria." />
    <NoticeBanner tone="warm" icon={ShieldCheck}>This prototype stores non-sensitive demo profile details in this browser. Income is optional. Avoid entering information you would not want stored locally.</NoticeBanner>
    <form className="profile-form panel" onSubmit={submit} noValidate><div className="profile-section-title"><span className="profile-section-icon"><UserRound size={19} /></span><div><h2>Student information</h2><p>Keep your academic snapshot current.</p></div><span className="profile-demo-pill">Demo profile</span></div>
      <div className="form-grid"><Field label="Full name" name="name" value={form.name || ''} onChange={change} error={errors.name} required /><Field label="Email address" name="email" type="email" value={form.email || ''} onChange={change} error={errors.email} required /><SelectField label="Education level" name="educationLevel" value={form.educationLevel || ''} onChange={change} options={levelOptions} /><SelectField label="Course" name="course" value={form.course || ''} onChange={change} options={courseOptions} /><Field label="Institution" name="institution" value={form.institution || ''} onChange={change} /><SelectField label="State / location" name="state" value={form.state || ''} onChange={change} options={stateOptions} /><Field label="Academic performance (%)" name="percentage" type="number" min="0" max="100" value={form.percentage} onChange={change} error={errors.percentage} hint="Use the scale requested by the provider." /><Field label="Annual family income (₹)" name="annualFamilyIncome" type="number" min="0" value={form.annualFamilyIncome} onChange={change} error={errors.annualFamilyIncome} hint="Optional. Used only for sample income criteria." /></div>
      <div className="profile-preferences"><div><h3>Opportunity preferences</h3><p>Choose the categories you want to explore.</p></div><label className="check-control"><input type="checkbox" checked={(form.interests || []).includes('merit')} onChange={(event) => setForm((current) => ({ ...current, interests: event.target.checked ? [...new Set([...(current.interests || []), 'merit'])] : (current.interests || []).filter((item) => item !== 'merit') }))} /> Merit-based</label><label className="check-control"><input type="checkbox" checked={(form.interests || []).includes('need')} onChange={(event) => setForm((current) => ({ ...current, interests: event.target.checked ? [...new Set([...(current.interests || []), 'need'])] : (current.interests || []).filter((item) => item !== 'need') }))} /> Need-based</label></div>
      {status && <p className="form-success" role="status">{status}</p>}
      <div className="profile-form-footer"><p><Info size={16} /> SmartMatch is informational and compares this profile to demo criteria only.</p><button className="button button--primary" type="submit"><Save size={17} /> Save profile <ArrowRight size={16} /></button></div>
    </form>
    <div className="privacy-note"><Eye size={18} /><div><strong>Your privacy in demo mode</strong><p>Passwords are not saved. Sensitive identity documents are never requested or uploaded. Use official provider portals for applications.</p></div></div>
  </div>;
}

function Field({ label, name, value, onChange, type = 'text', error, hint, required, min, max }) {
  const errorId = `profile-${name}-error`;
  const hintId = `profile-${name}-hint`;
  return <label className="form-field"><span>{label}{required && <span aria-hidden="true"> *</span>}</span><input name={name} type={type} value={value} onChange={onChange} min={min} max={max} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : hint ? hintId : undefined} />{error ? <span id={errorId} className="field-error" role="alert">{error}</span> : hint && <small id={hintId} className="field-hint">{hint}</small>}</label>;
}
function SelectField({ label, name, value, onChange, options }) {
  return <label className="form-field">{label}<select name={name} value={value} onChange={onChange}><option value="">Choose one</option>{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}
