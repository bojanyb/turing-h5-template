<template>
  <div class="autonymComp-box">
    <van-dialog v-model="show" :showConfirmButton="false" :show-cancel-button="false">
      <div class="handerBox">
        <van-icon size="26px" color="#CCCCCC" name="cross" @click="handClose" />
      </div>
      <div class="mainBox">
        <div class="conBox">成为举荐人需实名认证</div>
        <div class="btnBox" @click="authentication">去认证</div>
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
  import { js_sync_app } from '/@/utils/index';

  const show = ref(false);

  const handClose = () => {
    show.value = false;
  };

  // 去实名认证
  const authentication = () => {
    const params = {
      // params用于给安卓指令用的 - 不携带参数 - 安卓接收不到指令
      url: '123',
    };
    js_sync_app('js_sync_authentication', params, 'url');
  };
</script>

<style lang="scss" scoped>
  .autonymComp-box {
    .van-dialog__content {
      padding: 28px 22px 40px;
    }

    .handerBox {
      display: flex;
      justify-content: flex-end;
    }

    .mainBox {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 17px;

      .conBox {
        font-size: 34px;
        text-align: center;
        font-family: 'Adobe Heiti Std';
      }

      .btnBox {
        width: 500px;
        height: 90px;
        border-radius: 45px;
        background: rgb(255 53 101 / 100%);
        font-size: 34px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        margin-top: 111px;
      }
    }
  }
</style>
