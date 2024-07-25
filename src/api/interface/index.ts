// 请求响应参数（不包含data）
export interface Result {
  code: string;
  msg: string;
}

// 请求响应参数（包含data）
export interface ResultData<T = any> extends Result {
  data: T;
}

// 分页响应参数
export interface ResPage<T> {
  list: T[];
  pageNum: number;
  pageSize: number;
  total: number;
}

// 分页请求参数
export interface ReqPage {
  pageNum: number;
  pageSize: number;
}

// 文件上传模块
export namespace Upload {
  export interface ResFileUrl {
    fileUrl: string;
  }
}

// 登录模块
export namespace Login {
  export interface ReqLoginForm {
    phone?: string;
    code?: string;
    version?: string;
    agent?: string;
    device_id?: string;
  }
  export interface ResLogin {
    token: string;
    [key: string]: any;
  }
  export interface ResAuthButtons {
    [key: string]: string[];
  }
}

// 用户管理模块
export namespace User {
  export interface ReqUserParams extends ReqPage {
    username: string;
    gender: number;
    idCard: string;
    email: string;
    address: string;
    createTime: string[];
    status: number;
  }
  export interface ResUserList {
    id: string;
    username: string;
    gender: number;
    user: { detail: { age: number } };
    idCard: string;
    email: string;
    address: string;
    createTime: string;
    status: number;
    avatar: string;
    photo: any[];
    children?: ResUserList[];
  }
  export interface ResStatus {
    userLabel: string;
    userValue: number;
  }
  export interface ResGender {
    genderLabel: string;
    genderValue: number;
  }
  export interface ResDepartment {
    id: string;
    name: string;
    children?: ResDepartment[];
  }
  export interface ResRole {
    id: string;
    name: string;
    children?: ResDepartment[];
  }
}

// 拍拍关系模块
export namespace Couple {
  export interface ResConfList {
    id: number;
    name: string;
    tree_price: string;
  }
  export interface ResDescribe {
    anim_list?: ResConfList[];
    conf_list?: ResConfList[];
  }
}

// 公会模块
export namespace Guild {
  export interface ResGuild {
    [key: string]: any;
  }
  export interface ReqGuildApply {
    [key: string]: any;
  }
}

// 邀请模块
export namespace Invite {
  export interface ReqInvite {
    [key: string]: any;
  }
  export interface ResInvite {
    [key: string]: any;
  }
}

// 礼物模块
export namespace Gift {
  export interface ReqGift {
    [key: string]: any;
  }
  export interface ResGift {
    [key: string]: any;
  }
  export interface ReqGiftBoxDetail {
    box_id: number;
  }
  export interface GiftItem {
    id: number;
    gift_name: string;
    gift_photo: string;
    gift_diamond: number;
  }
  export interface ResGiftBoxDetail {
    id: number;
    name: string;
    icon: string;
    gift_list: GiftItem[];
  }
}

// SUD游戏模块
export namespace Game {
  export interface ReqGame {
    [key: string]: any;
  }
  export interface ResGame {
    [key: string]: any;
  }

  export interface ReqGameConfig {
    room_number: string | number;
  }

  export interface GameItem {
    game_id: string;
    game_name: string;
    game_icon: string;
    in_play: string;
  }

  export interface ResGameConfig {
    app_id: string;
    app_key: string;
    game_list: GameItem[];
  }

  export interface ReqGameCode {
    user_id: string | number;
  }

  export interface ResGameCode {
    code: string;
  }
}

// 提现模块
export namespace Withdrawal {
  export interface ReqWithdrawal {
    [key: string]: any;
  }
  export interface ResWithdrawal {
    [key: string]: any;
  }

  export interface ReqHistory {
    /** 分页页码，数字类型 */
    page: number;
    /** 1申请中2体现中3后台驳回4提现成功5四方返回失败 */
    staus?: number;
  }

  export interface IRecord {
    id: number;
    order_id: string;
    user_id: number;
    gain: number;
    cash_rate: number;
    real_money: number;
    money: number;
    card_id: string;
    status: number;
    addtime: number;
    status_time: number;
    user_num: string;
    ok_order: string | null;
    wallt_id: string | null;
    wallt_name: string | null;
    money_rate: string;
    admin_id: string;
    pay_time: number;
    channel: number;
    remark: string;
    today_count: number;
    fail_money: string;
    success_money: string;
    guild_id: number;
    gain_type: number;
  }

  export interface ResHistory {
    next_page: number;
    count: number;
    page: number;
    pagesize: number;
    list: IRecord[];
  }

  export interface ReqCreateWithTemplate {
    type: number;
    request_from: string;
  }
}
