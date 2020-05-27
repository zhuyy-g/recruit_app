import axios from 'axios'

// 封装下面的ajax()的原因是调用接口的方法是统一的 只有接口路径 传入参数 调用方式会有不同
// 1. 判断调接口的方式
// 2. 如果是GET 拼接参数 调用接口
// 3. 如果是POST 直接调用接口
export default function ajax(url, data={}, type='GET') {
    if(type === 'GET') {
        // data: {username: tom, password: 123}
        // paramStr: username=tom&password=123
        let paramStr = ''
        // 以下演示的是对象遍历的方法(得到的是对象的键组成的数组,再对这个数组进行遍历，凭借成为最后的查询参数)
        Object.keys(data).forEach(key => {
            paramStr += key + "=" + data[key] + "&"
        })
        if(paramStr) {
            paramStr = paramStr.substring(0, paramStr.length-1)
        }
        url = url + '?' + paramStr
        return axios.get(url)
    }else {
        return axios.post(url, data)
    }
}