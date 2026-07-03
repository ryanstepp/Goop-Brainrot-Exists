import { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export function useBrainrots() {
  const [brainrots, setBrainrots] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function fetchBrainrots() {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(`${API_BASE_URL}/api/brainrots`);

        if (!response.ok) {
          throw new Error('The brainrot API did not respond correctly.');
        }

        const data = await response.json();

        if (isMounted) {
          setBrainrots(Array.isArray(data.brainrots) ? data.brainrots : []);
          setLastUpdated(data.lastUpdated || null);
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(fetchError.message || 'Could not load brainrot counts.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchBrainrots();

    return () => {
      isMounted = false;
    };
  }, []);

  return { brainrots, lastUpdated, loading, error };
}
