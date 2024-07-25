<template>
  <div class="page-wrap">
    <div class="game-container">
      <!-- <van-icon name="cross" @click="handleDestory" class="close" /> -->
      <!-- game 容器  -->
      <div id="game" class="game-wrap"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { useRoute } from 'vue-router';
  import { SDKGameView } from '../SudSDK';

  // 路由参数获取
  const route = useRoute();
  // 一些变量
  const orientation = ref('');
  const gameId = ref('');
  const roomId = ref('');
  const userId = ref('');
  const isPlay = ref(false);
  let SudSDK = null;

  // const goBack = (data: any) => {
  //   if (data && data.leaveGame) {
  //     // 销毁游戏
  //     SudSDK && SudSDK.onDestroy();
  //   }
  //   setTimeout(() => {
  //     js_sync_app('js_sync_close', { type: 'close' }, 'type');
  //     // location.href = '/game';
  //   }, 1000);
  // };

  // const handleDestory = () => {
  //   showConfirmDialog({
  //     title: '提示',
  //     message: '确定要退出吗？',
  //   }).then(() => {
  //     goBack({ leaveGame: 1 });
  //   });
  // };

  const initGame = () => {
    const root = document.getElementById('game');
    if (root) {
      const nsdk = new SDKGameView({
        root,
        gameRoomId: roomId.value,
        gameId: gameId.value,
        userId: userId.value || Math.floor((Math.random() + 1) * 10000).toString(),
        isPlay: isPlay.value,
      });
      SudSDK = nsdk;
      nsdk.login();
    }
  };

  const rotateScreen = () => {
    const body = document.body;
    const width = window.outerWidth;
    const height = window.outerHeight;
    const isPortrait = window.orientation === 0 || window.orientation === 180; // 竖屏
    // @ts-ignore
    body.style['transform-origin'] = 'center center';
    // 竖屏
    if (isPortrait) {
      body.style.position = 'relative';
      body.style.width = height + 'px';
      body.style.height = width + 'px';
      body.style.transform = 'rotate(90deg)';
      const diffDistance = (height - width) / 2;
      body.style.left = -diffDistance + 'px';
      body.style.top = diffDistance + 'px';
    } else {
      body.style.width = width + 'px';
      body.style.height = height + 'px';
      // 横屏
      body.style.left = 'unset';
      body.style.top = 'unset';
      body.style.transform = 'rotate(0deg)';
    }
  };

  onMounted(async () => {
    const params = route.params;
    gameId.value = params.id;

    const query = route.query;
    orientation.value = query.orientation;
    roomId.value = query.roomId;
    userId.value = query.userId;
    isPlay.value = query.isPlay;

    // 横屏处理
    if (orientation.value && orientation.value === '0') {
      rotateScreen();
      window.onresize = function () {
        rotateScreen();
      };
    }
    nextTick(() => {
      initGame();
    });

    // 加入游戏
    window.js_sync_join_game = (seatIndex = 0) => {
      console.log('加入游戏', seatIndex);
      SudSDK && SudSDK.joinGame(seatIndex);
    };

    // 退出游戏
    window.js_sync_exit_game = () => {
      console.log('退出游戏');
      SudSDK && SudSDK.exitGame();
    };

    // 重新加载游戏
    window.js_sync_reload_game = () => {
      console.log('重新加载游戏');
      SudSDK && SudSDK.endGame();
    };

    // 发送文本到游戏
    window.js_sync_send_game_text = (text: string) => {
      console.log('发送文字', text);
      SudSDK && SudSDK.sendText(text);
    };

    // 清空游戏缓存
    window.js_sync_destroy_game = () => {
      console.log('销毁游戏');
      SudSDK && SudSDK.onDestroy();
    };
  });
  onUnmounted(() => {
    // 销毁游戏
    SudSDK && SudSDK.onDestroy();
  });
</script>
<style lang="scss" scoped>
  .page-wrap {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .game-container {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }

  .close {
    position: fixed;
    top: 20px;
    left: 46px;
    width: 60px;
    height: 60px;
    line-height: 60px;
    cursor: pointer;
    z-index: 999;
    background-color: rgb(255 255 255 / 20%);
    border-radius: 50%;
    text-align: center;
    color: #fff;
  }

  .game-wrap {
    width: 100vw;
    height: 100vh;

    :deep(iframe) {
      border: none;
    }
  }
</style>
