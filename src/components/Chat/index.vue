<template>
    <div class="viewpage" id="appView">
        <div class="page-logo">
            <img :src="logo" alt="logo" />
        </div>
        <div @click="changeDarkMode" class="change-dark">
            <el-icon v-if="!isNightMode" class="icon-normal"><Sunny /></el-icon>
            <el-icon v-else class="icon-normal"><Moon /></el-icon>
        </div>
        <div @click="isOpenInfoPage = !isOpenInfoPage" class="info-entry">
            <el-icon class="icon-normal"><User /></el-icon>
        </div>
        <div v-if="!isHaveConversation" class="welcome-wrapper">
            <div class="text-present">
                <div class="main-title">欢迎使用Jerry Jin的AI系统</div>
                <div class="sub-title">{{ chatFloatWord }} _</div>
            </div>
            <el-scrollbar>
            <div class="explore-present">
                <div class="explore-title">随便问些问题</div>
                <div class="explore-title english">Feel free to ask something</div>
                <div class="pre-item">
                    <ExploreItem :isClickAble="true" text="什么是黑洞？" />
                    <ExploreItem :isClickAble="true" text="人类大脑的神经元如何协同工作？" />
                    <ExploreItem :isClickAble="true" text="简要介绍一下超级计算机" />
                </div>
            </div>
            <div class="explore-present">
                <div class="explore-title">上班啦，写点代码吧</div>
                <div class="explore-title english">Time for work, let's coding!</div>
                <div class="pre-item">
                    <ExploreItem :isClickAble="true" text="如何用JavaScript发送http请求？" />
                    <ExploreItem :isClickAble="true" text="怎样使用Python构建Windows桌面应用？" />
                    <ExploreItem :isClickAble="true" text="PHP是最好的编程语言吗" />
                </div>
            </div>
            <div class="explore-present">
                <div class="explore-title">把我当个聊天机器人就好了</div>
                <div class="explore-title english">Treat me as a chatting robot</div>
                <div class="pre-item">
                    <ExploreItem :isClickAble="true" text="用英语写一个日记" />
                    <ExploreItem :isClickAble="true" text="如何给朋友准备一个好的礼物？" />
                    <ExploreItem :isClickAble="true" text="给我写首优美的诗歌吧！" />
                </div>
            </div>
            <div class="explore-present">
                <div class="explore-title">你需要注意的事情</div>
                <div class="explore-title english">What you should know ... </div>
                <div class="pre-item">
                    <ExploreItem :isClickAble="false" text="偶尔可能会有有错误消息" />
                    <ExploreItem :isClickAble="false" text="数据集内容截止2022年7月" />
                    <ExploreItem :isClickAble="false" text="Jerry可以写了一些bug" />
                </div>
            </div>
            </el-scrollbar>
        </div>
        <div v-show="!isHaveConversation" class="system-info-area">
            Copyright &copy; 2021-{{ new Date().getFullYear() }} Jerry Jin. All Rights Reserved.  | Powered by OpenAI API
        </div>
            <MainChatWindow v-show="isHaveConversation" />
            <InfoPage v-if="isOpenInfoPage" />
            <InputArea />
    </div>
</template>

<script lang='ts' setup>
import PubSub from 'pubsub-js'
import { Sunny , Moon , User } from '@element-plus/icons-vue'
import { nextTick, onMounted, type Ref, ref } from 'vue'
import useTabHeight from '@/hooks/useTabHeight'
import useScrollChat from '@/hooks/useScrollChat'
import ExploreItem from '../Explore/Item.vue'
import MainChatWindow from '../Chat/MainChatWindow.vue'
import InputArea from '../Input/index.vue'
import InfoPage from '../About/index.vue'
import logo from '@/assets/pic/Jerry.png'
import chatFloatArr from '@/config/helloArr.json'

const isHaveConversation: Ref<boolean> = ref(false)
const isOpenInfoPage = ref(true)
const chatFloatWord = ref('')
const tabHeight = ref('800px')

const isNightMode = ref(false)

const generateRealTimeWord = () => {
    const length = chatFloatArr.length
    let currentPos = 0
    setInterval(() => {
        if (currentPos < length -1){
            chatFloatWord.value = chatFloatArr[currentPos]
            currentPos++
        }else{
            currentPos = 0
        }
    }, 160)
}

const changeDarkMode = () => {
    isNightMode.value = !isNightMode.value
    localStorage.setItem('theme', `${isNightMode.value}`)
    if (isNightMode.value){
        document.getElementById('appView')?.setAttribute('theme', 'night')
    }else{
        document.getElementById('appView')?.setAttribute('theme', 'day')
    }
}

onMounted(() => {
    nextTick(() => {
        tabHeight.value = useTabHeight(560)
        // 检查夜间模式
        const d = localStorage.getItem('theme')
        if (!d){
            localStorage.setItem('theme', 'day')
        }
        if (d === 'true'){
            isNightMode.value = true
            document.getElementById('appView')?.setAttribute('theme', 'night')
        }else{
            isNightMode.value = false
            document.getElementById('appView')?.setAttribute('theme', 'day')
        }
    })
    addEventListener('click',() => tabHeight.value = useTabHeight(560))
    generateRealTimeWord()
    PubSub.subscribe('close-chat-window',() => {
        isHaveConversation.value = false
    })
    PubSub.subscribe('send-question',() => {
        isHaveConversation.value = true
    })
    PubSub.subscribe('focus-input', () => {
        isHaveConversation.value = true
        isOpenInfoPage.value = false
        nextTick(() => {
            useScrollChat()
        })
    })
})

</script>

<style lang='less' scoped>
.viewpage{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-image: url('@/assets/pic/background.png');
    background-size: cover;
    background-position: center;
    .page-logo{
        //position: relative;
        display: flex;
        justify-content: center;
        margin-top: 0px;
        text-align: center;
        width: 100px;
        user-select: none;
        img{
            position: absolute;
            width: 100px;
            left: calc(50% - 50px);
        }
    }
    .icon-normal{
        position: relative;
        font-size: 25px;
        left: 5px;
        top: 4px;
        transition-duration: 0.4s;
        &:hover{
            color: orangered;
        }
    }
    .change-dark{
        position: fixed;
        right: 6px;
        top: 6px;
        width: 35px;
        height: 35px;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.589);
        cursor: pointer;
    }
    .info-entry{
        position: fixed;
        right: 47px;
        top: 6px;
        width: 35px;
        height: 35px;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.589);
        cursor: pointer;
    }
    .welcome-wrapper{
        position: relative;
        height: calc(100% - 360px);
    }
    .text-present{
        position: relative;
        margin-top: 100px;
        text-align: center;
        .main-title{
            font-size: 36px;
            font-weight: 600;
            padding-bottom: 14px;
            user-select: none;
        }
        .sub-title{
            font-size: 16px;
            color: #606266;
            height: 30px;
            user-select: none;
        }
        
    }
    .explore-present{
        position: relative;
        margin-top: 6px;
        width: 70%;
        left: 15%;
        cursor: default;
        .explore-title{
            font-size: 21px;
            text-align: center;
            transition-duration: 0.4s;
            user-select: none;
            &.english{
                font-size: 17px;
            }
            &:hover{
                color: rgb(64,158,255);
            }
        }
        .pre-item{
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
        }
    }
    .system-info-area{
        position: relative;
        top: 125px;
        padding: 6px 0;
        width: 100%;
        border-radius: 6px;
        text-align: center;
        font-size: 14.5px;
        background-color: rgba(184,240,255,0.3);
        transition-duration: 0.3s;
        cursor: default;
        user-select: none;
        &:hover{
            color: rgb(245,108,108);
        }
    }
}
</style>