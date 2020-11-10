"use strict";

const Controller = require("egg").Controller;

class DuController extends Controller {
  async render() {
    const { ctx } = this;
    await ctx.render("du.html");
  }

  async random() {
    const { ctx, service } = this;
    let text = "";
    try {
      text = await service.du.random();
    } catch (e) {
      // ignore
    }
    ctx.runInBackground(async () => {
      await service.tool.addUsed("du");
    });
    ctx.body = { success: true, message: "OK", data: text };
  }
}

module.exports = DuController;
