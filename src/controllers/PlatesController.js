const knex = require("../database/knex")

class PlatesController {
  async create(request, response) {
    const { plateImage, name, description, price, categories, ingredients } = request.body

    const [plate_id] = await knex("plates").insert({ plateImage, name, description, price})

    const categoriesInsert = categories.map(category => {
      return {
        plate_id,
        name: category,
      }
    })

    await knex("categories").insert(categoriesInsert)

    const ingredientsInsert = ingredients.map(ingredient => {
      return {
        plate_id,
        name: ingredient,
      }
    })

    await knex("ingredients").insert(ingredientsInsert)

    return response.status(201).json({ message: "Prato criado com sucesso."})
  }

  async delete(request, response) {
    const { id } = request.params

    await knex("plates").where({ id }).delete()
    return response.status(200).json({ message: `Prato de id ${id} deletado com sucesso.`})
  }

  async index(request, response){
    // const { name, ingredients } = request.query

    // let plates

    // if(ingredients) {
    //   const filterIngredients = ingredients.split(",").map(ingredient => ingredient.trim())

    //   plates = await knex("ingredients")
    //     .whereLike("plates.name", `%${name}%`)
    //     .whereIn("name", filterIngredients)
    //     .innerJoin("plates", "plates.id", "ingredients.plate_id")
    //     .orderBy("plates.name")
    // } else {
    //   plates = await knex("plates")
    //     .whereLike("name", `%${name}%`)
    //     .orderBy("name")
    // }
    // return response.json(plates)
  }
}

module.exports = PlatesController