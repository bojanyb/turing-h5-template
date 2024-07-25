import { Guild } from '/@/api/interface/index';
import { PORT1 } from '/@/api/config/servicePort';
import http from '/@/api';

/**
 * @name 公会模块
 */
// 创建工会申请
export const newGuildApply = (params: Guild.ReqGuildApply) => {
  return http.post<Guild.ResGuild>(PORT1 + `/guildApply/newGuildApply`, params);
};

// 查看我的创建申请
export const myApply = () => {
  return http.post<Guild.ResGuild>(PORT1 + `/guild/myApply`);
};

// 获取公会类型
export const getGuildType = () => {
  return http.post<Guild.ResGuild>(PORT1 + `/guildApply/getGuildType`);
};

// 获取协议签署状态
export const getSignStatus = (params: Guild.ReqGuildApply) => {
  return http.post<Guild.ResGuild>(PORT1 + `/Fadada/getSignStatus`, params);
};

// 创建签署任务(基于签署任务模板)
export const createWithTemplate = (params: Guild.ReqGuildApply) => {
  return http.post<Guild.ResGuild>(PORT1 + `/Fadada/createWithTemplate`, params);
};
