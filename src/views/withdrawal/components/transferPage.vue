<template>
  <div> </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();

  onMounted(() => {
    const userToken = localStorage.getItem('token') || '';
    router.push(`/withdrawal/apply/?token=${userToken}`);
  });
</script>

<style lang="scss"></style>
