const showTabs = () => import('./tabs.js')

const DevelopmentPush = (mobxTabsData) => {
    if (process.env.NODE_ENV === 'development') {
        showTabs().then(tabs => {
            tabs.showTabs(mobxTabsData)
        })
        // showTabs(mobxTabsData)
    }
}
export const initShowTab = mobxTabsData => {
    if (process.env.NODE_ENV === 'development') {
        DevelopmentPush(mobxTabsData)
    }
}
