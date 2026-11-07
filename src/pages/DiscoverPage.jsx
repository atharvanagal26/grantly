import { useMemo, useState } from 'react';
import { ArrowDownWideNarrow, ArrowUpDown, Filter, Search, SlidersHorizontal, X } from 'lucide-react';
import { useCatalogue } from '../context/CatalogueContext.jsx';
import { useAppData } from '../context/AppContext.jsx';
import { DemoBadge, EmptyState, PageHeading } from '../components/UI.jsx';
import ScholarshipCard from '../components/ScholarshipCard.jsx';
import EligibilityChecker from '../components/EligibilityChecker.jsx';
import { evaluateScholarship } from '../utils/smartMatch.js';
import { daysUntil } from '../utils/formatters.js';

const courses = ['Engineering', 'Computer Science', 'Science', 'Medicine', 'Arts', 'Commerce', 'Law', 'Design', 'Business'];
const levels = ['Undergraduate', 'Postgraduate', 'Diploma'];
const states = ['Bihar', 'Delhi', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Rajasthan', 'Tamil Nadu', 'Uttar Pradesh'];

export default function DiscoverPage() {
  const { scholarships, loading } = useCatalogue();
  const { profile } = useAppData();
  const [filters, setFilters] = useState({ search: '', course: '', level: '', category: '', state: '', minAmount: '', deadline: '' });
  const [sort, setSort] = useState('relevance');
  const [checker, setChecker] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const activeFilters = Object.entries(filters).filter(([key, value]) => key !== 'search' && value !== '').length;
  const results = useMemo(() => {
    let list = scholarships.filter((item) => {
      const query = filters.search.trim().toLowerCase();
      const haystack = `${item.name} ${item.provider} ${item.description}`.toLowerCase();
      if (query && !haystack.includes(query)) return false;
      if (filters.course && !item.courses.some((course) => course === 'Any course' || course === filters.course)) return false;
      if (filters.level && !item.educationLevels.includes(filters.level)) return false;
      if (filters.category && item.category !== filters.category) return false;
      if (filters.state && item.states.length && !item.states.includes(filters.state)) return false;
      if (filters.minAmount && item.amount < Number(filters.minAmount)) return false;
      if (filters.deadline && daysUntil(item.deadline) > Number(filters.deadline)) return false;
      return true;
    });
    if (sort === 'deadline') list = [...list].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    else if (sort === 'amount') list = [...list].sort((a, b) => b.amount - a.amount);
    else list = [...list].sort((a, b) => evaluateScholarship(profile, b).score - evaluateScholarship(profile, a).score);
    return list;
  }, [scholarships, filters, sort, profile]);
  const setFilter = (event) => setFilters((current) => ({ ...current, [event.target.name]: event.target.value }));
  const reset = () => setFilters({ search: '', course: '', level: '', category: '', state: '', minAmount: '', deadline: '' });

  return <div className="page-content"><PageHeading eyebrow="DISCOVERY" title="Find a scholarship that fits." description="Search the sample catalogue. Filter by your study details, compare criteria and decide what to verify next." action={<DemoBadge />} />
    <div className="catalogue-note"><span className="catalogue-note__mark">i</span><p>All awards in this catalogue are synthetic demo examples. They are not verified live scholarships. <a href="/resources">Open official resources</a> to check real schemes.</p></div>
    <div className="search-toolbar"><label className="search-box"><Search size={18} /><span className="sr-only">Search scholarships or providers</span><input name="search" value={filters.search} onChange={setFilter} placeholder="Search name, provider or keyword" /></label><button className={`filter-toggle ${filtersOpen ? 'is-active' : ''}`} onClick={() => setFiltersOpen(!filtersOpen)} aria-expanded={filtersOpen}><SlidersHorizontal size={17} /> Filters{activeFilters > 0 && <span>{activeFilters}</span>}</button><label className="sort-control"><ArrowUpDown size={16} /><span>Sort by</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="relevance">Relevance to profile</option><option value="deadline">Nearest deadline</option><option value="amount">Award amount</option></select></label></div>
    <section className={`filter-panel ${filtersOpen ? 'is-open' : ''}`} aria-label="Scholarship filters"><div className="filter-panel__heading"><span><Filter size={16} /> Refine opportunities</span><button className="filter-reset" onClick={reset}><X size={14} /> Reset all</button></div><div className="filter-grid">
      <FilterSelect name="course" label="Course" value={filters.course} onChange={setFilter} options={courses} />
      <FilterSelect name="level" label="Education level" value={filters.level} onChange={setFilter} options={levels} />
      <FilterSelect name="category" label="Funding type" value={filters.category} onChange={setFilter} options={[['merit', 'Merit-based'], ['need', 'Need-based']]} />
      <FilterSelect name="state" label="State / location" value={filters.state} onChange={setFilter} options={states} />
      <FilterSelect name="minAmount" label="Minimum award" value={filters.minAmount} onChange={setFilter} options={[[25000, '₹25,000+'], [40000, '₹40,000+'], [60000, '₹60,000+'], [80000, '₹80,000+']]} />
      <FilterSelect name="deadline" label="Deadline window" value={filters.deadline} onChange={setFilter} options={[[30, 'Within 30 days'], [90, 'Within 90 days'], [180, 'Within 6 months']]} />
    </div></section>
    <div className="results-bar"><p><strong>{results.length}</strong> sample {results.length === 1 ? 'opportunity' : 'opportunities'}{filters.search && <> for <strong>“{filters.search}”</strong></>}</p><span>Amounts and dates are illustrative demo values.</span></div>
    {loading && <div className="loading-state" role="status">Loading the demo catalogue…</div>}
    {!loading && results.length === 0 && <EmptyState icon={Search} title="No scholarships found" description="Try a different search or reset some filters to explore more demo examples." action={<button className="button button--outline" onClick={reset}>Reset filters</button>} />}
    <div className="scholarship-grid">{results.map((item) => <ScholarshipCard key={item.id} scholarship={item} onEligibility={setChecker} />)}</div>
    <p className="catalogue-bottom-note"><ArrowDownWideNarrow size={15} /> Showing all {results.length} matching demo examples. New live opportunities are not connected in this prototype.</p>
    {checker && <EligibilityChecker scholarship={checker} onClose={() => setChecker(null)} />}
  </div>;
}

function FilterSelect({ name, label, value, onChange, options }) {
  return <label>{label}<select name={name} value={value} onChange={onChange}><option value="">Any</option>{options.map((option) => Array.isArray(option) ? <option key={option[0]} value={option[0]}>{option[1]}</option> : <option key={option} value={option}>{option}</option>)}</select></label>;
}
