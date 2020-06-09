"use strict";

const Controller = require("egg").Controller;

class TohController extends Controller {
  async render() {
    const { ctx, service } = this;
    let toh = [];
    try {
      await service.dict.addTotalPV();
      await service.tool.addUsed("toh");
      const res = await service.third.todayOfHistory();
      if (res.success) {
        toh = res.data;
      }
    } catch (e) {
      // ignore
    }
    await ctx.render("toh.html", { pageTitle: "历史上的今天", toh });
  }
}

module.exports = TohController;
