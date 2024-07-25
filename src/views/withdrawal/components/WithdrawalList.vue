<template>
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <van-list
      v-model:loading="loading"
      v-model:error="error"
      :finished="finished"
      finished-text="没有更多了"
      error-text="请求失败，点击重新加载"
      @load="onLoad"
    >
      <!-- 空数据 -->
      <van-empty v-if="list.length === 0 && !loading && !error" image="error" description="暂无数据" />
      <!-- 列表数据 -->
      <RecordList v-else :list="list" @refresh="onRefresh" />
    </van-list>
  </van-pull-refresh>
</template>

<script setup lang="ts">
  import { getHistory } from '@/api/modules/withdrawal';
  import { timeFormat } from '@/utils';
  import RecordList from './RecordList.vue';

  // 提现状态
  const STATUSLIST = [
    {
      value: 1,
      name: '待审核',
      remark: '提现等待',
      color: '#FF8918',
    },
    {
      value: 2,
      name: '待发放',
      remark: '提现等待',
      color: '#FF8918',
    },
    {
      value: 3,
      name: '已拒绝',
      remark: '',
      color: '#FF1818',
    },
    {
      value: 4,
      name: '已发放',
      remark: '提现成功',
      color: '#00A45C',
    },
    {
      value: 5,
      name: '已拒绝',
      remark: '',
      color: '#FF2F2F',
    },
    {
      value: 6,
      name: '部分成功',
      remark: '提现等待',
      color: '#FF8E50',
    },
    {
      value: 7,
      name: '已取消',
      remark: '',
      color: '#FF2F2F',
    },
  ];
  // 公会提现状态
  const GUILDSTATUSLIST = [
    {
      value: 1,
      name: '待审核',
      color: '#FF8918',
    },
    {
      value: 2,
      name: '已提现至公司账户',
      color: '#00A45C',
    },
    {
      value: 3,
      name: '已拒绝',
      color: '#FF2F2F',
    },
    {
      value: 4,
      name: '已提现至公司账户',
      color: '#00A45C',
    },
    {
      value: 7,
      name: '已取消',
      color: '#FF2F2F',
    },
  ];
  const list = ref<any>([]);
  const loading = ref<boolean>(false);
  const error = ref<boolean>(false);
  const finished = ref<boolean>(false);
  const refreshing = ref<boolean>(false);
  // 页数
  const pageNum = ref<number>(1);

  const onLoad = async () => {
    const res = await getHistory({
      page: pageNum.value,
    }).catch((err) => {
      console.error(err);
    });

    // 刷新时，清空列表
    if (refreshing.value) {
      list.value = [];
      refreshing.value = false;
    }

    // 数据异常，直接返回
    if (!res) {
      loading.value = false;
      error.value = true;
      return;
    }

    // 数据处理
    const data = res.list.map((item: any) => {
      item.addtime = item.addtime ? timeFormat(item.addtime) : '--';
      let statusData: any = null;
      // 如果是公会提现
      if (item.channel === 12) {
        statusData = GUILDSTATUSLIST.find((sItem) => {
          return sItem.value === item.status;
        });
        if (item.status === 3 && !item.admin_id) {
          statusData.name = '公司已拒绝';
        }
      } else {
        statusData = STATUSLIST.find((sItem) => {
          return sItem.value === item.status;
        });
      }
      item.status_name = statusData ? statusData.name : '';
      item.status_color = statusData ? statusData.color : '';
      return item;
    });
    list.value.push(...data);
    // 加载状态结束
    loading.value = false;
    // 数据全部加载完成
    if (!res.next_page) {
      finished.value = true;
    } else {
      pageNum.value++;
    }
  };

  const onRefresh = () => {
    // 清空列表数据
    finished.value = false;

    // 重新加载数据
    // 将 loading 设置为 true，表示处于加载状态
    loading.value = true;
    pageNum.value = 1;
    refreshing.value = true;
    onLoad();
  };
</script>
