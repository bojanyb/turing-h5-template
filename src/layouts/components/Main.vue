<template>
  <router-view v-slot="{ Component, route }">
    <transition appear name="fade-transform" mode="out-in">
      <keep-alive :include="keepAliveName">
        <component :is="Component" :key="route.fullPath" />
      </keep-alive>
    </transition>
  </router-view>
</template>
<script setup lang="ts">
  import { useKeepAliveStore } from '/@/store/modules/keepAlive';
  import { storeToRefs } from 'pinia';

  const keepAliveStore = useKeepAliveStore();
  const { keepAliveName } = storeToRefs(keepAliveStore);
</script>
