"use strict";

const Controller = require("egg").Controller;
const fs = require("fs-extra");
const path = require("path");
const contentDisposition = require("content-disposition");
const iconv = require("iconv-lite");
iconv.skipDecodeWarning = true;

class BackgroundController extends Controller {
  async _sleep(time) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  }

  async _fetchAll() {
    const { ctx, app } = this;
    const outputDir = path.join(app.baseDir, `app/public/bg`);
    const max = 1200;
    for (let i = 1; i <= max; i++) {
      const url = "https://www.hituyu.com/item/download/" + i;
      console.log(`FETCH ${url} START`);
      try {
        const res = await ctx.curl(url);
        const cd = res.headers["content-disposition"];
        let filename = cd.split("=")[1];
        filename = iconv.decode(filename, "utf-8");
        await fs.writeFile(path.join(outputDir, filename), res.data, "binary");
        await this._sleep(200);
        console.log(`FETCH ${url} SUCCESS`);
      } catch (e) {
        console.log(e);
        console.log(`FETCH ${url} FAIL`);
      }
    }
  }

  async render() {
    const { ctx, app, service } = this;
    const dir = path.join(app.baseDir, `app/public/bg`);
    let names = [];
    try {
      names = await fs.readdir(dir);
    } catch (e) {
      // ignore
    }
    ctx.runInBackground(async () => {
      await service.dict.addTotalPV();
      await service.tool.addUsed("bg");
    });
    await ctx.render("bg.html", { names });
  }
}

module.exports = BackgroundController;
