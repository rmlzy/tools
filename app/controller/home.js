"use strict";

const Controller = require("egg").Controller;

class HomeController extends Controller {
  async render() {
    const { ctx, service } = this;
    let doneTools = [];
    let workingTools = [];
    try {
      doneTools = await service.tool.findAll({ where: { status: "DONE" } });
      workingTools = await service.tool.findAll({ where: { status: "WORKING" } });
    } catch (e) {
      // ignore
    }
    await service.dict.addTotalPV();
    await ctx.render("home.html", { doneTools, workingTools });
  }
}

module.exports = HomeController;
