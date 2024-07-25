<template>
  <van-cell v-for="(item, index) in list" :key="index">
    <div class="item-wrap">
      <div class="item-header">
        <div class="money">
          <span class="name">状态</span>
          <span class="line"></span>
          <span :style="{ color: item.status_color }">{{ item.status_name }}</span>
        </div>
        <div class="date">{{ item.addtime }}</div>
      </div>
      <div class="item-body">
        <div class="money">
          <span class="name">提现</span>
          <span class="line"></span>
          <span class="service"
            >{{ item.real_money / 100 }}元 <span>(手续费：{{ Number(item.money_rate) / 100 }}元)</span></span
          >
        </div>
      </div>
      <div class="item-footer">
        <div class="money">
          <span class="name">来源</span>
          <span class="line"></span>
          <div class="down">
            <span>饭团：-{{ item.money }}</span>
            <span v-if="item.status === 3" class="color-#FF1818">{{ item.remark }}</span>
          </div>
        </div>
        <van-button class="cancel-btn" size="small" color="#E8FAFF" v-if="item.status === 1" @click="handleCancelApply(item.id)"
          >取消提现</van-button
        >
      </div>
    </div>
  </van-cell>
</template>

<script setup lang="ts">
  import { showConfirmDialog, showToast } from 'vant';
  import { cancelApply } from '/@/api/modules/withdrawal';
  import { Withdrawal } from '@/api/interface/index';

  interface WithdrawalRecord extends Withdrawal.IRecord {
    status_color: string;
    status_name: string;
  }

  defineProps<{
    list: WithdrawalRecord[];
  }>();

  const emit = defineEmits(['refresh']);

  // 取消提现
  const handleCancelApply = async (id: number) => {
    showConfirmDialog({
      className: 'cancel-apply-dialog',
      width: '70vw',
      theme: 'round-button',
      title: '是否确认取消提现？',
      confirmButtonText: '确认取消',
      confirmButtonColor: 'linear-gradient(270deg, #53DCFF 19.04%, #81FFFD 93.14%)',
      cancelButtonText: '考虑一下',
      cancelButtonColor: 'linear-gradient(270deg, rgba(83, 220, 255, 0.2) 19.04%, rgba(129, 255, 253, 0.2) 93.14%)',
    }).then(async () => {
      const res = await cancelApply({ id }).catch((err) => {
        console.log(err);
        showToast('取消提现失败');
      });
      if (!res) return;
      showToast('取消提现成功');
      emit('refresh');
    });
  };
</script>

<style lang="scss">
  .cancel-apply-dialog {
    .van-button {
      color: #000 !important;
      font-size: 28px;
      font-weight: 500;
    }
  }
</style>
<style lang="scss" scoped>
  .van-cell {
    padding: 0;
    background: none;

    &::after {
      display: none;
    }
  }

  .item-wrap {
    border-radius: 30px;
    padding: 20px 30px;
    margin-bottom: 30px;
    font-size: 24px;
    color: rgb(0 0 0 / 80%);
    background-color: #fff;
    box-sizing: border-box;
  }

  .item-header,
  .item-body,
  .item-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .money {
      display: flex;
      align-items: center;
    }

    .line {
      width: 2px;
      height: 20px;
      background: #d8d8d8;
      margin: 0 16px;
    }
  }

  .item-body {
    margin: 10px 0;

    .service {
      color: #000;

      span {
        padding-left: 10px;
        color: #727272;
      }
    }
  }

  .item-footer {
    width: 100%;

    .money {
      flex: 1;
    }

    .down {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex: 1;
    }

    .cancel-btn {
      width: 160px;
      height: 48px;
      border-radius: 999px;

      :deep(.van-button__text) {
        font-size: 24px;
        color: #1acbfd;
      }
    }
  }
</style>
