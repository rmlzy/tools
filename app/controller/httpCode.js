"use strict";

const Controller = require("egg").Controller;

class HttpCodeController extends Controller {
  async render() {
    const { ctx, service } = this;
    await service.dict.addTotalPV();
    await ctx.render("http-code.html", {
      pageTitle: "HTTP Code",
    });
  }
}

module.exports = HttpCodeController;
