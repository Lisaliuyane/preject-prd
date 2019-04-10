import homeIcon from '@src/libs/img/nav/home.svg'
import clientIcon from '@src/libs/img/nav/client.svg'
import financialIcon from '@src/libs/img/nav/financial_management.svg'
import businessIcon from '@src/libs/img/nav/business_management.svg'
import projectIcon from '@src/libs/img/nav/project_management.svg'
import resourceIcon from '@src/libs/img/nav/resource_management.svg'
import systemIcon from '@src/libs/img/nav/system_management.svg'
import warehouseIcon from '@src/libs/img/nav/warehouse_management.svg'
import baseIcon from '@src/libs/img/nav/base_data.svg'
export const getNavs = (req, res) => {
    return [
        {
            code: 'HOME',
            name: '首页',
            icon: 'ion-android-home'
        },
        {
            code: 'client',
            name: '客户伙伴管理',
            icon: 'ion-android-contacts',
            children: [
                {
                    code: 'CLIENT_SOURCE',
                    name: '客户资料'
                },
                {
                    code: 'CLIENT_STATISTICS',
                    name: '业务统计'
                },
                {
                    code: 'CLIENT_BILL',
                    name: '客户账单'
                }
            ]
        },
        {
            code: 'res',
            name: '资源管理',
            icon: 'ion-social-buffer',
            children: [
                {
                    code: 'RESOURCE_MANAGEMENT_BASE',
                    name: '基础资源池',
                    children: [
                        {
                            code: 'RESOURCE_MANAGEMENT_BASE_CARRIER',
                            name: '承运商资源'
                        },
                        {
                            code: 'RESOURCE_MANAGEMENT_BASE_DRIVER',
                            name: '司机资源'
                        },
                        {
                            code: 'RESOURCE_MANAGEMENT_BASE_CAR',
                            name: '车辆资源'
                        },
                        {
                            code: 'RESOURCE_MANAGEMENT_BASE_NODE',
                            name: '节点资源'
                        }
                    ]
                },
                {
                    // code: 'RESOURCE_MANAGEMENT_OFFER',
                    // name: '合作报价资源管理',
                    // children: [
                    //     {
                    //         code: 'RESOURCE_MANAGEMENT_OFFER_CARRIER',
                    //         name: '承运商报价管理'
                    //     }
                    // ]
                    code: 'RESOURCE_MANAGEMENT_OFFER_CARRIER',
                    name: '承运商报价管理'
                }
            ]
        },
        // {
        //     code: 'project',
        //     name: '项目管理'
        // },
        // {
        //     code: 'business',
        //     name: '业务运作管理'
        // },
        // {
        //     code: 'finance',
        //     name: '财务管理'
        // },
        // {
        //     code: 'storehouse',
        //     name: '仓库管理'
        // },
        // {
        //     code: 'user',
        //     name: '用户管理'
        // },
        {
            code: 'basedata',
            name: '基础数据管理',
            icon: 'ion-filing',
            children: [
                {
                    code: 'WORD_BOOK',
                    name: '数据字典'
                },
                {
                    code: 'LEGAL_PERSON',
                    name: '公司法人'
                },
                {
                    code: 'ADDRESS_FILE',
                    name: '地址档案'
                },
                {
                    code: 'BASIC_DATA_CAR_TYPE',
                    name: '车型管理'
                },
                {
                    code: 'BASIC_DATA_COST_ITEM',
                    name: '费用项目'
                }
            ]
        }
    ]
}

// export const icons = {
//     HOME: 'ion-android-home',
//     CLIENT: 'ion-android-contacts',
//     RESOURCE_MANAGEMENT: 'ion-social-buffer',
//     BASE_DATA: 'ion-filing',
//     SYSTEM_MANAGEMENT: 'ion-android-settings',
//     PROJECT_MANAGEMENT: 'ion-cube',
//     BUSINESS_MANAGEMENT: 'ion-clipboard',
//     WAREHOUSE_MANAGEMENT: 'ion-cloud',
//     FINANCIAL_MANAGEMENT: 'ion-social-yen'
// }
export const icons = {
    HOME: homeIcon,
    CLIENT: clientIcon,
    RESOURCE_MANAGEMENT: resourceIcon,
    BASE_DATA: baseIcon,
    SYSTEM_MANAGEMENT: systemIcon,
    PROJECT_MANAGEMENT: projectIcon,
    BUSINESS_MANAGEMENT: businessIcon,
    WAREHOUSE_MANAGEMENT: warehouseIcon,
    FINANCIAL_MANAGEMENT: financialIcon
}