# Brainrot Exist Counts

A full-stack exist-count dashboard for the Roblox game **Survive GOOP For Brainrots**.

## Features

- React + Vite frontend
- Node.js + Express backend
- `GET /api/brainrots` for the dashboard
- Secure `POST /api/update-counts` for Roblox servers
- Search, mutation filtering, and sorting
- Detail pages for each Brainrot
- Future mutations appear automatically when they are added to the data

## Install

```bash
npm install
```

## Set The API Key

Copy `.env.example` to `.env`, then change the key:

```bash
PORT=3001
BRAINROT_API_KEY=your-super-secret-key
VITE_API_BASE_URL=http://localhost:3001
```

The Roblox script must use the same secret in its `API_KEY` variable.

On Render, do not set `VITE_API_BASE_URL` unless you set it to your deployed site URL. The frontend can use same-domain API calls automatically.

## Run The Backend

```bash
npm run server
```

Backend URL:

```text
http://localhost:3001
```

## Run The Frontend

In another terminal:

```bash
npm run client
```

Frontend URL:

```text
http://localhost:5173
```

You can also run both together:

```bash
npm run dev
```

## Test The Update Endpoint

PowerShell example:

```powershell
$body = @{
  brainrots = @(
    @{
      name = "67"
      total = 1234
      mutations = @{
        Normal = 800
        Gold = 120
        Diamond = 40
        Rainbow = 10
        Galaxy = 4
      }
    }
  )
} | ConvertTo-Json -Depth 10

Invoke-RestMethod `
  -Uri "http://localhost:3001/api/update-counts" `
  -Method Post `
  -Headers @{ "x-api-key" = "your-super-secret-key" } `
  -ContentType "application/json" `
  -Body $body
```

## Roblox HttpService Setup

1. In Roblox Studio, open **Game Settings**.
2. Go to **Security**.
3. Enable **Allow HTTP Requests**.
4. Put `roblox/SendBrainrotCounts.server.lua` into `ServerScriptService`.
5. Change `API_URL` to your hosted backend URL.
6. Change `API_KEY` to match `BRAINROT_API_KEY`.

Expected Roblox folder layout:

```text
ReplicatedStorage
└── Brainrots
    ├── Normal
    ├── Gold
    ├── Diamond
    ├── Rainbow
    ├── Galaxy
    ├── Lava
    ├── Candy
    ├── Glitch
    └── Radioactive
```

The Lua script checks `ServerStorage.Brainrots` first, then `ReplicatedStorage.Brainrots`.

## Real Exist Count Storage

The Roblox script can read real counts in any of these beginner-friendly layouts.

One object per existing Brainrot:

```text
ServerStorage
└── Brainrots
    └── Gold
        ├── 67
        ├── 67
        └── Goop Kid
```

One value object per Brainrot:

```text
ServerStorage
└── Brainrots
    └── Gold
        ├── 67 (IntValue, Value = 120)
        └── Goop Kid (IntValue, Value = 80)
```

One folder/model per Brainrot with a count value:

```text
ServerStorage
└── Brainrots
    └── Gold
        └── 67
            └── Count (IntValue, Value = 120)
```

Or set an attribute named `Count`, `ExistCount`, `Exists`, `Total`, or `Amount` on the Brainrot object.

## Add More Brainrots Or Mutations

Add new mutation folders in Roblox under `Brainrots`. The Lua script finds mutation folders automatically.

The website automatically shows any mutation keys that the backend receives:

```json
{
  "brainrots": [
    {
      "name": "New Brainrot",
      "mutations": {
        "Normal": 10,
        "Toxic": 2
      }
    }
  ]
}
```

## Data Storage

The backend stores data in:

```text
server/data/brainrots.json
```

This keeps the project beginner-friendly. For a larger public game, you can later replace this with SQLite, Postgres, or another database.
