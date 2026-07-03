import { Route, Routes } from 'react-router-dom';
import BrainrotDetailPage from './components/BrainrotDetailPage.jsx';
import Dashboard from './components/Dashboard.jsx';
import { useBrainrots } from './hooks/useBrainrots.js';

export default function App() {
  const brainrotState = useBrainrots();

  return (
    <Routes>
      <Route path="/" element={<Dashboard {...brainrotState} />} />
      <Route path="/brainrot/:name" element={<BrainrotDetailPage {...brainrotState} />} />
    </Routes>
  );
}
