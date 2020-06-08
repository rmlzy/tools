const Service = require("egg").Service;

class UserService extends Service {
  async findAll(condition) {
    const { ctx } = this;
    return ctx.model.User.findAll({
      ...condition,
      attributes: { exclude: ["password"] },
    });
  }

  async findOne(condition) {
    const { ctx } = this;
    return ctx.model.User.findOne({
      ...condition,
      attributes: { exclude: ["password"] },
    });
  }

  async create(row, condition) {
    const { ctx } = this;
    return ctx.model.User.create(row, condition);
  }

  async update(row, condition) {
    const { ctx } = this;
    return ctx.model.User.update(row, condition);
  }

  async bulkCreate(row, condition) {
    const { ctx } = this;
    return ctx.model.User.bulkCreate(row, condition);
  }

  async destroy(condition) {
    const { ctx } = this;
    return ctx.model.User.destroy(condition);
  }

  async verifyPassword(email, password) {
    const { ctx } = this;
    const row = await this.findOne({
      where: {
        email,
        password: ctx.helper.encryptPassword(password),
        status: "ENABLE",
      },
    });
    return Boolean(row);
  }

  async generateToken(email, password) {
    const { config, ctx } = this;
    const user = await this.findOne({
      where: {
        email,
        password: ctx.helper.encryptPassword(password),
        status: "ENABLE",
      },
    });
    const token = ctx.helper.generateToken(
      {
        id: user.id,
        level: user.level,
      },
      { expiresIn: "7d" }
    );
    const row = await ctx.model.User.update({ token }, { where: { id: user.id } });
    return token;
  }
}

module.exports = UserService;
