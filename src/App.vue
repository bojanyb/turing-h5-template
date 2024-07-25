<template>
  <router-view />
</template>
<script setup lang="ts">
  import { useUserStore } from '/@/store/modules/user';

  const userStore = useUserStore();
  window.js_sync_info = (token, id) => {
    console.log('获取客户端token:', token);
    userStore.setToken(token);
    userStore.device_id = id;
  };
</script>

<style>
  html,
  body {
    height: 100%;
    overflow: hidden;
    overscroll-behavior: none;
  }

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    background-color: transparent;
    height: 100%;
    overflow: auto;
  }
</style>
