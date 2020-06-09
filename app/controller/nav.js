"use strict";

const Controller = require("egg").Controller;

class NavController extends Controller {
  async render() {
    const { ctx, service } = this;
    let categories = [];
    try {
      await service.dict.addTotalPV();
      categories = await service.category.findAll({
        order: [["id", "DESC"]],
      });
    } catch (e) {
      // ignore
    }
    await ctx.render("nav.html", { pageTitle: "网站导航", categories });
  }
}

module.exports = NavController;
