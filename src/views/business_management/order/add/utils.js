export const expenseItemsToArray = (d) => {
    let {
        text,
        title,
        carType, // 车类型ID
        carTypeName, // 车类型名称
        costUnitId, // 费用单位ID
        costUnitName, // 费用单位名称
        expenseItemId, // 费用项目ID
        expenseItemName, // 费用项目名称
        lowestFee, // 最低收费
        intervalCostUnitName, // 限制区间单位名称
        intervalCostUnitId, // 限制区间单位ID
        endValue, // 限制区间 end
        startValue // 限制区间 start
    } = d
    let array = []
    if (costUnitName) {
        array.push({
            key: 'costUnit',
            costUnitId: costUnitId,
            costUnitName: costUnitName,
            costUnitValue: null
        })
    }
    return array
}