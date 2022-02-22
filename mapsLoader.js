import { maps } from "./js/maps.js"
import { updateLayers } from "./js/technical/layerSupport.js"
import { setupTemp, updateTemp } from "./js/technical/temp.js"
import { getStartPlayer } from "./js/utils/save.js"

var loadMaps = function (maps) {
    let ret = {}
    for (const map in maps) {
        const [layers, player, tmp, funcs, isEndgame, canGenPoints, getPointGen, getStartPoints, ROW_LAYERS, TREE_LAYERS, OTHER_LAYERS] = getMapDefaultState(map)
        ret[map] = {layers, player, tmp, funcs, isEndgame, canGenPoints, getPointGen, getStartPoints, ROW_LAYERS, TREE_LAYERS, OTHER_LAYERS}
    }
    return ret
}

var getMapDefaultState = function (map) {
    global.isEndgame = maps[map].isEndgame
    global.canGenPoints = maps[map].canGenPoints
    global.getPointGen = maps[map].getPointGen
    global.getStartPoints = maps[map].getStartPoints
    global.stateChangeTree = { tmp: {}, player: {} }
    global.funcs = {}
    global.tmp = {}
    global.temp = tmp
    global.player = {}
    global.layers = maps[map].layers
    global.player = getStartPlayer()
    updateLayers()
    setupTemp()
    updateTemp()
    updateTemp()
    return [layers, player, tmp, funcs, isEndgame, canGenPoints, getPointGen, getStartPoints, ROW_LAYERS, TREE_LAYERS, OTHER_LAYERS]
}

export { loadMaps }