"use strict";

const Controller = require("egg").Controller;

class DesignController extends Controller {
  async render() {
    const { ctx, service } = this;
    const sections = await service.third.fetchMlqk();
    ctx.runInBackground(async () => {
      await service.dict.addTotalPV();
    });
    await ctx.render("design.html", { sections });
  }
}

module.exports = DesignController;
