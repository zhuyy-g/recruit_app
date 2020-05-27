// 用户主界面路由
    // dashen: /dashen
    // laoban: /laoban
// 用户信息完善界面路由
    // dashen: /dasheninfo
    // laoban: /laoban
// 返回对应的路由路径
export function getRedirectTo(type, header) {
    let path = ""
    if(type === 'laoban') {
        path = '/laoban'
    } else {
        path = '/dashen'
    }

    if(!header) {
        path += 'info'
    }

    return path
}
