"use strict";

const Controller = require("egg").Controller;
const dayjs = require("dayjs");

class TrendingController extends Controller {
  async render() {
    const { ctx, service } = this;
    const today = dayjs().format("YYYY-MM-DD");
    const { date = today } = ctx.request.query;
    const entity = {
      repos: [],
      date: date,
    };
    try {
      entity.repos = await service.trending.findAll({ where: { date: date } });
      entity.repos = entity.repos
        .map((el) => el.get({ plain: true }))
        .map((el) => {
          el.json = JSON.parse(el.json);
          return el;
        })
        .filter((el) => el.json.length > 0);
    } catch (e) {
      ctx.logger.error("Error while TrendingController.render, stack: ", e);
    }
    ctx.runInBackground(async () => {
      await service.dict.addTotalPV();
      await service.tool.addUsed("trending");
    });
    await ctx.render("trending.html", entity);
  }

  async query() {
    const { ctx, service } = this;
    try {
      const rows = await service.trending.fetchAndSave(ctx.request.query);
      ctx.body = { success: true, message: "OK", data: rows };
    } catch (e) {
      ctx.logger.error("Error while TrendingController.query, stack: ", e);
      ctx.body = { success: false, message: "内部服务器错误" };
    }
  }

  async queryAll() {
    const { ctx, service } = this;
    try {
      await service.trending.fetchAllAndSave();
    } catch (e) {
      ctx.logger.error("Error while TrendingController.queryAll, stack: ", e);
      ctx.body = { success: false, message: "内部服务器错误" };
    }
  }
}

module.exports = TrendingController;
