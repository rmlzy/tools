"use strict";

const Controller = require("egg").Controller;
const parser = require("xml2json");

class Xml2jsonController extends Controller {
  async render() {
    const { ctx, service } = this;
    ctx.runInBackground(async () => {
      await service.dict.addTotalPV();
    });
    await ctx.render("xml2json.html");
  }

  async toJson() {
    const { ctx } = this;
    const { xml } = ctx.request.body;
    if (xml === "") {
      ctx.body = { success: false, message: "请输入xml" };
      return;
    }
    try {
      const json = parser.toJson(xml, {});
      ctx.body = { success: true, message: "操作成功", data: json };
    } catch (e) {
      ctx.logger.error("Error while Xml2jsonController.toJson, stack: ", e);
      ctx.body = { success: false, message: "内部服务器错误" };
    }
  }

  async toXml() {
    const { ctx } = this;
    const { json } = ctx.request.body;
    if (json === "") {
      ctx.body = { success: false, message: "请输入json" };
      return;
    }
    try {
      const xml = parser.toXml(json, { sanitize_values: true });
      ctx.body = { success: true, message: "操作成功", data: xml };
    } catch (e) {
      ctx.logger.error("Error while Xml2jsonController.toXml, stack: ", e);
      ctx.body = { success: false, message: "内部服务器错误" };
    }
  }
}

module.exports = Xml2jsonController;
