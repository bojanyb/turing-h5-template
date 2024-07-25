<template>
  <div class="page-wrap">
    <!-- 返回按钮 -->
    <div class="back-wrap" @click="handleBack">
      <img src="@/assets/images/love-explain/btn_back.png" alt="" />
    </div>
    <!-- 真爱戒指 -->
    <div class="card-wrap">
      <img class="card-title" src="@/assets/images/love-explain/title1.png" />
      <img class="ring-img" src="@/assets/images/love-explain/ring1.png" />
      <div class="card-body">
        <p><span>1、</span>真爱戒指只有在亲密值大于等于 520 的时候，才会触发求婚流程。</p>
        <p><span>2、</span>亲密值不足可以使用挚爱时刻礼物，直接进入求婚</p>
        <p><span>3、</span>对方拒绝和你组成情侣，礼物戒指不退回</p>
        <p><span>4、</span>对方已有伴侣的情况下，礼物正常送出，但不触发求婚流程</p>
      </div>
    </div>
    <!-- 挚爱时刻 -->
    <div class="card-wrap">
      <img class="card-title" src="@/assets/images/love-explain/title2.png" />
      <img class="ring-img" src="@/assets/images/love-explain/ring2.png" />
      <div class="card-body">
        <p><span>1、</span>挚爱时刻直接触发求婚流程</p>
        <p><span>2、</span>对方拒绝和你组成情侣，礼物不退回</p>
        <p><span>3、</span>对方已有伴侣的情况下，礼物正常送出，但不触发求婚流程</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { js_sync_app, js_sync_loadEnd, isIosFun, isAndroidFun } from '/@/utils/index';

  const handleBack = () => {
    let params = {
      // params用于给安卓指令用的 - 不携带参数 - 安卓接收不到指令
      type: 'back',
    };
    let backText = isIosFun() == true ? 'js_sync_back' : 'js_app_back';
    js_sync_app(backText, params, 'type');
  };

  // 页面挂载
  onMounted(() => {
    if (isAndroidFun()) {
      let params = {
        // params用于给安卓指令用的 - 不携带参数 - 安卓接收不到指令
        type: 'loadEnd',
      };
      js_sync_loadEnd('js_sync_loadEnd', params, 'type');
    }
  });
</script>

<style lang="scss" scoped>
  .page-wrap {
    padding: 200px 32px 40px;
    min-height: 100vh;
    background: url('@/assets/images/love-explain/bg.jpg') center center / 100% 100% no-repeat transparent;
  }

  // 返回按钮
  .back-wrap {
    position: fixed;
    top: 140px;
    left: 25px;
    width: 64px;
    height: 64px;

    &:active {
      opacity: 0.8;
    }

    img {
      width: 100%;
      height: 100%;
    }
  }

  .card-wrap {
    position: relative;
    margin-top: 64px;
    margin-bottom: 64px;
    padding: 68px 30px 30px;
    color: #ea0000;
    border-radius: 32px;
    background: url('@/assets/images/love-explain/meta.png') right bottom / 158px 122px no-repeat #ffeced;

    & + .card-wrap {
      margin-top: 128px;
    }
  }

  .card-title {
    position: absolute;
    top: -32px;
    left: 50%;
    transform: translateX(-50%);
    width: 264px;
    height: 64px;
  }

  .ring-img {
    position: absolute;
    top: -50px;
    left: calc(50% + 136px);
    width: 100px;
    height: 100px;
  }

  .card-body {
    font-size: 28px;
    line-height: 2;

    p {
      display: flex;
    }
  }
</style>
