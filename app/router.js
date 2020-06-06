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
  router.get("/png2jpg.html", controller.png2Jpg.render);
  router.get("/api/png2jpg/downloadAll", controller.png2Jpg.downloadAll);
  router.post("/api/png2jpg/convert", controller.png2Jpg.convert);

  // HTTP Code
  router.get("/http-code.html", controller.httpCode.render);

  // MD5
  router.get("/md5.html", controller.md5.render);
  router.post("/api/md5/encrypt", controller.md5.encrypt);

  // Admin
  router.get("/admin/login.html", controller.admin.login.render);
  router.get("/admin/home.html", controller.admin.home.render);
  router.get("/admin/demand.html", controller.admin.demand.render);
  router.get("/admin/category.html", controller.admin.category.render);
  router.get("/admin/nav.html", controller.admin.nav.render);
  router.get("/admin/tool.html", controller.admin.tool.render);
};
