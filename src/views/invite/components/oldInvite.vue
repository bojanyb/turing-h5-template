<template>
  <div class="invite-oldInvite-box">
    <img class="bgBox" src="@/assets/images/invite/bg_full.png" alt="" />

    <div class="contentBox">
      <div class="mainBox" :class="{ mainHigh: can }">
        <div class="invitationBox input-box" v-if="can">
          <span class="tit">邀请码：</span>
          <van-field v-model="invite_code" placeholder="请输入邀请码" />
          <van-button class="submitBox" round @click="bindCode">绑定</van-button>
        </div>
        <div class="roomBox input-box">
          <span class="tit">房间号：</span>
          <van-field v-model="room_number" placeholder="输入房间号，直接进入房间" />
        </div>
        <div class="peopleBox input-box">
          <span class="tit">我的邀请：</span>
          <van-field v-model="returnPeople" :readonly="true" />
        </div>
        <div class="btnBox">
          <img class="linkBox" @click="toCopy" src="@/assets/images/invite/link.png" alt="" />
          <img class="qrBox" @click="qrFunc" src="@/assets/images/invite/qr.png" alt="" />
        </div>
      </div>
    </div>

    <!-- 二维码分享 -->
    <qrComp ref="qrCompRef" />
  </div>
</template>

<script setup lang="ts">
  // 引入api
  import { userInfo, myInvite, canBind, bindInvite } from '/@/api/modules/invite';
  // 二维码分享
  import qrComp from './qrComp.vue';
  import { useClipboard } from '@vueuse/core';
  import { showToast } from 'vant';

  const { copy } = useClipboard();
  // 二维码组件
  const qrCompRef = ref('');
  // 邀请码
  const invite_code = ref(null);
  // 房间号
  const room_number = ref('');
  // 邀请统计
  const form = ref({});
  // 个人信息
  const ruleForm = ref({});
  // 是否第一次登录
  const can = ref(false);

  // 计算属性
  const returnPeople = computed(() => {
    return (form.value.count ? form.value.count : 0) + ' 人';
  });

  // 分享链接
  const invite_href = computed(() => {
    // let url = `https://mmxq.aiyi.live/?nav=3&invite_code=${invite_code.value}&room_number=${room_number.value}`
    let url = `${import.meta.env.VITE_INVITE_URL}?nav=3&invite_code=${ruleForm.value.user_number}&room_number=${room_number.value}`;
    return url || '';
  });

  // 获取是否第一次登录
  const getCanBind = () => canBind().then((res) => (can.value = res.can || false));

  // 绑定邀请码
  const bindCode = async () => {
    const res = await bindInvite({ invite_code: invite_code.value });
    if (!res) return;
    showToast('绑定成功');
    getCanBind();
  };

  // 复制操作
  const toCopy = () => {
    copy(invite_href.value)
      .then(() => {
        showToast('邀请链接已复制');
      })
      .catch((err) => {
        console.error('[ err ] >', err);
        showToast('邀请链接复制失败');
      });
  };

  // 获取邀请统计
  const statisticsFunc = () => myInvite().then((res) => (form.value = res));

  // 获取个人信息
  const getInfo = () => userInfo().then((res) => (ruleForm.value = res));

  // 二维码
  const qrFunc = () => {
    let params = invite_href.value.split('nav=3&');
    let url = params[1].split('&');
    let back = {};
    url.forEach((item) => {
      let data = item.split('=');
      back[data[0]] = data[1];
    });

    qrCompRef.value.loadParams(back, invite_href.value);
  };

  // 获取数据
  const loadParams = () => Promise.all([statisticsFunc(), getInfo(), getCanBind()]);

  defineExpose({
    loadParams,
  });
</script>

<style lang="scss" scoped>
  .invite-oldInvite-box {
    width: 100%;
    height: 100%;
  }
  .bgBox {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 1624px;
  }
  .contentBox {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    padding: 618px 32px 0;
  }
  .mainBox {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 68px 32px 40px;
    width: 100%;
    background: rgba(255, 255, 255, 0.85);
    border-radius: 40px;

    .input-box {
      display: flex;
      align-items: center;
      width: 100%;
      height: 96px;
      margin-bottom: 30px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 1);
      border: 3px solid #fc2700;
      box-sizing: border-box;
      padding-left: 36px;
      overflow: hidden;

      > span.tit {
        font-size: 32px;
        color: #f33;
      }

      .van-field {
        flex: 1;
      }

      .submitBox {
        width: 162px;
        height: 100%;
        color: #FC2700;
        font-size: 32px;
        background: rgba(252, 39, 0, 0.24);
        border-color: rgba(255, 255, 255, 1);
      }
    }

    .btnBox {
      margin-top: 30px;

      img {
        width: 304px;
        height: 96px;
      }

      .linkBox {
        margin-right: 14px;
      }
    }
  }
  .mainHigh {
    padding-top: 58px;

    .input-box {
      margin-bottom: 20px;
    }

    .btnBox {
      margin-top: 5px;
    }
  }
</style>
