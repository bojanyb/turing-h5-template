<template>
  <div class="withdraw-container">
    <header class="header" @click="navigateToInviteUrl">
      <img src="@/assets/images/withdrawal/logo-text.png" alt="Logo" class="logo" />
    </header>
    <router-view class="flex-1 overflow-y-auto" />
  </div>
</template>
<script setup lang="ts">
  const navigateToInviteUrl = () => {
    window.location.href = import.meta.env.VITE_INVITE_URL;
  };
</script>

<style scoped lang="scss">
  .withdraw-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #f7f7f7;

    .header {
      height: 88px;
      padding: 20px 32px;
      background: #fff;
      display: flex;
      align-items: center;

      .logo {
        height: 48px;
      }
    }
  }
</style>
