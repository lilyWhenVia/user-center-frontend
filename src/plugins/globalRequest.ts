/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import {extend} from 'umi-request';
import {message} from "antd";
import {history} from "@@/core/history";
import {stringify} from "querystring";
import { SUCCESS_CODE, UN_LOGIN_CODE} from "@/constants";
/**
 * 配置request请求时的默认参数
 */
const request = extend({
  credentials: 'include', // 默认请求是否带上cookie
  prefix: process.env.NODE_ENV === 'production' ?"127.0.0.1": undefined
  // requestType: 'form',
});

/**
 * 所以请求拦截器
 */
request.interceptors.request.use((url, options): any => {
  console.log(`do request url = ${url}`)

  return {
    url,
    options: {
      ...options,
      headers: {},
    },
  };
});

/**
 * 所有响应拦截器
 */
request.interceptors.response.use(async (response, options): Promise<any> => {
  const res = await response.clone().json();

  if (res.code === SUCCESS_CODE) {
    return res.data;
  }
  if (res.code === UN_LOGIN_CODE) {
    message.error('请先登录');
    history.replace({ // if (true){
                      //   return response;
                      // }
      pathname: '/user/login',
      search: stringify({
        redirect: history.location.pathname,
      }),
    });
  } else {
    message.error(res.description)
  }
  return res.data;
});

export default request;
