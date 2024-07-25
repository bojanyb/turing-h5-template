<template>
  <div class="page-wrap">
    <van-popup v-model:show="show" position="bottom" closeable :overlay="false" :before-close="beforeClose" @click-close-icon="handleClose">
      <div class="dialog-wrap">
        <div class="title-box">
          <img :src="titleImg" alt="" />
        </div>
        <div class="main-box">
          <div class="tips-box">团内包含六个甄选礼物，将会从中选择一款礼物送出</div>
          <div class="gift-box">
            <div
              class="gift-item"
              v-for="(item, index) in giftList"
              :key="item.id"
              :class="{ active: swiperIndex === index }"
              @click="handleSwitchGift(index)"
            >
              <img :src="prependHttpIfMissing(item.gift_photo)" :alt="item.gift_name" />
            </div>
          </div>
          <div class="swiper-box">
            <swiper
              ref="swiperRef"
              :modules="modules"
              effect="creative"
              centeredSlides
              navigation
              slidesPerView="auto"
              :creativeEffect="{
                prev: {
                  translate: [-35, 0, 0],
                  scale: 0.8,
                  opacity: 0.8,
                },
                next: {
                  translate: [35, 0, 0],
                  scale: 0.8,
                  opacity: 0.8,
                },
              }"
              @swiper="onSwiper"
              @active-index-change="onActiveIndexChange"
            >
              <swiper-slide v-for="item in giftList" :key="item.id">
                <div class="swiper-item">
                  <div class="gift-rate">{{ item.gift_rate }}%</div>
                  <div class="gift-img"><img :src="prependHttpIfMissing(item.gift_photo)" :alt="item.gift_name" /></div>
                  <div class="gift-name">{{ item.gift_name }}</div>
                  <div class="gift-price">{{ item.gift_diamond }}米粒</div>
                </div>
              </swiper-slide>
            </swiper>
          </div>
          <div class="btn-box">
            <img class="hover:scale-95 active:scale-95" :src="btnImg" alt="" @click="handleConfirm" />
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script setup lang="ts">
  // 导入Swiper所需模块
  import { Navigation, EffectCreative } from 'swiper/modules';
  // 导入 Swiper Vue.js 组件
  import { Swiper, SwiperSlide } from 'swiper/vue';
  // 导入 Swiper 样式
  import 'swiper/scss';
  import 'swiper/scss/navigation';
  import 'swiper/scss/effect-creative';
  // 导入图片
  import title1 from '@/assets/images/peach-blossom-luck/title1.png';
  import title2 from '@/assets/images/peach-blossom-luck/title2.png';
  import title3 from '@/assets/images/peach-blossom-luck/title3.png';
  import btn1 from '@/assets/images/peach-blossom-luck/btn1.png';
  import btn2 from '@/assets/images/peach-blossom-luck/btn2.png';
  import btn3 from '@/assets/images/peach-blossom-luck/btn3.png';
  import { js_sync_app, js_sync_loadEnd, isIosFun, isAndroidFun } from '@/utils/index';
  import { useRoute } from 'vue-router';
  import { getGiftBoxDetail } from '@/api/modules/gift';
  import { prependHttpIfMissing } from '@/utils';
  import { useHandleData } from '@/hooks/useHandleData';

  // 路由参数获取
  const route = useRoute();
  const query = route.query;

  const modules = [Navigation, EffectCreative];
  const show = ref(true);
  const titleImgs = [title1, title2, title3];
  const btnImgs = [btn1, btn2, btn3];
  const titleImg = ref(null);
  const btnImg = ref(null);
  const giftList = ref([]);
  const swiperRef = ref<any>(null);
  const swiperIndex = ref<number>(0);

  const onSwiper = (swiper) => {
    console.log(swiper);
  };

  const onActiveIndexChange = (swiper) => {
    console.log('[ swiper.activeIndex ] >', swiper.activeIndex);
    swiperIndex.value = swiper.activeIndex;
  };

  // 切换礼物
  const handleSwitchGift = (index: number) => {
    swiperRef.value?.$el.swiper.slideTo(index);
  };

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

  const handleConfirm = () => {
    let params = {
      gift_id: Number(query.box_id),
    };
    js_sync_app('js_sync_give_gift', params, 'gift_id');
    // handleClose();
  };

  const getGiftDetail = async (boxId: number) => {
    const res = await getGiftBoxDetail({ box_id: boxId });
    console.log('[ res ] >', res);
    if (!res) return;
    giftList.value = res.gift_list;
  };

  // hook使用
  useHandleData(false, () => {
    if (query.box_id) {
      getGiftDetail(Number(query.box_id));
    }
  });

  // 页面挂载
  onMounted(() => {
    if (query.type) {
      const index = query.type - 1;
      titleImg.value = titleImgs[index];
      btnImg.value = btnImgs[index];
    }
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
    :deep(.van-popup) {
      padding-top: 40px;
      background: transparent;
    }

    :deep(.van-popup__close-icon) {
      display: flex;
      justify-content: center;
      align-items: center;
      top: 72px;
      right: 40px;
      width: 40px;
      height: 40px;
      font-size: 20px;
      color: #fff;
      background: rgb(0 0 0 / 30%);
      border-radius: 999px;
    }
  }

  .dialog-wrap {
    position: relative;
  }

  .title-box {
    position: absolute;
    top: -40px;
    left: 50%;
    transform: translateX(-50%);

    img {
      width: 404px;
      height: 128px;
    }
  }

  .main-box {
    width: 100%;
    padding: 90px 32px 40px;
    padding-bottom: calc(constant(safe-area-inset-bottom) + 40px);
    padding-bottom: calc(env(safe-area-inset-bottom) + 40px);
    border-radius: 20px 20px 0 0;
    background: url('@/assets/images/peach-blossom-luck/bg.png') center center / cover no-repeat transparent;
  }

  .tips-box {
    font-size: 24px;
    text-align: center;
    color: #242424;
  }

  .gift-box {
    display: flex;
    justify-content: space-between;
    margin-top: 24px;
    height: 100px;

    .gift-item {
      width: 100px;
      height: 100px;
      border-radius: 16px;
      background: url('@/assets/images/peach-blossom-luck/gift_item_bg.png') center center / 100% 100% no-repeat rgb(255 255 255 / 20%);

      &.active {
        background-color: rgb(255 255 255 / 50%);
      }

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .swiper-box {
    display: flex;
    width: 100%;
    height: 550px;
    margin-top: 32px;

    :deep(.swiper-slide) {
      width: 470px;
      height: 550px;
      background: url('@/assets/images/peach-blossom-luck/gift_box_bg.png') center center / 100% 100% no-repeat transparent;
    }

    :deep(.swiper-button-prev),
    :deep(.swiper-button-next) {
      width: 48px;
      height: 48px;
      color: #24e3ec;
      background: rgb(0 0 0 / 30%);
      border-radius: 999px;

      &::after {
        font-size: 24px;
        font-weight: bold;
      }
    }

    :deep(.swiper-button-prev) {
      left: 0;
    }

    :deep(.swiper-button-next) {
      right: 0;
    }
  }

  .swiper-item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;

    .gift-rate {
      display: flex;
      align-items: center;
      padding-top: 34px;
      height: 36px;
      color: #fff;
      font-size: 28px;
    }

    .gift-img {
      margin-top: 10px;
      width: 240px;
      height: 240px;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }

    .gift-name {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 48px;
      text-align: center;
      color: #000;
      font-size: 32px;
      font-weight: 500;
    }

    .gift-price {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 10px;
      text-align: center;
      color: #666;
      font-size: 24px;
    }
  }

  .btn-box {
    margin-top: 32px;
    text-align: center;

    img {
      width: 473px;
      height: 112px;
    }
  }
</style>
