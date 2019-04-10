const moduleName = 'account/'
const book = require('../../../store/wordbooknav')
let {booktypes0, booktypes1, booktypes2, booktypes3, booktypes4, booktypes5, booktypes6, booktypes7, booktypes8, booktypes9, allbooktypes} = book
const bookKeyToCode = (data) => {
    return data.map(item => {
        return {
            type: 'view',
            method: 'POST',
            typeId: item.id,
            url: item.id,
            name: item.text,
            id: item.key
        }
    })
}

let types = [
    {
        name: '业务相关',
        type: 'view',
        id: 'BASIC_DATA1',
        children: bookKeyToCode(booktypes1)
    },
    {
        name: '车辆相关',
        type: 'view',
        id: 'BASIC_DATA2',
        children: bookKeyToCode(booktypes2)
    },
    {
        name: '结算相关',
        type: 'view',
        id: 'BASIC_DATA3',
        children: bookKeyToCode(booktypes3)
    }, 
    {
        name: '异常相关',
        type: 'view',
        id: 'BASIC_DATA4',
        children: bookKeyToCode(booktypes4)
    },
    {
        name: '单位相关',
        type: 'view',
        id: 'BASIC_DATA5',
        children: bookKeyToCode(booktypes5)
    },
    {
        name: '标签相关',
        type: 'view',
        id: 'BASIC_DATA6',
        children: bookKeyToCode(booktypes6)
    },
    {
        name: '用户相关',
        type: 'view',
        id: 'BASIC_DATA7',
        children: bookKeyToCode(booktypes7)
    },
    {
        name: '仓库相关',
        type: 'view',
        id: 'BASIC_DATA8',
        children: bookKeyToCode(booktypes9)
    },
    {
        name: '其他',
        type: 'view',
        id: 'BASIC_DATA9',
        children: bookKeyToCode(booktypes8)
    }
]
module.exports.id =  {
    id: 'WORD_BOOK',
    method: 'POST',
    name: '数据字典',
    type: 'menu'
}


// let moduleName = ''
module.exports.children = {
    // REGISTER: {
    //     id: 'WORD_BOOK_GET_LIST',
    //     apiName: 'getle',
    //     method: 'POST',
    //     name: '获取列表',
    //     type: 'view',
    //     url: `${moduleName}views/register`
    // },
    NAV: {
        id: 'WORD_BOOK_NAV',
        name: '数据字典',
        type: 'view',
        children: types
    }
}