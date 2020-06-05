const Service = require("egg").Service;
const _ = require("lodash");

class TagService extends Service {
  async get(key) {
    const { ctx } = this;
    return ctx.model.Dict.findOne({ where: { key } });
  }

  async set(key, path, value) {
    const { ctx } = this;
    let val = {};
    const valStr = await this.get(key);
    if (valStr) {
      try {
        val = JSON.parse(valStr);
      } catch (e) {
        // ignore
      }
      _.set(val, path, value);
      return ctx.model.Dict.update({ value: val }, { where: { key } });
    } else {
      _.set(val, path, value);
      return ctx.model.Dict.create(value);
    }
  }
}

module.exports = TagService;
