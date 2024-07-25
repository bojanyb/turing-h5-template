<template>
  <div class="page-wrap">
    <div class="pt-20vh">
      <van-loading size="24px" vertical>正在加载中...</van-loading>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { js_sync_back } from '@/utils';
  // import { getSignStatus } from '/@/api/modules/guild';

  // // 获取签署协议状态
  // const getAgreementStatus = async () => {
  //   // 查询公会协议签署状态，签署类型（1主播协议 2公会协议 3公司协议）
  //   const res = await getSignStatus({ type: 1 });
  //   console.log('[ res ] >', res);
  //   if (!res) return;
  //   // 如果主播协议已签署，则关闭页面
  //   if (res.anchor_agreement) {
  //     js_sync_back();
  //   }
  // };

  onMounted(() => {
    // getAgreementStatus();
    // 直接关闭页面
    js_sync_back();
  });
</script>

<style scoped lang="scss"></style>
