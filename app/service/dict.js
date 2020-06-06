const Service = require("egg").Service;

class DictService extends Service {
  async get(key) {
    const { ctx } = this;
    const row = await ctx.model.Dict.findOne({ where: { key } });
    return row ? row.get({ plain: true }).value : null;
  }

  async set(key, value) {
    const { ctx } = this;
    const existed = await this.get(key);
    if (existed) {
      return ctx.model.Dict.update({ value }, { where: { key } });
    } else {
      return ctx.model.Dict.create({ key, value });
    }
  }

  async addTotalPV() {
    const { ctx } = this;
    try {
      const pv = await this.get("totalPV");
      await this.set("totalPV", Number(pv) + 1);
    } catch (e) {
      ctx.logger.error("Error while DictService.addTotalPV, stack: ", e);
    }
  }
}

module.exports = DictService;
