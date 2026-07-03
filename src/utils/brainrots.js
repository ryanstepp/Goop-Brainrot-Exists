export const preferredMutationOrder = [
  'Normal',
  'Radioactive',
  'Glitch',
  'Candy',
  'Lava',
  'Galaxy',
  'Rainbow',
  'Diamond',
  'Gold'
];

export function getMutationNames(brainrots) {
  const names = new Set();

  brainrots.forEach((brainrot) => {
    Object.keys(brainrot.mutations || {}).forEach((mutationName) => names.add(mutationName));
  });

  return [...names].sort((a, b) => {
    const orderA = preferredMutationOrder.indexOf(a);
    const orderB = preferredMutationOrder.indexOf(b);

    if (orderA === -1 && orderB === -1) return a.localeCompare(b);
    if (orderA === -1) return 1;
    if (orderB === -1) return -1;
    return orderA - orderB;
  });
}

export function formatNumber(number) {
  return new Intl.NumberFormat().format(number || 0);
}

export function formatDateTime(dateValue) {
  if (!dateValue) return 'Not updated yet';

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(dateValue));
}
