"use strict";

const Controller = require("egg").Controller;

class JsonFormatController extends Controller {
  async render() {
    const { ctx, service } = this;
    ctx.runInBackground(async () => {
      await service.tool.addUsed("json-format");
    });
    await ctx.render("json-format.html");
  }
}

module.exports = JsonFormatController;
