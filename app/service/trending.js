const Service = require("egg").Service;
const cheerio = require("cheerio");
const dayjs = require("dayjs");

const GITHUB_URL = "https://github.com";
const langs = [
  {
    "urlParam": "",
    "name": "All Language"
  },
  {
    "urlParam": "html",
    "name": "HTML"
  },
  {
    "urlParam": "shell",
    "name": "Shell"
  },
  {
    "urlParam": "css",
    "name": "CSS"
  },
  {
    "urlParam": "typescript",
    "name": "TypeScript"
  },
  {
    "urlParam": "python",
    "name": "Python"
  },
  {
    "urlParam": "ruby",
    "name": "Ruby"
  },
  {
    "urlParam": "java",
    "name": "Java"
  },
  {
    "urlParam": "javascript",
    "name": "JavaScript"
  },
]
const sinces = ["daily", "weekly", "monthly"];

class TrendingService extends Service {
  async findAll(condition) {
    const { ctx } = this;
    return ctx.model.Trending.findAll(condition);
  }

  async findOne(condition) {
    const { ctx } = this;
    return ctx.model.Trending.findOne(condition);
  }

  async create(row, condition) {
    const { ctx } = this;
    return ctx.model.Trending.create(row, condition);
  }

  async update(row, condition) {
    const { ctx } = this;
    return ctx.model.Trending.update(row, condition);
  }

  async bulkCreate(row, condition) {
    const { ctx } = this;
    return ctx.model.Trending.bulkCreate(row, condition);
  }

  async destroy(condition) {
    const { ctx } = this;
    return ctx.model.Trending.destroy(condition);
  }

  removeDefaultAvatarSize(src) {
    if (!src) {
      return src;
    }
    return src.replace(/\?s=.*$/, "");
  }

  getHumanLanguage(language) {
    let humanLanguage = "";
    for (let i = 0; i < langs.length; i++) {
      if (language === langs[i].urlParam) {
        humanLanguage = langs[i].name;
        break;
      }
    }
    return humanLanguage;
  }

  async fetchRepositories({ language = "", since = "daily", spokenLanguage = "" }) {
    const { ctx } = this;
    const url = `${GITHUB_URL}/trending/${language}?since=${since}&spoken_language_code=${spokenLanguage}`;
    const res = await ctx.curl(url, { type: "GET", dataType: "text", timeout: 10000 });
    const $ = cheerio.load(res.data);
    return $(".Box article.Box-row")
      .get()
      .map((repo) => {
        const $repo = $(repo);
        const title = $repo.find(".h3").text().trim();
        const description = $repo.find("p.my-1").text().trim() || "";
        const [username, repoName] = title.split("/").map((v) => v.trim());
        const relativeUrl = $repo.find(".h3").find("a").attr("href");
        const langNode = $repo.find("[itemprop=programmingLanguage]");
        const lang = langNode.length ? langNode.text().trim() : null;
        const colorNode = $repo.find(".repo-language-color");
        const langColor = colorNode.length ? colorNode.css("background-color") : null;
        const currentPeriodStarsString = $repo.find(".float-sm-right").text().trim() || "";
        const currentPeriodStars = currentPeriodStarsString.split(" ")[0].replace(",", "") || "0";
        const stars = $repo.find(".mr-3 svg[aria-label='star']").first().parent().text().trim().replace(",", "") || "0";
        const forks = $repo.find("svg[aria-label='fork']").first().parent().text().trim().replace(",", "") || "0";
        const builtBy = $repo
          .find('span:contains("Built by")')
          .find('[data-hovercard-type="user"]')
          .map((i, user) => {
            const altString = $(user).children("img").attr("alt");
            const avatarUrl = $(user).children("img").attr("src");
            return {
              username: altString ? altString.slice(1) : null,
              href: `${GITHUB_URL}${user.attribs.href}`,
              avatar: this.removeDefaultAvatarSize(avatarUrl),
            };
          })
          .get();
        return {
          author: username,
          name: repoName,
          avatar: `${GITHUB_URL}/${username}.png`,
          url: `${GITHUB_URL}${relativeUrl}`,
          description: description,
          language: lang,
          languageColor: langColor,
          stars: Number(stars),
          forks: Number(forks),
          currentPeriodStars: currentPeriodStars,
          builtBy: builtBy,
        };
      });
  }

  async fetchDevelopers({ language = "", since = "daily" }) {
    const { ctx } = this;
    const url = `${GITHUB_URL}/trending/developers/${language}?since=${since}`;
    const res = await ctx.curl(url, { type: "GET", dataType: "text", timeout: 10000 });
    const $ = cheerio.load(res.data);
    return $(".Box article.Box-row")
      .get()
      .map((dev) => {
        const $dev = $(dev);
        const relativeUrl = $dev.find(".h3 a").attr("href");
        const sponsorRelativeUrl = $dev.find('span:contains("Sponsor")').parent().attr("href");
        const name = $dev.find(".h3 a").text().trim();
        const username = relativeUrl.slice(1);
        const type = $dev.find("img").parent().attr("data-hovercard-type");
        const $repo = $dev.find(".mt-2 > article");
        $repo.find("svg").remove();
        return {
          username,
          name,
          type,
          url: `${GITHUB_URL}${relativeUrl}`,
          sponsorUrl: sponsorRelativeUrl ? `${GITHUB_URL}${sponsorRelativeUrl}` : undefined,
          avatar: this.removeDefaultAvatarSize($dev.find("img").attr("src")),
          repo: {
            name: $repo.find("a").text().trim(),
            description: $repo.find(".f6.mt-1").text().trim() || /* istanbul ignore next */ "",
            url: `${GITHUB_URL}${$repo.find("a").attr("href")}`,
          },
        };
      });
  }

  async fetchAndSave({ type = "repositories", language = "", since = "daily", spokenLanguage = "", force = "0" }) {
    const { ctx } = this;
    const today = dayjs().format("YYYY-MM-DD");
    const existed = await this.findOne({ where: { date: today, type, language, since } });
    if (existed && force === "0") {
      return JSON.parse(existed.json);
    }
    let rows;
    if (type === "repositories") {
      rows = await this.fetchRepositories({ language, since, spokenLanguage });
    }
    if (type === "developers") {
      rows = await this.fetchDevelopers({ language, since });
    }
    ctx.runInBackground(async () => {
      if (!rows) return;
      if (rows.length === 0) return;
      const existed = await this.findOne({ where: { date: today, type, language, since } });
      if (existed) return;
      const row = {
        date: today,
        type,
        language,
        humanLanguage: this.getHumanLanguage(language),
        since,
        json: JSON.stringify(rows),
      };
      await this.create(row);
    });
    return rows;
  }

  async fetchAllAndSave() {
    const { ctx } = this;
    for (let i = 0; i < langs.length; i++) {
      const language = langs[i].urlParam;
      for (let j = 0; j < sinces.length; j++) {
        const since = sinces[j];
        try {
          console.log(`${language} ${since} START:`);
          await this.fetchAndSave({ type: "repositories", language, since });
          console.log(`${language} ${since} ✅!`);
        } catch (e) {
          console.log(`${language} ${since} ❌!`);
          ctx.logger.error(`Error while TrendingService.fetch: ${language} ${since}, stack: `, e);
        }
      }
    }
  }
}

module.exports = TrendingService;
