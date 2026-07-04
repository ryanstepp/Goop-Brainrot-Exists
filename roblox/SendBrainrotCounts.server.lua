-- Put this Script in ServerScriptService.
-- Enable Game Settings > Security > Allow HTTP Requests in Roblox Studio.

local HttpService = game:GetService("HttpService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local ServerStorage = game:GetService("ServerStorage")

local API_URL = "http://localhost:3001/api/update-counts" -- Replace with your deployed website URL.
local API_KEY = "change-this-secret-key" -- Must match BRAINROT_API_KEY on your backend.

local COUNT_ATTRIBUTE_NAMES = {
	"Count",
	"ExistCount",
	"Exists",
	"Total",
	"Amount",
}

local COUNT_VALUE_NAMES = {
	"Count",
	"ExistCount",
	"Exists",
	"Total",
	"Amount",
}

local function getBrainrotsRoot()
	return ServerStorage:FindFirstChild("Brainrots") or ReplicatedStorage:FindFirstChild("Brainrots")
end

local function getPositiveInteger(value)
	local numberValue = tonumber(value)

	if numberValue and numberValue > 0 then
		return math.floor(numberValue)
	end

	return nil
end

local function getCountFromAttributes(instance)
	for _, attributeName in ipairs(COUNT_ATTRIBUTE_NAMES) do
		local count = getPositiveInteger(instance:GetAttribute(attributeName))

		if count then
			return count
		end
	end

	return nil
end

local function getCountFromValueObject(instance)
	if instance:IsA("IntValue") or instance:IsA("NumberValue") then
		return getPositiveInteger(instance.Value)
	end

	for _, valueName in ipairs(COUNT_VALUE_NAMES) do
		local valueObject = instance:FindFirstChild(valueName)

		if valueObject and (valueObject:IsA("IntValue") or valueObject:IsA("NumberValue")) then
			local count = getPositiveInteger(valueObject.Value)

			if count then
				return count
			end
		end
	end

	return nil
end

local function getBrainrotName(instance)
	return instance:GetAttribute("BrainrotName") or instance:GetAttribute("DisplayName") or instance.Name
end

local function getRealCount(instance)
	return getCountFromAttributes(instance) or getCountFromValueObject(instance) or 1
end

local function addBrainrotCount(countsByName, brainrotName, mutationName, amount)
	if not countsByName[brainrotName] then
		countsByName[brainrotName] = {
			name = brainrotName,
			total = 0,
			mutations = {},
		}
	end

	local brainrot = countsByName[brainrotName]
	brainrot.total += amount
	brainrot.mutations[mutationName] = (brainrot.mutations[mutationName] or 0) + amount
end

local function collectBrainrotCounts()
	local root = getBrainrotsRoot()
	local countsByName = {}

	if not root then
		warn("No Brainrots folder found in ServerStorage or ReplicatedStorage.")
		return {}
	end

	for _, mutationFolder in ipairs(root:GetChildren()) do
		if mutationFolder:IsA("Folder") then
			local mutationName = mutationFolder.Name

			for _, brainrotInstance in ipairs(mutationFolder:GetChildren()) do
				local brainrotName = getBrainrotName(brainrotInstance)
				local amount = getRealCount(brainrotInstance)

				addBrainrotCount(countsByName, brainrotName, mutationName, amount)
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

-- Sends fresh counts every 5 minutes while the server is running.
while task.wait(300) do
	sendCounts()
end
