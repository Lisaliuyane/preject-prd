import BaseData from './base'
import TabsData from './tabs'
import WordBook from './wordbook'
import DataBook from './databook'
// import { observable, action, autorun } from "mobx";

// 初始化 APP mobx基本数据，包括 token、用户信息、用户权限数据
export const mobxBaseData = (() => new BaseData())()
export const mobxTabsData = (() => new TabsData())()
export const mobxWordBook = (() => new WordBook())()
export const mobxDataBook = (() => new DataBook())()
// autorun(() => {
//     console.log('autorun', mobxTabsData.activeKey, mobxTabsData);
// });
