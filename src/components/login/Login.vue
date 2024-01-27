<template>
    <div class="login-page">
        <div class="login-area">
            <div class="title">欢迎使用 <br>Jerry Jin的智能AI系统</div>
            <div class="content text-like">请使用系统账号登录</div>
            <el-form class="login-form-area" :model="form">
                <el-form-item label="用户名">
                    <el-input id="username" v-model="form.username" />
                </el-form-item>
                <el-form-item label="密码">
                    <el-input id="password" v-model="form.password" type="password" />
                </el-form-item>
                <el-form-item>
                    <el-button id="loginButton" style="width: 100%;" type="primary" @click="onSubmit">登录</el-button>
                </el-form-item>
                <br> <br>
                <el-text style="text-align: center;" aria-copyright="版权所有 Jerry Jin@SCAU"
                type="primary">Copyright &copy; 2021-{{ new Date().getFullYear() }} Jerry Jin. All Rights Reserved.</el-text>
            </el-form>
        </div>
    </div>
</template>

<script lang='ts' setup>
import { dataEncrypt } from '@/utils/crypto';
import axios from 'axios';
import { ref, toRaw } from 'vue';
import api from '@/config/apis/api';
import Pubsub from 'pubsub-js'
import { ElMessage } from 'element-plus';
import router from '@/router';

const form = ref({
    username: '',
    password: ''
})

const onSubmit = () => {
    const cert = dataEncrypt(toRaw(form.value))
    // 在此处自定义修改你的登录方法
}
</script>

<style lang='less' scoped>
.login-page{
    position: fixed;
    display: block;
    left: 0;
    width: 100%;
    top: 0;
    height: 100%;
    z-index: 165;
    background-color: white;
    background-image: url('@/assets/login.png');
    background-position: left;
    background-size: contain;
    background-repeat: no-repeat;
    user-select: none;
    .login-area{
        position: absolute;
        left: 80px;
        top: 200px;
        width: 500px;
        height: 500px;
        .title{
            position: relative;
            font-size: 29px;
            font-weight: bold;
        }
        .content{
            position: relative;
            margin: 10px 0;
            font-size: 16px;
        }
        .text-like{
            color: #606266;
        }
    }
}
@media only screen and (max-width: 600px){
    .login-area{
        width: 90% !important;
        left: 5% !important;
    }
}
</style>
