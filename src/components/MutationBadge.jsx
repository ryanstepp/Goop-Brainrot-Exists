import { formatNumber } from '../utils/brainrots.js';

export default function MutationBadge({ name, count }) {
  return (
    <span className={`mutation-badge mutation-${name.toLowerCase()}`}>
      <span className="mutation-dot" />
      {name}
      <strong>{formatNumber(count)}</strong>
    </span>
  );
}
