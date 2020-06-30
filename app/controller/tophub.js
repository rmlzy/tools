"use strict";

const Controller = require("egg").Controller;

class TophubController extends Controller {
  async render() {
    const { ctx, service } = this;
    let nodes = [];
    const cached = await service.tophub.readCached("tech");
    if (cached) {
      nodes = cached;
    } else {
      nodes = await service.tophub.fetchNodes("tech");
    }
    await ctx.render("tophub.html", { nodes });
  }
}

module.exports = TophubController;
