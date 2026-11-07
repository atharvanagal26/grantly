const normalize = (value) => String(value ?? '').trim().toLocaleLowerCase();
const normalizeCategory = (value) => {
  const category = normalize(value);
  if (category.includes('need')) return 'need';
  if (category.includes('merit')) return 'merit';
  return category;
};
const isAny = (list) => !Array.isArray(list) || list.length === 0 || list.some((item) => normalize(item) === 'any course');

export function evaluateScholarship(profile = {}, scholarship = {}) {
  const criteria = scholarship.criteria ?? scholarship;
  const checks = [];
  const addCheck = (label, weight, expected, actual, test, missingReason) => {
    if (expected === null || expected === undefined || expected === '' || (Array.isArray(expected) && expected.length === 0)) return;
    const actualPresent = actual !== null && actual !== undefined && actual !== '';
    if (!actualPresent) {
      checks.push({ key: label, label, weight, status: 'missing', expected, actual: null, explanation: missingReason });
      return;
    }
    const matched = test(expected, actual);
    checks.push({
      key: label,
      label,
      weight,
      status: matched ? 'matched' : 'mismatch',
      expected,
      actual,
      explanation: matched ? 'Your profile meets this listed sample criterion.' : 'Your current profile does not meet this listed sample criterion.',
    });
  };

  addCheck('Education level', 20, criteria.educationLevels, profile.educationLevel,
    (expected, actual) => expected.some((item) => normalize(item) === normalize(actual)),
    'Add your education level to check this requirement.');
  if (!isAny(criteria.courses)) {
    addCheck('Course', 25, criteria.courses, profile.course,
      (expected, actual) => expected.some((item) => normalize(item) === 'any course' || normalize(item) === normalize(actual)),
      'Add your course to check this requirement.');
  }
  addCheck('Academic performance', 20, criteria.minPercentage, profile.percentage,
    (expected, actual) => Number(actual) >= Number(expected),
    'Add your academic percentage to check the minimum.');
  addCheck('Family income', 20, criteria.maxFamilyIncome, profile.annualFamilyIncome,
    (expected, actual) => Number(actual) <= Number(expected),
    'Income is optional in your profile. Add it only if you want to check this sample income limit.');
  if (Array.isArray(criteria.states) && criteria.states.length > 0) {
    addCheck('Location', 15, criteria.states, profile.state,
      (expected, actual) => expected.some((item) => normalize(item) === normalize(actual)),
      'Add your state to check this regional requirement.');
  }

  const totalWeight = checks.reduce((sum, check) => sum + check.weight, 0);
  const earnedWeight = checks.reduce((sum, check) => sum + (check.status === 'matched' ? check.weight : 0), 0);
  const eligibilityScore = totalWeight ? Math.round((earnedWeight / totalWeight) * 100) : 0;
  const category = normalizeCategory(scholarship.category ?? criteria.category);
  const selectedCategories = Array.isArray(profile.interests)
    ? profile.interests.map(normalizeCategory).filter(Boolean)
    : [];
  const preference = category && selectedCategories.length > 0
    ? {
      category,
      aligned: selectedCategories.includes(category),
      explanation: selectedCategories.includes(category)
        ? 'This sample category matches your selected interests. Category preferences affect relevance only, not eligibility.'
        : 'This sample category is outside your selected interests. That does not make you ineligible; use this preference only to prioritize browsing.',
    }
    : null;
  const score = preference
    ? Math.round(eligibilityScore * 0.9 + (preference.aligned ? 10 : 0))
    : eligibilityScore;
  const hasMismatch = checks.some((check) => check.status === 'mismatch');
  const missing = checks.filter((check) => check.status === 'missing');
  const matched = checks.filter((check) => check.status === 'matched');
  let status = 'Needs Verification';
  if (hasMismatch || eligibilityScore < 45) status = 'Unlikely Match';
  else if (missing.length === 0 && eligibilityScore >= 70) status = 'Potential Match';

  const explanation = hasMismatch
    ? 'At least one listed sample condition does not match your current profile. Review the details with the official provider.'
    : missing.length
      ? `${missing.length} profile detail${missing.length === 1 ? ' is' : 's are'} missing. Add information if you choose, then check again.`
      : preference && !preference.aligned
        ? 'Your profile meets the listed sample criteria, but this example is outside your selected category preferences. That affects relevance, not eligibility. This is not an official eligibility decision.'
        : 'Your profile matches the listed sample criteria. This is not an official eligibility decision.';

  return {
    score,
    eligibilityScore,
    preference,
    status,
    checks,
    matched,
    missing,
    mismatched: checks.filter((check) => check.status === 'mismatch'),
    explanation,
    totalWeight,
  };
}

export function rankScholarships(profile, items) {
  return items
    .map((scholarship) => ({ scholarship, match: evaluateScholarship(profile, scholarship) }))
    .sort((a, b) => b.match.score - a.match.score || new Date(a.scholarship.deadline) - new Date(b.scholarship.deadline));
}
