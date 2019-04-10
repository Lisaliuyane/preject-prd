import load from '@src/views/layout/modules_load'
import {
    id
} from './power_hide'

let module = {}
module[id.id] = {}
module[id.id].component = load(() =>
    import ('./index'))
module[id.id].name = id.name
module[id.id].id = id

export default module