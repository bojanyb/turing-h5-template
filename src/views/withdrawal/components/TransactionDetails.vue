<template>
  <div class="transaction-list">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <div class="transaction-item" v-for="transaction in transactions" :key="transaction.id">
          <div class="transaction-title">
            <span>{{ transaction.title }}</span>
            <span>{{ transaction.description }}</span>
          </div>
          <div class="transaction-amount">
            <span>{{ transaction.amount }}</span>
            <span>{{ transaction.date }}</span>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup lang="ts">
  import { TransactionRecord } from '../interface';

  const props = defineProps<{
    data?: Partial<TransactionRecord>[]; // 静态 data 数据，若存在则不会使用 requestApi 返回的 data ==> 非必传
    requestApi?: (params: any) => Promise<any>; // 请求表格数据的 api ==> 非必传
    callback?: (transaction: TransactionRecord) => any; // 加载数据回调函数 ==> 非必传
    pagination?: boolean; // 是否支持分页，默认为 true ==> 非必传
    requestParams?: { page: number; pageSize: number }; // 请求参数 ==> 非必传
  }>();

  console.log(props.data);

  // const emit = defineEmits(['callback']);

  const transactions = ref<Partial<TransactionRecord>[]>(props.data ? [...props.data] : []);

  // 定义加载和刷新状态
  const loading = ref(false);
  const finished = ref(true);
  const refreshing = ref(false);
  const enablePagination = ref(props.pagination !== undefined ? props.pagination : true);

  const loadData = async (refresh = false) => {
    if (props.requestApi) {
      loading.value = true;

      try {
        const response = await props.requestApi(props.requestParams);
        const newTransactions = response.bills.map(props.callback);

        // 如果是刷新操作
        if (refresh) {
          transactions.value = newTransactions;
          refreshing.value = false;
        } else {
          // 如果启用分页
          if (enablePagination.value) {
            transactions.value = [...transactions.value, ...newTransactions];
          } else {
            transactions.value = newTransactions;
          }
        }

        // 判断结束条件
        if (newTransactions.length > response.bills.length) {
          finished.value = false;
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        loading.value = false;
      }
    }
  };

  // 加载更多数据
  const onLoad = () => {
    if (enablePagination.value) {
      loadData();
    } else {
      finished.value = true; // 如果不支持分页，则加载更多时标记为已完成
    }
  };

  // 刷新数据
  const onRefresh = () => {
    finished.value = false; // 重置完成状态
    refreshing.value = true; // 显示加载状态
    loadData(true);
  };

  onMounted(() => {
    if (!props.data) {
      loadData();
    }
  });
</script>

<style lang="scss" scoped>
  .transaction-list {
    .transaction-item {
      height: 114px;
      display: flex;
      justify-content: space-between;
      margin-bottom: 32px;
      border-bottom: 2px solid rgb(0 0 0 / 10%);
      padding: 20px;

      .transaction-title {
        font-size: 28px;
        font-weight: 700;
        white-space: nowrap;
        color: #000;
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        span {
          margin-bottom: 8px;

          &:last-child {
            font-size: 20px;
            color: rgb(0 0 0 / 40%);
            margin-bottom: 0;
          }
        }
      }

      .transaction-amount {
        font-size: 30px;
        font-weight: 400;
        color: #000;
        display: flex;
        flex-direction: column;
        align-items: flex-end;

        span {
          margin-bottom: 8px;

          &:last-child {
            font-size: 22px;
            color: rgb(0 0 0 / 40%);
            margin-bottom: 0;
          }
        }
      }
    }
  }
</style>
