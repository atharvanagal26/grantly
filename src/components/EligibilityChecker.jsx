import { useEffect, useRef, useState } from 'react';
import { Check, CircleAlert, Info, X } from 'lucide-react';
import { useAppData } from '../context/AppContext.jsx';
import { evaluateScholarship } from '../utils/smartMatch.js';

const levels = ['Undergraduate', 'Postgraduate', 'Diploma'];
const courses = ['Engineering', 'Computer Science', 'Science', 'Medicine', 'Arts', 'Commerce', 'Law', 'Design', 'Business', 'Any course'];
const states = ['Andhra Pradesh', 'Bihar', 'Delhi', 'Gujarat', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal'];

export default function EligibilityChecker({ scholarship, onClose }) {
  const { profile, updateProfile } = useAppData();
  const [form, setForm] = useState({ educationLevel: profile.educationLevel || '', course: profile.course || '', percentage: profile.percentage ?? '', annualFamilyIncome: profile.annualFamilyIncome ?? '', state: profile.state || '' });
  const [result, setResult] = useState(null);
  const dialogRef = useRef(null);
  useEffect(() => {
    const previousFocus = document.activeElement;
    const focusable = () => [...(dialogRef.current?.querySelectorAll('button, input, select, textarea, a[href]') || [])].filter((item) => !item.disabled);
    focusable()[0]?.focus();
    const handler = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab') {
        const items = focusable();
        if (!items.length) return;
        if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items.at(-1).focus(); }
        else if (!event.shiftKey && document.activeElement === items.at(-1)) { event.preventDefault(); items[0].focus(); }
      }
    };
    window.addEventListener('keydown', handler);
    return () => { window.removeEventListener('keydown', handler); previousFocus?.focus?.(); };
  }, [onClose]);
  if (!scholarship) return null;
  const set = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const check = (event) => {
    event.preventDefault();
    const profileValues = { ...form, percentage: form.percentage === '' ? '' : Number(form.percentage), annualFamilyIncome: form.annualFamilyIncome === '' ? '' : Number(form.annualFamilyIncome) };
    setResult(evaluateScholarship(profileValues, scholarship));
  };
  const save = () => {
    updateProfile({ ...form, percentage: form.percentage === '' ? '' : Number(form.percentage), annualFamilyIncome: form.annualFamilyIncome === '' ? '' : Number(form.annualFamilyIncome) });
    setResult(evaluateScholarship(form, scholarship));
  };
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section ref={dialogRef} className="eligibility-modal" role="dialog" aria-modal="true" aria-labelledby="eligibility-title" aria-describedby="eligibility-note">
        <div className="modal-heading"><div><p className="eyebrow">Demo eligibility check</p><h2 id="eligibility-title">Does this fit your profile?</h2><p>{scholarship.name}</p></div><button className="icon-button" onClick={onClose} aria-label="Close eligibility checker"><X size={20} /></button></div>
        <div className="eligibility-demo-note" id="eligibility-note"><Info size={17} /><span>This compares your details with sample criteria only. It is not an official eligibility decision.</span></div>
        <form onSubmit={check} className="eligibility-form">
          <label>Education level<select name="educationLevel" value={form.educationLevel} onChange={set}><option value="">Select level</option>{levels.map((value) => <option key={value}>{value}</option>)}</select></label>
          <label>Course<select name="course" value={form.course} onChange={set}><option value="">Select course</option>{courses.map((value) => <option key={value}>{value}</option>)}</select></label>
          <label>Academic performance (%)<input type="number" min="0" max="100" name="percentage" value={form.percentage} onChange={set} placeholder="e.g. 78" /></label>
          <label>Annual family income (₹)<input type="number" min="0" name="annualFamilyIncome" value={form.annualFamilyIncome} onChange={set} placeholder="Optional" /></label>
          <label>State<select name="state" value={form.state} onChange={set}><option value="">Select state</option>{states.map((value) => <option key={value}>{value}</option>)}</select></label>
          <button className="button button--primary button--full" type="submit">Check sample criteria</button>
        </form>
        {result && <div className="eligibility-result" aria-live="polite"><div className={`eligibility-score eligibility-score--${result.status.startsWith('Potential') ? 'good' : result.status.startsWith('Unlikely') ? 'low' : 'review'}`}><span>{result.score}%</span><strong>{result.status}</strong></div><p className="eligibility-explanation">{result.explanation}</p>
          <div className="criteria-results">{result.checks.map((item) => <div key={item.key} className={`criteria-result criteria-result--${item.status}`}><span>{item.status === 'matched' ? <Check size={15} /> : <CircleAlert size={15} />}</span><div><strong>{item.label} · {item.status === 'matched' ? 'Matched' : item.status === 'missing' ? 'Needs information' : 'Does not match'}</strong><p>{item.explanation}</p></div></div>)}</div>
          <button type="button" className="text-action" onClick={save}>Save these details to my profile</button>
        </div>}
        <p className="modal-disclaimer">Final eligibility, application dates and award decisions are determined by the official scholarship provider.</p>
      </section>
    </div>
  );
}
