import { MOCK_API_BASE_URL, MOCK_API_TARGET_URL } from '../constant';
import { ProxyOptions, loadEnv } from 'vite';

type ProxyTargetList = Record<string, ProxyOptions>;

const env = loadEnv(process.env.NODE_ENV as string, process.cwd());
const { VITE_API_URL, VITE_POROXY_URL } = env;

const init: ProxyTargetList = {
  // serve
  [VITE_API_URL as string]: {
    target: VITE_POROXY_URL,
    changeOrigin: true,
    rewrite: (path) => path.replace(new RegExp(`^${VITE_API_URL}`), ''),
  },
  // mock
  [MOCK_API_BASE_URL]: {
    target: MOCK_API_TARGET_URL,
    changeOrigin: true,
    rewrite: (path) => path.replace(new RegExp(`^${MOCK_API_BASE_URL}`), '/api'),
  },
};

export default init;
