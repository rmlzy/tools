"use strict";

const Controller = require("egg").Controller;

class CheatsheetController extends Controller {
  async renderList() {
    const { ctx, service } = this;
    let cheatsheets = [];
    try {
      cheatsheets = await service.cheatsheet.findAll();
    } catch (e) {
      // ignore
    }
    await ctx.render("admin/cheatsheet.html", {
      cheatsheets,
    });
  }

  async renderUpdate() {
    const { ctx, service } = this;
    const { id } = ctx.params;
    await ctx.render("admin/cheatsheet-update.html", { id });
  }

  async detail() {
    const { ctx, service } = this;
    try {
      const { id } = ctx.params;
      const existed = await service.cheatsheet.findOne({ where: { id } });
      if (!existed) {
        ctx.body = { success: false, message: "速查表不存在" };
        return;
      }
      ctx.body = { success: true, data: existed };
    } catch (e) {
      ctx.logger.error("Error while CheatsheetController.detail, stack: ", e);
      ctx.body = { success: false, message: "内部服务器错误" };
    }
  }

  async create() {
    const { ctx, service } = this;
    const { name, content, desc, status } = ctx.request.body;
    try {
      const existed = await service.cheatsheet.findOne({ where: { name } });
      if (existed) {
        ctx.body = { success: false, message: "速查表已存在" };
        return;
      }
      const created = await service.cheatsheet.create({ name, content, desc, status });
      ctx.body = { success: true, message: "操作成功", data: created.id };
    } catch (e) {
      ctx.logger.error("Error while CheatsheetController.create, stack: ", e);
      ctx.body = { success: false, message: "内部服务器错误" };
    }
  }

  async update() {
    const { ctx, service, app } = this;
    const { Op } = app.Sequelize;
    const { id } = ctx.params;
    const { name, content, desc, status } = ctx.request.body;
    try {
      const idExisted = await service.cheatsheet.findOne({ where: { id: Number(id) } });
      if (!idExisted) {
        ctx.body = { success: false, message: "速查表不存在" };
        return;
      }
      const nameExisted = await service.cheatsheet.findOne({
        where: {
          name,
          id: { [Op.ne]: id },
        },
      });
      if (nameExisted) {
        ctx.body = { success: false, message: "名称已存在" };
        return;
      }
      const updated = await service.cheatsheet.update({ name, content, desc, status }, { where: { id } });
      ctx.body = { success: true, message: "操作成功", data: id };
    } catch (e) {
      ctx.logger.error("Error while CheatsheetController.update, stack: ", e);
      ctx.body = { success: false, message: "内部服务器错误" };
    }
  }

  async delete() {
    const { ctx, service } = this;
    const { id } = ctx.params;
    try {
      const existed = await service.cheatsheet.findOne({ where: { id } });
      if (!existed) {
        ctx.body = { success: false, message: "速查表不存在" };
        return;
      }
      const deleted = await service.cheatsheet.destroy({ where: { id } });
      ctx.body = { success: true, message: "操作成功" };
    } catch (e) {
      ctx.logger.error("Error while CheatsheetController.delete, stack: ", e);
      ctx.body = { success: false, message: "内部服务器错误" };
    }
  }
}

module.exports = CheatsheetController;
