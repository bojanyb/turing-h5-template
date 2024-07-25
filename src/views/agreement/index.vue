<template>
  <div class="agreement-box">
    <div class="contentBox" v-for="(item, index) in params.content" :key="index">
      <div class="tit" v-if="item.tit">{{ item.tit }}</div>
      <div class="conBox" v-html="item.con"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  // 引入协议
  import agreement from './index.data';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  // 协议参数
  const params = ref({});

  // 页面挂载
  onMounted(() => {
    if (route.query && route.query.type) {
      const name = route.query.type;
      // 标题
      document.title = agreement[name].title;
      params.value = agreement[name];
    }
  });
</script>

<style lang="scss">
  .agreement-box {
    background: #fff;
    padding: 42px 30px 50px;

    * {
      color: #3d3d3d;
      font-size: 28px;
    }

    .contentBox {
      margin-bottom: 50px;

      .tit {
        margin-bottom: 10px;
      }

      .conBox {
        line-height: 50px;
      }
    }
  }
</style>
