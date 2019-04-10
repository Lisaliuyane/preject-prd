export const dateSelectData = () => {
    let arry = []
    arry.push({id: -1, name: '自然月'})
    for (let i = 0; i < 31; i++) {
        arry.push({id: i + 1, name: (i + 1) + '号'})
    }
    return arry
}