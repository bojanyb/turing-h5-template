<template>
  <div class="couple-page">
    <top-list :list="listFilter">
      <template #header>
        <section class="header"></section>
      </template>
      <template #explain>
        <section class="explain">
          <div class="explain-title">1、牵手流程</div>
          <div class="explain-text">
            <p>等待缘分——心动表白——约会成功</p>
          </div>
          <div class="explain-title">2、玩法说明</div>
          <div class="explain-text">
            <p>
              对麦上用户打赏，会产生心动连线；心动连线值排名前3的玩家，会保留在麦上。每名玩家可以有很多心动连线，但只有最高心动值的连线才能显示出来。
            </p>
            <p>
              1米粒=1心动值；<br />
              赠送给与自己同一边的玩家不会产生心动值。<br />
              连线心动值超过一定额度的玩家，可以在环节的最后，得到主持人赐予的‘关系’。<br />
              关系随着心动值的增高而升级；心动值越高，场景更加华丽高级，关系牌更加酷炫，快去提高心动值吧!
            </p>
          </div>
          <relation-tmp v-if="relationList.length" :list="relationList" />
        </section>
      </template>
      <!-- <template #footer>
        <section class="footer">
          <div class="footer-text">
            <p>
                1.匹配成功的嘉宾，两人心动值总额达到一定值会出发不同的牵手场景；
              <br />
              心动值越高，场景更加华丽高级快去提高心动值吧！
            </p>
          </div>
          <explain-tmp v-if="explainList.length" :list="explainList"></explain-tmp>
        </section>
      </template> -->
    </top-list>
  </div>
</template>

<script setup lang="ts">
  import TopList from './components/topList.vue';
  import relationTmp from './components/relationTmp.vue';
  import { getDescribe } from '/@/api/modules/couple';
  import { useHandleData } from '/@/hooks/useHandleData';

  const listFilter = reactive<any[]>([
    // {
    //   sec: 1,
    //   title: new URL('/@/assets/images/couple/explain_title_1.png', import.meta.url).href,
    //   bg: new URL('/@/assets/images/couple/explain_bg_1.png', import.meta.url).href,
    //   slot: 'header',
    // },
    {
      sec: 2,
      title: new URL('/@/assets/images/couple/explain_title_2.png', import.meta.url).href,
      bg: new URL('/@/assets/images/couple/explain_bg_2.png', import.meta.url).href,
      slot: 'explain',
    },
    {
      sec: 3,
      title: new URL('/@/assets/images/couple/explain_title_3.png', import.meta.url).href,
      bg: new URL('/@/assets/images/couple/explain_bg_3.png', import.meta.url).href,
      slot: 'footer',
    },
  ]);
  const explainList = ref<any[]>([]);
  const relationList = ref<any[]>([]);
  const pagePrams = reactive<StateType>({
    page: 1,
    pagesize: 10,
  });

  const getDescribeList = async () => {
    const { anim_list, conf_list } = await getDescribe(pagePrams);
    explainList.value = anim_list;
    relationList.value = conf_list;
  };

  // hook使用
  useHandleData(false, () => {
    getDescribeList();
  });

  onMounted(() => {
    // getDescribeList();
  });
</script>
<style scoped lang="scss">
  .couple-page {
    width: 100%;
    min-height: 100vh;
    padding: 38px 42px;
    background: #fff;
    color: #000;
  }

  .explain-title {
    margin-bottom: 20px;
    font-size: 32px;
    font-weight: 500;
  }

  .explain-text {
    margin-bottom: 40px;
    font-size: 28px;

    p {
      margin-bottom: 20px;
      line-height: 40px;
    }
  }

  .footer-text {
    width: 622px;
    margin: 0 auto;
    margin-bottom: 40px;

    p {
      font-size: 24px;
      line-height: 40px;
      margin-bottom: 40px;
    }
  }
</style>
