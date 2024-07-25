<template>
  <van-popup v-model:show="visible" round position="bottom">
    <van-picker show-toolbar :columns="options" value-key="bankName" @cancel="closePicker" @confirm="confirmSelection" />
  </van-popup>
</template>

<script setup lang="ts">
  import type { PickerColumn, PickerOption } from 'vant';

  const props = defineProps({
    show: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array as () => (PickerColumn | PickerOption)[],
      required: true,
    },
  });

  const emit = defineEmits<{
    (event: 'update:show', value: boolean): void;
    (event: 'confirm', value: any): void;
  }>();

  const visible = computed({
    get: () => props.show,
    set: (val) => emit('update:show', val),
  });

  const closePicker = () => {
    emit('update:show', false);
  };

  const confirmSelection = (selectedValue: any) => {
    emit('confirm', selectedValue);
    closePicker();
  };
</script>
