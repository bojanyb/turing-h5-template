<template>
  <div>
    <van-cell-group>
      <van-field v-model="roomId" label="房间号ID" placeholder="请输入房间号ID" />
    </van-cell-group>
    <div class="game-list">
      <div @click="toDetail(item)" v-for="item in list" :key="item.sceneId" class="game-item">
        <img class="game-logo" :src="item.scenePic" alt="" />
        <div class="game-title">{{ item.sceneName }}</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  // import { getList } from '@/api/modules/game';
  import { useRouter } from 'vue-router';
  import gameData from './home.json';

  const list = ref<any[]>([]);
  const roomId = ref('');
  // 路由参数获取
  const router = useRouter();

  const getData = () => {
    // const res = await getList();
    list.value = gameData.data.sceneVOList;
  };

  const toDetail = (item) => {
    console.log('[ game url ] >', `/game/${item.sceneId}`);
    router.push({ path: `/game/${item.sceneId}`, query: { orientation: item.orientation, roomId: roomId.value } });
  };

  onMounted(() => {
    getData();
  });
</script>
<style lang="scss" scoped>
  .game-list {
    padding: 0 4.2vw;
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 40px;
  }

  .game-item {
    margin-right: 1.6vw;
    margin-top: 20px;
  }

  .game-item:nth-child(2n) {
    margin-right: 0;
  }

  .game-logo {
    width: 44.8vw;
    height: 44.8vw;
    border-radius: 10px;
    object-fit: cover;
  }

  .game-title {
    font-size: 14px;
    font-family: PingFangSC-Semibold, 'PingFang SC';
    font-weight: 600;
    color: #000;
    padding-top: 8px;
    text-align: left;
  }
</style>
