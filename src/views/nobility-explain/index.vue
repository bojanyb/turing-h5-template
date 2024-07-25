<template>
  <div class="nobilityExplain-box bg-white">
    <ul>
      <li v-for="(item, index) in nobilityList" :key="index">
        <div class="titleBox">
          <img v-if="item.titImg" :src="item.titImg" alt="" />
          <span>{{ item.title }}</span>
        </div>
        <div class="conBox">
          <div class="con-sun-box">{{ item.content }}</div>
          <img v-if="item.contentImg" :src="item.contentImg" alt="" />
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  // 引入贵族说明参数
  import nobilityList from './index.data';

  onMounted(() => {
    document.title = '贵族说明';
  });
</script>

<style lang="scss" scoped>
  .nobilityExplain-box {
    padding: 41px 30px 50px;
    color: #3d3d3d;

    ul {
      li {
        margin-bottom: 60px;

        .titleBox {
          display: flex;
          align-items: center;

          > img {
            width: 28px;
            height: 20px;
            margin-right: 11px;
          }

          > span {
            font-weight: 600;
            font-size: 30px;
          }
        }

        .conBox {
          margin-top: 21px;

          .con-sun-box {
            font-size: 27px;
            line-height: 50px;
            word-break: break-all;
          }

          > img {
            width: 100%;
            margin-top: 50px;
          }
        }
      }
    }
  }
</style>
