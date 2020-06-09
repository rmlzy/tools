"use strict";

const Controller = require("egg").Controller;

class HttpCodeController extends Controller {
  async render() {
    const { ctx, service } = this;
    try {
      await service.dict.addTotalPV();
      await service.tool.addUsed("http-code");
    } catch (e) {
      // ignore
    }
    await ctx.render("http-code.html", {
      pageTitle: "HTTP Code",
    });
  }
}

module.exports = HttpCodeController;
