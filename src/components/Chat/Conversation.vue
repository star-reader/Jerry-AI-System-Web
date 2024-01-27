<template>
    <div class="conversation">
         <div v-if="!(props.data.is_reg)" class="time">{{ props.data.time }}</div>
        <div class="dialog-item question" v-if="!(props.data.is_reg)">
            <div class="text-area">
                <div class="dialog question" v-html="props.data.question"></div>
            </div>
            <div class="avatar-area">
                <el-avatar
                    :src="user.avatar"
                />
            </div>
        </div>
        <div class="dialog-item answer">
            <div class="avatar-area">
                <el-avatar
                    :src="skylineLogo"
                />
            </div>
            <div class="text-area">
                <div class="dialog answer"
                :class="props.data.answer === '思考失败，这玩意我也不会啊' ? 'failed' : 'normal'"
                v-html="getMDContext(props.data.answer)"
                ></div>
                <div class="action-answer">
                    <!-- <div class="stop" v-if="!props.data.is_f" @click="stopChat">停止生成</div> -->
                    <div class="action-button">
                        <!-- <el-icon class="action-button-inter" @click="stopChat"><SwitchButton /></el-icon> -->
                        <span v-if="props.data.gpt"
                            class="button-info-m"
                            :class="props.data.gpt == '4' ? 'gpt4' : 'gpt35'"
                            >GPT{{ props.data.gpt }}</span>
                        <el-icon class="action-button-inter" 
                            @click="refreshAnswer(props.data.question)"
                            style="margin-right: 10px;" 
                            :size="16"><RefreshRight
                             /></el-icon>
                        <el-icon class="action-button-inter" @click="copyCode(props.data.answer)" 
                            :size="16"><CopyDocument />
                        </el-icon>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang='ts' setup>
import MarkDownIt from 'markdown-it'
import he from 'he'
import PubSub from 'pubsub-js'
import hljs from 'highlight.js'
import { ElMessage } from 'element-plus';
import axios from 'axios'
import { RefreshRight , CopyDocument } from '@element-plus/icons-vue'
import skylineLogo from '@/assets/avatar/Jerry.jpg'
import { type ConversationItem } from '@/config/interface/main';
import api from '@/config/apis/api'
import useGetUser from '@/hooks/useGetUser';
// import type useFormatQuestion from '@/hooks/useFormatQuestion';


const props = defineProps<{
    data: ConversationItem,
    'is_f': 0 | 1,
    pcid: string
}>()

const user = useGetUser()

const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    ElMessage.success('回复内容复制成功!')
}

const refreshAnswer = (q: string) => {
    PubSub.publish('refresh-answer',q)
}

const stopChat = () => {
    axios.post(api.stopChat,{'d':{
        a: props.data.answer,
        pid: props.data.pid,
        cid: props.data.id,
        pcid: props.pcid,
        q: props.data.question,
    }})
}

const getMDContext = (md: string) => {
    //把GPT返回的MD格式转成html，尤其是代码高亮
    const Md: MarkDownIt = new MarkDownIt({
      html: true,
      highlight: (str: string, lang: string) => {
        if (lang && hljs.getLanguage(lang)) {
          try {
            const code = Md.utils.escapeHtml(str)
            const decode = he.decode(Md.utils.escapeHtml(str))
            //真离谱啊，pre和code只能写在一行
            return `<pre class="hljs"><div class="copy-button" onclick="
                ((e) => {
                    navigator.clipboard.writeText(\`${code}\`);
                    e.target.innerText = '复制成功！'
                    setTimeout(() => e.target.innerText = '复制代码',1000)
                })(event)
                ">复制代码</div><div class="code-main-wrapper"><code>${hljs.highlight(decode,{'language': lang,'ignoreIllegals': false}).value}</code>
                </div>
                   </pre>`
          } catch (__) {}
        }
        return `<pre class="hljs"><code>${he.decode(Md.utils.escapeHtml(str))}</code></pre>`
      }
    })
    return Md.render(md)
}

</script>

<style lang='less' scoped>
.conversation{
    position: relative;
    width: 100%;
    left: 0;
    margin: 10px 0;
    .time{
        width: 100%;
        text-align: center;
        color: #909399;
        font-size: 14px;
        user-select: none;
    }
    .dialog-item{
        position: relative;
        display: flex;
        margin: 15px 0;
        line-height: 20px;
        .avatar-area{
            user-select: none;
        }
        &.question{
            justify-content: right;
            right: 30px;
        }
        &.answer{
            justify-content: left;
            left: 10px;
            max-width: 100%;
        }
        
        .text-area{
            padding: 0 12px;
            max-width: calc(100% - 100px);
            word-break: break-all;
            overflow-wrap: break-word;
            .time{
                color: #FAFCFF;
                font-size: 12px;
                margin-bottom: 6px;
                display: flex;
                justify-content: right;
            }
            .dialog{
                border-radius: 6px;
                padding: 6px 8px;
                font-size: 14px;
                &.question {
                    background-color: rgb(149,236,105);
                    right: 0;
                }
                &.answer{
                    background-color: white;
                }
                &.failed{
                    background-color: rgb(241 186 176);
                }
            }
        }
        .action-answer{
            position: relative;
            width: 100%;
            display: flex;
            justify-content: right;
            .stop{
                position: fixed;
                display: flex;
                justify-content: center;
                bottom: 10px;
                text-align: center;
                background-color: white;
                padding: 6px 10px;
                font-size: 14px;
                border-radius: 5px;
                cursor: pointer;
            }
            .action-button{
                margin: 4px 0;
                background-color: white;
                color: #606266;
                border-radius: 9px;
                padding: 2px 10px;
                padding-bottom: 0px;
                font-size: 15px;
                font-weight: bold;
                .button-info-m{
                    position: relative;
                    top: -1px;
                    padding-right: 10px;
                    font-size: 13px;
                    font-weight: 300;
                    color: rgb(102,193,57);
                    user-select: none;
                    &.gpt4{
                        color: rgb(102,193,57);
                    }
                    &.gpt35{
                        color: rgb(228,163,62);
                    }
                }
            }
        }
    }
}
</style>