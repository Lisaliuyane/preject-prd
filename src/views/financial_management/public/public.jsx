import React from 'react'
import { ColumnItemBox } from '@src/components/table_template'
import { costItemObjectToString } from '@src/components/dynamic_table1/utils'

/* 费用项表格cell item */
export const CostItem = props => {
    const { keyName, r, totalKey } = props
    if (keyName === 'itemName') {/* 费用项目 */
        let itemName = '-'
        switch (r.expenseType) {
            case 1:
                itemName = r.name ? `${r.name}(${r.billingMethodName})` : '-'
                break
            case 2:
                itemName = costItemObjectToString(r)
                break
            case 3:
                itemName = `${r.name}(${r.billingMethodName})`
                break
            case '现金价':
                itemName = `${r.expenseName}(现金价)`
                break
            case '总计':
                itemName = '总计'
                break
            default:
                itemName = r.billingMethodName === '实报实销' ? `${r.name}(${r.billingMethodName})` : '-'
        }

        switch (r.costMark) { //1-实报实销 2-合同价
            case 1:
                itemName = r.name ? `${r.name}(${r.billingMethodName})` : '-'
                break
            case 2:
                itemName = costItemObjectToString(r)
                break
            case '现金价':
                itemName = `${r.expenseName}(现金价)`
                break
            case '总计':
                itemName = '总计'
                break
            default:
                itemName = r.billingMethodName === '实报实销' ? `${r.name}(${r.billingMethodName})` : '-'
        }

        return (
            <ColumnItemBox name={itemName} />
        )
    } else if (keyName === 'fee') {/* 金额 */
        let fee = 0
        switch (r.expenseType) {
            case 1:
                fee = r.costUnitValue
                break
            case 2:
                fee = r.chargeFee * ((r.orderExpenseItemUnitCoefficientList && r.orderExpenseItemUnitCoefficientList.length > 0) ? r.orderExpenseItemUnitCoefficientList.reduce((total, cur) => total += cur.costUnitValue, 0) : 1)
                break
            case 3:
                fee = r.costUnitValue
                break
            case '现金价':
                fee = r.expenseValue
                break
            case '总计':
                fee = totalKey ? r[totalKey] : r.totalFee
                break
            default:
                fee = r.billingMethodName === '实报实销' ? r.costUnitValue : '-'
        }

        switch (r.costMark) { //1-实报实销 2-合同价
            case 1:
                fee = r.costUnitValue
                break
            case 2:
                fee = r.chargeFee * ((r.orderExpenseItemUnitCoefficientList && r.orderExpenseItemUnitCoefficientList.length > 0) ? r.orderExpenseItemUnitCoefficientList.reduce((total, cur) => total += cur.costUnitValue, 0) : 0)
                break
            case '现金价':
                fee = r.expenseValue
                break
            case '总计':
                fee = totalKey ? r[totalKey] : r.totalFee
            break
            default:
                fee = r.billingMethodName === '实报实销' ? r.costUnitValue : '-'
        }

        return <span style={{ color: '#E76400' }}>{fee}</span>
    } else {
        return <ColumnItemBox name={'-'} />
    }
}