const Service = require("egg").Service;
const _ = require("lodash");

class DuService extends Service {
  async random() {
    const { ctx } = this;
    const total = await ctx.model.Du.count();
    const random = _.random(3, total);
    const res = await ctx.model.Du.findOne({ where: { id: random } });
    return res.title;
  }
}

module.exports = DuService;
