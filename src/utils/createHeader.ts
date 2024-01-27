export default () => {
    const token = localStorage.getItem('token')
    return {
        "Authorization": token
    }
}