"use strict";

const Controller = require("egg").Controller;

class AesdesController extends Controller {
  async render() {
    const { ctx, service } = this;
    try {
      await service.dict.addTotalPV();
      await service.tool.addUsed("aesdes");
    } catch (e) {
      // ignore
    }
    await ctx.render("aesdes.html");
  }
}

module.exports = AesdesController;
