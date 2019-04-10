import React from 'react'
import BasicView from '@src/views/BasicView'
import { inject, observer } from "mobx-react"
import { Form, Input, Button, message } from 'antd';
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import { children, id } from './power'
// import Area from './area'
// import Province from './province'
import RemoteSelect from '@src/components/select_databook'
// import City from './city'
// import County from './county'
// import Street from './street'
import Modal from '@src/components/modular_window';
import TableView from './table_view'
import './index.less'
// import { TestData } from './test'

const FormItem = Form.Item;
const power = Object.assign({}, children, id)


function testString(str, s) {
    str += ','
    var reg = new RegExp(s + ',');//从头到尾都不是数字
    return reg.test(str)
};
/**
 *  基础数据 地址档案
 * 
 * @export
 * @class AddressFile
 * @extends BasicView
 */
@inject('mobxTabsData')
@inject('mobxWordBook')
@inject('rApi')
@observer
export default class AddressFile extends BasicView {


    state = {
        open: false,
        loading1: false,
        loading2: false,
        loading3: false,
        loading4: false,
        isEdit: false,
        sp: {},
        sc: {},
        sd: {},
        ss: {},
        provinceOptions: [],
        cityOptions: [],
        countyOptions: [],
        streetOptions: [],
        title: '',
        area: null,
        areadata: 0,
    }

    changeOpen = (state) => {
        this.setState({
            open: state
        })
    }

    addNew = (d) => {
        this.setState({ open: true, title: d.title })
    }

    initData = () => {

    }

    onChangeValue = d => {
        //console.log('onChangeValue_area', d)
        this.setState({ areadata: d })
    }

    onSave = () => {
        let { rApi }= this.props
        let codes1 = this.ProvinceView.getCodes()
        let codes2 = this.CityView.getCodes()
        let codes = [...codes1, ...codes2]
        codes = codes.join(',')
        rApi.bindArea({codeIds: codes, areaId: this.state.area}).then(e => {
            message.success('操作成功！')
            this.setState({isEdit: false}, () => {
                this.loadProvinces()
            })
        }).catch(e => {
            message.error('操作失败！')
        })
    }


    componentDidMount() {
        this.loadProvinces()
    }

    loadProvinces = () => {
        let { rApi } = this.props
        this.setState({ loading1: true })
        rApi.getProvinces().then(provinces => {
            this.setState({ 
                cityOptions: [],
                countyOptions: [],
                streetOptions: [],
                loading1: false, 
                provinceOptions: provinces })
        }).catch(e => {
            this.setState({ loading1: false })
        })
    }

    loadcitys = (value) => {
        let { rApi } = this.props
        this.setState({ loading2: true , sp: value})
        rApi.getCitys(value).then(res => {
            this.setState({ loading2: false, cityOptions: res })
        }).catch(e => {
            this.setState({ loading2: false })
        })
    }

    loadcountys = (value) => {
        let { rApi } = this.props
        this.setState({ loading3: true, sc: value })
        rApi.getCountys(value).then(res => {
            this.setState({ loading3: false, countyOptions: res })
        }).catch(e => {
            this.setState({ loading3: false })
        })
    }

    loadstreets = (value) => {
        let { rApi } = this.props
        this.setState({ loading4: true, sd: value })
        rApi.getStreets(value).then(res => {
            this.setState({ loading4: false, streetOptions: res })
        }).catch(e => {
            this.setState({ loading4: false })
        })
    }

    render() {
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 }
        };
        const {
            area,
            provinceOptions,
            cityOptions,
            countyOptions,
            streetOptions,
            loading1,
            loading2,
            loading3,
            loading4,
            isEdit
        } = this.state
        let provinces = provinceOptions
        if (!isEdit && area) {
            provinces = provinces.slice().filter(ele => {
                // console.log('provinces', testString(ele.areaId ? ele.areaId.toString() : '', this.state.area))
                return testString(ele.areaId ? ele.areaId.toString() : '', this.state.area)
            })
        }
        // let citys = cityOptions
        // if (!isEdit && area) {
        //     citys = citys.slice().filter(ele => {
        //         return testString(ele.areaId ? ele.areaId.toString() : '', this.state.area)
        //     })
        // }
        return (
            <div className="default-background" style={{ minHeight: this.props.minHeight }}>
                <Modal changeOpen={this.changeOpen} open={this.state.open} title={this.state.title} footer={[<Button key='close'>取消</Button>, <Button key='ok'>确定</Button>]}>
                    <Form layout='horizontal'>
                        <FormItem />
                        <FormItem
                            label="名字"
                            {...formItemLayout}
                        >
                            <Input defaultValue={this.state.remarker} placeholder="" />
                        </FormItem>
                    </Form>
                </Modal>
                <div className='address-header flex flex-vertical-center'>
                    <div className='flex1'>
                        地址档案
                    </div>
                    <div style={{ width: 100, marginRight: 5 }}>
                        <RemoteSelect
                            onChangeValue={
                                e => {
                                    let id = e ? e.id : 0
                                    this.setState({ area: id }, this.onChangeValue({ e }))
                                }
                            }
                            placeholder='所属片区'
                            text="片区">
                        </RemoteSelect>
                    </div>
                    {
                        area ? 
                        <div>
                        {
                            isEdit ?
                                <div>
                                    <Button style={{ marginRight: 5 }} onClick={() => this.setState({ isEdit: false })}>取消</Button>
                                    <Button onClick={this.onSave}>保存</Button>
                                </div>
                                :
                                <FunctionPower power={power.AREA_CONFIG}>
                                    <Button onClick={() => this.setState({ isEdit: true })}>配置</Button>
                                </FunctionPower>
                        }
                        </div> : null
                    }
                </div>
                {
                    //     <p>
                    //     地址格式：广东省/深圳市/西丽街道 （华南片区）
                    // </p>
                }
                <div className="flex address-file">
                    {
                        // <Area maxHeight={this.props.maxHeight} addNew={this.addNew} />
                        // <Province addNew={this.addNew} />
                    }
                    <TableView
                        isHaveAction
                        loading={loading1}
                        getref={ref => {this.ProvinceView = ref}}
                        isEdit={this.state.isEdit}
                        title='省份列表'
                        area={this.state.area}
                        clickLoadData={this.loadcitys}
                        dataSource={provinces} />
                    <TableView
                        isCity
                        isHaveAction
                        loading={loading2}
                        area={this.state.area}
                        getref={ref => {this.CityView = ref}}
                        isEdit={this.state.isEdit}
                        title={ '市级列表' + (this.state.sp.name ? ` (${this.state.sp.name})` : '')}
                        clickLoadData={this.loadcountys}
                        dataSource={cityOptions} />
                    <TableView
                        loading={loading3}
                        title={ '区县列表' + (this.state.sc.name ? ` (${this.state.sc.name})` : '')}
                        clickLoadData={this.loadstreets}
                        dataSource={countyOptions} />
                    <TableView
                        loading={loading4}
                        title={ '街道、镇列表' + (this.state.sd.name ? ` (${this.state.sd.name})` : '')}
                        dataSource={streetOptions} />
                    {
                        /**
                        <City addNew={this.addNew} />
                        <County addNew={this.addNew} />
                        <Street addNew={this.addNew} />
                        */
                    }
                </div>
            </div>
        )
    }
}
