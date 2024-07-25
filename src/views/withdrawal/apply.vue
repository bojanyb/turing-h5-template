<template>
  <div class="withdrawal-module">
    <div class="withdraw-page" v-if="!skeletonLoaing">
      <div class="page-header">
        <van-button icon="arrow-left" icon-position="left" class="back-button" @click="navigateToHome">返回</van-button>
        <van-button class="record-button" @click="navigateToWithdrawRecord">提现记录</van-button>
      </div>
      <!-- 余额面板 -->
      <section class="withdraw-info">
        <div class="info-box">
          <p
            >可提现余额: <span>{{ formattedWithdrawableAmount }}元</span></p
          >
          <p
            >本周剩余可提现余额: <span>{{ formattedRemainingWeeklyAmount }}元</span></p
          >
          <p
            >今日剩余提现次数: <span>{{ userWithdrawalsData?.can_cash_times || '-' }}次</span></p
          >
        </div>
      </section>
      <!-- 对公转账已认证 -->
      <template v-if="selectedMethod !== 'public' || (selectedMethod === 'public' && publicAccountInfo.verify_status)">
        <!-- 提现方式 -->
        <section class="withdraw-method">
          <div class="method-title">提现方式</div>
          <div class="method-buttons">
            <!-- 提现列表 -->
            <button
              v-for="(method, index) in filteredMethods"
              :key="index"
              :class="{ active: selectedMethod === method.value, ['active-' + method.value]: true }"
              @click="selectMethod(method.value)"
            >
              <img :src="method.imgSrc" />
              <span>{{ method.label }}</span>
            </button>
          </div>
        </section>
        <!-- 到账账号 -->
        <section class="deposit-account">
          <div class="account-title">到账账号</div>
          <div class="account-info">
            <div v-if="selectedMethod === 'alipay'" class="alipay-account-info">
              <!-- 支付宝已绑定 -->
              <div class="bind-alipay" v-if="isAliPayAccountBound">
                <div class="alipay-account">
                  <div class="alipay-info">
                    <span>{{ aliPayAccountInfo ? aliPayAccountInfo.name : '--' }}</span>
                    <span>{{ maskedIdentity }}</span>
                  </div>
                  <van-button class="unbind-button" @click="handleUnbindAliPayAccount">解绑</van-button>
                </div>
                <div class="alipay-decription">
                  注：绑定账号为支付宝时所登录的支付宝账号，支付宝唯一标识为{{ maskedIdentity }},
                  (唯一标识不是支付宝账号，这不会影响您支付宝账户的提现到账安全)。
                </div>
                <!-- <div class="alipay-error"></div> -->
              </div>
              <!-- 支付宝未绑定 -->
              <div class="unbind-alipay" v-else>
                <img src="@/assets/images/withdrawal/bind_ailpay.png" />
                <span>请先绑定支付宝账号</span>
                <van-button class="account-button" @click="fetchAliPayAuthorizationInfo">去绑定</van-button>
              </div>
            </div>
            <div v-else-if="selectedMethod === 'bank'" class="bank-account-info">
              <div class="bind-bank">
                <van-form class="bank-form" label-width="80" @submit="onSubmit" :readonly="isBankCardAccountBound">
                  <van-cell-group inset class="from-group">
                    <van-field v-model="bankCardAccountInfo.username" name="户名" label="户名" placeholder="户名" />
                    <van-field
                      v-model="bankCardAccountInfo.bank_name"
                      name="银行"
                      label="银行"
                      placeholder="银行"
                      @click="!isBankCardAccountBound ? (isBankPickerOpen = true) : null"
                    />
                    <van-field v-model="bankCardAccountInfo.bank_card_id" name="卡号" label="卡号" placeholder="卡号" />
                  </van-cell-group>
                  <!-- 银行卡已绑定 -->
                  <van-button class="unbind-button" v-if="isBankCardAccountBound" @click="handleUnbindBankCardAccount">解绑</van-button>
                  <!-- 银行卡未绑定 -->
                  <div class="from-button" v-else>
                    <van-button class="account-button" native-type="submit" @click="handleBankCardBinding"> 去绑定 </van-button>
                  </div>
                </van-form>
              </div>
            </div>
            <div v-else-if="selectedMethod === 'public'" class="public-account-info">
              <!-- 公会账户 -->
              <div class="account-info">
                <van-cell-group inset class="from-group">
                  <!-- <van-field v-model="publicAccountInfo.company_name" name="公司名称" label="公司名称" placeholder="公司名称" readonly label-width="80" /> -->
                  <van-field
                    v-model="publicAccountInfo.guild_name"
                    name="公会名称"
                    label="公会名称"
                    placeholder="公会名称"
                    readonly
                    label-width="80"
                  />
                  <van-field
                    v-model="publicAccountInfo.guild_number"
                    name="公会ID"
                    label="公会ID"
                    placeholder="公会ID"
                    readonly
                    label-width="80"
                  />
                </van-cell-group>
                <div class="public-decription"> 公会账户提现后，将会提现至公会统一对公账户中 </div>
              </div>
            </div>
          </div>
        </section>
        <!-- 提现金额 -->
        <section
          class="withdraw-amount"
          v-if="
            (isBankCardAccountBound && selectedMethod === 'bank') ||
            (isAliPayAccountBound && selectedMethod === 'alipay') ||
            selectedMethod === 'public'
          "
        >
          <div class="amount-title">提现金额</div>
          <div class="amount-info">
            <div class="amount-input">
              <i class="currency-symbol">¥</i>
              <van-field
                v-model="withdrawalAmount"
                placeholder="请输入金额"
                class="input"
                type="number"
                :formatter="handleFormatter"
                @update:model-value="handleDebouncedInput"
              />
            </div>
            <p class="actual-arrival-amount" v-if="selectedMethod !== 'public'">实际到账：{{ actualAmount }} 元</p>
          </div>
          <van-button class="amount-button" @click="handleInitiateWithdrawal">立即提现</van-button>
        </section>
        <!-- 提现协议 -->
        <section
          class="withdraw-agreement"
          v-if="
            (isBankCardAccountBound && selectedMethod === 'bank') ||
            (isAliPayAccountBound && selectedMethod === 'alipay') ||
            selectedMethod === 'public'
          "
        >
          <div class="agreement-header" v-if="[4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].includes(withdrawalChannels as number)">
            <div class="agreement-title">提现服务协议</div>
            <van-button icon="arrow" icon-position="right" class="sign-link" @click="navigateToSign">{{
              signStatus === 1 ? '已签署' : '未签署'
            }}</van-button>
          </div>
          <div class="agreement-content">
            <p>提示：</p>
            <p>1. 可提现金额不能超过可提现余额。</p>
            <p>2. 提现金额必须为整数，最高不能超过49999元。</p>
            <p>3. 一周可提现额度为500000元。</p>
          </div>
        </section>
      </template>
      <!-- 对公转账未认证 -->
      <template v-else>
        <section class="withdraw-unauth">
          <van-empty image="search" image-size="80" description="公司未认证完成，请耐心等待" />
        </section>
      </template>

      <!-- 提现密钥输入框 -->
      <InputDialog
        v-if="showWithdrawalKey"
        v-model:show="showWithdrawalKey"
        @confirm="confirmWithdrawalKey"
        title="请输入提现密钥"
        placeholder="请输入提现密钥"
        message="请输入提现密钥，如有疑问请联系客服"
      />
      <!-- 签署协议 - 绑定手机号码 -->
      <InputDialog
        v-if="showBindPhone"
        v-model:show="showBindPhone"
        @confirm="confirmBindPhone"
        confirmButtonText="去签署"
        title="请完成提现服务协议签署"
        placeholder="请输入手机号码"
        message="签署协议前，需绑定手机号码"
        :boundPhoneNumber="boundPhoneNumber"
      />
      <!-- 签署协议 - 短信验证 -->
      <InputDialog
        v-if="showEnterSmsCode"
        v-model:show="showEnterSmsCode"
        @from-confirm="confirmSmsCode"
        title="确认签署提现服务协议"
        placeholder="请输入短信验证码"
        message="请注意查收平台短信验证码"
        :verificationData="verificationData"
        inputType="smsCode"
      />
      <!-- 银行卡信息核实 -->
      <InputDialog
        v-if="showVerifyBankCard"
        v-model:show="showVerifyBankCard"
        @from-confirm="confirmBankCardInfo"
        title="银行卡信息核实"
        placeholder="请输入银行卡信息"
        :bankCardAccountInfo="bankCardAccountInfo"
        inputType="bankCard"
      />
      <!-- 银行卡选择器 -->
      <BankPicker v-model:show="isBankPickerOpen" :options="bankOptions" @confirm="handleBankPickerConfirm" />
    </div>
    <SkeletonPage v-else />
  </div>
</template>

<script setup lang="ts">
  import { WithdrawalInfo, AliPayAccountInfo, BankCardAccountInfo, PublicAccountInfo, UserVerify, WithdrawalMethod } from './interface';
  import { createLoadingController, isNumber, isString } from './utils';
  import {
    getUserWithdrawals,
    getAliPayAccount,
    getAliPayAuthorization,
    sendAliPayAuthCodeToServer,
    unbindAliPay,
    getWithdrawalChannel,
    getBankCardAccount,
    bindBankCard,
    requestWithdrawal,
    getBankListInfo,
    getPublicAccount,
    signAgreement,
    unbindBankCard,
    confirmSign,
  } from '/@/api/modules/withdrawal';
  import { showConfirmDialog, showToast, PickerOption } from 'vant';
  import InputDialog from './components/InputDialog.vue';
  import BankPicker from './components/BankPicker.vue';
  import SkeletonPage from './components/SkeletonPage.vue';
  import { debounce } from 'lodash';
  import { useUserStore } from '/@/store/modules/user';

  const route = useRoute();
  const router = useRouter();
  const userStore = useUserStore();

  const ALIPAY_WITHDRAWAL_CHANNELS = [2, 7, 9, 11, 14, 16, 18, 20]; // 支付宝提现通道常量
  const BANK_WITHDRAWAL_CHANNELS = [4, 6, 8, 10, 13, 15, 17]; // 银行卡提现通道常量
  const PUBLIC_WITHDRAWAL_CHANNELS = [12]; // 对公转账提现通道常量

  const selectedMethod = ref<string>(''); // 当前提现类型 alipay 支付宝 bank 银行卡
  const userWithdrawalsData = ref<WithdrawalInfo | null>(null); // 用户提现信息
  const globalCashConfigList = ref<string[]>([]); // 全局提现通道配置

  const aliPayAccountInfo = ref<AliPayAccountInfo | null>(null); // 支付宝用户信息
  const isAliPayAccountBound = ref<boolean>(false); // 是否已绑定支付宝账号

  const loadingController = createLoadingController(); // 加载控制器

  const withdrawalChannels = ref<UserVerify['cash_channel'] | null>(null); // 当前提现通道
  const signStatus = ref<UserVerify['sign_status'] | null>(null); // 签署状态

  const bankCardAccountInfo = ref<BankCardAccountInfo>({
    username: '',
    bank_card_id: '',
    bank_name: '',
  }); // 银行卡用户信息

  const isBankCardAccountBound = ref<boolean>(false); // 是否已绑定银行卡账号

  const withdrawalAmount = ref<number | string>(); // 提现金额
  const actualAmount = ref<number>(0); // 实际到账金额

  const publicAccountInfo = ref<PublicAccountInfo>({
    guild_name: '',
    guild_number: '',
    verify_status: 1,
  }); // 对公转账用户信息

  const showWithdrawalKey = ref<boolean>(false); // 是否显示提现密钥
  const showBindPhone = ref<boolean>(false); // 是否显示绑定手机号码
  const showEnterSmsCode = ref<boolean>(false); // 是否显示输入短信验证码
  const showVerifyBankCard = ref<boolean>(false); // 是否显示银行卡信息核实

  const isBankPickerOpen = ref(false); // 是否打开银行选择器
  const bankOptions = ref<PickerOption[]>([]); // 银行选项
  const boundPhoneNumber = ref<string>(''); // 已绑定手机号码

  const verificationData = ref<any>({}); // 签署三方协议数据
  const skeletonLoaing = ref<boolean>(false); // 是否显示骨架屏

  // 提现方式列表
  const withdrawalMethods: WithdrawalMethod[] = [
    { value: 'alipay', imgSrc: new URL('/@/assets/images/withdrawal/alipay.png', import.meta.url).href, label: '支付宝' },
    { value: 'bank', imgSrc: new URL('/@/assets/images/withdrawal/card.png', import.meta.url).href, label: '银行卡' },
    { value: 'public', imgSrc: new URL('/@/assets/images/withdrawal/transfer.png', import.meta.url).href, label: '公会账户' },
  ];

  /**
   * 获取用户提现数据
   * @param verifyCashConfig 是否需要校验提现通道
   */
  const fetchUserWithdrawals = async (verifyCashConfig = false) => {
    try {
      const response = await getUserWithdrawals({});
      userWithdrawalsData.value = response;
      globalCashConfigList.value = response.cash_config;
      verifyCashConfig && configureWithdrawalChannel();
    } catch (error) {
      loadingController.stopLoading();
      console.error('获取用户提现信息失败', error);
      throw error;
    }
  };

  /**
   * 获取提现通道 (isAuthenticated表示签署之后的请求)
   * @param isAuthenticated 是否签署 为了解决后端bug
   */
  const fetchWithdrawalChannels = async (isAuthenticated = false) => {
    try {
      const requestType = methodTypeMap[selectedMethod.value];
      const response = await getWithdrawalChannel({ type: requestType });
      withdrawalChannels.value = response.cash_channel;
      signStatus.value = response.sign_status;
      boundPhoneNumber.value = String(response.phone);
      // 15,16,17,18渠道，由于第三方返回的状态有延时，签约完成之后，需要手动更改签署状态值为1
      if (isAuthenticated && [15, 16, 17, 18].includes(withdrawalChannels.value as number)) {
        signStatus.value = 1;
      }

      console.log('获取提现通道', response, isAuthenticated, PUBLIC_WITHDRAWAL_CHANNELS.includes(withdrawalChannels.value as number));

      if (BANK_WITHDRAWAL_CHANNELS.includes(withdrawalChannels.value as number)) {
        selectedMethod.value = 'bank';
        fetchBankCardAccountInfo();
        fetchBankListInfo();
      } else if (ALIPAY_WITHDRAWAL_CHANNELS.includes(withdrawalChannels.value as number)) {
        selectedMethod.value = 'alipay';
        fetchAliPayAccountInfo();
      } else if (PUBLIC_WITHDRAWAL_CHANNELS.includes(withdrawalChannels.value as number)) {
        selectedMethod.value = 'public';
        fetchPublicAccountInfo();
      }
    } catch (error) {
      loadingController.stopLoading();
      skeletonLoaing.value = false;
      console.error('获取提现通道失败', error);
      throw error;
    }
  };

  /**
   * 获取支付宝绑定信息
   * @remark 获取本系统的支付宝绑定信息
   */
  const fetchAliPayAccountInfo = async () => {
    try {
      const response = await getAliPayAccount({});
      aliPayAccountInfo.value = response.info;
      console.log(
        '获取支付宝信息',
        !!(aliPayAccountInfo.value && aliPayAccountInfo.value.identity && aliPayAccountInfo.value.identity.trim()),
      );
      if (aliPayAccountInfo.value && aliPayAccountInfo.value.identity && aliPayAccountInfo.value.identity.trim()) {
        isAliPayAccountBound.value = true; // 支付宝账号已绑定
      }
    } catch (error) {
      console.error('获取支付宝信息失败', error);
      throw error;
    } finally {
      loadingController.stopLoading();
      skeletonLoaing.value = false;
    }
  };

  /**
   * 获取跳转支付宝授权信息
   *  @remark 获取支付宝平台的授权信息
   */
  const fetchAliPayAuthorizationInfo = async () => {
    try {
      loadingController.startLoading();
      const response = await getAliPayAuthorization({});
      if (response && response.url) {
        window.location.href = response.url;
      } else {
        throw new Error('未能获取有效的授权URL');
      }
    } catch (error) {
      console.error('获取支付宝授权信息失败', error);
      throw error;
    } finally {
      loadingController.stopLoading();
    }
  };

  /**
   * 处理支付宝回调
   */
  const handleAliPayCallback = () => {
    const authCode = route.query.auth_code as string;
    if (authCode) {
      console.log('授权码:', authCode);
      // 将 auth_code 保存到本地存储
      localStorage.setItem('alipay_auth_code', authCode);
      // 发送 auth_code 到服务器授权
      sendAuthCodeToServer(authCode);
    } else {
      console.error('未能获取到有效的 auth_code');
    }
  };

  /**
   * 发送授权码到服务器授权
   * @param authCode 授权码
   */
  const sendAuthCodeToServer = async (authCode?: string) => {
    // 如果 authCode 为空，从 localStorage 中获取
    if (!authCode) {
      authCode = localStorage.getItem('alipay_auth_code') || '';
    }

    // 如果 authCode 为空，则抛出错误
    if (!authCode) {
      console.error('auth_code 不存在');
      throw new Error('auth_code 不存在');
    }

    try {
      const response = await sendAliPayAuthCodeToServer({ auth_code: authCode });
      const { name, identity } = response;
      aliPayAccountInfo.value = { name, identity };
      // isAliPayAccountBound.value = true; // 支付宝账号已绑定
      fetchWithdrawalChannels();

      // 清除本地存储中的 auth_code
      localStorage.removeItem('alipay_auth_code');
    } catch (error) {
      loadingController.stopLoading();
      // showToast(error.msg || '授权失败');
      console.error('发送授权码到服务器失败', error);
      throw error;
    }
  };

  /**
   * 解绑支付宝账户
   */
  const handleUnbindAliPayAccount = async () => {
    try {
      const confirmed = await showConfirmDialog({
        title: '确认解绑支付宝账户吗?',
        message: '您确认要解绑支付宝账户吗？此操作将取消与支付宝的绑定，可能影响您的提现功能。',
      });

      if (confirmed) {
        loadingController.startLoading();
        await unbindAliPay({});
        isAliPayAccountBound.value = false; // 支付宝账号已解绑
        aliPayAccountInfo.value = {};
        setTimeout(() => {
          showToast('解绑成功');
        }, 500);
      }
    } catch (error) {
      console.error('解绑支付宝账户失败', error);
      throw error;
    } finally {
      loadingController.stopLoading();
    }
  };

  // 获取银行卡绑定信息
  const fetchBankCardAccountInfo = async () => {
    try {
      const response = await getBankCardAccount({});
      console.log('获取银行卡绑定信息', response, isBankCardAccountBound.value);
      bankCardAccountInfo.value = response.info;
      if (bankCardAccountInfo.value?.bank_card_id && bankCardAccountInfo.value?.username && bankCardAccountInfo.value?.bank_name) {
        isBankCardAccountBound.value = true; // 银行卡账号已绑定
      }
    } catch (error) {
      console.error('获取银行卡绑定信息失败', error);
      throw error;
    } finally {
      loadingController.stopLoading();
      skeletonLoaing.value = false;
    }
  };

  /**
   * 获取银行卡信息
   */
  const fetchBankListInfo = async () => {
    try {
      const response = await getBankListInfo({});
      bankOptions.value = response.list.map((bank) => ({
        text: bank.bank_name,
        value: bank.bank_id,
      }));
    } catch (error) {
      loadingController.stopLoading();
      console.error('获取银行卡信息失败', error);
      throw error;
    }
  };

  /**
   * 银行卡表单校验
   */
  const validateBankCardForm = (bankCardInfo): boolean => {
    if (bankCardInfo) {
      const { bank_card_id, username, bank_name } = bankCardInfo;

      if (!username) {
        showToast('请输入户名');
        return false;
      }

      if (!bank_name) {
        showToast('请输入银行');
        return false;
      }

      if (!bank_card_id) {
        showToast('请输入卡号');
        return false;
      }

      return true;
    } else {
      showToast('获取银行卡绑定信息失败');
      return false;
    }
  };

  /**
   * 绑定银行卡
   */
  const handleBankCardBinding = async () => {
    if (bankCardAccountInfo.value) {
      const { bank_card_id, username, bank_name } = bankCardAccountInfo.value;
      if (!validateBankCardForm(bankCardAccountInfo.value)) {
        return;
      }
      try {
        loadingController.startLoading();
        const response = await bindBankCard({ bank_card_id, username, bank_name });
        showVerifyBankCard.value = true;
        setTimeout(() => {
          showToast('绑定成功');
        }, 500);
        isBankCardAccountBound.value = true; // 银行卡账号已绑定
        // TODO
        console.log(response);
      } catch (error) {
        console.error('绑定银行卡失败', error);
        throw error;
      } finally {
        loadingController.stopLoading();
      }
    }
  };
  /**
   * 解绑银行卡
   */
  const handleUnbindBankCardAccount = async () => {
    try {
      const confirmed = await showConfirmDialog({
        title: '确认解绑银行卡账户吗?',
        message: '您确认要解绑银行卡账户吗？此操作将取消与银行卡的绑定，可能影响您的提现功能。',
      });

      if (confirmed) {
        loadingController.startLoading();
        await unbindBankCard({});
        isBankCardAccountBound.value = false; // 银行卡账号已解绑
        bankCardAccountInfo.value = {};
        setTimeout(() => {
          showToast('解绑成功');
        }, 500);
      }
    } catch (error) {
      console.error('解绑银行卡账户失败', error);
      throw error;
    } finally {
      loadingController.stopLoading();
    }
  };

  // 处理确认选择银行事件
  const handleBankPickerConfirm = ({ selectedOptions }) => {
    if (bankCardAccountInfo.value) {
      bankCardAccountInfo.value.bank_name = selectedOptions[0].text;
    }
    isBankPickerOpen.value = false;
  };

  /**
   * 获取对公账户绑定信息
   * @remark 获取本系统的对公账户绑定信息
   */
  const fetchPublicAccountInfo = async () => {
    try {
      const response = await getPublicAccount({});
      publicAccountInfo.value = response.info;
    } catch (error) {
      console.error('获取对公账户绑定信息失败', error);
      throw error;
    } finally {
      loadingController.stopLoading();
      skeletonLoaing.value = false;
    }
  };

  /**
   * 校验提现条件
   */
  const validateWithdrawalConditions = (): boolean => {
    // 提现金额
    const withdrawalAmountValue = withdrawalAmount.value ? Number(withdrawalAmount.value) : 0;
    // 签署状态
    const signStatusValue = Number(signStatus.value);
    // 当前提现通道
    const cashChannelValue = Number(withdrawalChannels.value);
    // 账户余额
    const gainValue = Number(userWithdrawalsData.value?.gain) || 0;

    const showError = (message: string): boolean => {
      showToast(message);
      return false;
    };
    const alipayChannels = ALIPAY_WITHDRAWAL_CHANNELS;
    const bankChannels = BANK_WITHDRAWAL_CHANNELS;
    const publicChannels = PUBLIC_WITHDRAWAL_CHANNELS;
    const isAlipayChannel = alipayChannels.includes(cashChannelValue);
    const isBankChannel = bankChannels.includes(cashChannelValue);
    const isPublicChannel = publicChannels.includes(cashChannelValue);

    console.log(gainValue, withdrawalAmountValue, gainValue < withdrawalAmountValue, signStatusValue, cashChannelValue);

    // 检查签署状态
    if (signStatusValue === 0) {
      showBindPhone.value = true;
      return false;
    }

    // 提现金额范围检查
    if (withdrawalAmountValue < 100) return showError('最低提现金额为100元');
    if (withdrawalAmountValue > 50000) return showError('最高提现金额为50000元');
    if (gainValue < withdrawalAmountValue) return showError('账户余额不足');

    const identity = aliPayAccountInfo.value?.identity || '';
    const bank_card_id = bankCardAccountInfo.value?.bank_card_id || '';
    const username = bankCardAccountInfo.value?.username || '';
    const bank_name = bankCardAccountInfo.value?.bank_name || '';

    // 提现通道检查
    if (isAlipayChannel) {
      if (!identity) return showError('请绑定支付宝账号后再试');
    } else if (isBankChannel) {
      if (!bank_card_id) return showError('请输入银行卡');
      if (!username) return showError('请输入户名');
      if (!bank_name) return showError('请输入银行');
    } else if (isPublicChannel) {
      console.log('public');
    } else {
      return showError('当前提现通道不存在');
    }
    return true;
  };

  // 处理提现逻辑
  const handleInitiateWithdrawal = () => {
    if (!validateWithdrawalConditions()) {
      console.log('校验失败');
      return;
    }
    if (PUBLIC_WITHDRAWAL_CHANNELS.includes(withdrawalChannels.value as number)) {
      console.log('对公账户提现');
      confirmWithdrawalKey();
      return;
    }
    showWithdrawalKey.value = true;
  };

  /**
   * 处理密钥确认并发起提现请求
   * @param withdrawalParams 提现请求参数
   */
  const confirmWithdrawalKey = async (withdrawalParam?: any) => {
    if (!withdrawalParam && !PUBLIC_WITHDRAWAL_CHANNELS.includes(withdrawalChannels.value as number)) {
      showToast('请输入提现密钥');
      return;
    }

    try {
      const requestParams = {
        key: withdrawalParam,
        cashMoney: withdrawalAmount.value,
        channel: withdrawalChannels.value,
      };
      loadingController.startLoading();
      await requestWithdrawal(requestParams);
      withdrawalAmount.value = '';
      actualAmount.value = 0;
      showWithdrawalKey.value = false;
      fetchUserWithdrawals();
      setTimeout(() => {
        showToast('提现申请已提交');
      }, 500);
    } catch (error) {
      console.error('提现请求失败：', error);
    } finally {
      loadingController.stopLoading();
    }
  };

  /**
   * 签署三方协议 - 绑定手机号
   * @param signParam - 签署请求参数
   */
  const confirmBindPhone = async (signParam: string) => {
    const phoneRegex = /^[1][0-9]{10}$/;
    const cashChannelValue = Number(withdrawalChannels.value); // 当前提现通道
    const verifyCashConfig = true;

    const externalAgreementChannels = [4, 10, 11, 12]; // 跳转到外部协议的通道
    const platformAgreementChannels = [6, 7, 8, 9]; // 平台确认协议的通道
    const excludedChannels = [13, 14, 15, 16, 17, 18]; // 无需确认的通道

    const isExternal = externalAgreementChannels.includes(cashChannelValue);
    const isPlatform = platformAgreementChannels.includes(cashChannelValue);
    const isExcluded = excludedChannels.includes(cashChannelValue);

    if (!signParam) {
      showToast('请输入手机号');
      return;
    }

    if (!phoneRegex.test(signParam)) {
      showToast('请输入正确的手机号码');
      return;
    }

    try {
      loadingController.startLoading();
      const response = await signAgreement({ phone: signParam, channel_id: cashChannelValue });
      if (isExternal) {
        window.location.href = response.sign_url;
      } else if (isPlatform) {
        verificationData.value = {
          contractId: response.contract_id,
          phone: signParam,
          code: '',
        };
        showEnterSmsCode.value = true;
      } else if (isExcluded) {
        showToast('签署成功');
        showBindPhone.value = false;
        fetchUserWithdrawals();
        fetchWithdrawalChannels(verifyCashConfig);
      }
    } catch (error) {
      console.error('签署协议失败:', error);
    } finally {
      loadingController.stopLoading();
    }

    console.log(signParam);
  };

  /**
   * 签署三方协议 - 短信验证码
   * @param signParam - 签署请求参数
   */
  const confirmSmsCode = async (fromParams: any) => {
    const verifyCashConfig = true;
    const cashChannelValue = Number(withdrawalChannels.value); // 当前提现通道
    const contractId = verificationData.value.contractId; // 三方协议id

    if (!fromParams.code) {
      showToast('请输入验证码');
      return;
    }

    try {
      loadingController.startLoading();
      await confirmSign({ contract_id: contractId, captcha: fromParams.code, channel_id: cashChannelValue });
      showToast('签署成功');
      showBindPhone.value = false;
      showEnterSmsCode.value = false;
      fetchUserWithdrawals();
      fetchWithdrawalChannels(verifyCashConfig);
    } catch (error) {
      console.error('签署协议失败:', error);
    } finally {
      loadingController.stopLoading();
    }
  };

  /**
   * 银行卡信息核实
   */
  const confirmBankCardInfo = async () => {
    showVerifyBankCard.value = false;
    fetchWithdrawalChannels();
  };

  /**
   * 格式化输入，仅保留数字
   */
  const handleFormatter = (value: string) => {
    return value.replace(/[^\d]/g, '');
  };

  /**
   * 验证并更新金额的
   */
  const handleDebouncedInput = debounce((value: string) => {
    let cleanedValue = value.replace(/[^\d]/g, ''); // 移除所有非数字字符
    let amount = Number(cleanedValue); // 用户输入的金额
    const gain = userWithdrawalsData.value?.gain || 0; // 账户余额
    const rate = userWithdrawalsData.value?.rate || 0; // 提现手续费

    const maxAmount = Math.min(Math.floor(Number(gain)), 50000); // 最大可提现金额为 gain 和 50000 中的最小值

    // 限制输入值在 0 到 maxAmount 之间
    if (amount > maxAmount) {
      withdrawalAmount.value = String(maxAmount);
    }

    // 计算实际到账金额
    if (withdrawalAmount.value && rate) {
      const serviceFee = (Number(withdrawalAmount.value) * rate) / 100;
      actualAmount.value = Math.floor((Number(withdrawalAmount.value) - serviceFee) * 100) / 100;
    } else {
      actualAmount.value = 0;
    }
  }, 300);

  /**
   * 监听界面切换获取支付宝绑定信息
   */
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      console.log('切离该页面时执行');
    } else if (document.visibilityState === 'visible') {
      console.log('切进该页面时执行');
      if (selectedMethod.value === 'alipay') {
        fetchAliPayAccountInfo();
      }
    }
  };

  /**
   * 配置提现通道 todo
   */
  const configureWithdrawalChannel = () => {
    if (globalCashConfigList.value.includes('2')) {
      selectedMethod.value = 'public';
    } else if (globalCashConfigList.value.includes('0') && globalCashConfigList.value.includes('1')) {
      selectedMethod.value = 'bank';
    } else if (globalCashConfigList.value.includes('1')) {
      selectedMethod.value = 'bank';
    } else if (globalCashConfigList.value.includes('0')) {
      selectedMethod.value = 'alipay';
    }
    fetchWithdrawalChannels();
  };

  /**
   * 选中提现通道
   */
  const selectMethod = (method: string) => {
    selectedMethod.value = method;
    fetchWithdrawalChannels();
  };

  /**
   * 导航到首页
   */
  const navigateToHome = () => {
    router.push('/withdrawal/home');
  };

  /**
   * 导航到提现记录
   */
  const navigateToWithdrawRecord = () => {
    router.push('/withdrawal/list');
  };

  /**
   * 导航到去签署
   */
  const navigateToSign = () => {
    // 签署状态
    const signStatusValue = Number(signStatus.value);
    // 检查签署状态
    if (signStatusValue === 0) {
      showBindPhone.value = true;
      return false;
    }
    showToast('请勿重复签署服务协议');
  };

  /**
   * 支付宝唯一标识脱敏函数
   */
  function maskStringWithAsterisks(string: string): string {
    if (string.length < 8) {
      return string;
    }
    const firstFour = string.substring(0, 4);
    const lastFour = string.substring(Math.max(0, string.length - 4));
    const middleLength = Math.max(0, 12 - firstFour.length - lastFour.length);
    const middleMask = '*'.repeat(middleLength);
    const maskedString = firstFour + middleMask + lastFour;
    return maskedString.substring(0, 12);
  }

  /**
   * 支付宝标识号脱敏处理
   */
  const maskedIdentity = computed(() => {
    if (aliPayAccountInfo.value && aliPayAccountInfo.value.identity) {
      return maskStringWithAsterisks(aliPayAccountInfo.value.identity);
    }
    return '--';
  });

  /**
   * 提现方式与type值的映射
   */
  const methodTypeMap: Record<string, number> = {
    alipay: 0,
    bank: 1,
    public: 2,
  };

  /**
   * 根据提现配置过滤提现方式
   */
  const filteredMethods = computed(() => {
    const methodMap: { [key: string]: string } = {
      '0': 'alipay',
      '1': 'bank',
      '2': 'public',
    };

    return withdrawalMethods.filter((method) => {
      const methodKey = Object.keys(methodMap).find((key) => methodMap[key] === method.value);
      return globalCashConfigList.value.includes(methodKey as string);
    });
  });

  /**
   * 格式化可提现余额
   */
  const formattedWithdrawableAmount = computed(() => {
    if (userWithdrawalsData.value && isString(userWithdrawalsData.value.gain)) {
      const gainNum = Number(userWithdrawalsData.value.gain);
      return Math.floor(gainNum / 100).toFixed(2);
    } else {
      return '0.00';
    }
  });

  /**
   * 格式化本周剩余可提现余额
   */
  const formattedRemainingWeeklyAmount = computed(() => {
    if (userWithdrawalsData.value && isNumber(userWithdrawalsData.value.money)) {
      const moneyNum = Number(userWithdrawalsData.value.money);
      return moneyNum.toFixed(2);
    } else {
      return '0.00';
    }
  });

  /**
   * 获取路由参数token
   */
  const processToken = () => {
    const userToken = route.query.token as string;
    if (userToken) {
      userStore.setToken(userToken);
    }
  };

  /**
   * 获取路由参数authCode
   */
  const processAuthCode = () => {
    const authCode = route.query.auth_code as string;
    if (authCode) {
      handleAliPayCallback();
    }
  };

  onMounted(async () => {
    const verifyCashConfig = true;
    try {
      loadingController.startLoading();
      skeletonLoaing.value = true;
      await processToken();
      await processAuthCode();
      await fetchUserWithdrawals(verifyCashConfig);
      await handleVisibilityChange();
    } catch (error) {
      console.error('初始化数据失败', error);
      skeletonLoaing.value = false;
    }
  });

  // 公会TODO
  const onSubmit = (values) => {
    console.log('submit', values);
  };
</script>

<style scoped lang="scss">
  .withdrawal-module {
    .withdraw-page {
      min-height: 100vh;
      width: 100%;
      padding: 20px 32px;
      background: #f9f9f9;

      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 22px;

        .page-title {
          color: rgb(0 0 0 / 90%);
          font-size: 32px;
          font-weight: 600;
        }

        .back-button {
          height: 38px;
          width: 120px;
          color: #000;
          font-size: 28px;
          font-weight: 400;
          line-height: 48px;
          background: transparent;
          border: none;
          white-space: nowrap;
        }

        .record-button {
          height: 38px;
          width: 128px;
          color: #000;
          font-size: 28px;
          font-weight: 400;
          line-height: 44px;
          background: transparent;
          border: none;
          white-space: nowrap;
        }
      }

      .withdraw-info {
        height: 232px;
        border-radius: 16px;
        background: #fff;
        padding: 24px;
        margin-bottom: 22px;

        .info-box {
          p {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 32px;
            font-size: 28px;
            color: #161823;
            // font-weight: 500;

            &:last-child {
              margin-bottom: 0;
            }

            span {
              font-weight: 400;
            }
          }
        }
      }

      .withdraw-method {
        margin-bottom: 22px;

        .method-title {
          color: rgb(0 0 0 / 90%);
          font-size: 32px;
          font-weight: 600;
          margin-bottom: 14px;
        }

        .method-buttons {
          height: 96px;
          display: flex;
          justify-content: flex-start;

          button {
            width: 220px;
            padding: 28px 42px;
            border-radius: 16px;
            border: 1px solid rgb(0 0 0 / 10%);
            background: #fff;
            font-size: 28px;
            font-weight: 500;
            margin-right: 14px;
            cursor: pointer;
            display: flex;
            white-space: nowrap;
            position: relative;

            &:last-child {
              margin-right: 0;
            }

            &.active {
              &::after {
                content: '';
                display: block;
                width: 40px;
                height: 40px;
                position: absolute;
                bottom: -1px;
                right: 0;
                background: no-repeat center center;
                background-size: contain;
                opacity: 0;
                transition: opacity 0.3s ease;
              }
            }

            &.active-alipay {
              // background: rgb(0 160 234 / 5%);
              border: 1px solid #00a0ea;
              background: rgb(0 160 234 / 5%);

              &::after {
                background-image: url('@/assets/images/withdrawal/alipay_sel.png');
                opacity: 1;
              }
            }

            &.active-bank {
              // border: 1px solid #ffbc0f;
              // background: rgb(255 188 15 / 5%);
              border: 1px solid #00a0ea;
              background: rgb(0 160 234 / 5%);

              &::after {
                // background-image: url('@/assets/images/withdrawal/card_sel.png');
                background-image: url('@/assets/images/withdrawal/alipay_sel.png');
                opacity: 1;
              }
            }

            &.active-public {
              // border: 1px solid #ff1818;
              // background: rgb(255 24 24 / 5%);
              border: 1px solid #00a0ea;
              background: rgb(0 160 234 / 5%);

              &::after {
                // background-image: url('@/assets/images/withdrawal/transfer_sel.png');
                background-image: url('@/assets/images/withdrawal/alipay_sel.png');
                opacity: 1;
              }
            }

            img {
              width: 40px;
              height: 40px;
              margin-right: 8px;
            }
          }
        }
      }

      .deposit-account {
        margin-bottom: 22px;

        .account-title {
          color: rgb(0 0 0 / 90%);
          font-size: 32px;
          font-weight: 600;
          margin-bottom: 14px;
        }

        .account-info {
          .alipay-account-info {
            height: 252px;

            .unbind-alipay {
              padding: 48px 83px;
              border-radius: 16px;
              background: #fff;
              display: flex;
              flex-direction: column;
              align-items: center;

              img {
                width: 374px;
                height: 176px;
                margin-bottom: 24px;
              }

              span {
                color: rgb(0 0 0 / 60%);
                font-size: 28px;
                font-weight: 400;
                margin-bottom: 32px;
                line-height: 40px;
              }
            }

            .bind-alipay {
              background: #fff;
              padding: 24px;
              border-radius: 16px;
              height: 252px;

              .alipay-account {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 32px;

                .alipay-info {
                  color: #323233;
                  font-size: 30px;
                  font-weight: 400;

                  span:first-child {
                    margin-right: 16px;
                  }
                }

                .unbind-button {
                  height: 40px;
                  padding: 20px;
                  font-size: 24px;
                  font-weight: 500;
                  color: #fff;
                  white-space: nowrap;
                  border-radius: 70px;
                  background: #1acbfd;
                }
              }

              .alipay-decription {
                font-size: 24px;
                font-weight: 400;
                color: rgb(0 0 0 / 50%);
              }

              .alipay-error {
                color: #ff1818;
                font-size: 22px;
                font-weight: 400;
                margin-top: 20px;
              }
            }
          }

          .bank-account-info {
            background: #fff;
            border-radius: 16px;
            padding: 24px;
            height: 252px;

            .bind-bank {
              position: relative;

              .bank-form {
                .van-cell-group--inset {
                  margin: 0;
                }

                .van-cell {
                  height: 70px;
                  padding: 0;
                  color: rgb(0 0 0 / 80%);
                  font-size: 28px;
                  font-weight: 500;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }

                .from-button {
                  display: flex;
                  justify-content: center;
                }
              }

              .unbind-button {
                position: absolute;
                right: 0;
                top: 0;
                height: 40px;
                padding: 20px;
                font-size: 24px;
                font-weight: 500;
                color: #fff;
                white-space: nowrap;
                border-radius: 70px;
                background: #1acbfd;
              }
            }
          }

          .public-account-info {
            background: #fff;
            border-radius: 16px;
            padding: 24px;

            .account-info {
              .van-cell-group--inset {
                margin: 0;
              }

              .from-group {
                margin-bottom: 16px;

                ::v-deep(.van-cell) {
                  height: 70px;
                  padding: 0;
                  color: #161823;
                  font-size: 28px;
                  font-weight: 400;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
              }

              .public-decription {
                font-size: 22px;
                color: #00000080;
                font-weight: 500;
              }
            }
          }

          .account-button {
            width: 520px;
            height: 100px;
            border-radius: 70px;
            background: #1acbfd;
            font-size: 36px;
            font-weight: 500;
            color: #fff;
            margin-top: 46px;
          }
        }
      }
      // 提现金额
      .withdraw-amount {
        .amount-title {
          color: rgb(0 0 0 / 90%);
          font-size: 32px;
          font-weight: 600;
          margin-bottom: 14px;
        }

        .amount-info {
          padding: 38px 33px;
          border-radius: 16px;
          background: #fff;
          margin-bottom: 22px;

          .amount-input {
            display: flex;
            align-items: center;
            position: relative;
            height: 84px;
            // margin-bottom: 18px;
            border-bottom: 1px solid rgb(0 0 0 / 10%);

            .van-cell {
              padding: 0;
              height: 84px;

              ::v-deep(.van-field__body) {
                height: 100%;

                input {
                  color: #000;
                  font-size: 60px;
                  font-weight: 600;
                  margin-left: 62px;
                  width: 100%;
                  height: 84px;
                  // position: relative;

                  &::placeholder {
                    // position: absolute;
                    // top: 50%;
                    // transform: translateY(-50%);
                    color: rgb(0 0 0 / 20%);
                    font-size: 40px;
                    font-weight: 400;
                  }
                }
              }
            }

            .currency-symbol {
              position: absolute;
              font-size: 48px;
              font-weight: 600;
              color: #000;
              font-style: normal;
              line-height: normal;
              top: 50%;
              transform: translateY(-50%);
              z-index: 1;
            }
          }

          .actual-arrival-amount {
            height: 60px;
            display: flex;
            align-items: flex-end;
            justify-content: center;
            color: rgb(0 0 0 / 80%);
            font-size: 28px;
            font-weight: 400;
            text-align: center;
          }
        }

        .amount-button {
          width: 100%;
          height: 100px;
          border-radius: 70px;
          background: #1acbfd;
          font-size: 36px;
          font-weight: 500;
          color: #fff;
          margin-bottom: 22px;
        }
      }

      // 提现协议
      .withdraw-agreement {
        border-radius: 16px;
        background: #fff;
        padding: 24px;

        .agreement-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
          font-weight: 400;

          .agreement-title {
            font-size: 28px;
          }

          .sign-link {
            font-size: 24px;
            color: rgb(0 0 0 / 50%);
            border: none;
            height: 34px;
            width: 104px;
            white-space: nowrap;
          }
        }

        .agreement-content {
          color: #00000080;
          font-size: 24px;
          font-weight: 500;

          p {
            margin: 4px 0;
          }
        }
      }

      // 公司未认证
      .withdraw-unauth {
        border-radius: 16px;
        background: #fff;
        padding: 24px;
        font-size: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
</style>
