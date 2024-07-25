import { Couple } from '/@/api/interface/index';
import { PORT1 } from '/@/api/config/servicePort';
import http from '/@/api';

/**
 * @name 拍拍关系模块
 */
// 玩法介绍
export const getDescribe = () => {
  return http.post<Couple.ResDescribe>(PORT1 + `/v2/Coupling/describe`);
};
