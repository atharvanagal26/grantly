import { useState } from 'react';
import { ArrowLeft, ArrowRight, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout.jsx';
import { BrandMark, DemoBadge, NoticeBanner } from '../components/UI.jsx';
import { useAppData, useSession } from '../context/AppContext.jsx';
import { loginSchema, signupSchema } from '../utils/validation.js';

export default function AuthPage({ mode = 'login' }) {
  const isSignup = mode === 'signup';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('student@demo.grantly');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const { loginDemo } = useSession();
  const { updateProfile } = useAppData();
  const navigate = useNavigate();
  const location = useLocation();
  const destination = location.state?.from || '/dashboard';

  const enterDemo = (role = 'student') => {
    const isAdmin = role === 'admin';
    const userName = isAdmin ? 'GRANTLY Admin Demo' : (name.trim() || 'Aarav Sharma');
    const userEmail = isAdmin ? 'admin@demo.grantly' : (email.trim() || 'student@demo.grantly');
    loginDemo({ name: userName, email: userEmail, role });
    if (!isAdmin && isSignup) updateProfile({ name: userName, email: userEmail });
    navigate(isAdmin ? '/admin' : destination, { replace: true });
  };

  const submit = (event) => {
    event.preventDefault();
    setMessage('');
    const validation = (isSignup ? signupSchema : loginSchema).safeParse({ name, email, password });
    if (!validation.success) {
      setErrors(Object.fromEntries(validation.error.issues.map((issue) => [issue.path[0], issue.message])));
      return;
    }
    setErrors({});
    setMessage('Demo mode is active. Your password is checked only in this form and is not sent or saved.');
    enterDemo('student');
  };

  return <PublicLayout><section className="auth-page"><div className="auth-aside"><div className="auth-aside__brand"><BrandMark light /></div><div className="auth-aside__content"><p className="eyebrow">A MORE ORGANIZED SEARCH</p><h1>Every opportunity,<br /><em>one step closer.</em></h1><p>Find your way through scholarship discovery, preparation and progress—with clear information at every step.</p><div className="auth-aside-note"><span className="auth-aside-note__symbol">✳</span><span><strong>Always verify.</strong> GRANTLY suggestions are a starting point, not an official eligibility decision.</span></div></div><div className="auth-aside__bottom">GRANTLY · DEMO PLATFORM</div></div>
    <div className="auth-card-wrap"><div className="auth-card"><Link to="/" className="back-link"><ArrowLeft size={16} /> Back to home</Link><div className="auth-card__heading"><DemoBadge /><p className="eyebrow">{isSignup ? 'CREATE YOUR WORKSPACE' : 'YOUR SCHOLARSHIP WORKSPACE'}</p><h2>{isSignup ? 'Start your journey.' : 'Welcome back.'}</h2><p>{isSignup ? 'Create a demo profile to organize your search.' : 'Continue where you left off in your demo workspace.'}</p></div>
      <NoticeBanner tone="warm" icon={ShieldAlert}>Demo only: this prototype has no production authentication. Passwords are never stored. Avoid entering a password you use elsewhere.</NoticeBanner>
      <form className="auth-form" onSubmit={submit} noValidate>{isSignup && <label>Full name<input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} placeholder="Your name" />{errors.name && <span className="field-error" id="name-error">{errors.name}</span>}</label>}
        <label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} />{errors.email && <span className="field-error" id="email-error">{errors.email}</span>}</label>
        <label>Password <span className="label-optional">demo field only</span><span className="password-field"><input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={isSignup ? 'new-password' : 'current-password'} aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? 'password-error' : undefined} placeholder={isSignup ? 'At least 8 characters' : 'Any value for the demo'} /><button className="password-toggle" type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span>{errors.password && <span className="field-error" id="password-error">{errors.password}</span>}</label>
        {message && <p className="form-success" role="status">{message}</p>}
        <button className="button button--primary button--full" type="submit">{isSignup ? 'Create demo profile' : 'Continue to demo'} <ArrowRight size={17} /></button>
      </form>
      <div className="auth-divider"><span />or try a sample workspace<span /></div>
      <button className="button button--outline button--full" onClick={() => enterDemo('student')} type="button">Explore the student demo <ArrowRight size={16} /></button>
      {!isSignup && <button className="admin-demo-link" onClick={() => enterDemo('admin')} type="button">Explore admin demo <span>Demo-only role preview</span></button>}
      <p className="auth-switch">{isSignup ? 'Already have a demo profile?' : 'New to GRANTLY?'} <Link to={isSignup ? '/login' : '/signup'}>{isSignup ? 'Sign in' : 'Create a profile'}</Link></p>
      <p className="auth-privacy">Profile progress stays in browser storage on this device. No identity documents are uploaded.</p>
    </div></div></section></PublicLayout>;
}
