const Service = require("egg").Service;

class DemandService extends Service {
  async findAll(condition) {
    const { ctx } = this;
    return ctx.model.Demand.findAll(condition);
  }

  async findOne(condition) {
    const { ctx } = this;
    return ctx.model.Demand.findOne(condition);
  }

  async create(row, condition) {
    const { ctx } = this;
    return ctx.model.Demand.create(row, condition);
  }

  async update(row, condition) {
    const { ctx } = this;
    return ctx.model.Demand.update(row, condition);
  }

  async bulkCreate(row, condition) {
    const { ctx } = this;
    return ctx.model.Demand.bulkCreate(row, condition);
  }

  async destroy(condition) {
    const { ctx } = this;
    return ctx.model.Demand.destroy(condition);
  }
}

module.exports = DemandService;
