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
};
