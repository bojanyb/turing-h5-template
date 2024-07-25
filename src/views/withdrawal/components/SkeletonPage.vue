<template>
  <van-skeleton :title="true" :row="30" avatar :loading="true">
    <template #template>
      <div class="skeleton-page">
        <div class="skeleton-header">
          <van-row :gutter="[20, 20]">
            <van-col span="12">
              <van-skeleton-paragraph row-width="100%" />
            </van-col>
            <van-col span="12">
              <van-skeleton-paragraph row-width="100%" />
            </van-col>
          </van-row>
          <van-skeleton-paragraph row-width="70%" />
          <van-skeleton-paragraph row-width="80%" />
          <van-skeleton-paragraph row-width="90%" />
          <van-skeleton-paragraph row-width="100%" />
        </div>

        <section class="skeleton-info">
          <van-row :gutter="[20, 20]">
            <van-col span="12">
              <van-skeleton-paragraph row-width="100%" />
            </van-col>
          </van-row>
          <van-skeleton-paragraph row-width="70%" />
          <van-skeleton-paragraph row-width="90%" />
          <van-skeleton-paragraph row-width="60%" />
          <van-skeleton-paragraph row-width="70%" />
        </section>

        <section class="skeleton-method">
          <van-row :gutter="[20, 20]">
            <van-col span="12">
              <van-skeleton-paragraph row-width="100%" />
            </van-col>
            <van-col span="12">
              <van-skeleton-paragraph row-width="100%" />
            </van-col>
          </van-row>
          <van-skeleton-paragraph row-width="70%" />
          <van-skeleton-paragraph row-width="90%" />
          <van-skeleton-paragraph row-width="60%" />
          <van-skeleton-paragraph row-width="70%" />
        </section>

        <section class="skeleton-account">
          <van-row :gutter="[20, 20]">
            <van-col span="12">
              <van-skeleton-paragraph row-width="100%" />
            </van-col>
            <van-col span="12">
              <van-skeleton-paragraph row-width="100%" />
            </van-col>
          </van-row>
          <van-skeleton-paragraph row-width="70%" />
          <van-skeleton-paragraph row-width="90%" />
          <van-skeleton-paragraph row-width="60%" />
          <van-skeleton-paragraph row-width="70%" />
        </section>

        <section class="skeleton-amount">
          <van-row :gutter="[20, 20]">
            <van-col span="12">
              <van-skeleton-paragraph row-width="100%" />
            </van-col>
          </van-row>
          <van-skeleton-paragraph row-width="70%" />
          <van-skeleton-paragraph row-width="90%" />
          <van-skeleton-paragraph row-width="60%" />
          <van-skeleton-paragraph row-width="70%" />
        </section>

        <section class="skeleton-agreement">
          <van-row :gutter="[20, 20]">
            <van-col span="12">
              <van-skeleton-paragraph row-width="100%" />
            </van-col>
            <van-col span="12">
              <van-skeleton-paragraph row-width="100%" />
            </van-col>
          </van-row>
          <van-skeleton-paragraph row-width="70%" />
          <van-skeleton-paragraph row-width="90%" />
          <van-skeleton-paragraph row-width="60%" />
          <van-skeleton-paragraph row-width="70%" />
        </section>
      </div>
    </template>
  </van-skeleton>
</template>

<style lang="scss" scoped>
  .van-skeleton {
    background: #fff;
  }

  .skeleton-page {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 16px;
  }

  .skeleton-header,
  .skeleton-info,
  .skeleton-method,
  .skeleton-account,
  .skeleton-amount,
  .skeleton-agreement {
    padding: 20px;
    margin-bottom: 32px;
  }

  .skeleton-buttons {
    display: flex;
    justify-content: space-between;
  }
</style>
