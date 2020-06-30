"use strict";

const Controller = require("egg").Controller;
const dayjs = require("dayjs");

class HomeController extends Controller {
  async render() {
    const { ctx, service } = this;
    let doneTools = [];
    let workingTools = [];
    try {
      doneTools = await service.tool.findAll({ where: { status: "DONE" } });
      workingTools = await service.tool.findAll({ where: { status: "WORKING" } });
    } catch (e) {
      // ignore
    }
    await ctx.render("home.html", { doneTools, workingTools });
  }

  async fuckWechat() {
    this.ctx.body = "3146667439605983502";
  }

  async fetchStat() {
    const { ctx, service, config } = this;
    const today = dayjs();
    const deployedDate = dayjs(config.firstDeployDate);
    try {
      const pv = await service.dict.get("totalPV");
      const ipNum = (await service.visitor.findAll()).length;
      const systemRunning = today.diff(deployedDate, "day");
      ctx.body = { success: true, message: "OK", data: { pv, ipNum: ipNum + 100, systemRunning } };
      ctx.runInBackground(async () => {
        await service.dict.addTotalPV();
        await service.visitor.create();
      });
    } catch (e) {
      ctx.logger.error("Error while TrendingController.fetchStat, stack: ", e);
      ctx.body = { success: false, message: "内部服务器错误" };
    }
  }
}

module.exports = HomeController;
