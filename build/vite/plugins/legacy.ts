/**
 * @name ConfigLegacy
 * @description 旧版浏览器兼容插件
 */

import legacy from '@vitejs/plugin-legacy';

export const ConfigLegacy = () => {
  return legacy({
    targets: ['defaults', 'not IE 11'],
  });
};
