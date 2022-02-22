import Decimal from "break_eternity.js";
import { decimalOne, decimalZero } from "./layerSupport.js";

export var NaNalert = false;

// Tmp will not call these
export var activeFunctions = [
	"startData", "onPrestige", "doReset", "update", "automate",
	"buy", "buyMax", "respec", "onPress", "onClick", "onHold", "masterButtonPress",
	"sellOne", "sellAll", "pay", "actualCostFunction", "actualEffectFunction",
	"effectDescription", "display", "fullDisplay", "effectDisplay", "rewardDisplay",
	"tabFormat", "content",
	"onComplete", "onPurchase", "onEnter", "onExit", "done",
	"getUnlocked", "getStyle", "getCanClick", "getTitle", "getDisplay"
]

export var doNotCallTheseFunctionsEveryTick = ["doReset", "buy", "buyMax", "onPurchase", "blowUpEverything", "castAllSpells", "completeInBulk", "startMastery", "completeMastery"]

export var alwaysKeepTheseVariables = ["primeMiles", "auto", "autoExt", "autoBld", "autoW", "autoGhost", "autoSE", "autoNN", "keepPosNeg", "distrAll", "spellInput", "pseudoUpgs", "maxToggle"]

//quick fix

export var noCall = doNotCallTheseFunctionsEveryTick
for (let item in noCall) {
	activeFunctions.push(noCall[item])
}

// Add the names of classes to traverse
export var traversableClasses = []

export function setupTemp() {
	tmp.pointGen = {}
	tmp.backgroundStyle = {}
	tmp.displayThings = []
	tmp.scrolled = 0
	tmp.gameEnded = false

	setupTempData(layers, tmp, funcs)
	for (let layer in layers) {
		tmp[layer].resetGain = {}
		tmp[layer].nextAt = {}
		tmp[layer].nextAtDisp = {}
		tmp[layer].canReset = {}
		tmp[layer].notify = {}
		tmp[layer].prestigeNotify = {}
		tmp[layer].computedNodeStyle = []
		setupBuyables(layer)
		tmp[layer].trueGlowColor = []
	}

	tmp.other = {
		lastPoints: player.points || decimalZero,
		oomps: decimalZero,
		screenWidth: 0,
		screenHeight: 0,
	}

	temp = tmp
}

export const boolNames = ["unlocked", "deactivated"]

export function setupTempData(layerData, tmpData, funcsData) {
	for (let item in layerData) {
		if (layerData[item] == null) {
			tmpData[item] = null
		}
		else if (layerData[item] instanceof Decimal)
			tmpData[item] = layerData[item]
		else if (Array.isArray(layerData[item])) {
			tmpData[item] = []
			funcsData[item] = []
			setupTempData(layerData[item], tmpData[item], funcsData[item])
		}
		else if ((!!layerData[item]) && (layerData[item].constructor === Object)) {
			tmpData[item] = {}
			funcsData[item] = []
			setupTempData(layerData[item], tmpData[item], funcsData[item])
		}
		else if ((!!layerData[item]) && (typeof layerData[item] === "object") && traversableClasses.includes(layerData[item].constructor.name)) {
			tmpData[item] = new layerData[item].constructor()
			funcsData[item] = new layerData[item].constructor()
		}
		else if (isFunction(layerData[item]) && !activeFunctions.includes(item)) {
			funcsData[item] = layerData[item]
			if (boolNames.includes(item))
				tmpData[item] = false
			else
				tmpData[item] = decimalOne // The safest thing to put probably?
		} else {
			tmpData[item] = layerData[item]
		}
	}
}


export function updateTemp() {
	if (tmp === undefined) {
		tmp = {}
		setupTemp()
	}

	updateTempData(layers, tmp, funcs)

	for (let layer in layers) {
		tmp[layer].resetGain = getResetGain(layer)
		tmp[layer].nextAt = getNextAt(layer)
		tmp[layer].nextAtDisp = getNextAt(layer, true)
		tmp[layer].canReset = canReset(layer)
		tmp[layer].trueGlowColor = tmp[layer].glowColor
		tmp[layer].notify = shouldNotify(layer)
		tmp[layer].prestigeNotify = prestigeNotify(layer)
		if (tmp[layer].passiveGeneration === true) tmp[layer].passiveGeneration = 1 // new Decimal(true) = decimalZero

	}

	tmp.pointGen = getPointGen()

}

export function updateTempData(layerData, tmpData, funcsData, useThis) {
	for (let item in funcsData) {
		if (Array.isArray(layerData[item])) {
			if (item !== "tabFormat" && item !== "content") // These are only updated when needed
				updateTempData(layerData[item], tmpData[item], funcsData[item], useThis)
		}
		else if ((!!layerData[item]) && (layerData[item].constructor === Object) || (typeof layerData[item] === "object") && traversableClasses.includes(layerData[item].constructor.name)) {
			updateTempData(layerData[item], tmpData[item], funcsData[item], useThis)
		}
		else if (isFunction(layerData[item]) && !isFunction(tmpData[item])) {
			let value

			if (useThis !== undefined) value = layerData[item].bind(useThis)()
			else value = layerData[item]()
			tmpData[item] = value

			if (["clickables", "buyables"].includes(item)) {
				for (let i in value) {
					layerData[item][i] = value[i]
					if (isPlainObject(layerData[item][i])){
						layerData[item][i]["id"] = i
						layerData[item][i]["layer"] = layerData.layer
						if (layerData[item][i].unlocked === undefined)
							layerData[item][i]["unlocked"] = true
					}
				}
			}
		}
	}
}

export function updateChallengeTemp(layer) {
	updateTempData(layers[layer].challenges, tmp[layer].challenges, funcs[layer].challenges)
}


export function updateBuyableTemp(layer) {
	updateTempData(layers[layer].buyables, tmp[layer].buyables, funcs[layer].buyables)
}

export function updateClickableTemp(layer) {
	updateTempData(layers[layer].clickables, tmp[layer].clickables, funcs[layer].clickables)
}

export function setupBuyables(layer) {
	for (let id in layers[layer].buyables) {
		if (isPlainObject(layers[layer].buyables[id])) {
			let b = layers[layer].buyables[id]
			b.actualCostFunction = b.cost
			b.cost = function (x) {
				x = (x === undefined ? player[this.layer].buyables[this.id] : x)
				return layers[this.layer].buyables[this.id].actualCostFunction(x)
			}
			b.actualEffectFunction = b.effect
			b.effect = function (x) {
				x = (x === undefined ? player[this.layer].buyables[this.id] : x)
				return layers[this.layer].buyables[this.id].actualEffectFunction(x)
			}
		}
	}
}

export function checkDecimalNaN(x) {
	return (x instanceof Decimal) && !x.eq(x)
}