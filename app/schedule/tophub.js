const Subscription = require("egg").Subscription;

class TopHub extends Subscription {
  static get schedule() {
    return {
      cron: "0 0 2 * * ?", // 每天凌晨2点执行一次
      type: "all",
    };
  }

  async subscribe() {
    const { ctx } = this;
    try {
      await ctx.service.tophub.fetchNodes("tech");
    } catch (e) {
      ctx.logger.error("抓取今日热榜失败: ", e);
    }
  }
}

module.exports = TopHub;
