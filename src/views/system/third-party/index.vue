<template>
  <div class="system-thirdparty-box">
    <div class="menuBox" v-for="(item, index) in list" :key="index">
      <h5>{{ item.tit }}</h5>
      <ul>
        <li v-for="(a, b) in item.list" :key="b">
          <div class="nameBox">{{ a.name }}</div>
          <div class="valueBox" :class="{ clickable: isUrl(a.value) }" @click="handleValueBoxClick(a.value)">
            {{ a.value }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
  // 引入js数据
  import thirdparty from './index.data';
  import { useRoute } from 'vue-router';

  const route = useRoute();

  // 设置初始数据
  const list = ref([]);

  // 页面创建时
  onMounted(() => {
    document.title = '第三方信息数据共享';
    // 获取路由中的参数
    const params = route.query;
    // 判断是否有source参数
    if (params && params.source) {
      // 设置数据
      list.value = thirdparty[params.source];
    }
  });

  // 判断是否为URL
  const isUrl = (value: string): boolean => {
    const urlPattern = /^(https?:\/\/)?([\w-]+\.)*[\w-]+(:\d+)?(\/\S*)?$/;
    return urlPattern.test(value);
  };

  const handleValueBoxClick = (value: string): void => {
    if (isUrl(value)) {
      window.open(value, '_blank');
    }
  };
</script>

<style lang="scss" scoped>
  .system-thirdparty-box {
    padding: 30px;
    background: rgb(250 250 250 / 100%);

    * {
      color: #333;
      word-break: break-all;
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
            cursor: pointer;

            &.clickable {
              color: blue; // 点击后变蓝色
            }
          }
        }
      }
    }
  }
</style>
