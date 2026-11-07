import { useMemo, useState } from 'react';
import { ArrowUpDown, Bookmark, Search } from 'lucide-react';
import { useAppData } from '../context/AppContext.jsx';
import { useCatalogue } from '../context/CatalogueContext.jsx';
import { DemoBadge, EmptyState, PageHeading } from '../components/UI.jsx';
import { ScholarshipCard } from '../components/UI.jsx';

export default function SavedPage() {
  const { savedIds } = useAppData();
  const { scholarships } = useCatalogue();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('name');
  const saved = useMemo(() => {
    let list = scholarships.filter((item) => savedIds.includes(item.id));
    if (query.trim()) list = list.filter((item) => `${item.name} ${item.provider}`.toLowerCase().includes(query.toLowerCase()));
    if (sort === 'deadline') list = [...list].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    else if (sort === 'amount') list = [...list].sort((a, b) => b.amount - a.amount);
    else list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [scholarships, savedIds, query, sort]);
  return <div className="page-content"><PageHeading eyebrow="YOUR SHORTLIST" title="Saved scholarships" description="Keep the opportunities you want to revisit close at hand." action={<DemoBadge />} />
    <div className="saved-toolbar"><label className="search-box"><Search size={17} /><span className="sr-only">Search saved scholarships</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your saved list" /></label><label className="sort-control"><ArrowUpDown size={16} /><span>Sort</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="name">Name</option><option value="deadline">Deadline</option><option value="amount">Amount</option></select></label><span className="saved-count">{saved.length} shown · {savedIds.length} saved</span></div>
    {saved.length === 0 ? <EmptyState icon={Bookmark} title={query ? 'No saved items match' : 'Your shortlist is ready when you are'} description={query ? 'Try another search term.' : 'Save a demo opportunity from discovery to keep its details here. Your list persists in this browser.'} action={query ? <button className="button button--outline" onClick={() => setQuery('')}>Clear search</button> : <a className="button button--primary" href="/discover">Explore demo scholarships</a>} /> : <div className="scholarship-grid">{saved.map((item) => <ScholarshipCard key={item.id} scholarship={item} />)}</div>}
  </div>;
}
