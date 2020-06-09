"use strict";

const Controller = require("egg").Controller;

class ToolController extends Controller {
  async render() {
    const { ctx, service } = this;
    let tools = [];
    try {
      tools = await service.tool.findAll();
    } catch (e) {
      // ignore
    }
    await ctx.render("admin/tool.html", {
      tools,
    });
  }

  async detail() {
    const { ctx, service } = this;
    try {
      const { id } = ctx.params;
      const existed = await service.tool.findOne({ where: { id } });
      if (!existed) {
        ctx.body = { success: false, message: "工具不存在" };
        return;
      }
      ctx.body = { success: true, data: existed };
    } catch (e) {
      ctx.logger.error("Error while ToolController.detail, stack: ", e);
      ctx.body = { success: false, message: "内部服务器错误" };
    }
  }

  async create() {
    const { ctx, service } = this;
    const { name, code, desc, status } = ctx.request.body;
    try {
      const existed = await service.tool.findOne({ where: { name } });
      if (existed) {
        ctx.body = { success: false, message: "工具已存在" };
        return;
      }
      const created = await service.tool.create({ name, code, desc, status });
      ctx.body = { success: true, message: "操作成功" };
    } catch (e) {
      ctx.logger.error("Error while ToolController.create, stack: ", e);
      ctx.body = { success: false, message: "内部服务器错误" };
    }
  }

  async update() {
    const { ctx, service, app } = this;
    const { Op } = app.Sequelize;
    const { id } = ctx.params;
    const { name, code, desc, status } = ctx.request.body;
    try {
      const idExisted = await service.tool.findOne({ where: { id: Number(id) } });
      if (!idExisted) {
        ctx.body = { success: false, message: "工具不存在" };
        return;
      }
      const codeExisted = await service.tool.findOne({
        where: {
          code,
          id: { [Op.ne]: id },
        },
      });
      if (codeExisted) {
        ctx.body = { success: false, message: "Code已存在" };
        return;
      }
      const updated = await service.tool.update({ name, code, desc, status }, { where: { id } });
      ctx.body = { success: true, message: "操作成功" };
    } catch (e) {
      ctx.logger.error("Error while ToolController.update, stack: ", e);
      ctx.body = { success: false, message: "内部服务器错误" };
    }
  }

  async delete() {
    const { ctx, service } = this;
    const { id } = ctx.params;
    try {
      const existed = await service.tool.findOne({ where: { id } });
      if (!existed) {
        ctx.body = { success: false, message: "工具不存在" };
        return;
      }
      const deleted = await service.tool.destroy({ where: { id } });
      ctx.body = { success: true, message: "操作成功" };
    } catch (e) {
      ctx.logger.error("Error while ToolController.delete, stack: ", e);
      ctx.body = { success: false, message: "内部服务器错误" };
    }
  }
}

module.exports = ToolController;
