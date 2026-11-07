import { scholarships } from './scholarships.js';

const notice = (item, index) => ({
  id: `notice-${item.id}`,
  scholarshipId: item.id,
  title: index % 2 === 0 ? `${item.name}: demo deadline reminder` : `Explore the ${item.name} example`,
  body: index % 2 === 0
    ? 'Illustrative reminder based on the sample record’s date. This is not a live announcement or an official application notification.'
    : 'A demo catalogue spotlight. Open the sample to review its criteria and see which profile details SmartMatch would need.',
  type: index % 2 === 0 ? 'deadline' : 'spotlight',
  date: item.deadline,
  isDemo: true,
});

export const notices = scholarships.slice(0, 6).map(notice);
