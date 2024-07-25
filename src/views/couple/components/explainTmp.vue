<template>
  <ul class="card">
    <li class="inner" v-for="item in topList" :key="item.id" :style="{ background: 'url(' + item.bg + ') no-repeat center / 100% 100%' }">
      <div class="text">
        <div class="title">{{ item.name }}</div>
        <div class="num">{{ item.num }}心动值</div>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
  interface SimpleTopList {
    id?: number;
    name: string;
    bg?: string;
    num?: number;
    min_score?: number;
  }

  const props = defineProps({
    list: Array,
  });

  let topList = ref<SimpleTopList[]>([
    {
      id: 1,
      name: '十里桃花',
      bg: new URL('/@/assets/image/couple/footer_bg_1.png', import.meta.url).href,
    },
    {
      id: 2,
      name: '三生三世',
      bg: new URL('/@/assets/image/couple/footer_bg_3.png', import.meta.url).href,
    },
    {
      id: 3,
      name: '金玉良缘',
      bg: new URL('/@/assets/image/couple/footer_bg_2.png', import.meta.url).href,
    },
  ]);

  onMounted(() => {
    const tempArr = props.list as SimpleTopList[];
    topList.value = tempArr.reduce((pev, cur) => {
      topList.value.forEach((item) => {
        if (item.id === cur.id) {
          pev.push({ ...item, num: cur.min_score });
        }
      });
      return pev;
    }, [] as any);
  });
</script>

<style lang="scss" scoped>
  .card {
    width: 660px;
    .inner {
      width: 100%;
      height: 200px;
      border-radius: 20px 20px 20px 20px;
      background: rgba(178, 178, 178, 0.4);
      margin-bottom: 20px;
      position: relative;
      .text {
        position: absolute;
        left: 10px;
        bottom: 10px;
        color: #ffffff;
        width: 148px;
        height: 66px;
        background: rgba(0, 0, 0, 0.7);
        border-radius: 20px;
        padding: 0px 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .title {
          font-size: 20px;
          transform: scale(0.9);
        }
        .num {
          font-size: 16px;
          white-space: nowrap;
          transform: scale(0.9);
        }
      }
    }
  }
</style>
