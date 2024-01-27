interface  DialogItem {
    dialog_id: string,
    title: string,
    created_at: string
}

interface DialogList {
    data: DialogItem[],
    available_id: string[]
}

interface ConversationItem {
    id: string,
    time: string,
    question: string,
    answer: string
}

interface ConversationList {
    dialog_id: string,
    created_at: string,
    data: Array<ConversationItem>
}

interface WsSendQuestion {
    type: 'c',
    q: string,  //问题
    cid: string, //conversation_id
    did: string //dialog_id
}

interface WsServerConversation {
    a: string //回答,
    id_f : 0 | 1, //0完成，1未完成,
    id: string, //conversation_id
    type: 'c'
}

interface WsServerNewDialog {
    title: string,
    id: string, //dialog_id
    type: 'd'
}

interface WsServerFailed {
   type: 'f',
   action: 'c' | 'd' 
}


export {
    DialogItem , DialogList, ConversationItem, ConversationList,
    WsSendQuestion, WsServerConversation, WsServerNewDialog, WsServerFailed,
}