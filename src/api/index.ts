import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { showToast } from 'vant';
import { ResultData } from '/@/api/interface';
import { ResultEnum } from '/@/api/enums/httpEnum';
import { checkStatus } from './helper/checkStatus';
import { AxiosCanceler } from './helper/axiosCancel';
import { useUserStore } from '/@/store/modules/user';
import { createUniqueTraceId } from '/@/utils/index';
import router from '/@/router';

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  loading?: boolean;
  cancel?: boolean;
}

const config = {
  // 默认地址请求地址，可在 .env.** 文件中修改
  baseURL: import.meta.env.VITE_API_URL as string,
  // 设置超时时间
  timeout: ResultEnum.TIMEOUT as number,
  // 跨域时候允许携带凭证
  withCredentials: true,
};

const axiosCanceler = new AxiosCanceler();

// 时间戳+随机字符串
let traceId = '';
const userStore = useUserStore();

class RequestHttp {
  service: AxiosInstance;
  public constructor(config: AxiosRequestConfig) {
    // instantiation
    this.service = axios.create(config);

    /**
     * @description 请求拦截器
     * 客户端发送请求 -> [请求拦截器] -> 服务器
     * token校验(JWT) : 接受服务器返回的 token,存储到 vuex/pinia/本地储存当中
     */
    this.service.interceptors.request.use(
      (config: CustomAxiosRequestConfig) => {
        // 重复请求不需要取消，在 api 服务中通过指定的第三个参数: { cancel: false } 来控制
        config.cancel ?? (config.cancel = true);
        config.cancel && axiosCanceler.addPending(config);
        // 当前请求不需要显示 loading，在 api 服务中通过指定的第三个参数: { loading: false } 来控制
        // config.loading ?? (config.loading = true);
        if (config.headers && typeof config.headers.set === 'function') {
          traceId = createUniqueTraceId();
          config.headers.set('x-request-id', traceId);
        }
        // 请求参数
        let params = config.data ? config.data : config.params;
        if (!params) {
          params = {};
        }
        // 添加token
        const token = useUserStore().getToken;
        if (config.url !== '/Login/login' && token) {
          params.token = token;
        }
        // 添加设备id
        if (userStore.device_id) {
          params.device_id = userStore.device_id;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      },
    );

    /**
     * @description 响应拦截器
     *  服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
     */
    this.service.interceptors.response.use(
      (response: AxiosResponse) => {
        const { data, config } = response;
        axiosCanceler.removePending(config);
        // 登陆失效
        if (data.code == ResultEnum.OVERDUE) {
          userStore.setToken('');
          showToast(data.msg);
          return Promise.reject(data);
        }
        // 全局错误信息拦截（防止下载文件的时候返回数据流，没有 code 直接报错）
        if (data.code !== ResultEnum.SUCCESS) {
          setTimeout(() => {
            showToast(data.msg);
          }, 500);
          return Promise.reject(data);
        }
        // 成功请求（在页面上除非特殊情况，否则不用处理失败逻辑）
        return data;
      },
      (error: AxiosError) => {
        const { response } = error;
        // 请求超时 && 网络错误单独判断，没有 response
        if (error.message.indexOf('timeout') !== -1) console.error('请求超时！请您稍后重试');
        if (error.message.indexOf('Network Error') !== -1) console.error('网络错误！请您稍后重试');
        // 根据服务器响应的错误状态码，做不同的处理
        if (response) checkStatus(response.status);
        // 服务器结果都没有返回(可能服务器错误可能客户端断网)，断网处理:可以跳转到断网页面
        if (!window.navigator.onLine) router.replace('/500');
        return Promise.reject(error);
      },
    );
  }

  /**
   * @description 常用请求方法封装
   */
  request<T>(config: AxiosRequestConfig): Promise<T> {
    const conf = config;
    return new Promise((resolve, reject) => {
      this.service
        .request<ResultData, AxiosResponse<ResultData>>(conf)
        .then((res: AxiosResponse<ResultData>) => {
          const { data } = res;
          resolve(data as T);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  get<T>(url: string, params?: object, _object = {}): Promise<T> {
    return this.request<T>({ method: 'get', url, params, ..._object });
  }
  post<T>(url: string, params?: object | string, _object = {}): Promise<T> {
    // POST接口额外添加时间戳
    const data = Object.assign(params || {}, { timestamp: Date.now() });
    return this.request<T>({ method: 'post', url, data, ..._object });
  }
  put<T>(url: string, params?: object, _object = {}): Promise<T> {
    return this.request<T>({ method: 'put', url, data: params, ..._object });
  }
  delete<T>(url: string, params?: any, _object = {}): Promise<T> {
    return this.request<T>({ method: 'delete', url, data: params, ..._object });
  }
  download(url: string, params?: object, _object = {}): Promise<BlobPart> {
    return this.service.post(url, params, { ..._object, responseType: 'blob' });
  }
}

export default new RequestHttp(config);
