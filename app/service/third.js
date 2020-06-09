const Service = require("egg").Service;
const dayjs = require("dayjs");

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
}

module.exports = ThirdService;
