"use strict";

const Controller = require("egg").Controller;

class CategoryController extends Controller {
  async render() {
    const { ctx, service } = this;
    let categories = [];
    try {
      categories = await service.category.findAll();
    } catch (e) {
      // ignore
    }
    await ctx.render("admin/category.html", {
      categories,
    });
  }

  async detail() {
    const { ctx, service } = this;
    try {
      const { id } = ctx.params;
      const existed = await service.category.findOne({ where: { id } });
      if (!existed) {
        ctx.body = { success: false, message: "分类不存在" };
        return;
      }
      ctx.body = { success: true, data: existed };
    } catch (e) {
      ctx.logger.error("Error while CategoryController.detail, stack: ", e);
      ctx.body = { success: false, message: "内部服务器错误" };
    }
  }

  async create() {
    const { ctx, service } = this;
    const { name, desc } = ctx.request.body;
    try {
      const existed = await service.category.findOne({ where: { name } });
      if (existed) {
        ctx.body = { success: false, message: "分类已存在" };
        return;
      }
      const created = await service.category.create({ name, desc });
      ctx.body = { success: true, message: "操作成功" };
    } catch (e) {
      ctx.logger.error("Error while CategoryController.create, stack: ", e);
      ctx.body = { success: false, message: "内部服务器错误" };
    }
  }

  async update() {
    const { ctx, service, app } = this;
    const { Op } = app.Sequelize;
    const { id } = ctx.params;
    const { name, desc } = ctx.request.body;
    try {
      const idExisted = await service.category.findOne({ where: { id: Number(id) } });
      if (!idExisted) {
        ctx.body = { success: false, message: "分类不存在" };
        return;
      }
      const nameExisted = await service.category.findOne({
        where: {
          name,
          id: { [Op.ne]: id },
        },
      });
      if (nameExisted) {
        ctx.body = { success: false, message: "名称已存在" };
        return;
      }
      const updated = await service.category.update({ name, desc }, { where: { id } });
      ctx.body = { success: true, message: "操作成功" };
    } catch (e) {
      ctx.logger.error("Error while CategoryController.update, stack: ", e);
      ctx.body = { success: false, message: "内部服务器错误" };
    }
  }

  async delete() {
    const { ctx, service } = this;
    const { id } = ctx.params;
    try {
      const existed = await service.category.findOne({ where: { id } });
      if (!existed) {
        ctx.body = { success: false, message: "分类不存在" };
        return;
      }
      const deleted = await service.category.destroy({ where: { id } });
      ctx.body = { success: true, message: "操作成功" };
    } catch (e) {
      ctx.logger.error("Error while CategoryController.delete, stack: ", e);
      ctx.body = { success: false, message: "内部服务器错误" };
    }
  }
}

module.exports = CategoryController;
