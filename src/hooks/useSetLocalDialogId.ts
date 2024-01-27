export default (id: number, action: 'add' | 'delete') => {
    let ori = localStorage.getItem('chat-list')
    if (!ori) return
    let oriJson: number[] = JSON.parse(ori)
    if (action === 'add'){
        if (oriJson.includes(id)) return
        oriJson.push(id)
    }else if (action === 'delete'){
        oriJson = oriJson.filter(i => i !== id)
    }
    
    localStorage.setItem('chat-list', JSON.stringify(oriJson))
}