"use strict";

const Controller = require("egg").Controller;

class CategoryController extends Controller {
  async render() {
    const { ctx } = this;
    await ctx.render("admin/category.html");
  }
}

module.exports = CategoryController;
