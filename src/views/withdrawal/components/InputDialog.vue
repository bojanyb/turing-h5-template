<template>
  <div class="dialog-wrapper">
    <van-dialog
      v-model:show="visible"
      :title="title"
      theme="round-button"
      showCancelButton
      :confirmButtonText="confirmButtonText"
      @cancel="handleClose"
      :beforeClose="beforeDialogClose"
      confirmButtonColor="linear-gradient(270deg, #53DCFF 19.04%, #81FFFD 93.14%)"
      cancelButtonColor="linear-gradient(270deg, rgba(83, 220, 255, 0.2) 19.04%, rgba(129, 255, 253, 0.2) 93.14%)"
    >
      <div class="dialog-content" v-if="!boundPhoneNumber">
        <div class="input-container">
          <van-field
            class="sms-input"
            v-model="inputValues.code"
            type="number"
            maxlength="6"
            label="验证码:"
            :placeholder="placeholder"
            v-if="inputType === 'smsCode'"
          />
          <div class="bank-info" v-else-if="inputType === 'bankCard'">
            <van-cell-group inset>
              <van-cell title="户名" :value="bankCardAccountInfo?.username" />
              <van-cell title="银行" :value="bankCardAccountInfo?.bank_name" />
              <van-cell title="卡号" :value="bankCardAccountInfo?.bank_card_id" />
            </van-cell-group>
          </div>
          <van-field v-model="inputText" type="text" :placeholder="placeholder" v-else />
        </div>
        <div class="validation-message" v-if="inputType === 'smsCode'">
          手机号：{{ verificationData?.phone }}, 请注意查收平台短信验证码
        </div>
        <div class="validation-message" v-else>{{ message }}</div>
      </div>
      <div class="empty" v-else></div>
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watchEffect, defineProps, defineEmits } from 'vue';

  interface DialogProps {
    show: boolean;
    title: string;
    message?: string;
    placeholder: string;
    boundPhoneNumber?: string;
    confirmButtonText?: string;
    verificationData?: Record<string, any>;
    bankCardAccountInfo?: {
      username?: string;
      bank_name?: string;
      bank_card_id?: string;
    };
    inputType?: 'smsCode' | 'bankCard' | string;
  }

  const props = defineProps<DialogProps>();

  const emit = defineEmits<{
    (event: 'update:show', value: boolean): void;
    (event: 'confirm', value: string): void;
    (event: 'fromConfirm', value: any): void;
  }>();

  const inputText = ref<string>('');
  const inputValues = ref<Record<string, any>>({});

  const visible = computed({
    get: () => props.show,
    set: (val) => emit('update:show', val),
  });

  watchEffect(() => {
    if (props.boundPhoneNumber) {
      inputText.value = props.boundPhoneNumber;
    }
  });

  watchEffect(() => {
    if (props.verificationData) {
      inputValues.value = props.verificationData;
    }
  });

  const beforeDialogClose = (action: string) => {
    if (action === 'confirm') {
      handleConfirm();
    } else {
      return false;
    }
  };

  const handleConfirm = () => {
    if (props.inputType === 'smsCode') {
      emit('fromConfirm', inputValues.value);
      return;
    }
    if (props.inputType === 'bankCard') {
      emit('fromConfirm', false);
      return;
    }
    const trimmedValue = inputText.value.trim();
    emit('confirm', trimmedValue);
  };

  const handleClose = () => {
    emit('update:show', false);
  };
</script>

<style lang="scss" scoped>
  .dialog-wrapper {
    .dialog-content {
      padding: 30px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .input-container {
        width: 100%;
        margin-bottom: 20px;
      }

      .validation-message {
        font-size: 24px;
        color: #666;
      }
    }

    .empty {
      height: 50px;
      width: 600px;
      padding: 30px;
    }

    ::v-deep(.van-cell) {
      padding: 0;

      .van-field__value {
        padding: 16px 48px;
        border-radius: 56px;
        background: #f5f5f5;

        input {
          font-size: 32px;

          &::placeholder {
            font-size: 24px;
          }
        }
      }
    }

    ::v-deep .van-button {
      color: #000 !important;
      font-size: 28px;
      font-weight: 500;
    }

    .sms-input {
      ::v-deep(.van-cell__title) {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        font-weight: 700;
        margin: 0;
      }
    }

    .bank-info {
      padding: 30px;
      width: 100%;

      .van-cell__value {
        white-space: nowrap;
      }

      ::v-deep(.van-cell) {
        display: flex;

        .van-cell__title {
          width: 150px !important;
          flex: none;
        }
      }
    }
  }
</style>
