"use strict";

const Controller = require("egg").Controller;

class HomeController extends Controller {
  async render() {
    const { ctx } = this;
    const onlineTools = [
      {
        name: "PNG转JPG",
        url: "/png2jpg.html",
        desc: "在线转换图片格式",
        used: "200k",
      },
      {
        name: "HTTP状态码对照表",
        url: "/http-code.html",
        desc: "HTTP Code",
        used: "200k",
      },
      {
        name: "JavaScript工具",
        url: "/javascript.html",
        desc: "在线js美化、解压缩、混淆",
        used: "200k",
      },
      {
        name: "CSS工具",
        url: "/css.html",
        desc: "在线css美化、格式化、压缩",
        used: "200k",
      },
    ];
    const comingTools = [
      {
        name: "时间格式化",
        url: "/dayjs.html",
        desc: "在线格式化时间",
        used: "0",
      },
      {
        name: "图片压缩",
        url: "/tiny-image.html",
        desc: "一个免费的图片转换工具",
        used: "0",
      },
      {
        name: "在线MD5加密",
        url: "/md5.html",
        desc: "一个免费的图片转换工具",
        used: "0",
      },
      {
        name: "JSON格式化",
        url: "/json-formatter.html",
        desc: "一个免费的图片转换工具",
        used: "0",
      },
      {
        name: "放假安排",
        url: "/holiday.html",
        desc: "放假安排",
        used: "0",
      },
    ];
    await ctx.render("home.html", { onlineTools, comingTools });
  }
}

module.exports = HomeController;
