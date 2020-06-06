"use strict";

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller } = app;

  router.get("/", controller.home.render);

  // PNG to JPG
  router.get("/png2jpg.html", controller.png2Jpg.render);
  router.get("/api/png2jpg/downloadAll", controller.png2Jpg.downloadAll);
  router.post("/api/png2jpg/convert", controller.png2Jpg.convert);

  // HTTP Code
  router.get("/http-code.html", controller.httpCode.render);

  // MD5
  router.get("/md5.html", controller.md5.render);
  router.post("/api/md5/encrypt", controller.md5.encrypt);
};
