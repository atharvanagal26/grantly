import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { readStorage, removeStorage, writeStorage } from '../utils/storage.js';

const defaultState = {
  profile: {
    name: 'Aarav Sharma',
    email: 'student@demo.grantly',
    educationLevel: 'Undergraduate',
    course: 'Engineering',
    institution: 'Western Institute of Technology',
    state: 'Maharashtra',
    annualFamilyIncome: 360000,
    percentage: 82,
    interests: ['merit', 'need'],
  },
  savedIds: ['rise-engineering', 'udaan-rural'],
  applications: [
    { id: 'app-rise', scholarshipId: 'rise-engineering', stage: 'Preparing Documents', appliedOn: '', note: 'Review the income certificate checklist.', createdAt: new Date().toISOString() },
    { id: 'app-bridge', scholarshipId: 'bridge-need', stage: 'Interested', appliedOn: '', note: 'Check the sample criteria with my profile.', createdAt: new Date().toISOString() },
  ],
  documents: {
    'Academic marksheets': true,
    'Bonafide certificate': true,
    'Bank details': false,
    'Income certificate': false,
    'Caste certificate': false,
    'Domicile certificate': false,
    'Aadhaar or identity proof': false,
    'Passport-size photograph': true,
  },
  readNoticeIds: [],
};

const DataContext = createContext(null);
const SessionContext = createContext(null);

export function AppProviders({ children }) {
  const [data, setData] = useState(() => readStorage('grantly:demo-data', defaultState));
  const [session, setSession] = useState(() => readStorage('grantly:demo-session', null));

  useEffect(() => { writeStorage('grantly:demo-data', data); }, [data]);
  useEffect(() => {
    if (session) writeStorage('grantly:demo-session', session);
    else removeStorage('grantly:demo-session');
  }, [session]);

  const dataActions = useMemo(() => ({
    updateProfile: (profile) => setData((current) => ({ ...current, profile: { ...current.profile, ...profile } })),
    toggleSaved: (id) => setData((current) => ({
      ...current,
      savedIds: current.savedIds.includes(id) ? current.savedIds.filter((saved) => saved !== id) : [...current.savedIds, id],
    })),
    addApplication: (scholarshipId) => setData((current) => current.applications.some((item) => item.scholarshipId === scholarshipId)
      ? current
      : { ...current, applications: [...current.applications, { id: `app-${Date.now()}`, scholarshipId, stage: 'Interested', appliedOn: '', note: '', createdAt: new Date().toISOString() }] }),
    updateApplication: (id, changes) => setData((current) => ({ ...current, applications: current.applications.map((item) => item.id === id ? { ...item, ...changes } : item) })),
    removeApplication: (id) => setData((current) => ({ ...current, applications: current.applications.filter((item) => item.id !== id) })),
    setDocumentReady: (name, ready) => setData((current) => ({ ...current, documents: { ...current.documents, [name]: ready } })),
    markNoticeRead: (id) => setData((current) => ({ ...current, readNoticeIds: current.readNoticeIds.includes(id) ? current.readNoticeIds : [...current.readNoticeIds, id] })),
  }), []);

  const sessionActions = useMemo(() => ({
    loginDemo: (user) => setSession({ ...user, demo: true }),
    logout: () => setSession(null),
  }), []);

  return (
    <SessionContext.Provider value={{ session, ...sessionActions }}>
      <DataContext.Provider value={{ ...data, ...dataActions }}>{children}</DataContext.Provider>
    </SessionContext.Provider>
  );
}

export function useAppData() {
  const value = useContext(DataContext);
  if (!value) throw new Error('useAppData must be used inside AppProviders.');
  return value;
}

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error('useSession must be used inside AppProviders.');
  return value;
}
