export const dateSelectData = () => {
    let arry = []
    arry.push({id: -1, name: '自然月'})
    for (let i = 0; i < 30; i++) {
        arry.push({id: i + 1, name: (i + 1) + '号'})
    }
    return arry
}

export const likeIdToName = (id) => {
    // console.log('likeIdToName', id)
    if ( typeof id === 'number' && id > -2 && id < 31) {
        let datas = dateSelectData()
        let name = datas.filter(item => item.id === id)[0].name
        return name
    }
    return ''
}
