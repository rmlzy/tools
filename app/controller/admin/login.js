"use strict";

const Controller = require("egg").Controller;
const svgCaptcha = require("svg-captcha");

class LoginController extends Controller {
  async render() {
    const { ctx } = this;
    const { code } = ctx.request.query;
    await ctx.render("admin/login.html", { code });
  }

  /**
   * 生成图片验证码
   * https://github.com/produck/svg-captcha
   */
  async generateImageCaptcha() {
    const { ctx } = this;
    try {
      const captcha = svgCaptcha.create({
        width: 70,
        height: 30,
        fontSize: 40,
      });
      ctx.session.captcha = captcha.text;
      ctx.body = { success: true, data: captcha.data };
    } catch (e) {
      ctx.logger.error("Error while LoginController.generateImageCaptcha, stack: ", e);
      ctx.body = { success: false, message: "内部服务器错误" };
    }
  }

  async login() {
    const { ctx, service, config } = this;
    const { code, email, password, captcha } = ctx.request.body;
    if (config.keys !== code) {
      ctx.body = { success: false, message: "账号或密码错误" };
      return;
    }
    if (captcha.toLowerCase() !== ctx.session.captcha.toLowerCase()) {
      ctx.body = { success: false, message: "图片验证码错误" };
      return;
    }
    try {
      const isRightPwd = await service.user.verifyPassword(email, password);
      if (!isRightPwd) {
        ctx.body = { success: false, message: "账号或密码错误" };
        return;
      }
      const token = await service.user.generateToken(email, password);
      ctx.cookies.set("tk", token);
      ctx.body = { success: true, message: "登录成功" };
    } catch (e) {
      ctx.logger.error("Error while LoginController.login, stack: ", e);
      ctx.body = { success: false, message: "内部服务器错误" };
    }
  }

  async logout() {
    const { ctx } = this;
    ctx.body = { success: false, message: "操作成功" };
  }
}

module.exports = LoginController;
