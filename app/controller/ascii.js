"use strict";

const Controller = require("egg").Controller;

class AsciiController extends Controller {
  async render() {
    const { ctx, service } = this;
    ctx.runInBackground(async () => {
      await service.dict.addTotalPV();
      await service.tool.addUsed("ascii");
    });
    await ctx.render("ascii.html");
  }
}

module.exports = AsciiController;
