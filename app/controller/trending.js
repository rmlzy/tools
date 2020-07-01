"use strict";

const Controller = require("egg").Controller;
const dayjs = require("dayjs");

class TrendingController extends Controller {
  async render() {
    const { ctx, service } = this;
    const today = dayjs().format("YYYY-MM-DD");
    const { date = today, lang = "", since = "daily" } = ctx.request.query;
    const entity = {
      repos: [],
      date: date,
      dateList: this._getDateRanges(),
      lang: lang,
      langs: [],
      since,
      sinces: [],
    };
    try {
      const { langs, sinces } = await service.trending.getEnums();
      entity.langs = langs;
      entity.sinces = sinces;
      entity.repos = await service.trending.findAll({ where: { date, since, language: lang } });
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
      await service.tool.addUsed("trending");
    });
    await ctx.render("trending.html", entity);
  }

  _getDateRanges() {
    const ranges = [];
    const start = dayjs("2020-06-30");
    const today = dayjs();
    const diff = today.diff(start, "day");
    for (let i = 0; i < diff + 1; i++) {
      ranges.push(start.add(i, "day").format("YYYY-MM-DD"));
    }
    return ranges;
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
      ctx.body = { success: true, message: "OK" };
    } catch (e) {
      ctx.logger.error("Error while TrendingController.queryAll, stack: ", e);
      ctx.body = { success: false, message: "内部服务器错误" };
    }
  }
}

module.exports = TrendingController;
