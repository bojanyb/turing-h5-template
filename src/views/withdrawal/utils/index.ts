import { showLoadingToast, closeToast, ToastWrapperInstance } from 'vant';

// 全局唯一的加载提示框实例
let toastInstance: ToastWrapperInstance | null = null;

/**
 * 创建加载控制器
 * @returns {Object} 包含开始和关闭加载状态的方法
 */
export const createLoadingController = () => {
  const startLoading = () => {
    if (!toastInstance) {
      toastInstance = showLoadingToast({
        message: '加载中...', // 文本内容
        forbidClick: true, // 是否禁止背景点击
        loadingType: 'spinner', // 加载图标类型
        duration: 0, // 持久显示手动关闭
      });
    }
  };

  const stopLoading = () => {
    if (toastInstance) {
      closeToast();
      toastInstance = null;
    }
  };

  return { startLoading, stopLoading };
};

/**
 * 类型守卫函数，检查值是否为数字
 */
export const isNumber = (value: any): value is number => {
  return typeof value === 'number';
};

/**
 * 类型守卫函数，检查值是否为字符串
 */
export const isString = (value: any): value is string => {
  return typeof value === 'string';
};
