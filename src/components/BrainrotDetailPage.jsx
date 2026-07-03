import { Link, useParams } from 'react-router-dom';
import MutationBadge from './MutationBadge.jsx';
import { formatDateTime, formatNumber, getMutationNames } from '../utils/brainrots.js';

export default function BrainrotDetailPage({ brainrots, lastUpdated, loading, error }) {
  const { name } = useParams();
  const decodedName = decodeURIComponent(name || '');
  const brainrot = brainrots.find((item) => item.name.toLowerCase() === decodedName.toLowerCase());
  const mutationNames = getMutationNames(brainrot ? [brainrot] : []);

  if (loading) {
    return <main className="page-shell"><p className="state-message">Loading Brainrot details...</p></main>;
  }

  if (error) {
    return <main className="page-shell"><p className="state-message error">{error}</p></main>;
  }

  if (!brainrot) {
    return (
      <main className="page-shell">
        <Link className="back-link" to="/">Back to dashboard</Link>
        <p className="state-message">That Brainrot was not found.</p>
      </main>
    );
  }

  return (
    <main className="page-shell detail-shell">
      <Link className="back-link" to="/">Back to dashboard</Link>

      <section className="detail-hero">
        <div className="detail-icon" aria-hidden="true">
          {brainrot.image ? <img src={brainrot.image} alt="" /> : <span>{brainrot.name.slice(0, 2)}</span>}
        </div>
        <div>
          <p className="eyebrow">{brainrot.rarity || 'Rarity TBD'}</p>
          <h1>{brainrot.name}</h1>
          <p className="exist-count large">{formatNumber(brainrot.total)} total exists</p>
          <p className="detail-updated">Last Updated: {formatDateTime(lastUpdated)}</p>
        </div>
      </section>

      <section className="detail-grid">
        {mutationNames.map((mutationName) => (
          <article key={mutationName} className="detail-stat">
            <span>{mutationName}</span>
            <strong>{formatNumber(brainrot.mutations?.[mutationName] || 0)}</strong>
          </article>
        ))}
      </section>

      <section className="detail-mutations">
        {mutationNames.map((mutationName) => (
          <MutationBadge key={mutationName} name={mutationName} count={brainrot.mutations?.[mutationName] || 0} />
        ))}
      </section>
    </main>
  );
}
