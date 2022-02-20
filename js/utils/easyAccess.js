export function hasUpgrade(layer, id) {
	return ((player[layer].upgrades.includes(toNumber(id)) || player[layer].upgrades.includes(id.toString())) && !tmp[layer].deactivated)
}

export function hasMilestone(layer, id) {
	return ((player[layer].milestones.includes(toNumber(id)) || player[layer].milestones.includes(id.toString())) && !tmp[layer].deactivated)
}

export function hasAchievement(layer, id) {
	return ((player[layer].achievements.includes(toNumber(id)) || player[layer].achievements.includes(id.toString())) && !tmp[layer].deactivated)
}

export function hasChallenge(layer, id) {
	return ((player[layer].challenges[id]) && !tmp[layer].deactivated)
}

export function maxedChallenge(layer, id) {
	return ((player[layer].challenges[id] >= tmp[layer].challenges[id].completionLimit) && !tmp[layer].deactivated)
}

export function challengeCompletions(layer, id) {
	return (player[layer].challenges[id])
}

export function getBuyableAmount(layer, id) {
	return (player[layer].buyables[id])
}

export function setBuyableAmount(layer, id, amt) {
	player[layer].buyables[id] = amt
}

export function addBuyables(layer, id, amt) {
	player[layer].buyables[id] = player[layer].buyables[id].add(amt)
}

export function getClickableState(layer, id) {
	return (player[layer].clickables[id])
}

export function setClickableState(layer, id, state) {
	player[layer].clickables[id] = state
}

export function getGridData(layer, id) {
	return (player[layer].grid[id])
}

export function setGridData(layer, id, data) {
	player[layer].grid[id] = data
}

export function upgradeEffect(layer, id) {
	return (tmp[layer].upgrades[id].effect)
}

export function challengeEffect(layer, id) {
	return (tmp[layer].challenges[id].rewardEffect)
}

export function buyableEffect(layer, id) {
	return (tmp[layer].buyables[id].effect)
}

export function clickableEffect(layer, id) {
	return (tmp[layer].clickables[id].effect)
}

export function achievementEffect(layer, id) {
	return (tmp[layer].achievements[id].effect)
}

export function gridEffect(layer, id) {
	return (gridRun(layer, 'getEffect', player[layer].grid[id], id))
}