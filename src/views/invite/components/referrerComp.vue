<template>
  <div class="referrerComp-box">
    <van-dialog v-model="show" :showConfirmButton="false" :show-cancel-button="false">
      <div class="mainBox">
        <div class="ConBox">
          <p class="tit" v-html="computedTit"></p>
          <p class="dec">（公会推荐人或用户推荐人一经选择不可更改）</p>
        </div>
        <div class="btnBox">
          <div class="confirmBox" @click="confirm">确定</div>
          <div class="cancelBox" @click="handClose">取消</div>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
  // 引入api
  import { beRecommender } from '/@/api/modules/invite';

  const show = ref(false);
  const status = ref(null);

  const emit = defineEmits(['next']);

  const computedTit = computed(() => {
    if (status.value && status.value === 1) {
      return `成为主播推荐人后，可享受推荐来的<br>主播收益的流水永久分成`;
    } else if (status.value && status.value === 2) {
      return `成为用户推荐人后，可享受推荐来的<br>新用户充值的永久分成`;
    }
  });

  const handClose = () => {
    show.value = false;
  };

  // 获取数据
  const loadParams = (status) => {
    show.value = true;
    status.value = status;
  };

  // 确定
  const confirm = async () => {
    let res = await beRecommender({ setting_flg: Number(status.value) });
    if (res.code === 2000) {
      show.value = false;
      emit('next');
    }
  };

  defineExpose({
    loadParams,
  });
</script>

<style lang="scss" scoped>
  .referrerComp-box {
    .van-dialog__content {
      padding: 28px 10px 40px;
    }

    .mainBox {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 17px;

      .ConBox {
        p.tit {
          font-size: 33px;
          text-align: center;
          font-family: 'Adobe Heiti Std';
          line-height: 50px;
          white-space: nowrap;
        }

        p.dec {
          font-size: 20px;
          text-align: center;
          margin-top: 20px;
          color: #999;
        }
      }

      .btnBox {
        display: flex;
        align-items: center;
        margin-top: 65px;

        > div {
          width: 240px;
          height: 90px;
          border-radius: 45px;
          font-size: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .confirmBox {
          background: rgb(255 53 101 / 100%);
          color: #fff;
          margin-right: 40px;
        }

        .cancelBox {
          background: #eee;
          color: #999;
        }
      }
    }
  }
</style>
