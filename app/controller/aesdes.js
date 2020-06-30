"use strict";

const Controller = require("egg").Controller;

class AesdesController extends Controller {
  async render() {
    const { ctx, service } = this;
    ctx.runInBackground(async () => {
      await service.tool.addUsed("aesdes");
    });
    await ctx.render("aesdes.html");
  }
}

module.exports = AesdesController;
