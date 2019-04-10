import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch
} from 'react-router-dom'
import React, { Component } from 'react'
import NotFound from '../views/layout/not_found'
import Jurisdiction from './jurisdiction.jsx'
import routes from './routes'
import Login from '../views/layout/login'
import { inject, observer } from "mobx-react"

@inject('mobxBaseData')
@observer
class GetAuth extends Component {

    state = {
        isHaveAuth: false
    }

    componentWillMount() {
        let { mobxBaseData } = this.props
        mobxBaseData.getLocationLoginStatus().then(() => {
            let { isLogin } = mobxBaseData
            if (isLogin) {
                this.setState({isHaveAuth: true})
            }
        })
    }

    render() {
        let { isHaveAuth } = this.state
        let { mobxBaseData, location, Component } = this.props
        let { isLogin } = mobxBaseData
        if (!isLogin) {
            return (
                <Redirect 
                    to={{
                        pathname: '/login',
                        state: { from: location }
                    }}
                />
            )
        } else if (isLogin && !isHaveAuth) {
            return (
                <div>获取权限中...</div>
            )
        } else {
            return (
                <Jurisdiction>
                    <Component {...this.props} />
                </Jurisdiction>
            )
        }
    }
}

const PrivateRoute = ({ ...rest }) => {
    let { Component } = rest
    return (
        <Route 
            {...rest}
            render={props => {
                return (
                    <GetAuth Component={Component} {...props} />
                )
            }
            }
        />
    )
}

/**
 * routes渲染层
 * 
 * @export
 * @class RouterView
 * @extends {Component}
 */
@inject('mobxBaseData')
@observer
export default class RouterView extends Component {
    
    render() {
        return (
            <Router>
                <div style={{height: '100%'}}>
                    <Switch>
                        <Route
                            path='/login'
                            component={Login}
                        />
                        {
                            routes.map((route, index) => {
                                return (
                                    <PrivateRoute 
                                        key={index}
                                        exact
                                        path={route.path}
                                        Component={route.component}
                                    />
                                )
                            })
                        }
                        <Route path="*" component={NotFound} />
                    </Switch>
                </div>
            </Router>
        )
    }
}