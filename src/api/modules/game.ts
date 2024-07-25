import { Game } from '/@/api/interface/index';
import { PORT1 } from '/@/api/config/servicePort';
import http from '/@/api';

/**
 * @name SUD游戏模块
 */

// 获取配置
export const getConfig = (params: Game.ReqGameConfig) => {
  return http.post<Game.ResGameConfig>(PORT1 + `game/config`, params);
};

// 获取code
export const getCode = (params: Game.ReqGameCode) => {
  return http.post<Game.ResGameCode>(PORT1 + `game/code`, params);
};
