<template>
  <div class="list"></div>
</template>
<script setup lang="ts">
  // interface SimpleTopList {
  //   id?: number;
  //   name: string;
  //   icon?: string;
  //   num?: number;
  //   tree_price?: number;
  // }

  // const props = defineProps({
  //   list: Array,
  // });

  // let topList = ref<SimpleTopList[]>([
  //   {
  //     id: 1,
  //     name: '跟班',
  //     icon: new URL('/@/assets/image/couple/user_empty_1.png', import.meta.url).href,
  //   },
  //   {
  //     id: 2,
  //     name: '队友',
  //     icon: new URL('/@/assets/image/couple/user_empty_2.png', import.meta.url).href,
  //   },
  //   {
  //     id: 3,
  //     name: '陪伴',
  //     icon: new URL('/@/assets/image/couple/user_empty_3.png', import.meta.url).href,
  //   },
  //   {
  //     id: 4,
  //     name: '守护',
  //     icon: new URL('/@/assets/image/couple/user_empty_4.png', import.meta.url).href,
  //   },
  //   {
  //     id: 5,
  //     name: '知己',
  //     icon: new URL('/@/assets/image/couple/user_empty_5.png', import.meta.url).href,
  //   },
  //   {
  //     id: 6,
  //     name: '基友',
  //     icon: new URL('/@/assets/image/couple/user_empty_6.png', import.meta.url).href,
  //   },
  //   {
  //     id: 7,
  //     name: '兄弟',
  //     icon: new URL('/@/assets/image/couple/user_empty_7.png', import.meta.url).href,
  //   },
  //   {
  //     id: 8,
  //     name: '独宠',
  //     icon: new URL('/@/assets/image/couple/user_empty_8.png', import.meta.url).href,
  //   },
  //   {
  //     id: 9,
  //     name: 'cp',
  //     icon: new URL('/@/assets/image/couple/user_empty_9.png', import.meta.url).href,
  //   },
  // ]);

  onMounted(() => {
    // const tempArr = props.list as SimpleTopList[];
    // topList.value = tempArr.reduce((pev, cur) => {
    //   topList.value.forEach((item) => {
    //     if (item.id === cur.id) {
    //       pev.push({ ...item, num: cur.tree_price });
    //     }
    //   });
    //   return pev;
    // }, [] as any);
  });
</script>

<style lang="scss" scoped>
  .list {
    // width: 686px;
    height: 868px;
    margin: 0 auto;
    background: url('/@/assets/images/couple/relation_icon.png') no-repeat center;
    background-size: 100% 100%;
  }
</style>
