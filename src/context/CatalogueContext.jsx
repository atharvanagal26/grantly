import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchNotices, fetchResources, fetchScholarships } from '../services/api.js';
import { readStorage, writeStorage } from '../utils/storage.js';

const CatalogueContext = createContext(null);
const emptyAdmin = { scholarshipEdits: {}, removedIds: [], addedScholarships: [], notices: [] };

function applyAdmin(baseScholarships, admin) {
  const removed = new Set(admin.removedIds);
  const edited = baseScholarships.filter((item) => !removed.has(item.id)).map((item) => ({ ...item, ...(admin.scholarshipEdits[item.id] || {}) }));
  const additions = admin.addedScholarships.filter((item) => !removed.has(item.id));
  return [...edited, ...additions];
}

export function CatalogueProvider({ children }) {
  const [base, setBase] = useState({ scholarships: [], notices: [], resources: [], loading: true });
  const [admin, setAdmin] = useState(() => readStorage('grantly:admin-data', emptyAdmin));
  useEffect(() => { writeStorage('grantly:admin-data', admin); }, [admin]);
  useEffect(() => {
    let live = true;
    Promise.all([fetchScholarships(), fetchNotices(), fetchResources()])
      .then(([scholarships, notices, resources]) => {
        if (live) setBase({ scholarships, notices, resources, loading: false });
      })
      .catch(() => { if (live) setBase((current) => ({ ...current, loading: false })); });
    return () => { live = false; };
  }, []);

  const actions = useMemo(() => ({
    saveAdminScholarship: (item) => setAdmin((current) => {
      const existing = base.scholarships.some((record) => record.id === item.id);
      if (existing) return { ...current, scholarshipEdits: { ...current.scholarshipEdits, [item.id]: item } };
      return { ...current, removedIds: current.removedIds.filter((id) => id !== item.id), addedScholarships: [...current.addedScholarships.filter((record) => record.id !== item.id), item] };
    }),
    removeAdminScholarship: (id) => setAdmin((current) => ({
      ...current,
      removedIds: current.removedIds.includes(id) ? current.removedIds : [...current.removedIds, id],
      addedScholarships: current.addedScholarships.filter((item) => item.id !== id),
    })),
    addAdminNotice: (notice) => setAdmin((current) => ({ ...current, notices: [notice, ...current.notices] })),
  }), [base.scholarships]);

  const value = useMemo(() => ({
    scholarships: applyAdmin(base.scholarships, admin),
    notices: [...admin.notices, ...base.notices],
    resources: base.resources,
    loading: base.loading,
    ...actions,
  }), [base, admin, actions]);

  return <CatalogueContext.Provider value={value}>{children}</CatalogueContext.Provider>;
}

export function useCatalogue() {
  const value = useContext(CatalogueContext);
  if (!value) throw new Error('useCatalogue must be used inside CatalogueProvider.');
  return value;
}
