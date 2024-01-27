<template>
  <RouterView></RouterView>
</template>

<script lang='ts' setup>
import { nextTick, onMounted, ref } from 'vue';
import useToken from './hooks/useToken';
import PubSub from 'pubsub-js';
import router from './router';

onMounted(() => {
  nextTick(() => {
      useToken()
  })
  PubSub.subscribe('login-action', (_,data: number) => {
      if (!data) return router.push('/login')
  })
  setInterval(useToken, 3580000)
})
</script>

<style lang='less'>
#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
  'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}
</style>