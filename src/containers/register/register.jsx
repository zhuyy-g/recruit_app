// 主界面路由组件
import React, { Component } from 'react'
import {
    NavBar,
    WingBlank,
    List,
    InputItem,
    WhiteSpace,
    Radio,
    Button
} from 'antd-mobile'
import {connect} from 'react-redux'

import {register} from '../../redux/actions'
import Logo from '../../components/logo/logo'
import { Redirect } from 'react-router-dom'

const ListItem = List.Item

class Register extends Component {
    // 这里是这个组件拥有的状态（作用：收集表单数据 传到后台）
    state = {
        username: '',
        password: '',
        password2: '',
        type: 'laoban'
    }

    // 与redux进行交互 在redux中进行操作(传入数据 返回状态)
    register = () => {
        this.props.register(this.state)
    }

    // 页面修改表单 实时的进行数据的修改
    handleChange = (name, val) => {
        this.setState({
            [name]: val
        })
    }

    // 以下演示的是用默认的history参数修改页面路由的方法
    toLogin = () => {
        this.props.history.replace('/login')
    }

    render() {
        const {type} = this.state
        // 根据接口返回的参数修改页面的错误提示以及即将要跳转去的路由
        const {msg, redirectTo} = this.props.user
        if(redirectTo) {
            // 以下演示的是直接用路由标签进行页面重定向的方法
            return <Redirect to={redirectTo}/>
        }
        return (
            <div>
                <NavBar>硅&nbsp;谷&nbsp;直&nbsp;聘</NavBar>
                <Logo />
                <WingBlank>
                    <List>
                        {/* 与vue v-if 不同的是 react当中一般是使用三元运算符来决定页面显示的内容的 如果什么都不显示 用null  */}
                        {msg ? <div className='error-msg'>{msg}</div> : null}
                        <WhiteSpace />
                        <InputItem placeholder='请输入用户名' onChange={val => {this.handleChange('username', val)}}>用户名:</InputItem>
                        <WhiteSpace />
                        <InputItem  placeholder='请输入密码' type="password" onChange={val => {this.handleChange('password', val)}}>密&nbsp;&nbsp;&nbsp;码</InputItem>
                        <WhiteSpace />
                        <InputItem  placeholder='请输入确认密码' type="password" onChange={val => {this.handleChange('password2', val)}}>确认密码</InputItem>
                        <WhiteSpace />
                        <ListItem>
                            <span>用户类型:</span>
                            &nbsp;&nbsp;&nbsp;
                            <Radio onChange={() => {this.handleChange('type', 'dashen')}} checked={type === 'dashen'}>大神</Radio>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Radio onClick={() => {this.handleChange('type', 'laoban')}} checked={type === 'laoban'}>老板</Radio>
                        </ListItem>
                        <WhiteSpace />
                        <Button type="primary" onClick={this.register}>注&nbsp;&nbsp;&nbsp;册</Button>
                        <WhiteSpace />
                        <Button onClick={this.toLogin}>已有账户</Button>
                    </List>
                </WingBlank>
            </div>
        )
    }
}

export default connect(
    state => ({user: state.user}),
    {register}
)(Register)