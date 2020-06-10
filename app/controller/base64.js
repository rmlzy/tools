"use strict";

const Controller = require("egg").Controller;

class Base64Controller extends Controller {
  async render() {
    const { ctx, service } = this;
    ctx.runInBackground(async () => {
      await service.dict.addTotalPV();
      await service.tool.addUsed("base64");
    });
    await ctx.render("base64.html");
  }
}

module.exports = Base64Controller;
