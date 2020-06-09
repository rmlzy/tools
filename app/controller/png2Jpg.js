"use strict";

const Controller = require("egg").Controller;
const { v4: uuidv4 } = require("uuid");
const Jimp = require("jimp");
const path = require("path");
const fs = require("fs-extra");
const compressing = require("compressing");

class Png2JpgController extends Controller {
  async render() {
    const { ctx, service } = this;
    const { id } = ctx.request.query;
    const uuid = uuidv4();
    await service.dict.addTotalPV();
    await ctx.render("png2jpg.html", {
      id,
      pageTitle: "PNG 转 JPG",
      key: uuid,
    });
  }

  async _fire(file, outputDir) {
    return new Promise((resolve, reject) => {
      let outputJpgPath = `${outputDir}/${file.filename}`;
      outputJpgPath = outputJpgPath.replace(".png", ".jpg");
      Jimp.read(file.filepath, function (err, image) {
        if (err) {
          reject(err);
          return;
        }
        image.write(outputJpgPath);
        resolve(outputJpgPath);
      });
    });
  }

  async convert() {
    const { ctx, app, service } = this;
    const { files } = ctx.request;
    const { key, id } = ctx.request.headers;
    if (files.length === 0) {
      ctx.body = { success: false, data: "未检测到附件" };
      return;
    }
    const outputDir = path.join(app.baseDir, `app/public/temp/${key}`);
    try {
      await fs.ensureDir(outputDir);
      for (let i = 0; i < files.length; i++) {
        await this._fire(files[i], outputDir);
        await service.tool.addUsed(id);
      }
      ctx.body = { success: true, data: "SUCCESS" };
    } catch (e) {
      ctx.logger.error("Error while Png2JpgController.convert, stack: ", e);
      ctx.body = { success: false, message: "内部服务器错误" };
    }
  }

  async downloadAll() {
    const { ctx, app } = this;
    const { key } = ctx.request.query;
    const outputDir = path.join(app.baseDir, `app/public/temp/${key}`);
    const zipPath = `${outputDir}.zip`;
    try {
      // 1. 移除旧的zip
      await fs.remove(zipPath);
      // 2. 生成新的zip
      await compressing.zip.compressDir(outputDir, zipPath);
      ctx.body = { success: true, data: `/public/temp/${key}.zip` };
    } catch (e) {
      ctx.logger.error("Error while Png2JpgController.downloadAll, stack: ", e);
      ctx.body = { success: false, message: "内部服务器错误" };
    }
  }
}

module.exports = Png2JpgController;
