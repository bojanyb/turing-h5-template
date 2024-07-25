export interface WalletInfo {
  icon: string;
  amount: number;
  description: string;
  buttonText: string;
}

/**
 * 提现方式列表
 */
export interface WithdrawalMethod {
  value: string; // 值
  imgSrc: string; // 图片路径
  label: string; // 标签文本
}

/**
 * 提现申请信息
 */
export interface WithdrawalInfo {
  can_cash_times?: number; // 可提现次数
  cash_config?: string[]; // 提现通道配置
  gain?: string; // 提现金额
  rate?: number | null; // 手续费
  id_card?: string; // 用户身份证
  money?: number; // 可提现余额
  name?: string; // 用户姓名
}

export interface AccountInfo {
  id: number;
  user_id: number;
  diamond: number; // 米粒，单位个
  freeze_diamond: bigint; // 冻结米粒，单位个
  guild_id: number; // 公会id
  guild_genre: number; // 结算类型，1对私结算，2对公结算
  guild_rate: number; // 公会分成，单位万分比
  scout_id: number; // 星探id
  gain: number; // 饭团，单位个
  freeze_gain: bigint; // 冻结饭团，单位个
  status: number; // 状态：1正常，2冻结
  password: string; // 支付密码
  update_time: number;
  create_time: number;
  party_gain: number; // 派对饭团，单位个
  live_gain: number; // 直播饭团，单位个
  freeze_party_gain: bigint; // 冻结派对饭团，单位个
  freeze_live_gain: bigint; // 冻结直播饭团，单位个
  deal_by: number; // 货币账户扣款顺序
  disable_gain: null; // 禁用提现 0:未禁用 1:禁用
  balanceInfo: WalletInfo; // 新增balanceInfo字段
  incomesInfo: WalletInfo; // 新增incomesInfo字段
}

export interface TransactionRecord {
  id: number; // Auto-incremented ID
  trade_no: string; // 交易流水号
  user_id: number; // User ID
  diamond: number; // 米粒和饭团总和
  gain: number; // 交易猫粮个数
  real_diamond: number | null; // 交易米粒数
  currency: 1 | 2; // 1米粒2猫粮
  genre: 1 | 2; // 收支类型：1收入，2支出（相对用户）
  create_time: number; // Timestamp of creation
  relation_trade_no: string; // 关联订单号
  relation_type: number; // 关联类型
  diamond_balance: number; // 最新米粒余额
  gain_balance: number; // 最新猫粮余额
  balance: number; // 最新余额
  remark: string; // 备注
  op_user: string; // 操作人
  party_gain: number; // 交易派对猫粮个数
  live_gain: number; // 交易直播猫粮个数
  party_gain_balance: number; // 最新派对猫粮余额
  live_gain_balance: number; // 最新直播猫粮余额
  freeze_balance: number; // 最新冻结余额
  title: string;
  description?: string;
  amount?: string;
  date?: string;
}

// 定义支付宝账号信息的接口
export interface AliPayAccountInfo {
  id?: number;
  user_id?: number;
  name?: string | null; // 支付宝用户真实姓名
  identity?: string | null; // 账号
  create_time?: number; // 创建时间
  update_time?: number; // 更新时间
  ali_account?: string; // 支付宝账号
}

/**
 * 用户提现银行卡号
 * @table cash_bankcard
 */
export interface BankCardAccountInfo {
  bank_card_id?: string | undefined; // 银行卡号
  bank_name?: string | undefined; // 银行名称
  username?: string | undefined; // 户名
  id?: number; // ID
  user_id?: number; // 用户ID
  bank_address?: string; // 银行支行
  create_time?: number; // 创建时间
  update_time?: number; // 更新时间
}

/**
 * 对公转账账号信息
 */
export interface PublicAccountInfo {
  company_name?: string | undefined; // 公司名称
  guild_name?: string | undefined; // 公会名称
  guild_number?: string | undefined; // 公会编号
  verify_status?: number | undefined; // 认证状态
}

/**
 * 用户实名信息表
 * @table user_verify
 */
export interface UserVerify {
  id?: number; // 自增ID
  user_id?: number; // 用户ID
  phone?: number; // 手机号
  status?: number; // 状态：0审核中，1正常，2失效
  id_card?: string; // 身份证号
  birthday?: string; // 生日，格式为MMDD
  name?: string; // 姓名
  create_time?: number; // 创建时间，时间戳格式
  update_time?: number; // 更新时间，时间戳格式
  change_count?: number; // 累计更换实名次数
  last_log_id?: number; // 最后一次实名记录ID
  /**
   * 银行卡提现通道：
   * 4=小猪银行卡, 6=工猫银行卡, 8=美事通银行卡, 10=福穗银行卡, 12=对公转账
   * 13=薪遇见, 15=中职银行卡, 17=智变量
   */
  cash_channel?: number;
  /**
   * 支付宝提现通道：
   * 2=支付宝, 5=小猪支付宝, 7=工猫支付宝, 9=美事通支付宝,
   * 11=福穗支付宝, 14=薪遇见, 16=中职, 18=智变量, 20=人工支付宝
   */
  alipay_cash_channel?: number;
  is_cash_whitelist?: number; // 是否提现白名单: 0=否, 1=是
  cash_channel_status?: number; // 用户支付宝提现通道开启状态: 0=关闭, 1=开启
  alipay_cash_channel_status?: number; // 用户支付宝提现通道开启状态: 0=关闭, 1=开启
  cash_config?: string[]; // 全局提现通道配置
  sign_status?: number; // 签约状态: 0=未签约, 1=已签约
}
