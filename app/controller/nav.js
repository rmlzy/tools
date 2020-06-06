"use strict";

const Controller = require("egg").Controller;

class HomeController extends Controller {
  async render() {
    const { ctx, service } = this;
    await service.dict.addTotalPV();
    await ctx.render("nav.html", { pageTitle: "网站导航" });
  }
}

module.exports = HomeController;
