"use strict";

const Controller = require("egg").Controller;

class Md2HtmlController extends Controller {
  async render() {
    const { ctx, service } = this;
    try {
      await service.dict.addTotalPV();
    } catch (e) {
      // ignore
    }
    await ctx.render("md2html.html");
  }

  async convert() {
    const { ctx, service } = this;
    const { md } = ctx.request.body;
    try {
      const html = ctx.helper.md2html(md);
      await service.tool.addUsed("md2html");
      ctx.body = { success: true, message: "操作成功", data: html };
    } catch (e) {
      ctx.logger.error("Error while Md2HtmlController.convert, stack: ", e);
      ctx.body = { success: false, message: "内部服务器错误" };
    }
  }
}

module.exports = Md2HtmlController;
