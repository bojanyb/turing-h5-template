<template>
  <section v-for="item in props.list" :key="item.sec" class="top-list">
    <slot :name="item.slot"></slot>
  </section>
</template>

<script setup lang="ts">
  const props = defineProps({
    list: Object,
  });

  onMounted(() => {
    console.log(props.list);
  });
</script>

<style lang="scss" scoped>
  .top-list {
    // width: 690px;
    display: flex;
    flex-direction: column;
    align-items: center;
    // padding: 28px 28px 40px 28px;
    margin: auto;
    margin-bottom: 30px;
    img {
      width: 140px;
    }
  }
</style>
