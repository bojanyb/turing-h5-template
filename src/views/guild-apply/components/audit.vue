<template>
  <div class="guild-audit-box">
    <div class="mainBox">
      <img src="@/assets/images/guild/audit.png" alt="" />
      <p> 感谢您的申请<br />我们会在7个工作日内联系您</p>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
  .guild-audit-box {
    padding-top: 202px;
    background: #fff;

    .mainBox {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;

      > img {
        width: 122px;
        height: 122px;
        margin-bottom: 79px;
      }

      p {
        font-size: 30px;
        font-weight: bold;
        line-height: 70px;
        color: #333;
        text-align: center;
        letter-spacing: 3px;
      }
    }
  }
</style>
