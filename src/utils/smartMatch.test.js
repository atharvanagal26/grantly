import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateScholarship, rankScholarships } from './smartMatch.js';

const sample = {
  id: 'sample',
  category: 'need',
  criteria: {
    educationLevels: ['Undergraduate'],
    courses: ['Engineering'],
    states: ['Maharashtra'],
    minPercentage: 70,
    maxFamilyIncome: 500000,
  },
  deadline: '2027-03-01',
};

const completeProfile = {
  educationLevel: 'Undergraduate',
  course: 'Engineering',
  state: 'Maharashtra',
  percentage: 82,
  annualFamilyIncome: 350000,
};

test('scores each matched criterion deterministically and explains a potential match', () => {
  const result = evaluateScholarship(completeProfile, sample);
  assert.equal(result.score, 100);
  assert.equal(result.eligibilityScore, 100);
  assert.equal(result.status, 'Potential Match');
  assert.equal(result.matched.length, 5);
  assert.equal(result.missing.length, 0);
  assert.match(result.explanation, /not an official/i);
});

test('marks required but absent profile details as missing, not a mismatch', () => {
  const result = evaluateScholarship({ educationLevel: 'Undergraduate', course: 'Engineering', percentage: 82 }, sample);
  assert.equal(result.score, 65);
  assert.equal(result.status, 'Needs Verification');
  assert.equal(result.missing.length, 2);
  assert.equal(result.mismatched.length, 0);
});

test('identifies concrete conflicts and classifies an unlikely match', () => {
  const result = evaluateScholarship({ ...completeProfile, state: 'Kerala', percentage: 40 }, sample);
  assert.equal(result.status, 'Unlikely Match');
  assert.equal(result.mismatched.length, 2);
  assert.ok(result.checks.find((item) => item.label === 'Location').status === 'mismatch');
});

test('treats a broad course and unspecified income/location criteria as non-applicable', () => {
  const broad = { criteria: { educationLevels: ['Undergraduate'], courses: ['Any course'], minPercentage: 60, maxFamilyIncome: null, states: [] } };
  const result = evaluateScholarship({ educationLevel: 'Undergraduate', percentage: 80 }, broad);
  assert.equal(result.score, 100);
  assert.equal(result.status, 'Potential Match');
  assert.deepEqual(result.checks.map((item) => item.label), ['Education level', 'Academic performance']);
});

test('category preference influences relevance, but does not create an eligibility mismatch', () => {
  const aligned = evaluateScholarship({ ...completeProfile, interests: ['need'] }, sample);
  const notSelected = evaluateScholarship({ ...completeProfile, interests: ['merit'] }, sample);

  assert.equal(aligned.score, 100);
  assert.equal(aligned.preference.aligned, true);
  assert.equal(aligned.status, 'Potential Match');
  assert.equal(notSelected.eligibilityScore, 100);
  assert.equal(notSelected.score, 90);
  assert.equal(notSelected.preference.aligned, false);
  assert.equal(notSelected.status, 'Potential Match');
  assert.equal(notSelected.mismatched.length, 0);
  assert.match(notSelected.preference.explanation, /not make you ineligible/i);
});

test('ranks matching category preferences ahead of a nearer deadline when criteria are equal', () => {
  const laterNeed = { ...sample, id: 'later-need', deadline: '2027-04-01' };
  const earlierMerit = { ...sample, id: 'earlier-merit', category: 'merit', deadline: '2027-02-01' };
  const profile = { ...completeProfile, interests: ['need'] };
  const ranked = rankScholarships(profile, [earlierMerit, laterNeed]);

  assert.deepEqual(ranked.map(({ scholarship }) => scholarship.id), ['later-need', 'earlier-merit']);
  assert.ok(ranked[0].match.score > ranked[1].match.score);
});

test('ranks equally fitting opportunities by deadline after score', () => {
  const later = { ...sample, id: 'later', deadline: '2027-04-01' };
  const earlier = { ...sample, id: 'earlier', deadline: '2027-02-01' };
  const weak = { ...sample, id: 'weak', criteria: { educationLevels: ['Postgraduate'], courses: ['Law'], minPercentage: 90, maxFamilyIncome: 100000, states: ['Kerala'] } };
  const ranked = rankScholarships(completeProfile, [later, weak, earlier]);
  assert.deepEqual(ranked.map((item) => item.scholarship.id), ['earlier', 'later', 'weak']);
  assert.equal(ranked[0].match.score, ranked[1].match.score);
  assert.ok(ranked[1].match.score > ranked[2].match.score);
});
