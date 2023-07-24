const { hash } = require("bcryptjs");
const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class UsersController {
  async create(request, response) {
    try {
      const { name, email, password, isAdmin } = request.body;

      if (!name || !email || !password) {
        throw new AppError("Preencha todos os campos para continuar.", 400);
      }

      const passwordLength = password.length <= 8;
      if (passwordLength) {
        throw new AppError("A senha deve ter ao menos 8 caracteres.", 400);
      }

      const userAlreadyExists = await knex("users").where({ email }).first();
      if (userAlreadyExists) {
        throw new AppError("Este e-mail já está em uso!");
      }

      const hashedPassword = await hash(password, 8);

      await knex("users").insert({
        name,
        email,
        password: hashedPassword,
        isAdmin,
      });
      return response
        .status(201)
        .json({ message: "Usuário cadastrado com sucesso." });
    } catch (error) {
      return response.status(500).json({ message: error.message });
    }
  }
  async delete(request, response) {
    const { id } = request.query;

    await knex("users").where({ id }).delete();

    return response.json({
      message: `Usuário de id ${id} deletado com sucesso.`,
    });
  }
}

module.exports = UsersController;
