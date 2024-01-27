<template>
    <div class="info-wrapper">
        <el-scrollbar :height="tabHeight">
            <div class="title">账号信息</div>
            <div class="info-box">
                <div class="item avatar">
                    <img :src="user.avatar" alt="user_avatar">
                </div>
                <div class="item info">
                    <div class="data-title">用户名</div>
                    <div class="content">Jerry Jin</div>
                </div>
                <div class="action">
                    <el-button @click="logOut" :icon="DArrowLeft" type="danger">退出登录</el-button>
                </div>
            </div>
            <div class="title">关于系统</div>
            <div class="subtitle">Jerry AI</div>
            <div class="subtitle">
                Copyright &copy; 2021-{{ new Date().getFullYear() }} Jerry Jin. All Rights Reserved.
            </div>
            <div class="subtitle">
                Powered by OpenAI API
            </div> <br>
            <div class="subtitle" style="color: white;">
                本系统开发过程中,使用了一些第三方库/插件，列举如下（排名不分先后）
            </div>
            <div class="main-content">
                <el-link href="https://vuejs.org/" type="danger">Vue.js</el-link> <br>
                <el-link href="https://cn.vitejs.dev/" type="danger">Vite</el-link> <br>
                <el-link href="https://router.vuejs.org/" type="danger">Vue Router</el-link> <br>
                <el-link href="https://element-plus.gitee.io/zh-CN/" type="danger">Element Plus</el-link> <br>
                <el-link href="https://nodejs.org/" type="danger">Node.js</el-link> <br>
            </div>
            <div class="title">更新日志</div>
            <div class="main-content">
                <div class="current-version">
                    <el-icon :size="22" style="color: yellow;"><StarFilled /></el-icon>
                    <el-icon :size="22" style="color: yellow;"><StarFilled /></el-icon>
                    <el-icon :size="22" style="color: yellow;"><StarFilled /></el-icon>
                    <span>V2.0.0</span>
                </div>
                    <div class="detail-update">- 新增GPT版本查看，不同版本智能切换</div>
                    <div class="detail-update">- 新增个人主页，增加退出登录等功能</div>
                    <div class="detail-update">- 修复一些已知问题</div>
                <div class="current-version old">V1.2.0</div>
                    <div class="detail-update">- 对接了具有上下文情境的接口</div>
                    <div class="detail-update">- 修复WebSocket连接中断问题</div>
                    <div class="detail-update">- 新增GPT3.5与GPT4切换功能</div>
                    <div class="detail-update">- 更新了重新生成回答问题时对话框样式</div>
                <div class="current-version old">V1.1.1</div>
                    <div class="detail-update">- 修复了授权token无法自动刷新的问题</div>
                <div class="current-version old">V1.1.0</div>
                    <div class="detail-update">- 更新代码复制问题</div>
                    <div class="detail-update">- 更新部分UI效果</div>
                <div class="current-version old">V1.0.0</div>
                    <div class="detail-update">- Initially release</div>
            </div>
        </el-scrollbar>
    </div>
</template>

<script lang='ts' setup>
import useTabHeight from '@/hooks/useTabHeight';
import { nextTick, onMounted, ref } from 'vue';
import { DArrowLeft , StarFilled } from '@element-plus/icons-vue'
import useGetUser from '@/hooks/useGetUser';
import router from '@/router';

const tabHeight = ref('800px')
const user = useGetUser()

const logOut = () => {
    localStorage.removeItem('certificate')
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/login')
}

onMounted(() => {
    nextTick(() => {
        const w = document.body.clientWidth
        if (w <= 600){
            tabHeight.value = useTabHeight(210)
        }else{
            tabHeight.value = useTabHeight(240)
        }
    })
})

</script>

<style lang='less' scoped>
@topHeightBorder: 75px;
.info-wrapper{
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
    z-index: 12;
    .title{
        position: relative;
        margin: 20px 0;
        margin-left: 25px;
        color: white;
        font-size: 22px;
        font-weight: bold;
        user-select: none;
    }
    .subtitle{
        position: relative;
        margin: 8px 0;
        margin-left: 25px;
        color: orange;
        font-size: 16px;
        line-height: 20px;
        user-select: none;
    }
    .main-content{
        position: relative;
        margin-left: 25px;
        .current-version{
            margin: 5px 0;
            font-size: 18px;
            color: orange;
            font-weight: bold;
            user-select: none;
            &.old{
                color: rgb(249, 185, 66);
                font-weight: normal;
            }
            span{
                position: relative;
                top: -4px;
                margin-left: 4px;
            }
        }
        .detail-update{
            position: relative;
            font-size: 16px;
            line-height: 22px;
            user-select: none;
            color: white;
        }
    }
    .info-box{
        position: relative;
        margin: 10px 20px;
        padding: 10px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        align-items: center;
        box-shadow: 0 0 12px #00000052;
        .item{
            position: relative;
            min-height: 80px;
            &.avatar{
                width: 80px;
                height: $width;
                border-radius: 50%;
                border: 2px solid #A8ABB2;
                overflow: hidden;
                user-select: none;
                img{
                    position: relative;
                    width: 100%;
                    height: 100%;
                }
            }
            &.info{
                //width: 35%;
                text-align: center;
                min-width: 100px;
                text-align: center;
                .data-title{
                    font-size: 16px;
                    color: #F56C6C;
                    margin-bottom: 12px;
                    margin-top: 12px;
                    user-select: none;
                }
                .content{
                    font-size: 18px;
                    color: #fff;
                }
            }
            &.action{
                //width: 30%;
                min-width: 50px;
            }
        }
    }
}
</style>