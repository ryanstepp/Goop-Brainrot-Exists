import { Link } from 'react-router-dom';
import { formatNumber } from '../utils/brainrots.js';
import MutationBadge from './MutationBadge.jsx';

export default function BrainrotCard({ brainrot }) {
  const mutationEntries = Object.entries(brainrot.mutations || {});

  return (
    <Link className="brainrot-card" to={`/brainrot/${encodeURIComponent(brainrot.name)}`}>
      <div className="brainrot-icon" aria-hidden="true">
        {brainrot.image ? <img src={brainrot.image} alt="" /> : <span>{brainrot.name.slice(0, 2)}</span>}
      </div>

      <div className="card-topline">
        <h2>{brainrot.name}</h2>
        <span className="rarity-pill">{brainrot.rarity || 'Rarity TBD'}</span>
      </div>

      <p className="exist-count">{formatNumber(brainrot.total)} exists</p>

      <div className="mutation-list">
        {mutationEntries.map(([mutationName, count]) => (
          <MutationBadge key={mutationName} name={mutationName} count={count} />
        ))}
      </div>
    </Link>
  );
}
