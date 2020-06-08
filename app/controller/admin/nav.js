"use strict";

const Controller = require("egg").Controller;
const cheerio = require("cheerio");

class NavController extends Controller {
  async render() {
    const { ctx, service } = this;
    let categories = [];
    let navs = [];
    try {
      categories = await service.category.findAll();
      navs = await service.nav.findAll({
        order: [["updatedAt", "DESC"]],
      });
    } catch (e) {
      // ignore
    }
    await ctx.render("admin/nav.html", { categories, navs });
  }

  async detail() {
    const { ctx, service } = this;
    try {
      const { id } = ctx.params;
      const existed = await service.nav.findOne({ where: { id } });
      if (!existed) {
        ctx.body = { success: false, message: "网站不存在" };
        return;
      }
      ctx.body = { success: true, data: existed };
    } catch (e) {
      ctx.logger.error("Error while NavController.detail, stack: ", e);
      ctx.body = { success: false, message: "内部服务器错误" };
    }
  }

  async create() {
    const { ctx, service } = this;
    const { name, logo, url, sort, categoryId, desc } = ctx.request.body;
    try {
      const existed = await service.nav.findOne({ where: { name } });
      if (existed) {
        ctx.body = { success: false, message: "网站已存在" };
        return;
      }
      const created = await service.nav.create({ name, logo, url, sort, categoryId, desc });
      ctx.body = { success: true, message: "操作成功" };
    } catch (e) {
      ctx.logger.error("Error while NavController.create, stack: ", e);
      ctx.body = { success: false, message: "内部服务器错误" };
    }
  }

  async update() {
    const { ctx, service, app } = this;
    const { Op } = app.Sequelize;
    const { id } = ctx.params;
    const { name, logo, url, sort, categoryId, desc } = ctx.request.body;
    try {
      const idExisted = await service.nav.findOne({ where: { id: Number(id) } });
      if (!idExisted) {
        ctx.body = { success: false, message: "网站不存在" };
        return;
      }
      const nameExisted = await service.nav.findOne({
        where: {
          name,
          id: { [Op.ne]: id },
        },
      });
      if (nameExisted) {
        ctx.body = { success: false, message: "名称已存在" };
        return;
      }
      const updated = await service.nav.update({ name, logo, url, sort, categoryId, desc }, { where: { id } });
      ctx.body = { success: true, message: "操作成功" };
    } catch (e) {
      ctx.logger.error("Error while NavController.update, stack: ", e);
      ctx.body = { success: false, message: "内部服务器错误" };
    }
  }

  async delete() {
    const { ctx, service } = this;
    const { id } = ctx.params;
    try {
      const existed = await service.nav.findOne({ where: { id } });
      if (!existed) {
        ctx.body = { success: false, message: "网站不存在" };
        return;
      }
      const deleted = await service.nav.destroy({ where: { id } });
      ctx.body = { success: true, message: "操作成功" };
    } catch (e) {
      ctx.logger.error("Error while NavController.delete, stack: ", e);
      ctx.body = { success: false, message: "内部服务器错误" };
    }
  }

  async clicked() {
    const { ctx, service } = this;
    const { id } = ctx.request.body;
    try {
      const existed = await service.nav.findOne({ where: { id } });
      if (!existed) {
        ctx.body = { success: false, message: "网站不存在" };
        return;
      }
      const updated = await service.nav.update({ clicked: existed.clicked + 1 }, { where: { id } });
      ctx.body = { success: true, message: "操作成功" };
    } catch (e) {
      ctx.logger.error("Error while NavController.clicked, stack: ", e);
      ctx.body = { success: false, message: "内部服务器错误" };
    }
  }

  async detect() {
    const { ctx } = this;
    try {
      let { url = "" } = ctx.request.body;
      if (url.endsWith("/")) {
        url = url.slice(0, -1);
      }
      const res = await ctx.curl(url, { type: "GET", dataType: "text" });
      const $ = cheerio.load(res.data);
      const name = $("title").text() || "";
      const desc = $("meta[name='description']").text() || "";

      // ----- Parse Logo Url Start -----
      let logo = $("link[rel='shortcut icon']").attr("href");
      if (!logo) {
        logo = $("link[rel='icon']").attr("href");
      }
      if (logo && !logo.includes("http")) {
        logo = url + logo;
      }
      // ----- Parse Logo Url End -----

      ctx.body = {
        success: true,
        message: "操作成功",
        data: {
          name: name ? name.trim() : "",
          url,
          logo,
          desc: desc ? desc.trim() : "",
        },
      };
    } catch (e) {
      ctx.logger.error("Error while NavController.detect, stack: ", e);
      ctx.body = { success: false, message: "内部服务器错误" };
    }
  }
}

module.exports = NavController;
