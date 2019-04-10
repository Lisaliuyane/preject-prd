import React, { Component } from 'react'
import More from './more'
import { Layout, Icon } from 'antd';
import Notice from './notice'
import LikeQuotation from '../like_quotation'
import { inject, observer } from "mobx-react"
import logo from '@src/libs/img/logo_gzpro.png'

const { Header } = Layout;

@inject('mobxTabsData', 'mobxBaseData')
@observer
export default class HeaderView extends Component {
    
    shouldComponentUpdate(nextProps, nextState) {
        return false
    }
    
    render() {
        let platformName = localStorage.getItem('platformName')
        let logoUrl = localStorage.getItem('logo')
        return (
            <Header className="flex header paper-1-1" style={{background: 'rgb(26,26,26)', position: 'fixed', width: '100%', padding: '0 0 0 20px',zIndex: 120, lineHeight: '54px', height: 54}}>
                <div className="logo">
                    <img alt='logo' style={{maxWidth: 80, marginLeft: 10}} src={logoUrl ? logoUrl : logo} />
                </div>
                <div style={{marginLeft: 10}} className="flex1">
                    <h3 style={{color: '#ccc', margin: 0}}>{platformName}</h3>
                </div>
                <div className='flex flex-veritcal-center' style={{minWidth: 240}}>
                    <LikeQuotation />
                    <Notice />
                    <div style={{ borderRight: '1px solid #333', height: 50, width: 10, padding: '1px 0' }}></div>
                    <More />
                </div>
            </Header>
        )
    }
}

export class RightButton extends React.PureComponent {
    render() {
        return (
            <div className='flex flex-vertical-center right-button-box'>
                <LikeQuotation />
                <Notice />
                <div style={{ borderRight: '1px solid #eee', height: 50, padding: '1px 0'}}></div>
                <More />
            </div>
        )
    }
}
