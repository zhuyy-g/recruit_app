import React, { Component } from 'react'
import { connect } from 'react-redux'
import { List, Badge } from 'antd-mobile'

const Item = List.Item
const Brief = Item.Brief

// 对chatMsgs按chat_id进行分组,并得到每个组的lastMsg组成的数组
function getLastMsgs(chatMsgs, userid) {
    // 1. 找出每个聊天的lastMsg 并用一个对象容器来保存 {chat_id, lastMsg}
    const lastMsgObjs = {}
    chatMsgs.forEach(msg => {
        // 对msg进行个体的统计
        if(msg.to===userid && !msg.read) {
            msg.unReadCount = 1
        }else {
            msg.unReadCount = 0
        }

        // 得到msg的聊天标识id
        const chatId = msg.chat_id
        // 获取已保存的当前组件的lastMsg
        const lastMsg = lastMsgObjs[chatId]
        // 没有
        if (!lastMsg) {
            lastMsgObjs[chatId] = msg
        } else {
            // 保存已经统计的未读数量
            const unReadCount = lastMsg.unReadCount
            // 如果msg比lastMsg晚 将msg保存为lastMsg
            if (msg.create_time > lastMsg.create_time) {
                lastMsgObjs[chatId] = msg
            }
            // 累加unReadCount并保存在最新的lastMsg上   
            lastMsgObjs[chatId].unReadCount = unReadCount + msg.unReadCount
        }
    })
    // 2. 得到所有lastMsg的数组
    const lastMsgs = Object.values(lastMsgObjs)
    // 3. 对数组进行排序
    lastMsgs.sort((m1, m2) => {
        return m2.create_time - m1.create_time
    })
    return lastMsgs
}

// 对话消息列表组件
class Message extends Component {
    render() {
        const { user } = this.props
        const { users, chatMsgs } = this.props.chat
        // 对chatMsgs按chat_id进行分组
        const lastMsgs = getLastMsgs(chatMsgs, user._id)
        console.log(lastMsgs)
        return (
            <List style={{ marginTop: 50 }}>
                {
                    lastMsgs.map(msg => {
                        // 得到目标用户的id
                        const targetUserId = msg.to===user._id ? msg.from : msg.to
                        // 得到目标用户的信息
                        const targetUser = users[targetUserId]
                        return (
                            <Item
                                key={msg._id}
                                extra={<Badge text={msg.unReadCount} />}
                                thumb={targetUser.header ? require(`../../assets/images/${targetUser.header}.png`) : null}
                                arrow='horizontal'
                                onClick={() => this.props.history.push(`/chat/${targetUserId}`)}
                            >
                                {msg.content}
                                <Brief>{targetUser.username}</Brief>
                            </Item>
                        )
                    })
                }
                {/* <Item
                    extra={<Badge text={3}/>}
                    thumb={require(`../../assets/images/头像1.png`)}
                    arrow='horizontal'
                >
                    你好
                    <Brief>nr1</Brief>
                </Item>
                <Item
                    extra={<Badge text={0}/>}
                    thumb={require(`../../assets/images/头像2.png`)}
                    arrow='horizontal'
                >
                    你好2
                    <Brief>nr2</Brief>
                </Item> */}
            </List>
        )
    }
}

export default connect(
    state => ({ user: state.user, chat: state.chat }),
    {}
)(Message)