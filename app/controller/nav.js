"use strict";

const Controller = require("egg").Controller;

class HomeController extends Controller {
  async render() {
    const { ctx, service } = this;
    let categories = [];
    try {
      await service.dict.addTotalPV();
      categories = await service.category.findAll();
    } catch (e) {
      // ignore
    }
    console.log(categories);
    await ctx.render("nav.html", { pageTitle: "网站导航", categories });
  }
}

module.exports = HomeController;
