const Subscription = require("egg").Subscription;

class Trending extends Subscription {
  static get schedule() {
    return {
      cron: "0 0 3 * * ?", // 每天凌晨3点执行一次
      type: "all",
    };
  }

  async subscribe() {
    const { ctx, service } = this;
    try {
      await service.trending.fetchAllAndSave();
    } catch (e) {
      ctx.logger.error("抓取 Github Trending 失败: ", e);
    }
  }
}

module.exports = Trending;
