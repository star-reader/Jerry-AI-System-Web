import Pubsub from "pubsub-js"

type User = {
    username: string,
    avatar: string
}

export default (): User => {
    const d = localStorage.getItem('user')
    if (!d){
        Pubsub.publish('login-action', 0)
        return {
            username: '',
            'avatar': ''
        }
    }
    return JSON.parse(d)
}