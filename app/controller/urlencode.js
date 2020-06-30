"use strict";

const Controller = require("egg").Controller;

class UrlencodeController extends Controller {
  async render() {
    const { ctx, service } = this;
    ctx.runInBackground(async () => {
      await service.tool.addUsed("urlencode");
    });
    await ctx.render("urlencode.html");
  }
}

module.exports = UrlencodeController;
