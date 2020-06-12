"use strict";

const Controller = require("egg").Controller;

class BarcodeController extends Controller {
  async render() {
    const { ctx, service } = this;
    ctx.runInBackground(async () => {
      await service.dict.addTotalPV();
      await service.tool.addUsed("barcode");
    });
    await ctx.render("barcode.html");
  }
}

module.exports = BarcodeController;
