import { ArrowUpRight, BookOpen, ExternalLink, FileText, ShieldCheck } from 'lucide-react';
import { useCatalogue } from '../context/CatalogueContext.jsx';
import { DemoBadge, InlineExternalLink, PageHeading } from '../components/UI.jsx';

const guides = [
  { title: 'Read the criteria before you begin', category: 'Application guide', text: 'Make a short list of the study level, course, marks, income, location and other conditions a provider asks you to meet. Keep notes beside the official source.' },
  { title: 'Prepare a document checklist', category: 'Preparation', text: 'Use a checklist to track what is ready, but compare it with the provider’s current list. Do not share identity or banking details through unverified channels.' },
  { title: 'Track every date and follow-up', category: 'Planning', text: 'Record the application deadline and any institution-verification date. Check official announcements directly in case dates or instructions change.' },
];

export default function ResourcesPage() {
  const { resources } = useCatalogue();
  return <div className="page-content"><PageHeading eyebrow="NEWS & RESOURCES" title="Start with trusted information." description="Use official sources for current criteria and applications. These live external resources are separate from GRANTLY’s synthetic demo awards." action={<DemoBadge />} />
    <div className="official-resource-note"><ShieldCheck size={19} /><p><strong>Verify at the source.</strong> GRANTLY’s example records are unverified. Official schemes have their own application, eligibility and deadline rules.</p></div>
    <section className="resource-section"><div className="section-heading-row resource-heading"><div><p className="eyebrow">OFFICIAL STUDENT LINKS</p><h2>Go straight to the source.</h2></div><span className="resource-verified-label"><ShieldCheck size={15} /> Official destinations</span></div><div className="resource-grid">{resources.map((resource) => <article className="resource-card panel" key={resource.id}><div className="resource-card__top"><span className="resource-icon"><BookOpen size={18} /></span><span className="resource-category">{resource.category}</span></div><p className="eyebrow">{resource.organization}</p><h3>{resource.title}</h3><p>{resource.description}</p><InlineExternalLink href={resource.url}>Visit official resource</InlineExternalLink></article>)}</div></section>
    <section className="resource-section guides-section"><div className="section-heading-row resource-heading"><div><p className="eyebrow">PRACTICAL PREPARATION</p><h2>Simple habits that help.</h2></div><span className="demo-resource-label"><FileText size={15} /> GRANTLY guides</span></div><div className="guide-grid">{guides.map((guide, index) => <article className="guide-card" key={guide.title}><span className="guide-number">0{index + 1}</span><p className="eyebrow">{guide.category}</p><h3>{guide.title}</h3><p>{guide.text}</p></article>)}</div></section>
    <div className="resource-bottom-callout"><div><h3>Need to compare your sample profile?</h3><p>SmartMatch can show how your details compare with the example criteria. It never replaces provider confirmation.</p></div><a href="/matches" className="button button--primary">Open SmartMatch <ArrowUpRight size={16} /></a></div>
    <div className="resource-footnote"><ExternalLink size={15} /><span>Links were checked as official destinations for this prototype. External pages may change; follow the provider’s current instructions.</span></div>
  </div>;
}
