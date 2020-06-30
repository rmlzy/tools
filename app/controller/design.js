"use strict";

const Controller = require("egg").Controller;

class DesignController extends Controller {
  async render() {
    const { ctx, service } = this;
    const sections = await service.third.fetchMlqk();
    await ctx.render("design.html", { sections });
  }
}

module.exports = DesignController;
