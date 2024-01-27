<template>
    <div class="dialog-wrapper">
        <div class="top-title" style="display: flex;justify-content: center;">
            <el-icon class="list-button" 
                @click="() => isShowList = !isShowList" 
                :size="29" 
                color="#FFFFFF"><Operation />
            </el-icon>
            <div class="top-wrapper-title">
                <span id="top-frame-title">{{ dialogData.data.length ? dialogData.data[0].question : '新对话' }}</span>
            </div>
            <div class="close-button">
                <el-button type="danger" 
                    :icon="Close" round
                    size="small"
                    @click="closeChatWindow"
                />
            </div>
        </div>
        <div class="main-frame" 
            v-loading="isLoading"
            element-loading-text="会话内容加载中"
            id="chat-frame">
            <DialogList v-show="isShowList" />
            <div class="conversation-views">
                <el-scrollbar :height="tabHeight">
                  <Conversation v-for="(i, index) in dialogData.data" 
                    :is_f="<1 | 0>i.is_f" 
                    :pcid="index === 0 ? '' : dialogData.data[index -1].id"
                    :data="i"
                  />
                </el-scrollbar>
            </div>
        </div>
    </div>
</template>

<script lang='ts' setup>
import { Operation } from '@element-plus/icons-vue'
import PubSub from 'pubsub-js'
import Conversation from './Conversation.vue';
import DialogList from '../Dialogs/List.vue'
import useTabHeight from '@/hooks/useTabHeight'
import { Close } from '@element-plus/icons-vue'
import { nextTick, onMounted, ref, type Ref } from 'vue';
import axios from 'axios'
import { ElMessage } from 'element-plus';
import type { ConversationList, WsSendQuestion, WsServerConversation, WsServerFailed } from '@/config/interface/main';
import api from '@/config/apis/api';
import useSetLocalDialogId from '@/hooks/useSetLocalDialogId';
import useScrollChat from '@/hooks/useScrollChat';
import createHeader from '@/utils/createHeader';
import useFormatQuestion from '@/hooks/useFormatQuestion';

const isLoading = ref(false)
const tabHeight = ref('800px')
const isShowList = ref(false)

const dialogData: Ref<ConversationList> = ref({
    'dialog_id': '',
    'created_at': '',
    'data': []
})

let socket: WebSocket
let isClosed: boolean = true

const closeChatWindow = () => {
    PubSub.publish('close-chat-window',true)
}

const initWsServer = async (): Promise<WebSocket> => {
    return new Promise((res, rej) => {
        socket = new WebSocket(api.wsServer)
        socket.onopen = () => {
            socket.addEventListener('close',event => {
                isClosed = true
                //initWsServer()
            })
            isClosed = false
            res(socket)
            // setInterval(() => {
            //     //心跳检测
            //     socket.send('PING')
            // }, 5000)
        }
        socket.onerror = () => {
            ElMessage.error('GPT WebSocket连接失败')
            rej()
        }
    })
}

const createNewDialog = async (question: string, isRegenerate: number) => {
    return new Promise(async (res, rej) => {
        const currentLength = dialogData.value.data.length
        const latestConv = dialogData.value.data[currentLength - 1]
        const token = localStorage.getItem('token')
        const data: WsSendQuestion = {
            'cid': latestConv ? latestConv.id : '' ,
            'did': dialogData.value.dialog_id ? dialogData.value.dialog_id : 0,
            'pid': latestConv ? latestConv.pid : 0,
            'q': question,
            'type': 'c',
            auth: token ? token : '',
            isRegenerate: isRegenerate
        }
        dialogData.value.data.push({
            'pid': latestConv ? latestConv.pid + 12 : 0,
            'answer': '全力思考中 ...',
            'id': '',
            'question': useFormatQuestion(question),
            'is_f': 0,
            'is_reg': isRegenerate,
            'time': new Date().toString().split('(')[0]
        })
        nextTick(() => useScrollChat())
        if (isClosed){
            await initWsServer()
        }
        socket.send(JSON.stringify(data))
        res(socket)
    })
}

const sendGPTMessage = async (question: string, isRegenerate: number) => {
    await createNewDialog(question, isRegenerate)
    const currentLength = dialogData.value.data.length
    const updatedLength = currentLength + 1
    socket.onmessage = (e) => {
        let msg: WsServerConversation | WsServerFailed
        try {
            msg = JSON.parse(e.data)
        } catch (error) {
            //return ElMessage.error('消息接受失败')
            return
        }
        if (msg.type === 'c'){
            //有消息啦
            let d = dialogData.value.data[updatedLength - 2]
            d.answer = msg.a
            d.id = msg.id
            d.pid = msg.pid
            d.is_f = msg.is_f
            d.gpt = msg.gpt
            if (currentLength === 1){
                //新创建的记录
                dialogData.value.dialog_id = msg.did
                useSetLocalDialogId(msg.did, 'add')
                PubSub.publish('new-dialog-message',[msg,question])
            }
            useScrollChat()
        }else{
            //return ElMessage.error('消息接受失败')
            if (msg.type === 'f'){
                //信息失败
                PubSub.publish('message-failed', 'c')
                dialogData.value.data[dialogData.value.data.length -1].answer = '思考失败，这玩意我也不会啊'
                dialogData.value.data[dialogData.value.data.length -1].is_f = 1
            }
            return
        }
    }
}

onMounted(() => {
    initWsServer()
    nextTick(() => {
        const w = document.body.clientWidth
        if (w <= 600){
            tabHeight.value = useTabHeight(160)
        }else{
            tabHeight.value = useTabHeight(210)
        }
    })
    
    addEventListener('resize',() => {
        const w = document.body.clientWidth
        if (w <= 600){
            tabHeight.value = useTabHeight(160)
        }else{
            tabHeight.value = useTabHeight(210)
        }
    })

    PubSub.subscribe('send-question',(_,msg: string) => {
        if (msg){
            //准备发送消息
            sendGPTMessage(msg, 0)
        }
    })
    PubSub.subscribe('load-latest-dialog',(_,did: number) => {
        isLoading.value = true
        axios.get(`${api.getDetailDialog}?id=${did}`, {'headers': createHeader()}).then(res => {
            if (res.data.code !== 200){
                return
                //return ElMessage.error('对话内容加载失败')
            }
            if (res.data.data && res.data.data.data){
                for (let i of res.data.data.data){
                    i.question = useFormatQuestion(i.question)
                }
            }
            dialogData.value = res.data.data
            isLoading.value = false
            isShowList.value = false
            nextTick(() => useScrollChat())
        }).catch(() => {
            //ElMessage.error('对话内容加载失败')
            isLoading.value = false
            return
        })
    })
    PubSub.subscribe('refresh-answer',(_,q: string) => {
        sendGPTMessage(q, 1)
    })
    PubSub.subscribe('create-new-dialog',() => {
        dialogData.value = {
            'dialog_id': '',
            'created_at': '',
            'data': []
        }
        setTimeout(() => {
            isShowList.value = false
        }, 40);
    })
    PubSub.subscribe('delete-dialog',(_,id: number) => {
        setTimeout(() => {
            isShowList.value = false
        }, 250);
        if (id === dialogData.value.dialog_id){
            dialogData.value = {
                'dialog_id': '',
                'created_at': '',
                'data': []
            }
        }
    })
})

</script>

<style lang='less' scoped>
@topHeightBorder: 75px;
.dialog-wrapper{
    position: absolute;
    width: 94%;
    left: 3%;
    height: calc(100% - @topHeightBorder - 100px);
    top: @topHeightBorder;
    border-radius: 8px;
    //半透明样式，兼容各类浏览器
    background-image: linear-gradient(30deg, rgba(128, 180, 240, 0.442) 50%, rgba(74, 192, 238, 0.462) 80%);
    -webkit-backdrop-filter: blur(18px);
    backdrop-filter: blur(18px);
    box-shadow: 0px 0px 12px rgba(74, 147, 231, 0.42);
    animation: showMainWindow 0.4s;
    z-index: 10;
    .top-title{
        position: absolute;
        height: 20px;
        width: calc(100% - 15px);
        left: 0;
        text-align: center;
        color: #303133;
        font-size: 15px;
        padding: 8px;
        cursor: default;
        user-select: none;
        background-image: linear-gradient(30deg,rgba(166, 228, 253, 0.462), rgba(146, 193, 247, 0.442) 50%, );
        .top-wrapper-title{
            position: relative;
            max-width: calc(100% - 190px);
            overflow: hidden;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
    .close-button{
        position: absolute;
        right: 25px;
        top: 6px;
    }
    .main-frame{
        position: relative;
        margin-top: 38px;
    }
}

@media only screen and (max-width: 600px){
    .dialog-wrapper{
        top: 28px;
        height: calc(100% - 25px - 100px);
    }
	.top-title{
        font-size: 14px !important;
    }
}
</style>