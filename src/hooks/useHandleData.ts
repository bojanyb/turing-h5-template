import { useUserStore } from '/@/store/modules/user';
import { loginApi } from '/@/api/modules/login';
import { isIosFun } from '/@/utils/index';

export const useHandleData = (isAnalog = false, callback?: () => void) => {
  const userStore = useUserStore();

  /**
   * @description 调试模拟数据
   * */
  const LoginFun = async () => {
    try {
      const params = {
        phone: '17665333914',
        code: '000000',
        version: '1.0.0',
        agent: 'ipone14',
        device_id: 'A-ADECFE62-612F-40C9-AE7C-8EE2CBC7BC4A',
      };
      const res = await loginApi(params);
      console.log(res);
      userStore.setToken(res.token);
      userStore.setInfo(res);
    } catch (e) {
      console.error('Login failed:', e);
    }
  };

  /**
   * @description 获取用户信息
   * */
  // const fetchAndSetUserInfo = async () => {
  //   try {
  //     const res = await userMe({});
  //     userStore.setInfo(res);
  //   } catch (error) {
  //     console.error(`获取用户信息错误: ${error}`);
  //     throw error;
  //   }
  // };

  /**
   * @description 调用客户端方法
   * */
  const setWindowJsSyncInfo = () => {
    window.js_sync_info = (token: string, id?: string) => {
      console.log('获取客户端token:', token);
      userStore.setToken(token);
      if (id !== undefined) {
        userStore.device_id = id;
      }
      // fetchAndSetUserInfo();
      callback && callback();
    };
  };

  onMounted(() => {
    // 是否调试模拟数据
    if (isAnalog) {
      LoginFun();
    }

    setWindowJsSyncInfo();

    // ios中的callback需要单独回调一次，js_sync_info中的callback方法无法执行
    if (isIosFun() && callback) {
      callback();
    }
  });
};
