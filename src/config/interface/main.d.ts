interface  DialogItem {
    dialog_id: string | number,
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
    answer: string,
    pid: number,
    is_f?: 0 | 1,
    is_reg?: boolean | number,
    gpt?: string
}

interface ConversationList {
    dialog_id: string | number,
    created_at: string,
    data: Array<ConversationItem>
}

interface WsSendQuestion {
    type: 'c',
    q: string,  //问题
    cid: string, //conversation_id
    did: number | string //dialog_id,
    pid: number,
    auth: string,
    isRegenerate: number
}

interface WsServerConversation {
    a: string //回答,
    is_f : 0 | 1, //0完成，1未完成,
    id: string, //conversation_id
    pid: number,
    did: number,
    type: 'c',
    gpt?: string
}

interface WsServerNewDialog {
    title: string,
    id: number, //dialog_id
    type: 'd'
}

interface WsServerFailed {
   type: 'f',
   action: 'c' | 'd' 
}

interface StopBody {
    a: string,
    pid: number,
    cid: string,
    pcid: string,
    q: string,
}
export {
    DialogItem , DialogList, ConversationItem, ConversationList,
    WsSendQuestion, WsServerConversation, WsServerNewDialog, WsServerFailed,
    StopBody
}