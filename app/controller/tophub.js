"use strict";

const Controller = require("egg").Controller;
const cheerio = require("cheerio");
const _ = require("lodash");
const fs = require("fs-extra");
const path = require("path");

const topics = [
  {
    name: "科技",
    key: "tech",
  },
  {
    name: "综合",
    key: "news",
  },
  {
    name: "娱乐",
    key: "ent",
  },
  {
    name: "社区",
    key: "community",
  },
  {
    name: "购物",
    key: "shopping",
  },
  {
    name: "财经",
    key: "finance",
  },
];

class TophubController extends Controller {
  async _fetchTopics() {
    const { ctx } = this;
    const tps = _.cloneDeep(topics);
    for (let i = 0; i < tps.length; i++) {
      try {
        const res = await ctx.curl(`https://tophub.today/c/${tps[i].key}`, { type: "GET", dataType: "text" });
        const $ = cheerio.load(res.data);
        const count = Number($(".bc-tc-tb small").text().replace("个", ""));
        tps[i].count = isNaN(count) ? 0 : count;
      } catch (e) {
        // ignore
      }
    }
    return tps;
  }

  async _fetchPageNodes(url) {
    const { ctx } = this;
    const nodes = [];
    try {
      const res = await ctx.curl(url, { type: "GET", dataType: "text" });
      const $ = cheerio.load(res.data);
      $(".bc-cc .cc-cd").each(function (i, div) {
        const id = $(this).attr("id");
        if (id) {
          const name = $(this).find(".cc-cd-lb").text();
          const desc = $(this).find(".cc-cd-sb-st").text();
          const logo = $(this).find(".cc-cd-lb img").attr("src");
          let articles = [];
          $(this)
            .find(".cc-cd-cb-l a")
            .each(function (j, a) {
              articles.push({
                title: $(this).find(".t").text(),
                url: $(this).attr("href"),
              });
            });
          nodes.push({
            name: name.trim(),
            logo,
            desc,
            articles,
          });
        }
      });
    } catch (e) {
      // ignore
    }
    return nodes;
  }

  async _fetchNodes(topic, maxPage) {
    let allNodes = [];
    try {
      const url = `https://tophub.today/c/${topic}`;
      const promises = [];
      for (let i = 1; i <= maxPage; i++) {
        promises.push(this._fetchPageNodes(`${url}?p=${i}`));
      }
      const res = await Promise.all(promises);
      res.forEach((item) => {
        allNodes = [...allNodes, ...item];
      });
    } catch (e) {
      // ignore
    }
    await this._setCached(topic, allNodes);
    return allNodes;
  }

  async _readCached(topic) {
    const { app } = this;
    const outputDir = path.join(app.baseDir, `app/public/tophub`);
    let json = {};
    try {
      await fs.ensureDir(outputDir);
      json = await fs.readJson(`${outputDir}/${topic}.json`);
    } catch (e) {
      // ignore
    }
    return json;
  }

  async _setCached(topic, content) {
    const { app } = this;
    const outputDir = path.join(app.baseDir, `app/public/tophub`);
    const now = +new Date();
    const expire = 2 * 60 * 60 * 1000; // 2 hour
    try {
      await fs.ensureDir(outputDir);
      const wrapper = {
        expireAt: now + expire,
        content,
      };
      await fs.writeJson(`${outputDir}/${topic}.json`, wrapper);
    } catch (e) {
      // ignore
    }
    return now;
  }

  async _ifCachedAvailable(topic) {
    const cached = await this._readCached(topic);
    const now = +new Date();
    if (now < cached.expireAt) {
      return cached.content;
    } else {
      return null;
    }
  }

  arr2Map(arr) {
    let map = {};
    arr.forEach((item) => {
      map[item.key] = item;
    });
    return map;
  }

  /**
   * 获取所有的分类
   * @returns {Promise<void>}
   */
  async topics() {
    const { ctx } = this;
    const tps = await this._fetchTopics();
    ctx.body = { success: true, message: "OK", data: tps };
  }

  /**
   * 获取某个分类下所有的文章
   * @returns {Promise<void>}
   */
  async nodes() {
    const { ctx } = this;
    const { topic } = ctx.request.query;
    const tps = await this._fetchTopics();
    const tpsMap = this.arr2Map(tps);
    if (!tpsMap[topic]) {
      ctx.body = { success: false, message: "topic 不存在" };
      return;
    }

    // 优先使用换成
    const useCache = await this._ifCachedAvailable(topic);
    if (useCache) {
      ctx.body = { success: true, message: "OK", data: useCache, stack: "From Local Cache" };
      return;
    }

    try {
      const maxPage = Math.ceil(tpsMap[topic].count / 24);
      const allNodes = await this._fetchNodes(topic, maxPage);
      ctx.body = { success: true, message: "OK", data: allNodes };
    } catch (e) {
      ctx.body = { success: false, message: e.message };
    }
  }

  async render() {
    const { ctx, service } = this;
    const tps = await this._fetchTopics();
    const tpsMap = this.arr2Map(tps);
    const maxPage = Math.ceil(tpsMap["tech"].count / 24);
    const nodes = await this._fetchNodes("tech", maxPage);
    ctx.runInBackground(async () => {
      await service.dict.addTotalPV();
    });
    await ctx.render("tophub.html", { nodes });
  }
}

module.exports = TophubController;
