import { useMemo } from 'react';
import { ArrowRight, Check, CircleAlert, Info, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppData } from '../context/AppContext.jsx';
import { useCatalogue } from '../context/CatalogueContext.jsx';
import { DemoBadge, PageHeading, NoticeBanner } from '../components/UI.jsx';
import { rankScholarships } from '../utils/smartMatch.js';

export default function MatchesPage() {
  const { profile } = useAppData();
  const { scholarships } = useCatalogue();
  const ranked = useMemo(() => rankScholarships(profile, scholarships), [profile, scholarships]);
  const matches = ranked.filter(({ match }) => match.status !== 'Unlikely Match');
  const conflicts = ranked.filter(({ match }) => match.status === 'Unlikely Match');

  return <div className="page-content">
    <PageHeading
      eyebrow="SMARTMATCH"
      title="A match you can understand."
      description="See how your profile compares with each sample opportunity—and what to verify before taking a next step."
      action={<Link className="button button--outline" to="/profile">Update profile <ArrowRight size={16} /></Link>}
    />
    <NoticeBanner tone="warm" icon={Info}>These scores are calculated from your profile and synthetic demo criteria. A match is not an official eligibility decision or a promise of funding.</NoticeBanner>
    <section className="smartmatch-intro">
      <span className="smartmatch-intro__icon"><Sparkles size={21} /></span>
      <div>
        <h2>How we calculate the score</h2>
        <p>GRANTLY compares listed education-level, course, academic-performance, optional-income and location criteria. The weighted criteria are normalized to a 0–100 eligibility-fit score. When you select one or more opportunity categories, 10% of the relevance score reflects whether an example aligns with those interests; the category preference affects ranking, never eligibility. With no category selected, only the listed criteria affect the score. Missing information earns no points for that criterion. The calculation is deterministic and uses your saved profile.</p>
      </div>
      <DemoBadge />
    </section>

    {matches.length > 0 && <>
      <div className="match-section-heading">
        <div><p className="eyebrow">RECOMMENDED TO REVIEW</p><h2>{matches.length} potential and verification-needed examples</h2></div>
      </div>
      <div className="match-list">
        {matches.map(({ scholarship, match }) => <article key={scholarship.id} className="match-result-card">
          <div className="match-result-card__main">
            <div className="match-score-ring" style={{ '--score': `${match.score}%` }}><strong>{match.score}%</strong></div>
            <div className="match-result-card__copy">
              <div className="match-result-title"><h3><Link to={`/scholarships/${scholarship.id}`}>{scholarship.name}</Link></h3><DemoBadge /></div>
              <p>{match.explanation}</p>
              <div className="match-checks">
                <div><strong><Check size={14} /> Matched criteria</strong>{match.matched.length ? <span>{match.matched.map((item) => item.label).join(' · ')}</span> : <span>No criteria confirmed yet</span>}</div>
                <div><strong><CircleAlert size={14} /> Needs attention</strong>{[...match.missing, ...match.mismatched].length ? <span>{[...match.missing, ...match.mismatched].map((item) => item.label).join(' · ')}</span> : <span>None listed in this sample</span>}</div>
                {match.preference && <div className="match-preference-check"><strong><Sparkles size={14} /> Category preference</strong><span>{match.preference.explanation}</span></div>}
              </div>
            </div>
          </div>
          <div className="match-result-card__aside">
            <span className={`match-status match-status--${match.status.toLowerCase().replaceAll(' ', '-')}`}>{match.status}</span>
            <Link className="text-action" to={`/scholarships/${scholarship.id}`}>Review criteria <ArrowRight size={15} /></Link>
          </div>
        </article>)}
      </div>
    </>}

    {conflicts.length > 0 && <details className="unlikely-section">
      <summary><span><CircleAlert size={17} /> {conflicts.length} unlikely sample fits</span><span>Review criteria</span></summary>
      <div className="unlikely-list">{conflicts.map(({ scholarship, match }) => <div key={scholarship.id}><Link to={`/scholarships/${scholarship.id}`}>{scholarship.name}</Link><span>{match.score}% · {match.mismatched.map((item) => item.label).join(', ') || match.explanation}</span></div>)}</div>
    </details>}

    <div className="match-next-step">
      <div><span className="match-next-icon"><Info size={19} /></span><div><strong>Missing profile information?</strong><p>Update your profile to clarify the comparison. Income is optional; you can leave it blank.</p></div></div>
      <Link className="button button--outline" to="/profile">Review my details <ArrowRight size={16} /></Link>
    </div>
  </div>;
}
