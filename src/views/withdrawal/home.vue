<template>
  <div class="withdrawal-home">
    <div class="withdrawal-wrapper" v-if="!skeletonLoaing">
      <!-- 我的余额 -->
      <section class="balance-section">
        <div class="balance-title">我的余额</div>
        <InfoCard :info="accountInfo.balanceInfo">
          <template #action>
            <van-button class="action-button" @click="handleToRecharge">{{ accountInfo.balanceInfo?.buttonText || '充值' }}</van-button>
          </template>
        </InfoCard>
      </section>
      <!-- 我的收入 -->
      <section class="income-section">
        <div class="income-header">
          <div class="income-title">我的收入</div>
          <!-- <van-button icon="arrow" icon-position="right" class="order-button">扣款顺序</van-button> -->
        </div>
        <div class="income-list">
          <div class="income-details">
            <InfoCard :info="accountInfo.incomesInfo">
              <template #action>
                <!-- 是公会主播 展示提现按钮 -->
                <van-button
                  class="action-button"
                  v-if="userInfo?.guild_id"
                  :disabled="Boolean(accountInfo?.disable_gain)"
                  @click="handleToWithdraw"
                  >{{ accountInfo.disable_gain ? '已禁用' : accountInfo?.incomesInfo?.buttonText ?? '提现' }}</van-button
                >
              </template>
            </InfoCard>
          </div>
        </div>
      </section>

      <section class="transactions-section">
        <van-tabs v-model:active="active" swipeable class="transactions-tabs">
          <van-tab title="交易">
            <div class="transaction-details">
              <TransactionDetails :requestApi="getTransactions" :callback="processTransaction" />
            </div>
          </van-tab>
          <van-tab title="提现">
            <div class="transaction-details">
              <WithdrawalList />
            </div>
          </van-tab>
        </van-tabs>
      </section>
    </div>
    <SkeletonPage v-else />
    <!-- 协议签署 -->
    <SignContractDialog v-model="showSignContract" :info="signInfo" />
  </div>
</template>

<script setup lang="ts">
  import InfoCard from './components/InfoCard.vue';
  import TransactionDetails from './components/TransactionDetails.vue';
  import WithdrawalList from './components/WithdrawalList.vue';
  import SkeletonPage from './components/SkeletonPage.vue';
  import SignContractDialog from './components/SignContractDialog.vue';
  // import { useHandleData } from './hook/useHandleData';
  import { WalletInfo, AccountInfo, TransactionRecord } from './interface';
  import { getWalletInfo, getTransactions, getUser, getVerifiedName } from '/@/api/modules/withdrawal';
  import dayjs from 'dayjs';
  import { showToast } from 'vant';
  import { createLoadingController } from './utils';

  // getWithdrawals, getVerifiedName, getUser

  const router = useRouter();
  const active = ref(0);
  const loadingController = createLoadingController(); // 加载控制器

  const balanceInfo = ref<Partial<WalletInfo>>({
    icon: new URL('/@/assets/images/withdrawal/coin.png', import.meta.url).href,
    amount: 8218290,
    description: '米粒：用于直播间打赏',
    buttonText: '充值',
  });

  const incomesInfo = ref<Partial<WalletInfo>>({
    icon: new URL('/@/assets/images/withdrawal/party-coin.png', import.meta.url).href,
    amount: 8218290,
    description: '饭团：直播间收到礼物打赏',
    buttonText: '提现',
  });

  const accountInfo = ref<Partial<AccountInfo>>({}); // 账户信息
  const userInfo = ref<any>(null); // 用户信息
  const userVerifiedInfo = ref<any>(null); // 用户实名认证名称
  const skeletonLoaing = ref<boolean>(false);
  const showSignContract = ref<boolean>(false); // 显示签署协议弹窗
  const signInfo = ref<any>({}); // 签署协议信息

  /**
   * 获取用户信息
   */
  const fetchUserInfo = async () => {
    try {
      const response = await getUser();
      userInfo.value = response;
      console.log(userInfo.value);
    } catch (error) {
      console.error('获取用户信息失败', error);
      throw error;
    }
  };

  /**
   * 获取用户实名认证名称
   */
  const fetchUserVerifiedName = async () => {
    try {
      const response = await getVerifiedName();
      userVerifiedInfo.value = response;

      // 用户协议签署相关信息
      const agreement = response.user_agreement;
      signInfo.value = agreement;
      if (!agreement || !agreement.role) return;
      // 如果是公会长，存在主播或者公会协议未签署则弹窗提示
      if (agreement.role === 1 && (agreement.anchor_agreement === 0 || agreement.guild_agreement === 0)) {
        showSignContract.value = true;
        return;
      }
      // 如果是主播，存在主播协议未签署则弹窗提示
      if (agreement.role === 9 && agreement.anchor_agreement === 0) {
        showSignContract.value = true;
        return;
      }
    } catch (error) {
      console.error('获取用户实名认证名称失败', error);
      throw error;
    } finally {
      loadingController.stopLoading();
      skeletonLoaing.value = false;
    }
  };
  /**
   * 获取账户余额
   */
  const fetchAccountBalance = async () => {
    try {
      const response = await getWalletInfo();
      accountInfo.value = {
        ...response,
        balanceInfo: {
          icon: balanceInfo.value.icon || '',
          description: balanceInfo.value.description || '',
          buttonText: balanceInfo.value.buttonText || '',
          amount: response.diamond || 0,
        },
        incomesInfo: {
          icon: incomesInfo.value.icon || '',
          description: incomesInfo.value.description || '',
          buttonText: incomesInfo.value.buttonText || '',
          amount: response.gain || 0,
        },
      };
      console.log(accountInfo.value.disable_gain, 'accountInfo');
    } catch (error) {
      console.error('获取账户余额失败', error);
      throw error;
    }
  };
  /**
   * 流水记录数据处理回调
   */
  const processTransaction = (transaction: TransactionRecord): Partial<TransactionRecord> => {
    const { title, genre, amount, currency, create_time } = transaction;

    const processedTitle = title ? title.split('--').pop() || '' : '';
    const description = genre === 1 ? '收入' : '支出';
    const formattedAmount = `${amount || ''}${currency === 1 ? '米粒' : '饭团'}`;
    const formattedDate = create_time ? dayjs.unix(create_time).format('YYYY-MM-DD HH:mm:ss') : '--';

    return {
      ...transaction,
      title: processedTitle,
      description: description,
      amount: formattedAmount,
      date: formattedDate,
    };
  };

  /**
   * 跳转到充值 URL
   */
  const handleToRecharge = () => {
    const payUrl = import.meta.env.VITE_PAY_URL;
    if (!userInfo.value || !userInfo.value.user_number) {
      showToast('获取用户信息失败');
      return;
    }
    const toUrl = `${payUrl}?phone=${userInfo.value.user_number}`;
    window.location.href = toUrl;
  };

  /**
   * 跳转到提现界面
   */
  const handleToWithdraw = () => {
    const { name, id_card } = userVerifiedInfo.value;
    if (!name || !id_card) {
      showToast('实名认证后才能提现');
      return;
    }
    if (!accountInfo.value?.disable_gain) {
      router.push('/withdrawal/apply');
    } else {
      showToast('提现已禁用');
    }
  };

  const initializeApp = async () => {
    try {
      loadingController.startLoading();
      skeletonLoaing.value = true;
      // await useHandleData(true);
      await fetchAccountBalance();
      await fetchUserInfo();
      await fetchUserVerifiedName();
    } catch (error) {
      console.error('初始化数据失败', error);
      skeletonLoaing.value = false;
    }
  };

  initializeApp();
</script>

<style lang="scss" scoped>
  .withdrawal-home {
    width: 100%;
    background: #f9f9f9;

    .withdrawal-wrapper {
      padding: 32px;

      // 我的余额
      .balance-section {
        height: 212px;
        margin-bottom: 32px;

        .balance-title {
          color: rgb(0 0 0 / 90%);
          font-size: 32px;
          font-weight: 600;
          margin-bottom: 24px;
        }
      }

      // 我的收入
      .income-section {
        margin-bottom: 32px;

        .income-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;

          .income-title {
            color: rgb(0 0 0 / 90%);
            font-size: 32px;
            font-weight: 600;
          }

          .order-button {
            height: 34px;
            width: 120px;
            color: rgb(0 0 0 / 30%);
            font-size: 24px;
            line-height: 34px;
            background: transparent;
            border: none;
            white-space: nowrap;
          }
        }

        .income-list {
          background-color: #f5f5f5;
          border-radius: 10px;

          .income-details {
            margin-bottom: 24px;

            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      }

      .action-button {
        width: 108px;
        height: 48px;
        background: #1acbfd;
        border-radius: 12px;
        font-size: 24px;
        color: #fff;
        white-space: nowrap;
      }
    }
  }

  .transactions-section {
    height: 524px;

    .transactions-tabs {
      ::v-deep(.van-tabs__nav) {
        background: transparent;

        .van-tab {
          font-size: 32px;
        }

        .van-tabs__line {
          background: #000;
          width: 40px;
          height: 8px;
        }
      }

      .transaction-details {
        margin-top: 32px;
      }
    }
  }
</style>
