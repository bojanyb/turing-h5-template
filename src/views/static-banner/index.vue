<template>
  <div class="bannerPage">
    <img v-if="placardImg" :src="placardImg" />
  </div>
</template>

<script setup lang="ts">
  import placard1 from '/@/assets/images/static-banner/1.png';
  import placard2 from '/@/assets/images/static-banner/2.png';
  import placard3 from '/@/assets/images/static-banner/3.png';
  import placard4 from '/@/assets/images/static-banner/4.png';

  const placardImg = ref('');

  // 设置横幅图片地址和文档标题
  const setPlacardAndTitle = (placard: string, title: string) => {
    placardImg.value = placard;
    document.title = title;
  };

  onMounted(() => {
    const params = new URLSearchParams(window.location.search);
    const placardNumValue = Number(params.get('placardNum'));
    const netType = params.get('netType');

    // 根据 placardNum 参数值设置横幅图片地址和文档标题
    if (placardNumValue === 1) {
      setPlacardAndTitle(placard1, '防范打击网络诈骗公告');
    } else if (placardNumValue === 2) {
      switch (netType) {
        case 'ddcp':
          setPlacardAndTitle(placard2, '多多CP文明公约');
          break;
        case 'kaihei':
          setPlacardAndTitle(placard2, '开黑啦文明公约');
          break;
        default:
          setPlacardAndTitle(placard2, 'turing-h5-template文明公约');
          break;
      }
    } else if (placardNumValue === 3) {
      setPlacardAndTitle(placard3, '防范打击网络诈骗公告');
    } else if (placardNumValue === 4) {
      setPlacardAndTitle(placard4, '用户行为管理规范');
    }
  });
</script>

<style scoped lang="scss">
  .bannerPage {
    width: 100%;
    height: 100%;
    overflow-y: scroll;

    img {
      display: block;
      width: 100%;
    }
  }
</style>
