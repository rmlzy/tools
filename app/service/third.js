const Service = require("egg").Service;
const dayjs = require("dayjs");
const cheerio = require("cheerio");
const fs = require("fs-extra");
const path = require("path");

class ThirdService extends Service {
  async todayOfHistory() {
    const { ctx, config } = this;
    const month = dayjs().format("M");
    const day = dayjs().format("D");
    try {
      const resText = await ctx.curl("http://api.juheapi.com/japi/toh", {
        method: "GET",
        data: {
          key: config.juheKey,
          v: "1.0",
          month,
          day,
        },
        dataType: "text",
      });
      const res = JSON.parse(resText.data);
      if (res.error_code === 0) {
        return {
          success: true,
          data: res.result,
        };
      } else {
        return {
          success: false,
          message: "获取历史上的今天失败",
        };
      }
    } catch (e) {
      return {
        success: false,
        message: "获取历史上的今天失败",
      };
    }
  }

  async _readCached() {
    const { app } = this;
    const outputDir = path.join(app.baseDir, `app/public/cached`);
    let json;
    try {
      await fs.ensureDir(outputDir);
      json = await fs.readJson(`${outputDir}/mlqk.json`);
    } catch (e) {
      // ignore
    }
    return json;
  }

  async _setCached(content) {
    const { app } = this;
    const outputDir = path.join(app.baseDir, `app/public/cached`);
    const now = +new Date();
    try {
      await fs.ensureDir(outputDir);
      await fs.writeJson(`${outputDir}/mlqk.json`, content);
    } catch (e) {
      // ignore
    }
    return now;
  }

  /**
   * 抓取码力全开设计资源
   * @returns {Promise<*>}
   */
  async fetchMlqk() {
    const { ctx } = this;
    // 优先使用缓存
    const cached = await this._readCached();
    if (cached) {
      return cached;
    }

    // 抓取数据
    const url = "https://design.maliquankai.com/";
    const res = await ctx.curl(url, {
      type: "GET",
      dataType: "text",
    });
    const $ = cheerio.load(res.data);
    const blocks = [];
    $("section.scroll-floor").each(function () {
      const title = $(this).find(".case-index-title h2").clone().children().remove().end().text();
      const subTitle = $(this).find(".case-index-title h2 span").text();
      const links = [];
      $(this)
        .find(".case-mlqk-item a")
        .each(function () {
          const href = $(this).attr("href");
          const img = $(this).find("img.case-pad").attr("data-src");
          const title = $(this).find(".case-info-title").text();
          const slogan = $(this).find(".case-info-logo").text();
          const desc = $(this).find(".case-info-text").text();
          links.push({
            href,
            img: `https://design.maliquankai.com/${img}`,
            title,
            slogan,
            desc,
          });
        });
      blocks.push({ title, subTitle, links });
    });

    // 存入缓存
    await this._setCached(blocks);
  }
}

module.exports = ThirdService;
