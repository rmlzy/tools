"use strict";

const Controller = require("egg").Controller;

class Code2ImgController extends Controller {
  async render() {
    const { ctx, service } = this;
    ctx.runInBackground(async () => {
      await service.dict.addTotalPV();
      await service.tool.addUsed("code2img");
    });
    await ctx.render("code2img.html");
  }
}

module.exports = Code2ImgController;
