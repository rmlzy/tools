"use strict";

const Controller = require("egg").Controller;

class ClientInfoController extends Controller {
  async render() {
    const { ctx, service } = this;
    ctx.runInBackground(async () => {
      await service.tool.addUsed("client-info");
    });
    await ctx.render("client-info.html");
  }
}

module.exports = ClientInfoController;
