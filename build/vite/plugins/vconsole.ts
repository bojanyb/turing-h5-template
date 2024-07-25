/**
 * @name ConfigVConsole
 * @description 控制台，方便移动端调试
 */

import { viteVConsole } from 'vite-plugin-vconsole';
import path from 'path';

export const ConfigVConsole = () => {
  return viteVConsole({
    entry: path.resolve('src/main.ts'),
  });
};
