import load from '@src/views/layout/modules_load'

const WordBook = load(() => import('./wordbook/index.jsx'))
const AddressFile = load(() => import('./addressfile/index.jsx'))
const LegalPerson = load(() => import('./legalperson/index.jsx'))
const UnitConfig = load(() => import('./unitconfig/index.jsx'))

const module = {
    WORD_BOOK: {
        component: WordBook,
        name: '数据字典'
    },
    ADDRESS_FILE:{
        component: AddressFile,
        name: '地址档案'
    },
    LEGAL_PERSON: {
        component: LegalPerson,
        name: '公司法人'
    },
    UNIT_CONFIG:
    {
        component: UnitConfig,
        name: '单位配置'
    }
}

export default module