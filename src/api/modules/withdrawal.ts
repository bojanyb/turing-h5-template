import { Withdrawal } from '/@/api/interface/index';
import { PORT1 } from '/@/api/config/servicePort';
import http from '/@/api';

/**
 * @name 提现首页模块
 */

// 获取钱包信息
export const getWalletInfo = () => {
  return http.post<Withdrawal.ResWithdrawal>(PORT1 + `/Wallet`);
};

// 获取流水记录
export const getTransactions = () => {
  return http.post<Withdrawal.ResWithdrawal>(PORT1 + `/Wallet/myBill`);
};

// 获取提现记录
export const getWithdrawals = (params) => {
  return http.post<Withdrawal.ResWithdrawal>(PORT1 + `/Withdrawal/getapply`, params);
};

// 获取实名认证名称
export const getVerifiedName = () => {
  return http.post<Withdrawal.ResWithdrawal>(PORT1 + `/Withdrawal/getName`); //
};

// 获取用户信息
export const getUser = () => {
  return http.post<Withdrawal.ResWithdrawal>(PORT1 + `/User/me`);
};

/**
 * @name 提现申请模块
 */

// 获取用户提现申请信息
export const getUserWithdrawals = (params) => {
  return http.post<Withdrawal.ResWithdrawal>(PORT1 + `Withdrawal/getConfig`, params);
};

// 获取提现通道
export const getWithdrawalChannel = (params) => {
  return http.post<Withdrawal.ResWithdrawal>(`${PORT1}/Withdrawal/getCashChannel`, params);
};

// 提现申请
export const requestWithdrawal = (params) => {
  return http.post<Withdrawal.ResWithdrawal>(`${PORT1}/Withdrawal/applyCash`, params);
};

/**
 * @name 支付宝模块
 */

//  获取支付宝信息
export const getAliPayAccount = (params) => {
  return http.post<Withdrawal.ResWithdrawal>(PORT1 + `/Withdrawal/getAliAccount`, params);
};

// 获取支付宝授权信息
export const getAliPayAuthorization = (params) => {
  return http.post<Withdrawal.ResWithdrawal>(PORT1 + `/Withdrawal/h5WakeupAlipay`, params);
};

// 发送授权码到服务器授权
export const sendAliPayAuthCodeToServer = (params) => {
  return http.post<Withdrawal.ResWithdrawal>(PORT1 + `/Withdrawal/aliAuthCallBack`, params);
};

// 解绑支付宝
export const unbindAliPay = (params) => {
  return http.post<Withdrawal.ResWithdrawal>(PORT1 + `/Withdrawal/unBindAli`, params);
};

/**
 * @name 银行卡模块
 */

// 获取银行卡信息
export const getBankCardAccount = (params) => {
  return http.post<Withdrawal.ResWithdrawal>(PORT1 + `/Withdrawal/getBankcard`, params);
};

// 绑定银行卡
export const bindBankCard = (params) => {
  return http.post<Withdrawal.ResWithdrawal>(PORT1 + `/Withdrawal/bindBankcard`, params);
};

// 获取银行卡信息
export const getBankListInfo = (params) => {
  return http.post<Withdrawal.ResWithdrawal>(PORT1 + `/Withdrawal/getBanklist`, params);
};

// 解绑银行卡
export const unbindBankCard = (params) => {
  return http.post<Withdrawal.ResWithdrawal>(PORT1 + `/Withdrawal/unbindBankcard`, params);
};

/**
 * @name 对公转账模块
 */

// 获取对公账户信息
export const getPublicAccount = (params) => {
  return http.post<Withdrawal.ResWithdrawal>(PORT1 + `/Withdrawal/getCompanyAccount`, params);
};

/**
 * @name 第三方提现模块
 */

// 第三方平台签署
export const signAgreement = (params) => {
  return http.post<Withdrawal.ResWithdrawal>(PORT1 + `/Withdrawal/sign`, params);
};

// 确认签署
export const confirmSign = (params) => {
  return http.post<Withdrawal.ResWithdrawal>(PORT1 + `/Withdrawal/catConfirmSign`, params);
};

/**
 * @name 提现记录模块
 */

// 提现记录
export const getHistory = (params: Withdrawal.ReqHistory) => {
  return http.post<Withdrawal.ResHistory>(PORT1 + `/Withdrawal/getapply`, params);
};

// 取消提现
export const cancelApply = (params) => {
  return http.post<Withdrawal.ResWithdrawal>(PORT1 + `/Withdrawal/cancelApply`, params);
};

/**
 * @name 协议签署
 */

// 获取用户协议签署任务状态
export const getSignStatus = () => {
  return http.post<Withdrawal.ResWithdrawal>(PORT1 + `/Fadada/getSignStatus`);
};

// 获取用户协议签署任务状态
export const createWithTemplate = (params: Withdrawal.ReqCreateWithTemplate) => {
  return http.post<Withdrawal.ResWithdrawal>(PORT1 + `/Fadada/createWithTemplate`, params);
};
