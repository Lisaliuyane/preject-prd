// 物料计量项key
export const materialKeys = ['quantityCount', 'boxCount', 'boardCount', 'grossWeight', 'volume']

/* 物料规则计算
key = boardCount:板数
key = boxCount:箱数
key = quantityCount:数量
key = grossWeight:重量
key = volume:体积
ruleObj.quantityScale: 数量/箱
ruleObj.boxScale: 箱/板
ruleObj.weightScale: 重量规则
ruleObj.volumeScale: 体积规则
*/
export const ruleCalculate = (key, val, ruleObj = {
    quantityScale: 0,
    boxScale: 0,
    weightScale: 0,
    volumeScale: 0,
    perUnitWeight: '',
    perUnitVolume: ''
}) => {
    let {
        quantityScale,
        boxScale,
        weightScale,
        volumeScale,
        perUnitWeight,
        perUnitVolume
    } = ruleObj
    let rt = {
        boardCount: 0,
        boxCount: 0,
        quantityCount: 0,
        grossWeight: 0,
        volume: 0
    }
    // console.log('ruleCalculate', key, val, quantityScale)
    switch (key) {
        case 'boardCount': //板数
            rt.boardCount = val
            if (!isNaN(boxScale) && boxScale) {
                rt.boxCount = val * boxScale
                if (!isNaN(quantityScale) && quantityScale) {
                    rt.quantityCount = val * boxScale * quantityScale
                }
            }
            break;

        case 'boxCount': //箱数
            rt.boxCount = val
            if (!isNaN(boxScale) && boxScale) {
                rt.boardCount = Math.ceil(val / boxScale)
            }
            if (!isNaN(quantityScale) && quantityScale) {
                rt.quantityCount = val * quantityScale
            }
            break;

        case 'quantityCount': //数量
            rt.quantityCount = val
            if (!isNaN(quantityScale) && quantityScale) {
                rt.boxCount = Math.ceil(val / quantityScale)
                if (!isNaN(boxScale) && boxScale) {
                    rt.boardCount = Math.ceil(val / quantityScale / boxScale)
                }
            }
            break;

        default:
            break;
    }
    if (perUnitWeight === 3 && !isNaN(weightScale)) {
        rt.grossWeight = rt.quantityCount * weightScale
    } else if (perUnitWeight === 2 && !isNaN(weightScale)) {
        rt.grossWeight = rt.boxCount * weightScale
    } else if (perUnitWeight === 1 && !isNaN(weightScale)) {
        rt.grossWeight = rt.boardCount * weightScale
    }
    if (perUnitVolume === 3 && !isNaN(volumeScale)) {
        rt.volume = rt.quantityCount * volumeScale
    } else if (perUnitVolume === 2 && !isNaN(volumeScale)) {
        rt.volume = rt.boxCount * volumeScale
    } else if (perUnitVolume === 1 && !isNaN(volumeScale)) {
        rt.volume = rt.boardCount * volumeScale
    }
    // console.log('rt', rt)
    return rt
}