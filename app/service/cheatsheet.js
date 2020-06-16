const Service = require("egg").Service;

class CheatsheetService extends Service {
  async findAll(condition) {
    const { ctx } = this;
    return ctx.model.Cheatsheet.findAll(condition);
  }

  async findOne(condition) {
    const { ctx } = this;
    return ctx.model.Cheatsheet.findOne(condition);
  }

  async create(row, condition) {
    const { ctx } = this;
    return ctx.model.Cheatsheet.create(row, condition);
  }

  async update(row, condition) {
    const { ctx } = this;
    return ctx.model.Cheatsheet.update(row, condition);
  }

  async bulkCreate(row, condition) {
    const { ctx } = this;
    return ctx.model.Cheatsheet.bulkCreate(row, condition);
  }

  async destroy(condition) {
    const { ctx } = this;
    return ctx.model.Cheatsheet.destroy(condition);
  }
}

module.exports = CheatsheetService;
