<template>
  <div class="withdrawal-list">
    <div class="page-header">
      <van-button icon="arrow-left" icon-position="left" class="back-button" @click="navigateToHome">返回</van-button>
    </div>
    <WithdrawalList />
  </div>
</template>

<script setup lang="ts">
  import WithdrawalList from './components/WithdrawalList.vue';

  const router = useRouter();
  /**
   * 返回上一页
   */
  const navigateToHome = () => {
    router.back();
  };
</script>

<style lang="scss" scoped>
  .withdrawal-list {
    padding: 30px;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;

    .back-button {
      height: 48px;
      width: 120px;
      color: #000;
      font-size: 32px;
      font-weight: 400;
      line-height: 48px;
      background: transparent;
      border: none;
      white-space: nowrap;
    }
  }
</style>
