<template>
  <div class="page-wrap">
    <van-popup
      v-model:show="show"
      position="bottom"
      overlay-class="dialog-overlay"
      safe-area-inset-bottom
      round
      :before-close="beforeClose"
      @click-overlay="handleClose"
    >
      <div class="dialog-wrap">
        <div class="dialog-header">
          <div class="left" :class="{ disabled: !index }" @click="handlePrev"><van-icon name="arrow-left" size="20" /> 上一步</div>
          <div class="center">{{ dataList[index].title }}</div>
          <div class="right" :class="{ disabled: index === dataList.length - 1 }" @click="handleNext"
            >下一步 <van-icon name="arrow" size="20"
          /></div>
        </div>
        <div ref="dialogBodyRef" class="dialog-body">
          <div v-if="index === 0" class="flex justify-center"><div class="tips">ps：需要自己在房间播放器里搜索心仪的音乐哦</div></div>
          <div v-html="dataList[index].content"></div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
  import { js_sync_app, js_sync_loadEnd, isIosFun, isAndroidFun } from '@/utils/index';
  import dataList from './index.data';

  const show = ref<boolean>(true);
  const index = ref<number>(0);
  const dialogBodyRef = ref(null);

  // 阻止组件内部的弹窗关闭事件
  const beforeClose = () => {
    return false;
  };
  const handleClose = () => {
    let params = {
      // params用于给安卓指令用的 - 不携带参数 - 安卓接收不到指令
      type: 'back',
    };
    let backText = isIosFun() == true ? 'js_sync_back' : 'js_app_back';
    js_sync_app(backText, params, 'type');
    // show.value = false;
  };

  // 滚动到顶部
  const scrollTop = async () => {
    await nextTick();
    // dialogBodyRef.value.scrollTop = 0;
    let scrollElem = dialogBodyRef.value;
    scrollElem.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 上一步
  const handlePrev = () => {
    console.log('[ 上一步 ] >');
    index.value--;
    scrollTop();
  };

  // 下一步
  const handleNext = () => {
    console.log('[ 下一步 ] >');
    index.value++;
    scrollTop();
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
<style lang="scss" scope>
  .page-wrap {
    .van-popup {
      background: #ff7070 !important;
    }
  }

  .dialog-wrap {
    display: flex;
    flex-direction: column;
    height: 800px;
  }

  .dialog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 32px;

    .left,
    .right {
      display: flex;
      align-items: center;
      color: #fff;
      font-size: 32px;
      cursor: pointer;
      pointer-events: auto;

      &:active {
        opacity: 0.8;
      }

      &.disabled {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
      }
    }

    .center {
      padding: 0 20px;
      height: 52px;
      font-size: 32px;
      color: #fe4649;
      line-height: 52px;
      border-radius: 999px;
      background: rgb(255 255 255 / 80%);
    }
  }

  .dialog-body {
    flex: 1;
    padding: 0 32px;
    overflow: auto;

    div {
      font-size: 28px;
      line-height: 1.8;
      text-align: justify;
      color: #fff;
    }

    p {
      margin-bottom: 20px;
      text-indent: 2em;
      font-size: 28px;
      line-height: 1.8;
      text-align: justify;
      color: #fff;
    }

    .title {
      font-size: 32px;
      font-weight: bold;
    }

    .tips {
      padding: 0 30px;
      margin: 40px 0;
      height: 55px;
      font-size: 28px;
      color: #ab0000;
      line-height: 55px;
      border-radius: 999px;
      background: #ffb9b9;
    }

    .red {
      color: #fbff35;
    }

    .green {
      color: #b0002a;
    }

    .yellow {
      color: #6c54ff;
    }
  }

  .dialog-overlay {
    background: none !important;
  }
</style>
