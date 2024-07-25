<template>
  <div class="invite-item-box">
    <div class="headerBox">
      <img class="friend" src="@/assets/images/invite/friend.png" alt="" />
      <img class="weal" src="@/assets/images/invite/weal.png" alt="" />
    </div>
    <div class="mainBox">
      <div class="funcBox">
        <div class="anchorBox" @click="referrerFunc(1)">
          <img src="@/assets/images/invite/anchor.png" alt="" />
          <span>成为主播推荐人</span>
        </div>
        <div class="userBox" @click="referrerFunc(2)">
          <img src="@/assets/images/invite/user.png" alt="" />
          <span>成为用户推荐人</span>
        </div>
      </div>
      <div class="explainBox">
        <h6>推荐人说明</h6>
        <div class="ConBox">
          <p>1.一个账号只能成为一种推荐人，一经选择不可更改</p>
          <p>2.成为主播推荐人后，享受邀请来的新用户实际收到的礼物价值分成</p>
          <p>3.成为用户推荐人后，享受邀请来的新用户充值的分成</p>
          <p>4.成为推荐人需进行实名认证，同一实名信息下的ID不可相互绑定</p>
          <p>5.同一安全验证方式下的ID不可相互绑定</p>
          <p>6.绑定同一实名信息或同一安全验证方式下的两个ID将自动解除绑定。</p>
          <p>7.新用户须使用从来没有下载注册过此APP的设备，否则不视为新用户</p>
          <p>8.如有利用系统BUG等违规行为，予以账号封禁处理</p>
          <p>9.最终解释权归本平台所有</p>
        </div>
      </div>
    </div>

    <!-- 实名组件 -->
    <autonymComp ref="autonymCompRef" />
    <!-- 推荐人组件 -->
    <referrerComp ref="referrerCompRef" @next="next" />
  </div>
</template>

<script setup lang="ts">
  import { getVerify } from '/@/api/modules/invite';
  import autonymComp from './autonymComp.vue';
  import referrerComp from './referrerComp.vue';
  import { showToast } from 'vant';

  const autonymCompRef = ref(null);
  const referrerCompRef = ref(null);
  const ruleForm = ref({});

  const emit = defineEmits(['next']);

  // 成为推荐人
  const referrerFunc = () => {
    showToast('程序媛小姐姐通宵达旦赶工中，敬请期待～');
  };

  // 是否实名
  const isAuthentication = async () => {
    let res = await getVerify();
    ruleForm.value = res.info;
  };

  // 下一步 - 去分享
  const next = () => {
    emit('next');
  };

  // 获取数据
  const loadParams = () => {
    isAuthentication();
  };

  defineExpose({
    loadParams,
  });

  onMounted(() => {
    // 重新加载 - 是否实名
    window.app_sync_reload = () => {
      autonymCompRef.value.show = false;
      isAuthentication();
    };
  });
</script>

<style lang="scss" scoped>
  .invite-item-box {
    background: #f98314;

    .headerBox {
      width: 100%;
      height: 478px;
      background: url('@/assets/images/invite/background.png') center center;
      background-size: cover;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 79px;

      > .friend {
        width: 502px;
        height: 98px;
      }

      > .weal {
        width: 627px;
        height: 105px;
        margin-top: 39px;
      }
    }

    .mainBox {
      padding: 0 30px;

      .funcBox {
        width: 100%;
        height: 400px;
        border-radius: 20px;
        background: rgb(255 255 255 / 100%);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        > div {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 478px;
          height: 118px;
          margin-bottom: 30px;

          > img {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
          }

          > span {
            position: absolute;
          }
        }

        .userBox {
          margin-bottom: 0;
        }
      }

      .explainBox {
        padding: 60px 12px 90px 15px;

        h6 {
          font-size: 30px;
          text-align: center;
          margin-bottom: 29px;
          letter-spacing: 5px;
        }

        .ConBox {
          p {
            font-size: 24px;
            margin-bottom: 15px;
            line-height: 35px;
          }

          p:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }
</style>
