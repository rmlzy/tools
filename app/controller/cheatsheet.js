"use strict";

const Controller = require("egg").Controller;
const dayjs = require("dayjs");

class CheatsheetController extends Controller {
  async renderList() {
    const { ctx, service } = this;
    let cheatsheets = [];
    try {
      cheatsheets = await service.cheatsheet.findAll({
        order: [["id", "DESC"]],
        where: { status: "ENABLE" },
      });
    } catch (e) {
      // ignore
    }
    ctx.runInBackground(async () => {
      await service.dict.addTotalPV();
    });
    await ctx.render("cheatsheet.html", { cheatsheets });
  }

  async renderDetail() {
    const { ctx, service } = this;
    const { id } = ctx.params;
    let sheet = {};
    try {
      sheet = await service.cheatsheet.findOne({ where: { id, status: "ENABLE" } });
      if (!sheet) {
        await ctx.render("404.html");
        return;
      }
      sheet = sheet.get({ plain: true });
      sheet.createdAt = dayjs(sheet.createdAt).format("YYYY年MM月DD日");
      sheet.updatedAt = dayjs(sheet.updatedAt).format("YYYY年MM月DD日");
      sheet.html = ctx.helper.md2html(sheet.content);
      ctx.runInBackground(async () => {
        await service.cheatsheet.update({ used: sheet.used + 1 }, { where: { id } });
      });
    } catch (e) {
      // ignore
    }
    await ctx.render("cheatsheet-detail.html", { sheet });
  }
}

module.exports = CheatsheetController;
