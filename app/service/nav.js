const Service = require("egg").Service;

class NavService extends Service {
  async findAll(condition) {
    const { ctx } = this;
    return ctx.model.Nav.findAll(condition);
  }

  async findOne(condition) {
    const { ctx } = this;
    return ctx.model.Nav.findOne(condition);
  }

  async create(row, condition) {
    const { ctx } = this;
    return ctx.model.Nav.create(row, condition);
  }

  async update(row, condition) {
    const { ctx } = this;
    return ctx.model.Nav.update(row, condition);
  }

  async bulkCreate(row, condition) {
    const { ctx } = this;
    return ctx.model.Nav.bulkCreate(row, condition);
  }

  async destroy(condition) {
    const { ctx } = this;
    return ctx.model.Nav.destroy(condition);
  }
}

module.exports = NavService;
