"use strict";

const Controller = require("egg").Controller;

class ToolController extends Controller {
  async render() {
    const { ctx } = this;
    await ctx.render("admin/tool.html");
  }
}

module.exports = ToolController;
