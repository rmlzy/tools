"use strict";

const Controller = require("egg").Controller;

class LoginController extends Controller {
  async render() {
    const { ctx } = this;
    await ctx.render("admin/login.html");
  }
}

module.exports = LoginController;
