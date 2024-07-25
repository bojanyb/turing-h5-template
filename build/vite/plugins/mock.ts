/**
 * @name ConfigMockPlugin
 * @description 引入mockjs，本地模拟接口
 */
import { viteMockServe } from 'vite-plugin-mock';

export const ConfigMockPlugin = (isBuild: boolean) => {
  return viteMockServe({
    ignore: /^\_/,
    mockPath: 'mock',
    enable: !isBuild,
    // https://github.com/anncwb/vite-plugin-mock/issues/9
  });
};
