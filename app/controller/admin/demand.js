"use strict";

const Controller = require("egg").Controller;

class DemandController extends Controller {
  async render() {
    const { ctx } = this;
    await ctx.render("admin/demand.html");
  }
}

module.exports = DemandController;
