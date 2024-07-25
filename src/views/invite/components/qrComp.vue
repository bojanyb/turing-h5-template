<template>
  <div class="qrComp-box" :class="{ 'qrComp-box-hide': isHide }">
    <van-dialog v-model:show="show" :show-confirm-button="false" :show-cancel-button="false">
      <img class="close" @click="show = false" src="@/assets/images/invite/close.png" alt="" />
      <div class="mainBox" ref="mainBox">
        <div class="qrBox">
          <vue-qr :text="invite_href" :margin="0" colorDark="#000000" colorLight="#fff" :logoScale="0.15" :size="150" />
        </div>
      </div>
      <div class="btnBox" @click="downLoad">
        <img src="@/assets/images/invite/btn.png" alt="" />
      </div>
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
  import vueQr from 'vue-qr/src/packages/vue-qr.vue';
  import html2Canvas from 'html2canvas';
  import { js_sync_app } from '/@/utils/index';
  import { useClipboard } from '@vueuse/core';

  const { copy } = useClipboard();
  const show = ref(false);
  const urlParams = ref(''); // 分享出去的参数
  const invite_href = ref(''); // 分享出去的链接
  const isHide = ref(false);
  const mainBox = ref(null);

  // 获取数据
  const loadParams = (urlParams, url) => {
    isHide.value = false;
    show.value = true;
    urlParams.value = JSON.stringify(urlParams);
    invite_href.value = url;
  };

  const downLoad = () => {
    // 复制链接到剪切板
    copy(urlParams.value);
    // 生成海报
    html2Canvas(mainBox.value, {
      backgroundColor: null,
      useCORS: true, // 如果截图的内容里有图片,可能会有跨域的情况,加上这个参数,解决文件跨域问题
      scale: 1,
    }).then((canvas) => {
      const dataURL = canvas.toDataURL('image/png');
      console.log('🚀 ~ file: qrComp.vue:58 ~ downLoad ~ dataURL', dataURL);
      let params = {
        url: dataURL,
      };
      js_sync_app('js_sync_camera', params, 'url');
    });
  };

  defineExpose({
    loadParams,
    show,
    isHide,
  });
</script>

<style lang="scss" scoped>
  .qrComp-box {
    position: relative;

    :deep(.van-dialog) {
      width: 686px;
      background: transparent;
    }

    img.close {
      position: absolute;
      right: 10px;
      top: 10px;
      width: 80px;
      height: 80px;
      z-index: 1;
    }

    .mainBox {
      position: relative;
      width: 686px;
      height: 872px;
      background: url('@/assets/images/invite/qrbg.png') center center / cover no-repeat transparent;

      .qrBox {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 196px;
        padding: 20px;
      }
    }

    .btnBox {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 40px;
      width: 356px;
      height: 96px;

      > img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .qrComp-box-hide {
    z-index: -9999;
    visibility: hidden;
  }
</style>
