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
    await ctx.render("nav.html", { categories });
  }
}

module.exports = NavController;
