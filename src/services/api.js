import { scholarships as demoScholarships } from '../data/scholarships.js';
import { notices as demoNotices } from '../data/notices.js';
import { resources as demoResources } from '../data/resources.js';

const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

async function getJson(path, fallback) {
  try {
    const response = await fetch(`${base}${path}`, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`Request failed (${response.status})`);
    return await response.json();
  } catch {
    return fallback;
  }
}

export async function fetchScholarships() {
  return getJson('/api/scholarships', demoScholarships);
}
export async function fetchNotices() {
  return getJson('/api/notices', demoNotices);
}
export async function fetchResources() {
  return getJson('/api/resources', demoResources);
}
