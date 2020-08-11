"use strict";

const Controller = require("egg").Controller;
const cheerio = require("cheerio");

class EbookController extends Controller {
  async render() {
    const { ctx } = this;
    const githubRepos = [
      {
        name: "CS-Book",
        url: "https://github.com/iamshuaidi/CS-Book",
        desc:
          "计算机类常用电子书整理，并且附带下载链接，包括Java，Python，Linux，Go，C，C++，数据结构与算法，人工智能，计算机基础，面试，设计模式，数据库，前端等书籍",
      },
      {
        name: "awesome-books",
        url: "https://github.com/biaochenxuying/awesome-books",
        desc:
          "160+ 本技术类精华电子书开源了，免费下载，包括 前端、后端、数据结构与算法、计算机基础、设计模式、数据库等书籍",
      },
      {
        name: "hello-algorithm",
        url: "https://github.com/geekxh/hello-algorithm",
        desc:
          "🙈🙉🙊 本项目包括：1、我写的三十万字图解算法题典 2、100 张 IT 相关超清思维导图 3、100 篇大厂面经汇总 4、各语言编程电子书 100 本 5、English version supported !!! 🚀🚀 国人项目上榜首不易，右上角助力一波！干就对了，奥利给 ！🚀🚀",
      },
      {
        name: "flutter-in-action",
        url: "https://github.com/flutterchina/flutter-in-action",
        desc: "《Flutter实战》电子书",
      },
      {
        name: "dive-into-webpack",
        url: "https://github.com/gwuhaolin/dive-into-webpack",
        desc: "全面的Webpack教程《深入浅出Webpack》电子书",
      },
      {
        name: "awesome-go-cn",
        url: "https://github.com/jobbole/awesome-go-cn",
        desc:
          "Go 资源大全中文版， 内容包括：Web框架、模板引擎、表单、身份认证、数据库、ORM框架、图片处理、文本处理、自然语言处理、机器学习、日志、代码分析、教程和（电子）书等。",
      },
      {
        name: "it-ebooks-cn",
        url: "https://github.com/fuhmmin/it-ebooks-cn",
        desc: "计算机电子书pdf整理",
      },
      {
        name: "netkiller.github.io",
        url: "https://github.com/netkiller/netkiller.github.io",
        desc: "Netkiller Free ebook - 免费电子书",
      },
      {
        name: "iBook",
        url: "https://github.com/fancy88/iBook",
        desc: "收藏一些电子书",
      },
      {
        name: "Coding-Now",
        url: "https://github.com/josonle/Coding-Now",
        desc:
          "学习记录的一些笔记，以及所看得一些电子书eBooks、视频资源和平常收纳的一些自己认为比较好的博客、网站、工具。涉及大数据几大组件、Python机器学习和数据分析、Linux、操作系统、算法、网络等",
      },
      {
        name: "blog",
        url: "https://github.com/it-ebooks/blog",
        desc: "📚 计算机开放电子书归档",
      },
      {
        name: "awesome-books",
        url: "https://github.com/biaochenxuying/awesome-books",
        desc:
          "160+ 本技术类精华电子书开源了，免费下载，包括 前端、后端、数据结构与算法、计算机基础、设计模式、数据库等书籍",
      },
      {
        name: "archive",
        url: "https://github.com/cjql/archive",
        desc: "计算机、文史、财经等的电子书、网址收藏。",
      },
    ];
    const sources = [
      {
        name: "淘链客",
        type: "toplinks_cc",
        url: "http://www.toplinks.cc",
        desc: "",
      },
      {
        name: "云海电子图书馆",
        type: "pdfbook_cn",
        url: "http://www.pdfbook.cn",
        desc: "",
      },
      {
        name: "图灵社区",
        type: "ituring_com_cn",
        url: "https://www.ituring.com.cn",
        desc: "",
      },
      {
        name: "书伴",
        type: "bookfere_com",
        url: "https://bookfere.com",
        desc: "",
      },
      {
        name: "书格",
        type: "shuge_org",
        url: "https://new.shuge.org",
        desc: "",
      },
      {
        name: "胖虎书屋",
        type: "panghubook_cn",
        url: "http://panghubook.cn/",
        desc: "",
      },
      {
        name: "IT熊猫",
        type: "itpanda_net",
        url: "https://itpanda.net",
        desc: "",
      },
    ];
    const sourceTypes = sources.map((item) => item.type);
    await ctx.render("ebook.html", { githubRepos, sources, sourceTypes: sourceTypes.join(",") });
  }

  async search() {
    const { ctx } = this;
    const { keyword } = ctx.query;
    const { site } = ctx.params;
    let rows = [];
    try {
      if (site === "toplinks_cc") {
        rows = await this.toplinks_cc(keyword);
      }
      if (site === "pdfbook_cn") {
        rows = await this.pdfbook_cn(keyword);
      }
      if (site === "ituring_com_cn") {
        rows = await this.ituring_com_cn(keyword);
      }
      if (site === "itpanda_net") {
        rows = await this.itpanda_net(keyword);
      }
      if (site === "bookfere_com") {
        rows = await this.bookfere_com(keyword);
      }
      if (site === "shuge_org") {
        rows = await this.shuge_org(keyword);
      }
      if (site === "panghubook_cn") {
        rows = await this.panghubook_cn(keyword);
      }
    } catch (e) {
      // ignore
    }
    ctx.body = {
      success: true,
      message: "SUCCESS",
      data: rows,
      site,
    };
  }

  async toplinks_cc(keyword) {
    const { ctx } = this;
    const res = await ctx.curl(`http://www.toplinks.cc/s/?keyword=${keyword}`, { type: "GET", dataType: "text" });
    const $ = cheerio.load(res.data);
    const rows = [];
    $(".col-lg-12 table tr").each(function () {
      const title = $(this).find("a").text();
      const url = $(this).find("a").attr("href");
      if (url) {
        rows.push({ title, url: `http://www.toplinks.cc${url}` });
      }
    });
    return rows;
  }

  async pdfbook_cn(keyword) {
    const { ctx } = this;
    const res = await ctx.curl(`http://www.pdfbook.cn/?s=${keyword}`, { type: "GET", dataType: "text" });
    const $ = cheerio.load(res.data);
    const rows = [];
    $("ul.image_box li").each(function () {
      const title = $(this).find("a").attr("title");
      const url = $(this).find("a").attr("href");
      rows.push({ title, url });
    });
    return rows;
  }

  async ituring_com_cn(keyword) {
    const { ctx } = this;
    const res = await ctx.curl(`https://www.ituring.com.cn/search?q=${keyword}`, { type: "GET", dataType: "text" });
    const $ = cheerio.load(res.data);
    const rows = [];
    $("#search-result-books ul.block-items li.block-item").each(function () {
      const title = $(this).find("h4 a").attr("title");
      const url = $(this).find("h4 a").attr("href");
      rows.push({ title, url: `https://www.ituring.com.cn${url}` });
    });
    return rows;
  }

  async itpanda_net(keyword) {
    const { ctx } = this;
    const res = await ctx.curl(`https://itpanda.net/book/search?query=${keyword}`, { type: "GET", dataType: "text" });
    const $ = cheerio.load(res.data);
    const rows = [];
    $("ul.list-unstyled li.media").each(function () {
      const title = $(this).find("h5 a").text();
      const url = $(this).find("h5 a").attr("href");
      rows.push({ title, url: `https://itpanda.net${url}` });
    });
    return rows;
  }

  async bookfere_com(keyword) {
    const { ctx } = this;
    const res = await ctx.curl(`https://bookfere.com/?s=${keyword}`, { type: "GET", dataType: "text" });
    const $ = cheerio.load(res.data);
    const rows = [];
    $("#main article").each(function () {
      const title = $(this).find(".entry-header h1 a").text();
      const url = $(this).find(".entry-header h1 a").attr("href");
      rows.push({ title, url });
    });
    return rows;
  }

  async shuge_org(keyword) {
    const { ctx } = this;
    const res = await ctx.curl(`https://new.shuge.org/?s=${keyword}`, { type: "GET", dataType: "text" });
    const $ = cheerio.load(res.data);
    const rows = [];
    $(".grid-sort-container article").each(function () {
      const title = $(this).find(".entry-content-header h2 a").text();
      const url = $(this).find(".entry-content-header h2 a").attr("href");
      rows.push({ title, url });
    });
    return rows;
  }

  async panghubook_cn(keyword) {
    const { ctx } = this;
    const res = await ctx.curl(`http://panghubook.cn/api/books/?key=${keyword}`, { type: "GET", dataType: "json" });
    let rows = [];
    if (res.data.code === 0) {
      rows = res.data.data.results.map((item) => ({
        title: item.title,
        url: `http://panghubook.cn/book/${item.id}`,
      }));
    }
    return rows;
  }
}

module.exports = EbookController;
