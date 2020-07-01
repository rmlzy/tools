"use strict";

const Controller = require("egg").Controller;
const dayjs = require("dayjs");

class DemandController extends Controller {
  async render() {
    const { ctx, service } = this;
    let demands = await service.demand.findAll({
      order: [["createdAt", "DESC"]],
    });
    demands = demands
      .map((el) => el.get({ plain: true }))
      .map((item) => {
        item.createdAtFormat = dayjs(item.createdAt).format("YYYY-MM-DD HH:mm:ss");
        item.updatedAtFormat = dayjs(item.updatedAt).format("YYYY-MM-DD HH:mm:ss");
        return item;
      });
    await ctx.render("demand.html", { demands });
  }

  async create() {
    const { ctx, service } = this;
    const { username, email, content } = ctx.request.body;
    try {
      if (!content) {
        ctx.body = { success: false, message: "请填写您的需求" };
        return;
      }
      if (content.length > 1000) {
        ctx.body = { success: false, message: "需求最多1000个字符" };
        return;
      }
      const created = await service.demand.create({
        username: username || "匿名用户",
        email: email || "",
        content,
        status: "WORKING",
      });
      ctx.body = { success: true, message: "提交成功" };
    } catch (e) {
      ctx.logger.error("Error while DemandController.create, stack: ", e);
      ctx.body = { success: false, message: "内部服务器错误" };
    }
  }
}

module.exports = DemandController;
