"use strict";

const Controller = require("egg").Controller;
const fs = require("fs-extra");

class OcrController extends Controller {
  async render() {
    const { ctx } = this;
    const bdOcrUsed = (await ctx.service.dict.get("bdOcrUsed")) || 0;
    await ctx.render("ocr.html", { freeNum: 500 - bdOcrUsed });
  }

  getBase64(imgPath) {
    const bitmap = fs.readFileSync(imgPath);
    return new Buffer(bitmap).toString("base64");
  }

  async _getBdAccessToken() {
    const { ctx, config } = this;
    const { appKey, appSecret } = config.bdOCR;
    let token = "";
    const url = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${appKey}&client_secret=${appSecret}`;
    try {
      const res = await ctx.curl(url, {
        method: "POST",
        dataType: "json",
      });
      if (res.data.access_token) {
        token = res.data.access_token;
      }
    } catch (e) {
      ctx.logger.error("Error while OcrController._getBdAccessToken, stack: ", e);
    }
    return token;
  }

  async upload() {
    const { ctx, app, service } = this;
    const { files } = ctx.request;
    const bdOcrUsed = (await ctx.service.dict.get("bdOcrUsed")) || 0;
    if (Number(bdOcrUsed) >= 500) {
      ctx.body = { success: false, message: "抱歉, 今日的免费次数已用完" };
      return;
    }
    if (files.length === 0) {
      ctx.body = { success: false, message: "未检测到附件" };
      return;
    }
    const file = files[0];
    const ext = ctx.helper.getFileExt(file.filename);
    if (!["jpg", "jpeg", "png"].includes(ext)) {
      ctx.body = { success: false, message: "仅支持.jpg, .jpeg, .png后缀的图片文件" };
      return;
    }
    const base64 = this.getBase64(file.filepath);
    const token = await this._getBdAccessToken();
    if (!token) {
      ctx.logger.error("Error while OcrController.upload, stack: ", e);
      ctx.body = { success: false, message: "获取百度AccessToken失败" };
      return;
    }
    try {
      const url = `https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token=${token}`;
      const res = await ctx.curl(url, {
        method: "POST",
        data: {
          image: encodeURI(base64),
        },
        dataType: "json",
      });
      let words = res.data.words_result;
      words = words.map((item) => item.words);
      words = words.join("\n");
      ctx.runInBackground(async () => {
        await service.tool.addUsed("min-image");
        await service.dict.set("bdOcrUsed", Number(bdOcrUsed) + 1);
      });
      ctx.body = { success: true, message: "OK", data: { words, base64 } };
    } catch (e) {
      ctx.logger.error("Error while OcrController.upload, stack: ", e);
      ctx.body = { success: false, message: "内部服务器错误" };
    }
  }
}

module.exports = OcrController;
