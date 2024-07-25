import { Gift } from '/@/api/interface/index';
import { PORT1 } from '/@/api/config/servicePort';
import http from '/@/api';

/**
 * @name 礼物模块
 */
// 礼盒详情
export const getGiftBoxDetail = (params: Gift.ReqGiftBoxDetail) => {
  return http.post<Gift.ResGiftBoxDetail>(PORT1 + `/v2/GiftBox/detail`, params);
};
