const Subscription = require("egg").Subscription;
const fs = require("fs-extra");

class TopHub extends Subscription {
  static get schedule() {
    return {
      cron: "0 0 2 * * ?", // 每天凌晨2点执行一次
      type: "all",
      immediate: true,
    };
  }

  async subscribe() {
    const { ctx, config } = this;
    try {
      const minImagePath = path.join(config.baseDir, "app/public/tophub/tech.json");
      await fs.remove(minImagePath);
      await ctx.service.tophub.fetchNodes("tech");
    } catch (e) {
      ctx.logger.error("抓取今日热榜失败: ", e);
    }
  }
}

module.exports = TopHub;
