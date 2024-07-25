<template>
  <div ref="anim" class="anim-container" @click="handleClick"></div>
</template>

<script setup lang="ts">
  import Vap from 'video-animation-player';
  // import config from './demo.json';
  // import demo from './demo.mp4';

  const access = ref<boolean>(true);
  const vap = ref<any>(null);
  const anim = ref<any>(null);

  // 暂停
  // const pause = () => {
  //   if (vap.value) {
  //     vap.value.pause();
  //   }
  // };

  // 播放结束
  const playEnd = () => {
    access.value = true;
    // 销毁vap
    if (vap.value) {
      vap.value.destroy();
      vap.value = null;
    }
    if (chrome.webview && chrome.webview.hostObjects && chrome.webview.hostObjects.dataObj) {
      const dataObj = chrome.webview.hostObjects.dataObj;
      dataObj.onComplete();
    }
  };

  // 继续播放
  // const playContinue = () => {
  //   if (vap.value) {
  //     vap.value.play();
  //   }
  // };

  // 播放vap
  const playVap = (obj) => {
    console.log('传入对象', obj);
    if (!access.value) {
      return;
    }
    if (!(obj && obj.path && obj.config)) {
      console.log('参数错误');
      playEnd();
      return;
    }
    // let width = document.body.clientWidth;
    // let height = document.body.clientHeight;
    try {
      vap.value = new Vap()
        .play({
          container: anim.value,
          // 素材视频链接
          src: obj.path,
          // 素材配置json对象
          config: obj.config,
          // width: width,
          // height: height,
          // 同素材生成工具中配置的保持一致
          fps: 20,
          // 是否循环
          loop: obj.loop || false,
          // 是否静音
          mute: obj.mute || false,
          // 起始播放时间点
          beginPoint: 0,
          // 精准模式
          accurate: true,
          type: 1,
          onLoadError: (e) => {
            console.log('加载失败！', e);
            playEnd();
          },
        })
        .on('playing', () => {
          access.value = false;
          console.log('播放中');
        })
        .on('ended', () => {
          console.log('播放结束');
          playEnd();
        });
      window.vap = vap.value;
    } catch (error) {
      console.log('未知错误', error);
      playEnd();
    }
  };

  // 播放测试
  // const playTest = () => {
  //   playVap({
  //     path: demo,
  //     config,
  //   });
  // };

  // 处理点击事件
  const handleClick = () => {
    if (chrome.webview && chrome.webview.hostObjects && chrome.webview.hostObjects.dataObj) {
      const dataObj = chrome.webview.hostObjects.dataObj;
      dataObj.js_sync_click();
    }
  };

  onMounted(() => {
    //取消默认的浏览器自带右键
    window.oncontextmenu = function (e) {
      e.preventDefault();
    };

    window.playSvga = (obj) => {
      playVap(obj);
    };
  });
</script>
<style scoped lang="scss">
  .anim-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
    overflow: hidden;

    :deep(canvas) {
      height: 100% !important;
    }
  }
</style>
