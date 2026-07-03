import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data', 'brainrots.json');
const CLIENT_DIST = path.join(__dirname, '..', 'dist');
const PORT = process.env.PORT || 3001;
const API_KEY = process.env.BRAINROT_API_KEY || 'change-this-secret-key';

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// The JSON file keeps the starter project simple. Swap this for a database later if needed.
async function readBrainrotData() {
  const raw = await fs.readFile(DATA_FILE, 'utf8');
  return JSON.parse(raw);
}

async function writeBrainrotData(data) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// Accept any future mutation name Roblox sends, as long as its count is a valid number.
function cleanMutationCounts(mutations = {}) {
  return Object.entries(mutations).reduce((cleaned, [mutationName, count]) => {
    const safeName = String(mutationName).trim();
    const safeCount = Number(count);

    if (safeName && Number.isFinite(safeCount) && safeCount >= 0) {
      cleaned[safeName] = Math.floor(safeCount);
    }

    return cleaned;
  }, {});
}

function normalizeBrainrot(brainrot) {
  const name = String(brainrot?.name || '').trim();
  const mutations = cleanMutationCounts(brainrot?.mutations);
  const mutationTotal = Object.values(mutations).reduce((sum, count) => sum + count, 0);
  const givenTotal = Number(brainrot?.total);

  return {
    name,
    total: Number.isFinite(givenTotal) && givenTotal >= 0 ? Math.floor(givenTotal) : mutationTotal,
    rarity: String(brainrot?.rarity || 'Unknown'),
    image: String(brainrot?.image || ''),
    mutations
  };
}

// Roblox servers must send this secret in the x-api-key header to update live counts.
function requireApiKey(req, res, next) {
  const providedKey = req.header('x-api-key');

  if (!providedKey || providedKey !== API_KEY) {
    return res.status(401).json({ error: 'Invalid or missing API key.' });
  }

  next();
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/brainrots', async (_req, res) => {
  try {
    const data = await readBrainrotData();
    res.json(data);
  } catch (error) {
    console.error('Failed to read brainrot data:', error);
    res.status(500).json({ error: 'Could not load brainrot data.' });
  }
});

app.post('/api/update-counts', requireApiKey, async (req, res) => {
  try {
    if (!Array.isArray(req.body?.brainrots)) {
      return res.status(400).json({ error: 'Body must include a brainrots array.' });
    }

    const brainrots = req.body.brainrots
      .map(normalizeBrainrot)
      .filter((brainrot) => brainrot.name);

    const nextData = {
      lastUpdated: new Date().toISOString(),
      brainrots
    };

    await writeBrainrotData(nextData);

    res.json({
      message: 'Brainrot counts updated.',
      lastUpdated: nextData.lastUpdated,
      brainrotsUpdated: brainrots.length
    });
  } catch (error) {
    console.error('Failed to update brainrot data:', error);
    res.status(500).json({ error: 'Could not update brainrot data.' });
  }
});

app.use(express.static(CLIENT_DIST));

app.get('*', (_req, res) => {
  res.sendFile(path.join(CLIENT_DIST, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Brainrot Exist Counts running on http://localhost:${PORT}`);
});
