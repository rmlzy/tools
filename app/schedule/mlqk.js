const Subscription = require("egg").Subscription;

class Mlqk extends Subscription {
  static get schedule() {
    return {
      cron: "0 0 2 * * ?", // 每天凌晨2点执行一次
      type: "all",
      immediate: true,
    };
  }

  async subscribe() {
    const { ctx } = this;
    try {
      await ctx.service.third.fetchMlqk();
    } catch (e) {
      ctx.logger.error("抓取码力全开设计资源失败: ", e);
    }
  }
}

module.exports = Mlqk;
