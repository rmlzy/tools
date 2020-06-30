"use strict";

const Controller = require("egg").Controller;

class HttpCodeController extends Controller {
  async render() {
    const { ctx, service } = this;
    ctx.runInBackground(async () => {
      await service.tool.addUsed("http-code");
    });
    await ctx.render("http-code.html", {
      pageTitle: "HTTP Code",
    });
  }
}

module.exports = HttpCodeController;
