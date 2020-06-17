"use strict";

const Controller = require("egg").Controller;

class RegexController extends Controller {
  async render() {
    const { ctx, service } = this;
    ctx.runInBackground(async () => {
      await service.dict.addTotalPV();
      await service.tool.addUsed("regex");
    });
    await ctx.render("regex.html");
  }
}

module.exports = RegexController;
