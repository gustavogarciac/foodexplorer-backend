const { hash } = require("bcryptjs")
const knex = require("../database/knex")

class UsersController {
  async create(request, response) {
    try {
      const { name, email, password, isAdmin } = request.body
  
      const userAlreadyExists = await knex("users").where({ email }).first()
      if (userAlreadyExists) {
        throw new Error("Este e-mail já está em uso!")
      }

      const hashedPassword = await hash(password, 8)

      await knex("users").insert({ name, email, password: hashedPassword, isAdmin })
      return response.status(201).json({ message: "Usuário cadastrado com sucesso."})

    } catch (error) {
      return response.status(500).json({ message: error.message })
    }
  }
  async delete(request, response) {
    const { id } = request.query

    await knex("users").where({ id }).delete()

    return response.json({ message: `Usuário de id ${id} deletado com sucesso.`})
  }
}

module.exports = UsersController