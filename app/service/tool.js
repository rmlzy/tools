const Service = require("egg").Service;

class ToolService extends Service {
  async findAll(condition) {
    const { ctx } = this;
    return ctx.model.Tool.findAll(condition);
  }

  async findOne(condition) {
    const { ctx } = this;
    return ctx.model.Tool.findOne(condition);
  }

  async create(row, condition) {
    const { ctx } = this;
    return ctx.model.Tool.create(row, condition);
  }

  async update(row, condition) {
    const { ctx } = this;
    return ctx.model.Tool.update(row, condition);
  }

  async bulkCreate(row, condition) {
    const { ctx } = this;
    return ctx.model.Tool.bulkCreate(row, condition);
  }

  async destroy(condition) {
    const { ctx } = this;
    return ctx.model.Tool.destroy(condition);
  }
}

module.exports = ToolService;
