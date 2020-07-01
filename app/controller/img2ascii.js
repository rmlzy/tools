"use strict";

const Controller = require("egg").Controller;
const imageToAscii = require("image-to-ascii");

class Img2AsciiController extends Controller {
  async render() {
    const { ctx } = this;
    await ctx.render("img2ascii.html");
  }

  async _convert(imgPath) {
    return new Promise((resolve, reject) => {
      const options = {
        colored: false,
        pxWidth: 1,
        size: {
          width: "100%",
        },
        size_options: {
          screen_size: {
            width: 30,
            height: 30,
          },
        },
      };
      imageToAscii(imgPath, options, (err, converted) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(converted);
      });
    });
  }

  async upload() {
    const { ctx, service } = this;
    const { files } = ctx.request;
    if (files.length === 0) {
      ctx.body = { success: false, message: "未检测到附件" };
      return;
    }
    try {
      const file = files[0];
      const res = await this._convert(file.filepath);
      ctx.runInBackground(async () => {
        await service.tool.addUsed("img2ascii");
      });
      console.log(res);
      ctx.body = { success: true, message: "OK", data: res };
    } catch (e) {
      ctx.logger.error("Error while Img2AsciiController.upload, stack: ", e);
      ctx.body = { success: false, message: "内部服务器错误" };
    }
  }
}

module.exports = Img2AsciiController;
