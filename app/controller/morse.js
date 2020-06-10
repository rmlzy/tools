"use strict";

const Controller = require("egg").Controller;

class MorseController extends Controller {
  async render() {
    const { ctx, service } = this;
    ctx.runInBackground(async () => {
      await service.dict.addTotalPV();
      await service.tool.addUsed("morse");
    });
    await ctx.render("morse.html");
  }
}

module.exports = MorseController;
