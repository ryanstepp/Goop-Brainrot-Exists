import { useMemo, useState } from 'react';
import BrainrotCard from './BrainrotCard.jsx';
import SearchBar from './SearchBar.jsx';
import { formatDateTime, formatNumber, getMutationNames } from '../utils/brainrots.js';

export default function Dashboard({ brainrots, lastUpdated, loading, error }) {
  const [query, setQuery] = useState('');
  const [mutationFilter, setMutationFilter] = useState('All');
  const [sortMode, setSortMode] = useState('highest');

  const mutationNames = useMemo(() => getMutationNames(brainrots), [brainrots]);

  const filteredBrainrots = useMemo(() => {
    return brainrots
      .filter((brainrot) => brainrot.name.toLowerCase().includes(query.toLowerCase()))
      .filter((brainrot) => mutationFilter === 'All' || Number(brainrot.mutations?.[mutationFilter] || 0) > 0)
      .sort((a, b) => {
        if (sortMode === 'lowest') return a.total - b.total;
        if (sortMode === 'alphabetical') return a.name.localeCompare(b.name);
        return b.total - a.total;
      });
  }, [brainrots, mutationFilter, query, sortMode]);

  const totalExists = brainrots.reduce((sum, brainrot) => sum + Number(brainrot.total || 0), 0);
  const mostCommon = [...brainrots].sort((a, b) => b.total - a.total)[0];
  const rarest = [...brainrots].filter((brainrot) => brainrot.total > 0).sort((a, b) => a.total - b.total)[0];

  return (
    <main className="page-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Survive GOOP For Brainrots</p>
          <h1>Brainrot Exist Counts</h1>
          <p className="hero-copy">Live Roblox inventory tracking for every Brainrot and every mutation.</p>
        </div>
        <div className="last-updated">
          <span>Last Updated</span>
          <strong>{formatDateTime(lastUpdated)}</strong>
        </div>
      </section>

      <section className="stats-grid">
        <article>
          <span>Total Brainrots Tracked</span>
          <strong>{formatNumber(brainrots.length)}</strong>
        </article>
        <article>
          <span>Total Exists</span>
          <strong>{formatNumber(totalExists)}</strong>
        </article>
        <article>
          <span>Most Common</span>
          <strong>{mostCommon?.name || 'None'}</strong>
        </article>
        <article>
          <span>Rarest Brainrot</span>
          <strong>{rarest?.name || 'None'}</strong>
        </article>
      </section>

      <section className="toolbar">
        <SearchBar value={query} onChange={setQuery} />

        <label>
          <span>Mutation</span>
          <select value={mutationFilter} onChange={(event) => setMutationFilter(event.target.value)}>
            <option value="All">All mutations</option>
            {mutationNames.map((mutationName) => (
              <option key={mutationName} value={mutationName}>
                {mutationName}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Sort</span>
          <select value={sortMode} onChange={(event) => setSortMode(event.target.value)}>
            <option value="highest">Highest exist count</option>
            <option value="lowest">Lowest exist count</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </label>
      </section>

      {loading && <p className="state-message">Loading Brainrot counts...</p>}
      {error && <p className="state-message error">{error}</p>}

      {!loading && !error && (
        <section className="card-grid">
          {filteredBrainrots.map((brainrot) => (
            <BrainrotCard key={brainrot.name} brainrot={brainrot} />
          ))}
          {filteredBrainrots.length === 0 && <p className="state-message">No Brainrots match that search.</p>}
        </section>
      )}
    </main>
  );
}
