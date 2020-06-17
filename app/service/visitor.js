const Service = require("egg").Service;
const ip = require("ip");
const parser = require("ua-parser-js");

class VisitorService extends Service {
  async findAll(condition) {
    const { ctx } = this;
    const rows = await ctx.model.Visitor.findAll(condition);
    return rows
      .map((el) => el.get({ plain: true }))
      .map((row) => {
        const ua = parser(row.ua);
        row = { ...row, ...ua };
        return row;
      });
  }

  async create() {
    const { ctx } = this;
    const ua = ctx.headers["user-agent"];
    const userIp = ip.address();
    const url = ctx.request.url;
    const existed = await ctx.model.Visitor.findOne({ where: { ip: userIp } });
    if (existed) {
      return;
    }
    return ctx.model.Visitor.create({ ua, ip: userIp, url });
  }
}

module.exports = VisitorService;
