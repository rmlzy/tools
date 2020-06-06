"use strict";

const Controller = require("egg").Controller;

class NavController extends Controller {
  async render() {
    const { ctx } = this;
    await ctx.render("admin/nav.html");
  }
}

module.exports = NavController;
