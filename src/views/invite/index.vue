<template>
  <div class="invite-box bg-white">
    <component :is="comps[comp]" ref="compRef" @next="next" />
  </div>
</template>

<script setup lang="ts">
  // import { isRecommender } from '/@/api/modules/invite';
  import item from './components/item.vue';
  import share from './components/share.vue';
  import oldInvite from './components/oldInvite.vue';
  import { useHandleData } from '/@/hooks/useHandleData';

  const compRef = ref<any>(null);
  const comp = ref<string>('oldInvite');
  const comps = {
    item,
    share,
    oldInvite,
  };
  const ruleForm = ref<any>({});

  // const getIsRecommender = async () => {
  //     const res = await isRecommender()
  //     ruleForm.value = res.info
  //     if(ruleForm.value.setting_flg) {
  //       comp.value = 'share'
  //     } else {
  //       comp.value = 'item'
  //     }
  //     setTimeout(() => {
  //       compRef.value.loadParams(ruleForm.value)
  //     }, 50);
  // }

  // 去分享
  const next = () => {
    comp.value = 'share';
    setTimeout(() => {
      compRef.value.loadParams(ruleForm.value);
    }, 50);
  };

  useHandleData(false, () => {
    compRef.value.loadParams();
  });

  onMounted(() => {
    document.title = '推荐人';
    // compRef.value.loadParams();
  });
</script>

<style lang="scss"></style>
