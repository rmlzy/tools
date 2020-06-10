"use strict";

const Controller = require("egg").Controller;
const md5 = require("blueimp-md5");

class Md5Controller extends Controller {
  async render() {
    const { ctx, service } = this;
    ctx.runInBackground(async () => {
      await service.dict.addTotalPV();
    });
    await ctx.render("md5.html", {
      pageTitle: "在线MD5加密",
    });
  }

  async encrypt() {
    const { ctx, service } = this;
    const { source } = ctx.request.body;
    if (source === "") {
      ctx.body = { success: false, message: "请输入要加密的原文" };
      return;
    }
    try {
      const hash = md5(source);
      const hash16 = hash.substring(8, 24);
      await service.tool.addUsed("md5");
      ctx.body = {
        success: true,
        message: "操作成功",
        data: {
          upper32: hash.toUpperCase(),
          lower32: hash,
          upper16: hash16.toUpperCase(),
          lower16: hash16,
        },
      };
    } catch (e) {
      ctx.logger.error("Error while Md5Controller.encrypt, stack: ", e);
      ctx.body = { success: false, message: "内部服务器错误" };
    }
  }
}

module.exports = Md5Controller;
