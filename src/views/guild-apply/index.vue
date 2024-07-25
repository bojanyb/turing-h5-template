<template>
  <component :is="comps[comp]" @next="next" />
</template>

<script setup lang="ts">
  // 引入申请组件
  import apply from './components/apply.vue';
  // 引入审核组件
  import audit from './components/audit.vue';
  import { myApply } from '/@/api/modules/guild';
  import { useUserStore } from '/@/store/modules/user';
  import { useHandleData } from '/@/hooks/useHandleData';

  const userStore = useUserStore();
  const comp = ref<string>('apply');
  const comps = {
    apply,
    audit,
  };

  const next = () => {
    comp.value = 'audit';
  };

  // 查看公会申请
  const seeGuild = async () => {
    if (!userStore.token) return;
    let res = await myApply();
    console.log('[ res ] >', res);
    comp.value = res.info ? 'audit' : 'apply';
  };

  useHandleData(false, () => {
    seeGuild();
  });
</script>
<style scoped lang="scss"></style>
