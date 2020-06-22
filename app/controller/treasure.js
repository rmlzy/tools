"use strict";

const Controller = require("egg").Controller;

class TreasureController extends Controller {
  async render() {
    const { ctx, service } = this;
    try {
      const cipherText = await service.treasure.encrypt("Hello World");
      console.log("密文", cipherText);
    } catch (e) {
      console.log(e);
    }
    await ctx.render("treasure.html");
  }

  async encrypt() {
    const { ctx, service } = this;
    const { plainText } = ctx.request.body;
    const cipherText = await service.treasure.encrypt(plainText);
    ctx.body = { success: true, message: "OK", data: cipherText };
  }

  async decrypt() {
    const { ctx, service } = this;
    const { cipherText } = ctx.request.body;
    const plainText = await service.treasure.decrypt(cipherText);
    ctx.body = { success: true, message: "OK", data: plainText };
  }
}

module.exports = TreasureController;
