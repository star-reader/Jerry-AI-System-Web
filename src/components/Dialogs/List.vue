<template>
    <div class="dialog-list-wrapper">
        <div class="title-start-new">
            <el-button @click="createNew" type="success">创建新对话</el-button>
            <el-divider />
        </div>
        <div class="main-list">
            <el-scrollbar :height="tabHeight" >
                <div @click="openDialog(i.dialog_id as number, $event)" v-for="i in dialogList" class="dialog-item">
                    <!-- <el-popconfirm @confirm="deleteDialog(i.dialog_id as number)" title="确定要删除此条会话记录吗?">
                        <template #reference>
                            <span class="action-panel">
                                <el-icon class="list-button" color="#FFFFFF"><Delete /></el-icon>
                            </span>
                        </template>
                    </el-popconfirm> -->
                        <span @click="deleteDialog(i.dialog_id as number, $event)" class="action-panel">
                            <el-icon class="list-button" color="#FFFFFF"><Delete /></el-icon>
                        </span>
                    <span class="text">{{ i.title }}</span>
                </div>
            </el-scrollbar>
        </div>
    </div>
</template>

<script lang='ts' setup>
import PubSub from 'pubsub-js';
import type { DialogItem, DialogList, WsServerConversation } from '@/config/interface/main';
import useTabHeight from '@/hooks/useTabHeight'
import { Delete } from '@element-plus/icons-vue'
import axios from 'axios';
import { nextTick, onMounted, ref, type Ref } from 'vue';
import api from '@/config/apis/api';
import useSetLocalDialogId from '@/hooks/useSetLocalDialogId';
import createHeader from '@/utils/createHeader';

const tabHeight = ref('800px')
const dialogList: Ref<DialogItem[]> = ref([])

const getList = () => {
    let localList = localStorage.getItem('chat-list')
    if (localList === null){
        localStorage.setItem('chat-list', JSON.stringify([]))
    }else{
        axios.get(`${api.getAllList}?dialogs=${localList}`, {'headers': createHeader()}).then(res => {
            if (res.data.code !== 200) return
            let refreshList: string[] = [];
            (<DialogList>res.data.data).data.forEach((i: DialogItem) => {
                refreshList.push(i.dialog_id as string)
            })
            dialogList.value = res.data.data.data
            localStorage.setItem('chat-list', JSON.stringify(refreshList))
            if (dialogList.value[0]){
                //有数据，加载最新的数据
                PubSub.publish('load-latest-dialog',dialogList.value[0].dialog_id)
            }
        }).catch(() => {
            //ElMessage.error('对话列表加载失败')
            return
        })
    }
}

const openDialog = (id: number, e: MouseEvent) => {
    e.cancelBubble = true
    PubSub.publish('load-latest-dialog',id)   
}

const createNew = () => {
    dialogList.value.unshift({
        'created_at': '',
        'dialog_id': '',
        'title': '新对话'
    })
    PubSub.publish('create-new-dialog',1)
}

const deleteDialog = (id: number, e: MouseEvent) => {
    e.cancelBubble = true
    axios.post(`${api.deleteDialog}?id=${id}`,{}, {'headers': createHeader()}).then(r =>{
        dialogList.value = dialogList.value.filter(i => i.dialog_id !== id);
        PubSub.publish('delete-dialog',id)
        useSetLocalDialogId(id, 'delete')
    })
}

onMounted(() => {
    setTimeout(() => {
        getList()
    }, 2200);
    nextTick(() => {
        tabHeight.value = useTabHeight(295)
    })
    addEventListener('click',() => tabHeight.value = useTabHeight(295))
    PubSub.subscribe('new-dialog-message',(_,msg: [WsServerConversation, string]) => {
        if (!dialogList.value.length){
            //新的
            dialogList.value.push({
                'created_at': '0',
                'dialog_id': msg[0].did,
                'title': msg[1].slice(0,30)
            })
        }else{
            //看看是哪个数据
            dialogList.value.forEach(i => {
                if (i.dialog_id === msg[0].did){
                    //指定对话
                    i.title = msg[1].slice(0, 30)
                }
            })
        }
    })
})

</script>

<style lang='less' scoped>
.dialog-list-wrapper{
    position: absolute;
    //top: -13px;
    height: 100%;
    width: 250px;
    border-radius: 6px;
    background-image: linear-gradient(30deg,rgba(166, 228, 253, 0.58), rgba(146, 193, 247, 0.75) 50% );
    -webkit-backdrop-filter: blur(15px);
    backdrop-filter: blur(15px);
    z-index: 25;
    animation: showDialogList 0.3s;
    user-select: none;
    .title-start-new{
        position: relative;
        margin: 6px 0;
        button{
            position: relative;
            left: 20px;
            margin: 0 -10px;
            width: calc(100% - 20px);
        }
    }
    .main-list{
        position: relative;
        height: 100%;
        .dialog-item{
            position: relative;
            margin: 4px 6px;
            padding: 10px 0;
            border-radius: 8px;
            color: white;
            font-size: 15px;
            padding-left: 6px;
            background-color: rgb(121, 178, 243);
            transition-duration: 0.4s;
            cursor: pointer;
            &:hover{
                background-color: rgb(98, 174, 233);
            }
        }
        .text{
            width: 195px;
            display: inline-block;
            word-break: break-all;
        }
        .action-panel{
            position: relative;
            left: 180px;
            z-index: 20;
            background-color: rgb(98,174,233);
        }
    }
}
</style>