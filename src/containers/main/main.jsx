import React, {Component} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import Cookies from 'js-cookie' //这个包可以操作前端的cookie对象 set()/get()/remove()    
import {NavBar} from 'antd-mobile'                                           

import LaobanInfo from '../laoban-info/laoban-info'
import DashenInfo from '../dashen-info/dashen-info'
import Dashen from '../dashen/dashen'
import Laoban from '../laoban/laoban'
import Message from '../message/message'
import Personal from '../personal/personal'
import NotFound from '../../components/not-found/not-found'
import NavFooter from '../../components/nav-footer/nav-footer'
import Chat from '../chat/chat'

import {getRedirectTo} from '../../utils'
import {getUser} from '../../redux/actions'

class Main extends Component {

    navList = [
        {
            path: '/laoban', //路由路径
            component: Laoban,
            title: '大神列表',
            icon: 'dashen',
            text: '大神'
        },
        {
            path: '/dashen', //路由路径
            component: Dashen,
            title: '老板列表',
            icon: 'laoban',
            text: '老板'
        },
        {
            path: '/message',
            component: Message,
            title: '消息列表',
            icon: 'message',
            text: '消息'
        },
        {
            path: '/personal',
            component: Personal,
            title: '用户中心',
            icon: 'personal',
            text: '个人'
        }
    ]

    componentDidMount() {
        //重新打开窗口（此时redux里面只有初始值 ）但是浏览器记录上次保存的cookie 这种情况下会重新发送请求*
        const userid = Cookies.get('userid')
        const {_id} = this.props.user
        if(userid && !_id) {
            // 发送异步请求 获取user
            console.log('发送ajax请求获取user')
            this.props.getUser()
        }
    }


    render() {
        // 读取cookie中的userid
        const userid = Cookies.get('userid')
        // 如果没有 自动重定向到登录页面
        if(!userid) {
            return <Redirect to='/login'/>
        }
        // 如果有 读取redux中的user状态
        const {user, unReadCount} = this.props
        // 如果user没有 _id, 返回 null 不作任何显示(这种情况出现的原因：重新打开窗口（此时redux里面只有初始值 ）但是浏览器记录上次保存的cookie)*
        if(!user._id) {
            return null
        }else {
             // 如果有_id 显示对应的界面
            // 如果请求根路径， 根据user的type和header来计算出一个重定向的路由路径 并且自动重定向
            let path = this.props.location.pathname
            if(path === '/') {
                // 得到一个重定向的路由路径
                path = getRedirectTo(user.type, user.header)
                return <Redirect to={path}/>
            }
        }

        const {navList} = this
        const path = this.props.location.pathname // 请求的路径
        const currentNav = navList.find(nav => nav.path === path) // 得到当前的nav,只有四个有
       
        if(currentNav) {
            // 决定哪个路由需要隐藏
            if(user.type === 'laoban') {
                // 隐藏数组的第2个
                navList[1].hide = true
            }else {
                // 隐藏数组的第一个
                navList[0].hide = true
            }
        }

        return (
            <div>
                {currentNav ? <NavBar className='sticky-header'>{currentNav.title}</NavBar> : null}
                <Switch>
                    {
                        navList.map(nav => <Route path={nav.path} component={nav.component}/>)
                    }
                    <Route path='/laobaninfo' component={LaobanInfo}/>
                    <Route path='/dasheninfo' component={DashenInfo}/>
                    <Route path='/chat/:userid' component={Chat}/>
                    <Route component={NotFound}/>
                </Switch>
                {currentNav ? <NavFooter navList={navList} unReadCount={unReadCount}/> : null}
            </div>
        )
    }
}

export default connect(
    state => ({user: state.user, unReadCount: state.chat.unReadCount}),
    {getUser}
)(Main)
