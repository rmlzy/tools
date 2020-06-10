"use strict";

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller } = app;

  router.get("/", controller.home.render);

  // Demand
  router.get("/i-need-this.html", controller.demand.render);
  router.post("/api/demand", controller.demand.create);

  // 导航
  router.get("/nav.html", controller.nav.render);

  // PNG to JPG
  router.get("/tool/png2jpg.html", controller.png2Jpg.render);
  router.get("/api/png2jpg/downloadAll", controller.png2Jpg.downloadAll);
  router.post("/api/png2jpg/convert", controller.png2Jpg.convert);

  // HTTP Code
  router.get("/tool/http-code.html", controller.httpCode.render);

  // 历史上的今天
  router.get("/tool/toh.html", controller.toh.render);

  // MD5
  router.get("/tool/md5.html", controller.md5.render);
  router.post("/api/md5/encrypt", controller.md5.encrypt);

  // Base64
  router.get("/tool/base64.html", controller.base64.render);

  // Aes Des
  router.get("/tool/aesdes.html", controller.aesdes.render);

  // Markdown转HTML
  router.get("/tool/md2html.html", controller.md2html.render);

  // 摩斯密码加密解密
  router.get("/tool/morse.html", controller.morse.render);

  // Admin
  router.get("/admin/login.html", controller.admin.login.render);
  router.get("/admin/home.html", controller.admin.home.render);
  router.get("/admin/demand.html", controller.admin.demand.render);
  router.get("/admin/category.html", controller.admin.category.render);
  router.get("/admin/nav.html", controller.admin.nav.render);
  router.get("/admin/tool.html", controller.admin.tool.render);
  // Admin API
  router.get("/api/generateImageCaptcha", controller.admin.login.generateImageCaptcha);
  router.post("/api/login", controller.admin.login.login);
  // Category
  router.get("/api/category/:id", controller.admin.category.detail);
  router.post("/api/category", controller.admin.category.create);
  router.put("/api/category/:id", controller.admin.category.update);
  router.delete("/api/category/:id", controller.admin.category.delete);
  // Nav
  router.get("/api/nav/:id", controller.admin.nav.detail);
  router.post("/api/nav", controller.admin.nav.create);
  router.put("/api/nav/:id", controller.admin.nav.update);
  router.delete("/api/nav/:id", controller.admin.nav.delete);
  router.post("/api/nav/clicked", controller.admin.nav.clicked);
  router.post("/api/nav/detect", controller.admin.nav.detect);
  // Tool
  router.get("/api/tool/:id", controller.admin.tool.detail);
  router.post("/api/tool", controller.admin.tool.create);
  router.put("/api/tool/:id", controller.admin.tool.update);
  router.delete("/api/tool/:id", controller.admin.tool.delete);
};
