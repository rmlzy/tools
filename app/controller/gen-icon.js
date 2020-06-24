"use strict";

const Controller = require("egg").Controller;
const fs = require("fs-extra");
const path = require("path");
// const favicons = require("favicons");
const { v4: uuidv4 } = require("uuid");

class GenLogoController extends Controller {
  async render() {
    const { ctx, service } = this;
    await ctx.render("gen-icon.html");
  }

  // async _genZip(sourcePath, options) {
  //   const { app } = this;
  //   const zipName = uuidv4();
  //   const source = path.join(app.baseDir, sourcePath);
  //   const outputDir = path.join(app.baseDir, `app/public/gen-logo/${zipName}`);
  //   return new Promise((resolve, reject) => {
  //     favicons(source, options, async (err, res) => {
  //       if (err) {
  //         reject(err);
  //         return;
  //       }
  //       let writeErr;
  //       for (let i = 0; i < res.images.length; i++) {
  //         const img = res.images[i];
  //         try {
  //           await fs.writeFile(path.join(outputDir, img.name), img.contents, "binary");
  //         } catch (e) {
  //           writeErr = e;
  //         }
  //       }
  //       if (writeErr) {
  //         reject(writeErr);
  //         return;
  //       }
  //       resolve(`/public/gen-logo/${zipName}.zip`);
  //     });
  //   });
  // }
  //
  // async download() {
  //   const { ctx } = this;
  //   try {
  //     // https://github.com/itgalaxy/favicons
  //     const opt = {
  //       icons: {
  //         android: false,
  //         appleIcon: true,
  //         appleStartup: false,
  //         coast: false,
  //         favicons: false,
  //         firefox: false,
  //         windows: false,
  //         yandex: false,
  //       },
  //     };
  //     const zip = await this._genZip("/app/public/demo.jpg", opt);
  //     ctx.body = { success: true, message: "OK", data: zip };
  //   } catch (e) {
  //     ctx.body = { success: false, message: e.message };
  //   }
  // }
}

module.exports = GenLogoController;
