"use strict";

const Controller = require("egg").Controller;
const path = require("path");
const fs = require("fs-extra");
const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");
const { v4: uuidv4 } = require("uuid");
const compressing = require("compressing");

class MinImageController extends Controller {
  async render() {
    const { ctx, service } = this;
    const uuid = uuidv4();
    await ctx.render("min-image.html", {
      folder: uuid,
    });
  }

  getFilesizeInBytes(filename) {
    var stats = fs.statSync(filename);
    var fileSizeInBytes = stats["size"];
    return fileSizeInBytes;
  }

  async upload() {
    const { ctx, app } = this;
    const { files } = ctx.request;
    if (files.length === 0) {
      ctx.body = { success: false, message: "未检测到附件" };
      return;
    }
    const { folder } = ctx.request.query;
    const destPath = path.join(app.baseDir, `app/public/min-image/${folder}`);
    await fs.ensureDir(destPath);

    // 压缩图片
    const file = files[0];
    const fileName = file.filepath.replace(/^.*[\\\/]/, "");
    try {
      const minedFile = await imagemin([file.filepath], {
        destination: destPath,
        plugins: [
          imageminJpegtran(),
          imageminPngquant({
            quality: [0.6, 0.8],
          }),
        ],
      });
      const url = `/public/min-image/${folder}/${fileName}`;
      const size = this.getFilesizeInBytes(path.join(destPath, fileName));
      ctx.body = {
        success: true,
        message: "OK",
        data: { name: fileName, size: size, url: url },
      };
    } catch (e) {
      ctx.logger.error("Error while MinImageController.upload, stack: ", e);
      ctx.body = { success: false, message: "内部服务器错误" };
    }
  }

  async downloadZip() {
    const { ctx, app } = this;
    const { folder } = ctx.request.query;
    if (!folder) {
      ctx.body = { success: false, message: "未检测到压缩包" };
      return;
    }
    const publicPath = `/public/min-image/${folder}.zip`;
    const zipPath = path.join(app.baseDir, `app/public/min-image/${folder}`);
    const destPath = path.join(app.baseDir, `app/public/min-image/${folder}.zip`);
    try {
      await compressing.zip.compressDir(zipPath, destPath);
      ctx.body = { success: true, message: "OK", data: publicPath };
    } catch (e) {
      ctx.logger.error("Error while MinImageController.downloadZip, stack: ", e);
      ctx.body = { success: false, message: "内部服务器错误" };
    }
  }
}

module.exports = MinImageController;
