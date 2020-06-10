"use strict";

const Controller = require("egg").Controller;

class NavController extends Controller {
  async render() {
    const { ctx, service } = this;
    let categories = [];
    try {
      categories = await service.category.findAll({
        order: [["id", "DESC"]],
      });
    } catch (e) {
      // ignore
    }
    ctx.runInBackground(async () => {
      await service.dict.addTotalPV();
    });
    await ctx.render("nav.html", { pageTitle: "网站导航", categories });
  }
}

module.exports = NavController;
