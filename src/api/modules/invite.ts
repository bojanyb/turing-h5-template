import { Invite } from '/@/api/interface/index';
import { PORT1 } from '/@/api/config/servicePort';
import http from '/@/api';

/**
 * @name 邀请模块
 */

// 判断我的邀请类型
export function isRecommender(params: Invite.ReqInvite) {
  return http.post<Invite.ResInvite>(PORT1 + `/Recommend/isRecommender`, params);
}

// 成为邀请人
export function beRecommender(params: Invite.ReqInvite) {
  return http.post<Invite.ResInvite>(PORT1 + `/Recommend/beRecommender`, params);
}

// 是否实名
export function getVerify(params: Invite.ReqInvite) {
  return http.post<Invite.ResInvite>(PORT1 + `/user/getVerify`, params);
}

// 邀请统计
export function statistics(params: Invite.ReqInvite) {
  return http.post<Invite.ResInvite>(PORT1 + `/Recommend/statistics`, params);
}

// 获取个人信息
export function userInfo(params: Invite.ReqInvite) {
  return http.post<Invite.ResInvite>(PORT1 + `/User/me`, params);
}

// 邀请信息
export function myInvite(params: Invite.ReqInvite) {
  return http.post<Invite.ResInvite>(PORT1 + `/user/myInvite`, params);
}

// 查看是否可以绑定
export function canBind(params: Invite.ReqInvite) {
  return http.post<Invite.ResInvite>(PORT1 + `/user/canBind`, params);
}

// 填写邀请码
export function bindInvite(params: Invite.ReqInvite) {
  return http.post<Invite.ResInvite>(PORT1 + `/user/bindInvite`, params);
}
