<template>
    <div @click="startDialog" class="explore-item">
        <el-card class="box-card">
            {{ props.text }}
        </el-card>
    </div>
</template>

<script lang='ts' setup>
import PubSub from 'pubsub-js';

const props = defineProps<{
    text: string,
    isClickAble: boolean
}>()

const startDialog = () => {
    if (props.isClickAble){
        PubSub.publish('transport-q',props.text)
    }
}
</script>

<style lang='less' scoped>
@tabHeight : 55px;
.explore-item{
    position: relative;
    width: 300px;
    height: @tabHeight;
    margin: 8px;
    text-align: center;
    .box-card{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 300px;
        height: @tabHeight;
        font-size: 15.3px;
        transition-duration: 0.4s;
        cursor: pointer;
        &:hover{
            color: rgb(245,108,108) !important;
        }
    }
}
</style>