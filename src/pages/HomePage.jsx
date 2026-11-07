import { ArrowRight, ArrowUpRight, CheckCircle2, CircleHelp, Compass, FileCheck2, Focus, ShieldCheck, Sparkles, Waypoints } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCatalogue } from '../context/CatalogueContext.jsx';
import { useSession } from '../context/AppContext.jsx';
import { DemoBadge, ScholarshipCard } from '../components/UI.jsx';

const featureItems = [
  { icon: Compass, number: '01', title: 'Discover with clarity', text: 'Search one calm, student-focused catalogue. Filter by what matters to you and see the important details up front.' },
  { icon: Sparkles, number: '02', title: 'Understand your fit', text: 'SmartMatch shows which sample criteria match, what is missing and where to verify—not just a mystery score.' },
  { icon: FileCheck2, number: '03', title: 'Stay ready', text: 'Save the awards you care about, prepare documents and keep every next step visible.' },
];

export default function HomePage() {
  const { scholarships } = useCatalogue();
  const { session } = useSession();
  const featured = scholarships.slice(0, 3);
  const appHref = session ? '/dashboard' : '/signup';
  return (
    <>
      <section className="hero-section">
        <div className="hero-copy"><span className="hero-kicker"><span className="kicker-line" /> A clearer way to find student funding</span>
          <h1>Find funding<br />for your <em>next chapter.</em></h1>
          <p>Discover scholarships that fit your journey, understand the criteria and keep your applications moving—all in one place.</p>
          <div className="hero-actions"><Link className="button button--primary button--large" to={appHref}>Explore your opportunities <ArrowRight size={18} /></Link><a className="button button--ghost button--large" href="#how-it-works">See how it works</a></div>
          <div className="hero-assurance"><ShieldCheck size={16} /><span>Clear match reasons. You stay in control.</span></div>
          <div className="hero-underline" aria-hidden="true"><span /></div>
        </div>
        <div className="hero-art" aria-label="Illustration of a scholarship search dashboard">
          <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
          <div className="hero-sun"><span>G</span></div>
          <div className="hero-art-label">YOUR NEXT STEP<br /><strong>STARTS HERE</strong></div>
          <div className="floating-card floating-card--match"><div className="floating-card__top"><span className="mini-spark"><Sparkles size={14} /></span><span>SMARTMATCH</span><span className="float-dot" /></div><strong>Good fit, explained.</strong><p>3 criteria matched · 1 to check</p><div className="mini-progress"><i /></div><div className="match-pill">82% <span>Potential match</span></div></div>
          <div className="floating-card floating-card--deadline"><span className="deadline-icon">↗</span><div><small>NEXT DEMO DEADLINE</small><strong>15 Feb</strong></div><span className="deadline-arrow"><ArrowUpRight size={16} /></span></div>
          <div className="hero-leaf" />
        </div>
      </section>

      <section className="trust-strip"><div className="trust-strip__inner"><span><CheckCircle2 size={17} /> One search, many pathways</span><span><CheckCircle2 size={17} /> Transparent sample matching</span><span><CheckCircle2 size={17} /> Your progress, in one place</span></div></section>

      <section className="problem-section section-pad"><div className="section-intro section-intro--split"><div><p className="eyebrow">THE CHALLENGE</p><h2>Searching for support<br />shouldn’t feel like a full-time job.</h2></div><p>Important information is scattered. Requirements read differently from one portal to the next. And a missed date can mean waiting another year. GRANTLY makes the steps easier to see.</p></div>
        <div className="problem-notes"><article><span>01</span><h3>Too many places to look</h3><p>One starting point brings opportunities into a browsable catalogue.</p></article><article><span>02</span><h3>Hard to know if you fit</h3><p>Plain-language criteria show what matches and what still needs a check.</p></article><article><span>03</span><h3>Details get lost</h3><p>Saved awards, preparation steps and deadlines stay together.</p></article></div>
      </section>

      <section className="feature-section section-pad" id="features"><div className="section-intro section-intro--center"><p className="eyebrow">MADE FOR THE WHOLE JOURNEY</p><h2>From “what’s out there?”<br />to “I’m ready.”</h2><p>More than a search page—a companion for each step of the scholarship process.</p></div>
        <div className="feature-grid">{featureItems.map(({ icon: Icon, number, title, text }) => <article className="feature-card" key={title}><div className="feature-card__meta"><span className="feature-icon"><Icon size={20} /></span><span>{number} / 03</span></div><h3>{title}</h3><p>{text}</p><span className="feature-rule" /></article>)}</div>
      </section>

      <section className="featured-section section-pad"><div className="section-heading-row"><div><p className="eyebrow">A FIRST LOOK</p><h2>Explore opportunities<br />built around your goals.</h2></div><Link className="text-action" to="/discover">Explore all demo awards <ArrowRight size={17} /></Link></div>
        <p className="demo-explainer"><DemoBadge /> These sample awards are illustrative demo records—not verified live scholarships.</p>
        <div className="featured-scholarships">{featured.map((item) => <ScholarshipCard key={item.id} scholarship={item} />)}</div>
      </section>

      <section className="how-section section-pad" id="how-it-works"><div className="how-heading"><p className="eyebrow">THREE STEPS, LESS GUESSWORK</p><h2>Start with your story.<br /><em>Take it one step at a time.</em></h2><p>GRANTLY works best when your profile is honest and up to date. Add only the information you feel comfortable sharing.</p><Link className="button button--nav" to={appHref}>Start your demo journey <ArrowRight size={16} /></Link></div>
        <div className="journey-list"><article><span>01</span><div><h3>Build your profile</h3><p>Share your course, study level and preferences. Income is optional in demo mode.</p></div><Waypoints size={20} /></article><article><span>02</span><div><h3>See what may fit</h3><p>Get a transparent comparison against each opportunity’s listed sample criteria.</p></div><Focus size={20} /></article><article><span>03</span><div><h3>Make your next move</h3><p>Save, prepare and track. Confirm every real requirement with the provider.</p></div><CheckCircle2 size={20} /></article></div>
      </section>

      <section className="impact-section"><div className="impact-copy"><p className="eyebrow">A MORE ORGANIZED START</p><h2>Give your goals<br />room to grow.</h2><p>Keep your search, preparation and application steps in one student-friendly workspace.</p></div><div className="impact-stats"><div><strong>{scholarships.length}</strong><span>illustrative sample<br />opportunities</span></div><div><strong>3</strong><span>verified official<br />resource links</span></div><div><strong>7</strong><span>application stages<br />to keep in view</span></div><small>Demo product figures. Not live market or funding statistics.</small></div></section>

      <section className="benefits-section section-pad"><div><p className="eyebrow">A BETTER WAY TO PREPARE</p><h2>Less time juggling tabs.<br />More time on your next step.</h2></div><div className="benefit-checks"><p><CheckCircle2 size={18} /> Keep opportunities and key details together</p><p><CheckCircle2 size={18} /> Understand where your profile may need an update</p><p><CheckCircle2 size={18} /> See every deadline and preparation task at a glance</p><p><CheckCircle2 size={18} /> Know what is demo data and what is official</p></div></section>

      <section className="faq-section section-pad"><div className="faq-intro"><p className="eyebrow">GOOD TO KNOW</p><h2>A few questions,<br />answered clearly.</h2><p>Not sure about something? Start with the details here.</p><Link to="/resources" className="text-action">Browse student resources <ArrowRight size={16} /></Link></div><div className="faq-list"><details><summary>Are the scholarships shown here live and verified?<CircleHelp size={17} /></summary><p>No. The catalogue currently contains synthetic demonstration records. They are labelled as demo examples. Use the official resource links and verify every real scholarship with its provider.</p></details><details><summary>Does a SmartMatch score mean I’m eligible?<CircleHelp size={17} /></summary><p>No. It compares information in your profile with sample criteria and explains the result. Only the scholarship provider can confirm eligibility or make an award decision.</p></details><details><summary>Where does my profile data go?<CircleHelp size={17} /></summary><p>This prototype keeps demo profile and progress information in browser storage on this device. Demo mode does not store your password or collect identity-document uploads.</p></details><details><summary>Can I apply through GRANTLY?<CircleHelp size={17} /></summary><p>GRANTLY helps you discover, prepare and track. Application submission happens through the scholarship provider’s official process.</p></details></div></section>

      <section className="final-cta"><div><p className="eyebrow">YOUR NEXT CHAPTER IS WORTH THE SEARCH</p><h2>Make the next step<br />a little clearer.</h2></div><Link className="button button--light button--large" to={appHref}>Explore GRANTLY <ArrowRight size={18} /></Link><div className="cta-mark" aria-hidden="true">G</div></section>
    </>
  );
}
