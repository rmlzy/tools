"use strict";

const Controller = require("egg").Controller;

class HomeController extends Controller {
  async render() {
    const { ctx } = this;
    await ctx.render("admin/home.html");
  }
}

module.exports = HomeController;
