"use strict";

const Controller = require("egg").Controller;
const cheerio = require("cheerio");
const _ = require("lodash");

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
    try {
      const url = `https://tophub.today/c/${topic}`;
      let allNodes = [];
      try {
        const maxPage = Math.ceil(tpsMap[topic].count / 24);
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
      ctx.body = { success: true, message: "OK", data: allNodes };
    } catch (e) {
      ctx.body = { success: false, message: e.message };
    }
  }
}

module.exports = TophubController;
