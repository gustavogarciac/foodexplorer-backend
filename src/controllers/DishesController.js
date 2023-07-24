const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class DishesController {
  async create(request, response) {
    try {
      const { name, description, price, category, ingredients } = request.body;

      if (!name || !description || !price || !category || !ingredients) {
        throw new AppError(
          "É necessário informar todos os dados para cadastrar o prato.",
          400
        );
      }

      const [dish_id] = await knex("dishes").insert({
        name,
        description,
        category,
        price,
      });

      const ingredientsInsert = ingredients.map((ingredient) => {
        return {
          dish_id,
          name: ingredient,
        };
      });

      await knex("ingredients").insert(ingredientsInsert);

      return response
        .status(201)
        .json({ message: "Prato criado com sucesso." });
    } catch (error) {
      throw new AppError(error.message);
    }
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("dishes").where({ id }).delete();
    return response
      .status(200)
      .json({ message: `Prato de id ${id} deletado com sucesso.` });
  }

  async index(request, response) {
    const { name, ingredient } = request.query;

    let dishes;

    if (ingredient) {
      const ingredients = await knex("ingredients")
        .whereLike("name", `%${ingredient}%`)
        .orderBy("name");
      const dishesWithIngredient = await Promise.all(
        ingredients.map(async (ingredient) => {
          const dishes = await knex("dishes")
            .where({ id: ingredient.dish_id })
            .orderBy("name");

          return {
            ...dishes,
          };
        })
      );

      return response.status(200).json(dishesWithIngredient);
    } else {
      dishes = await knex("dishes")
        .whereLike("name", `%${name}%`)
        .orderBy("name");
      const dishesIngredients = await Promise.all(
        dishes.map(async (dish) => {
          const ingredients = await knex("ingredients")
            .where({ dish_id: dish.id })
            .select(["name"])
            .orderBy("name");
          return {
            ...dish,
            ingredients,
          };
        })
      );
      return response.status(200).json(dishesIngredients);
    }
  }

  async show(request, response) {
    const { id } = request.params;

    const dish = await knex("dishes").where({ id }).first();
    const ingredients = await knex("ingredients")
      .where({ dish_id: id })
      .select(["id", "name"])
      .orderBy("name");
    return response.status(200).json({ ...dish, ingredients });
  }

  async update(request, response) {
    const { id } = request.params;
    const { name, category, ingredients, price, description } = request.body;

    if (!name || !category || !ingredients || !price || !description) {
      throw new AppError("É necessário informar todos os campos...", 400);
    }

    const dish = await knex("dishes").where({ id }).first();
    dish.name = name ?? dish.name;
    dish.description = description ?? dish.description;
    dish.price = price ?? dish.price;
    dish.category = category ?? dish.category;

    await knex("dishes").where({ id }).update(dish);

    const ingredientsInsert = ingredients.map((ingredient) => {
      return {
        dish_id: dish.id,
        name: ingredient,
      };
    });

    await knex("ingredients").where({ dish_id: dish.id }).delete();
    await knex("ingredients").insert(ingredientsInsert);

    return response
      .status(201)
      .json({ message: "Prato atualizado com sucesso." });
  }
}

module.exports = DishesController;
