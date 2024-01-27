import Pubsub from "pubsub-js"
import axios from 'axios'
import api from "@/config/apis/api"

export default () => {
    const cert = localStorage.getItem('certificate')
    if (!cert) return PubSub.publish('login-action', 0)
    axios.post(api.login,{'certificate': cert}).then(res => {
        if (!res.data.login){
            return Pubsub.publish('login-action', 0)
        }
        const token = res.data.token
        const userInfo = res.data.user
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(userInfo))
        Pubsub.publish('login-action', 1)
    }).catch(() => {
        Pubsub.publish('login-action', 0)
    })
}