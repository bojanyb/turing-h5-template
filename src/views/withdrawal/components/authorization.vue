<template>
  <div> </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';

  const router = useRouter();
  const route = useRoute();

  onMounted(() => {
    const userToken = localStorage.getItem('token') || '';

    const { auth_code, app_id, source, scope, state } = route.query as {
      auth_code?: string;
      app_id?: string;
      source?: string;
      scope?: string;
      state?: string;
    };

    console.log(route.query);
    console.log(`/withdrawal/apply/?token=${state || userToken}&auth_code=${auth_code}&app_id=${app_id}&source=${source}&scope=${scope}`);

    router.push(`/withdrawal/apply/?token=${state || userToken}&auth_code=${auth_code}&app_id=${app_id}&source=${source}&scope=${scope}`);
  });
</script>

<style lang="scss"></style>
