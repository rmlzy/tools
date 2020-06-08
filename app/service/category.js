const Service = require("egg").Service;

class CategoryService extends Service {
  async findAll(condition) {
    const { ctx } = this;
    return ctx.model.Category.findAll({
      ...condition,
      include: [{ model: ctx.model.Nav }],
      order: [[ctx.model.Nav, "sort", "DESC"]],
    });
  }

  async findOne(condition) {
    const { ctx } = this;
    return ctx.model.Category.findOne({
      ...condition,
      include: [{ model: ctx.model.Nav }],
    });
  }

  async create(row, condition) {
    const { ctx } = this;
    return ctx.model.Category.create(row, condition);
  }

  async update(row, condition) {
    const { ctx } = this;
    return ctx.model.Category.update(row, condition);
  }

  async bulkCreate(row, condition) {
    const { ctx } = this;
    return ctx.model.Category.bulkCreate(row, condition);
  }

  async destroy(condition) {
    const { ctx } = this;
    return ctx.model.Category.destroy(condition);
  }
}

module.exports = CategoryService;
