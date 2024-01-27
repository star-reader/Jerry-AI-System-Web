<template>
    <div class="input-area">
        <div class="input-frame">
            <el-input
                v-model="question"
                resize="none"
                :autosize="{ minRows: 1, maxRows: 3 }"
                @keydown.enter.prevent="sendQuestion($event)"
                @focus="focusInput"
                type="textarea"
                placeholder="请输入你要发送的消息(Enter发送,Shift + Enter换行)"
            />
        </div>
        <div class="send-area">
            <el-button class="send-button" 
                type="warning" 
                :icon="Promotion"
                @click="sendQuestion($event)"
            ></el-button>
        </div>
    </div>
</template>

<script lang='ts' setup>
import PubSub from 'pubsub-js';
import { Promotion } from '@element-plus/icons-vue'
import { onMounted, ref, toRaw } from 'vue';

const question = ref('')

const sendQuestion = (e: KeyboardEvent) => {
    if (e.shiftKey){
        question.value += '\n'
        return
    }
    PubSub.publish('send-question',toRaw(question.value))
    question.value = ''
    window.scrollTo(0, document.documentElement.scrollHeight)
}

const focusInput = () => {
    PubSub.publish('focus-input',1)
}

onMounted(() => {
    PubSub.subscribe('transport-q',(_,data: string) => {
        question.value = data
    })
})

</script>

<style lang='less' scoped>
.input-area{
    position: absolute;
    display: flex;
    justify-content: space-evenly;
    left: 3%;
    width: 94%;
    bottom: 20px;
    height: 76px;
    border-radius: 8px;
    background-color: rgb(150,221,255);
    .input-frame{
        width: calc(100% - 100px);
        display: flex;
        align-items: center;
        margin: 0 16px;
        margin-right: 0;
    }
    .send-area{
        width: 60px;
        height: 100%;
        display: flex;
        align-items: center;
    }
}
</style>