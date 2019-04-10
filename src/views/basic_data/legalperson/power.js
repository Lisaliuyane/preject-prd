const moduleName = 'common/'
module.exports.id =  {
    id: 'LEGAL_PERSON_LIST',
    method: 'POST',
    name: '公司法人',
    type: 'menu',
    apiName: 'getLegalPersonList',
    url: `${moduleName}faren/getFarens`
}

// let moduleName = ''
module.exports.children = {
    ADD_DATA: {
        id: 'LEGAL_PERSON_LIST_CODE_ADD_DATA',
        apiName: 'addLegalPerson',
        method: 'POST',
        name: '新建',
        type: 'view',
        url: `${moduleName}faren/add`
    },
    EDIT_DATA: {
        id: 'LEGAL_PERSON_LIST_EDIT_DATA',
        apiName: 'editLegalPerson',
        method: 'POST',
        name: '编辑',
        type: 'view',
        url: `${moduleName}faren/save`
    },
    DEL_DATA: {
        id: 'LEGAL_PERSON_LIST_CODE_DEL_DATA',
        apiName: 'delLegalPerson',
        method: 'GET',
        name: '删除',
        type: 'view',
        url: `${moduleName}faren/delete`
    }
    // LOOK_MORE: {
    //     id: 'LEGAL_PERSON_LIST_LOOK_MORE',
    //     name: '查看',
    //     type: 'view'
    // }
}