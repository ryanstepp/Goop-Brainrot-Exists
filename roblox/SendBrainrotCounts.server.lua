-- Put this Script in ServerScriptService.
-- Enable Game Settings > Security > Allow HTTP Requests in Roblox Studio.

local HttpService = game:GetService("HttpService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local ServerStorage = game:GetService("ServerStorage")

local API_URL = "http://localhost:3001/api/update-counts" -- Replace with your deployed website URL.
local API_KEY = "change-this-secret-key" -- Must match BRAINROT_API_KEY on your backend.

local MUTATION_FOLDER_NAMES = {
	"Normal",
	"Gold",
	"Diamond",
	"Rainbow",
	"Galaxy",
	"Lava",
	"Candy",
	"Glitch",
	"Radioactive",
}

local function getBrainrotsRoot()
	return ReplicatedStorage:FindFirstChild("Brainrots") or ServerStorage:FindFirstChild("Brainrots")
end

local function addBrainrotCount(countsByName, brainrotName, mutationName)
	if not countsByName[brainrotName] then
		countsByName[brainrotName] = {
			name = brainrotName,
			total = 0,
			mutations = {},
		}
	end

	local brainrot = countsByName[brainrotName]
	brainrot.total += 1
	brainrot.mutations[mutationName] = (brainrot.mutations[mutationName] or 0) + 1
end

local function collectBrainrotCounts()
	local root = getBrainrotsRoot()
	local countsByName = {}

	if not root then
		warn("No Brainrots folder found in ReplicatedStorage or ServerStorage.")
		return {}
	end

	for _, mutationName in ipairs(MUTATION_FOLDER_NAMES) do
		local mutationFolder = root:FindFirstChild(mutationName)

		if mutationFolder then
			for _, brainrotInstance in ipairs(mutationFolder:GetChildren()) do
				addBrainrotCount(countsByName, brainrotInstance.Name, mutationName)
			end
		end
	end

	local brainrots = {}

	for _, brainrotData in pairs(countsByName) do
		table.insert(brainrots, brainrotData)
	end

	return brainrots
end

local function sendCounts()
	local payload = {
		brainrots = collectBrainrotCounts(),
	}

	local success, response = pcall(function()
		return HttpService:RequestAsync({
			Url = API_URL,
			Method = "POST",
			Headers = {
				["Content-Type"] = "application/json",
				["x-api-key"] = API_KEY,
			},
			Body = HttpService:JSONEncode(payload),
		})
	end)

	if not success then
		warn("Failed to send Brainrot counts:", response)
		return
	end

	if not response.Success then
		warn("Brainrot count API error:", response.StatusCode, response.Body)
		return
	end

	print("Brainrot counts sent successfully:", response.Body)
end

sendCounts()

-- Optional: send fresh counts every 5 minutes while the server is running.
while task.wait(300) do
	sendCounts()
end
