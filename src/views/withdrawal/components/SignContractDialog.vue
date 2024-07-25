<template>
  <van-dialog v-model:show="show" width="80%" :showConfirmButton="false">
    <div class="dialog-wrap">
      <div class="title">协议签署</div>
      <div class="contract-list">
        <!-- 公会长才会显示公会入驻协议签署 -->
        <div v-if="info.role === 1" class="contract-item">
          <img class="icon" src="@/assets/images/withdrawal/document.png" alt="" />
          <div class="name">《公会入驻协议》</div>
          <button class="btn" :class="{ disabled: info.guild_agreement }" @click="toSign(2)">{{
            info.guild_agreement ? '已签署' : '去签署'
          }}</button>
        </div>
        <div class="contract-item">
          <img class="icon" src="@/assets/images/withdrawal/document.png" alt="" />
          <div class="name">《主播入驻协议》</div>
          <button class="btn" :class="{ disabled: info.anchor_agreement }" @click="toSign(1)">{{
            info.anchor_agreement ? '已签署' : '去签署'
          }}</button>
        </div>
      </div>
      <div class="tips">为保证双方权益需签署以上协议方可操作下一步</div>
    </div>
  </van-dialog>
</template>
<script setup lang="ts">
  import { closeToast, showLoadingToast, showToast } from 'vant';
  import { createWithTemplate } from '@/api/modules/withdrawal';

  const props = defineProps<{
    modelValue: boolean;
    info: any;
  }>();

  const show = ref<boolean>(false);

  // 去签署
  const toSign = async (type) => {
    try {
      showLoadingToast({
        message: '加载中...',
        forbidClick: true,
      });
      const res = await createWithTemplate({ type, request_from: 'cash_h5_v2' });
      window.location.href = res.actorSignTaskEmbedUrl;
    } catch (err: any) {
      console.log('[ err ] >', err);
      closeToast();
      showToast(err.msg || '创建签署任务失败');
    }
  };

  watchEffect(() => {
    show.value = props.modelValue;
  });
</script>

<style lang="scss" scoped>
  .dialog-wrap {
    padding: 48px 24px 32px;

    .title {
      font-size: 32px;
      font-weight: 600;
      color: #000;
      text-align: center;
    }
  }

  .contract-list {
    margin-top: 8px;
  }

  .contract-item {
    display: flex;
    align-items: center;
    padding: 24px 0;
    border-bottom: 1px solid #eee;

    &:last-child {
      border-bottom: none;
    }

    .icon {
      width: 68px;
      height: 68px;
    }

    .name {
      flex: 1;
      margin-left: 4px;
      text-align: left;
      font-size: 28px;
      color: #242424;
    }

    .btn {
      display: inline-block;
      box-sizing: border-box;
      padding: 10px 36px;
      font-size: 28px;
      line-height: 1.2;
      color: #fff;
      border: none;
      border-radius: 999px;
      background: linear-gradient(0deg, #1acbfd 0%, #1acbfd 100%), linear-gradient(270deg, #53dcff 19.04%, #81fffd 93.14%);
      cursor: pointer;

      &:active {
        opacity: 0.8;
      }

      &.disabled {
        color: #666;
        background: #dcdcdc;
        cursor: not-allowed;
        pointer-events: none;
      }
    }
  }

  .tips {
    margin-top: 8px;
    font-size: 24px;
    color: #666;
    text-align: center;
  }
</style>
