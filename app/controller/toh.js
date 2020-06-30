"use strict";

const Controller = require("egg").Controller;

class TohController extends Controller {
  async render() {
    const { ctx, service } = this;
    let toh = [];
    try {
      const res = await service.third.todayOfHistory();
      if (res.success) {
        toh = res.data;
      }
    } catch (e) {
      // ignore
    }
    ctx.runInBackground(async () => {
      await service.tool.addUsed("toh");
    });
    await ctx.render("toh.html", { pageTitle: "历史上的今天", toh });
  }
}

module.exports = TohController;
