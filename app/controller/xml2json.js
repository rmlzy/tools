"use strict";

const Controller = require("egg").Controller;
const parser = require("xml-js");

class Xml2jsonController extends Controller {
  async render() {
    const { ctx, service } = this;
    await ctx.render("xml2json.html");
  }

  async toJson() {
    const { ctx, service } = this;
    const { xml } = ctx.request.body;
    if (xml === "") {
      ctx.body = { success: false, message: "请输入xml" };
      return;
    }
    ctx.runInBackground(async () => {
      await service.tool.addUsed("xml2json");
    });
    try {
      const json = parser.xml2json(xml, { compact: true, spaces: 4 });
      ctx.body = { success: true, message: "操作成功", data: json };
    } catch (e) {
      ctx.logger.error("Error while Xml2jsonController.toJson, stack: ", e);
      ctx.body = { success: false, message: "内部服务器错误" };
    }
  }

  async toXml() {
    const { ctx, service } = this;
    const { json } = ctx.request.body;
    if (json === "") {
      ctx.body = { success: false, message: "请输入json" };
      return;
    }
    ctx.runInBackground(async () => {
      await service.tool.addUsed("xml2json");
    });
    try {
      const xml = parser.json2xml(json, { compact: true, spaces: 4 });
      ctx.body = { success: true, message: "操作成功", data: xml };
    } catch (e) {
      ctx.logger.error("Error while Xml2jsonController.toXml, stack: ", e);
      ctx.body = { success: false, message: "内部服务器错误" };
    }
  }
}

module.exports = Xml2jsonController;
