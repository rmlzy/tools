const Subscription = require("egg").Subscription;
const fs = require("fs-extra");
const path = require("path");

class CleanCached extends Subscription {
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
      // 图片压缩工具产生的缓存
      const minImagePath = path.join(config.baseDir, "min-image");
      await fs.remove(minImagePath);

      // Logo生成工具产生的缓存
      const genLogoPath = path.join(config.baseDir, "gen-logo");
      await fs.remove(genLogoPath);
    } catch (e) {
      ctx.logger.error("清空缓存文件失败: ", e);
    }
  }
}

module.exports = CleanCached;
