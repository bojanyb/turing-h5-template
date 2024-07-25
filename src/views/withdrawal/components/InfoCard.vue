<template>
  <div class="card-container">
    <div class="card-icon">
      <img :src="info.icon" alt="" />
    </div>
    <div class="card-content">
      <slot name="title">
        <div class="card-amount">{{ formattedAmount }}</div>
      </slot>
      <slot name="description">
        <div class="card-description">{{ info.description }}</div>
      </slot>
    </div>
    <slot name="action">
      <!-- <van-button class="card-button">{{ info.buttonText }}</van-button> -->
    </slot>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    info: {
      type: Object,
      required: true,
      default: () => ({
        icon: '',
        amount: '',
        description: '',
        buttonText: '操作',
      }),
    },
  });

  const formattedAmount = computed(() => {
    return props.info.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  });

  console.log(props.info);
</script>

<style scoped lang="scss">
  .card-container {
    height: 144px;
    border-radius: 24px;
    background: linear-gradient(270deg, #fff3e1 1.31%, #fff 98.37%);
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 24px 18px;

    .card-icon {
      margin-right: 24px;

      img {
        width: 96px;
        height: 96px;
      }
    }

    .card-content {
      flex: 1;

      .card-amount {
        font-size: 36px;
        font-weight: 700;
        color: rgb(0 0 0 / 60%);
        margin-bottom: 4px;
      }

      .card-description {
        font-size: 22px;
        font-weight: 400;
        color: rgb(0 0 0 / 40%);
      }
    }

    // .card-button {
    //   width: 108px;
    //   height: 48px;
    //   background: linear-gradient(270deg, #ff2c2c 0%, #f6d 104.05%);
    //   border-radius: 12px;
    //   font-size: 24px;
    //   color: #fff;
    //   white-space: nowrap;
    // }
  }
</style>
