const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export const formatMoney = (value) => currencyFormatter.format(Number(value || 0));
export const formatDate = (value, options = { day: 'numeric', month: 'short', year: 'numeric' }) => {
  if (!value) return 'Not listed';
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? 'Not listed' : new Intl.DateTimeFormat('en-IN', options).format(date);
};
export const daysUntil = (value) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${value}T00:00:00`);
  return Math.ceil((target - today) / 86400000);
};
export const deadlineLabel = (value) => {
  const days = daysUntil(value);
  if (days < 0) return 'Deadline passed';
  if (days === 0) return 'Due today';
  if (days === 1) return '1 day left';
  if (days <= 30) return `${days} days left`;
  return `Apply by ${formatDate(value, { day: 'numeric', month: 'short' })}`;
};
export const titleCase = (value = '') => value.replace(/[-_]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
