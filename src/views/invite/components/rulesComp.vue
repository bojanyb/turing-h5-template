<template>
  <div class="rulesComp-box">
    <van-dialog v-model="show" :showConfirmButton="false" :show-cancel-button="false">
      <div class="mainBox">
        <h6>邀请规则</h6>
        <div class="Con-Box">
          <p v-for="(item, index) in computedTit" :key="index">{{ item }}</p>
        </div>
        <div class="btnBox" @click="handClose">
          <img src="@/assets/images/invite/yes.png" alt="" />
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
  const show = ref(false);
  const status = ref(1);

  const computedTit = computed(() => {
    let arr = ['1.一个账号只能成为一种推荐人，一经选择不可更改'];
    let arr2 = ['2.成为主播推荐人后，享受邀请来的新用户实际收到的礼物价值分成'];
    let arr2_c = ['2.成为用户推荐人后，享受邀请来的新用户充值的分成'];
    let arr3 = [
      '3.成为推荐人需进行实名认证，同一实名信息下的ID不可相互绑定',
      '4.同一安全验证方式下的ID不可相互绑定',
      '5.新用户须使用从来没有下载注册过此APP的设备，否则不视为新用户',
      '6.绑定同一实名信息或同一安全验证方式下的两个ID将自动解除绑定。',
      '7.如有利用系统BUG等违规行为，予以账号封禁处理',
      '8.最终解释权归本平台所有',
    ];
    if (status.value && status.value === 1) {
      return [...arr, ...arr2, ...arr3];
    } else if (status.value && status.value === 2) {
      return [...arr, ...arr2_c, ...arr3];
    }
  });

  const handClose = () => {
    show.value = false;
  };
  // 获取数据
  const loadParams = (status) => {
    show.value = true;
    status.value = status;
  };

  defineExpose({
    loadParams,
  });
</script>

<style lang="scss" scoped>
  .rulesComp-box {
    * {
      color: #333;
    }

    .van-dialog {
      width: 640px;
    }

    .van-dialog__content {
      padding: 28px 10px 40px;
    }

    .mainBox {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 17px;

      > h6 {
        font-size: 36px;
      }

      .Con-Box {
        padding: 0 38px;
        margin-top: 43px;

        > p {
          font-size: 28px;
          line-height: 45px;
          margin-bottom: 10px;
        }
      }

      .btnBox {
        position: relative;
        width: 560px;
        height: 128px;
        margin-top: 20px;

        > img {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
        }
      }
    }
  }
</style>
