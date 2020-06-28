/* eslint valid-jsdoc: "off" */

"use strict";

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  const config = (exports = {});

  config.keys = "TOOLS";

  // 中间件
  config.middleware = ["locals"];

  // TDK
  config.title = "工具城";
  config.description = "开源免费的在线工具, 让你事半功倍";
  config.keywords = "在线工具, JSON格式化, LOGO制作";
  config.author = {
    name: "Jason Liu",
    email: "rmlzy@outlook.com",
    github: "https://github.com/rmlzy",
    twitter: "https://twitter.com/rmlzy",
  };

  // 仓库地址
  config.repoUrl = "https://github.com/rmlzy/tools";

  // 第一次部署的时间
  config.firstDeployDate = "2020-02-18 17:42:45";

  // 静态文件版本
  config.version = "2020-06-25";

  // 模板引擎配置
  // https://mozilla.github.io/nunjucks/
  config.view = {
    defaultViewEngine: "nunjucks",
    mapping: {
      ".html": "nunjucks",
    },
  };

  // 程序运行错误
  config.onerror = {
    errorPageUrl: "/500.html",
  };

  // 安全配置
  config.security = {
    // 关闭 csrf 防范
    csrf: false,
  };

  config.static = {
    gzip: true,
  };

  // 文件上传
  config.multipart = {
    mode: "file",
    fileExtensions: [".pdf", ".png", ".jpg", ".jpeg", ".doc", ".excel", ".ppt"],
    fileSize: "20mb",
  };

  return config;
};
