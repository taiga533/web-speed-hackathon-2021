import Express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
const app = Express();

app.use(
  '/',
  createProxyMiddleware({
    target: 'https://wsh-2021-taiga533.herokuapp.com',
    changeOrigin: true,
    onProxyRes: (proxyRes) => {
      proxyRes.headers['Cache-Control'] = 's-maxage=1, stale-while-revalidate';
    },
  }),
);
export { app as default };
