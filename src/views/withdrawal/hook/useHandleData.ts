import { useUserStore } from '/@/store/modules/user';
import { loginApi } from '/@/api/modules/login';
import { isIosFun } from '/@/utils/index';

export const useHandleData = (isAnalog = false, callback?: () => void) => {
  const userStore = useUserStore();

  /**
   * @description 调试模拟数据
   * */
  const login = async () => {
    try {
      const params = {
        phone: '17665333914',
        code: '000000',
        version: '1.0.0',
        agent: 'iphone14',
        device_id: 'A-ADECFE62-612F-40C9-AE7C-8EE2CBC7BC4A',
      };
      const res = await loginApi(params);
      userStore.setToken(res.token);
      userStore.setInfo(res);
      return res.token;
    } catch (e) {
      console.error('登录失败:', e);
      throw e;
    }
  };

  /**
   * @description 设置客户端同步信息
   * */
  const setWindowJsSyncInfo = (resolveToken: (token: string) => void) => {
    window.js_sync_info = (token: string, id?: string) => {
      console.log('获取客户端token:', token);
      userStore.setToken(token);
      if (id !== undefined) {
        userStore.device_id = id;
      }
      resolveToken(token);
    };
  };

  return new Promise<string>((resolve, reject) => {
    onMounted(() => {
      const handleToken = async () => {
        try {
          if (isAnalog) {
            const token = await login();
            resolve(token);
          } else {
            setWindowJsSyncInfo(resolve);
          }

          // ios中的callback需要单独回调一次
          if (isIosFun() && callback) {
            callback();
          }
        } catch (error) {
          reject(error);
        }
      };

      handleToken().catch(reject);
    });
  });
};
