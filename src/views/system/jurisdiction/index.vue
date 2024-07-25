<template>
  <div class="system-jurisdiction-box">
    <div class="menuBox" v-for="(item, index) in list" :key="index">
      <h5>{{ item.tit }}</h5>
      <ul>
        <li v-for="(a, b) in item.list" :key="b">
          <div class="nameBox">{{ a.name }}</div>
          <div class="valueBox">{{ a.value }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
  // 引入js数据
  import jurisdiction from './index.data';
  import { useRoute } from 'vue-router';

  const route = useRoute();

  // 初始化数据
  const list = ref([]);

  // 页面创建时
  onMounted(() => {
    document.title = '系统权限使用清单';
    // 获取路由中的参数
    const params = route.query;
    console.log(params, 'params---------2020');
    // 判断是否有source参数
    if (params && params.source) {
      // 设置数据
      list.value = jurisdiction.android;
    } else {
      list.value = jurisdiction.ios;
    }
  });
</script>

<style lang="scss" scoped>
  .system-jurisdiction-box {
    padding: 30px;
    background: rgb(250 250 250 / 100%);

    * {
      color: #333;
    }

    .menuBox {
      width: 100%;
      border-radius: 30px;
      background: rgb(255 255 255 / 100%);
      box-shadow: 0 12px 20px 0 rgb(211 211 212 / 30%);
      padding: 40px 25px 59px;
      margin-bottom: 60px;

      h5 {
        font-weight: bold;
        font-size: 32px;
      }

      ul {
        margin-top: 39px;

        > li {
          border-bottom: 1px solid rgb(233 233 233 / 100%);
          padding: 20px 0;

          > .nameBox {
            font-size: 26px;
            color: #999;
          }

          > .valueBox {
            font-size: 30px;
            color: #333;
            margin-top: 20px;
          }
        }
      }
    }
  }
</style>
