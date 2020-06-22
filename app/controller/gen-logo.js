"use strict";

const Controller = require("egg").Controller;

class GenLogoController extends Controller {
  async render() {
    const { ctx, service } = this;
    await ctx.render("gen-logo.html");
  }
}

module.exports = GenLogoController;
