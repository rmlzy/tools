"use strict";

const Controller = require("egg").Controller;

class Md2HtmlController extends Controller {
  async render() {
    const { ctx, service } = this;
    ctx.runInBackground(async () => {
      await service.dict.addTotalPV();
      await service.tool.addUsed("md2html");
    });
    await ctx.render("md2html.html");
  }
}

module.exports = Md2HtmlController;
