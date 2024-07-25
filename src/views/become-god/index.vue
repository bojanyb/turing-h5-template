<template>
  <div class="page-wrap">
    <img class="background" src="@/assets/images/become-god/bg.png" />
    <!-- 返回按钮 -->
    <div class="back-wrap" @click="handleBack">
      <van-icon name="arrow-left" size="18" />
    </div>
    <img class="btn-join" src="@/assets/images/become-god/btn_join.png" @click="handleJoin" />
  </div>
</template>

<script setup lang="ts">
  import { js_sync_app, js_sync_back } from '@/utils/index';

  // 返回
  const handleBack = () => {
    js_sync_back();
  };

  // 加入公会
  const handleJoin = () => {
    js_sync_app('js_sync_join_guild', { type: 'join_guild' }, 'type');
  };
</script>

<style lang="scss" scoped>
  .page-wrap {
    position: relative;
    min-height: 100vh;
  }

  .background {
    width: 100%;
    height: 1624px;
  }
  // 返回按钮
  .back-wrap {
    position: fixed;
    top: 140px;
    left: 25px;
    width: 64px;
    height: 64px;
    color: #fff;

    &:active {
      opacity: 0.8;
    }
  }

  .btn-join {
    position: absolute;
    bottom: 156px;
    left: 50%;
    transform: translateX(-50%);
    width: 528px;
    height: 164px;
    cursor: pointer;
    user-select: none;

    &:active {
      transform: translateX(-50%) scale(0.9);
    }
  }
</style>
