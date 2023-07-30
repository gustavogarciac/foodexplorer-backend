const knex = require("../database/knex");
const DiskStorage = require("../providers/DiskStorage");
const AppError = require("../utils/AppError");

class DishesController {
  async create(request, response) {
    try {
      const { name, description, price, category, ingredients } = request.body;
      const { filename: imageFileName } = request.file;

      const diskStorage = new DiskStorage();

      const filename = await diskStorage.saveFile(imageFileName);

      if (
        !name ||
        !description ||
        !price ||
        !category ||
        !ingredients ||
        !imageFileName
      ) {
        throw new AppError(
          "É necessário informar todos os dados para cadastrar o prato.",
          400
        );
      }

      const [dish_id] = await knex("dishes").insert({
        image: filename,
        name,
        description,
        category,
        price,
      });

      const ingredientsArray = ingredients.split(",");
      const ingredientsInsert = ingredientsArray.map((ingredient) => {
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
      const filterIngredients = ingredient
        .split(",")
        .map((ingredient) => ingredient.trim());

      dishes = await knex("ingredients")
        .select([
          "dishes.id",
          "dishes.name",
          "dishes.description",
          "dishes.category",
          "dishes.price",
          "dishes.image",
        ])
        .whereLike("dishes.name", `%${name}%`)
        .whereIn("ingredients.name", filterIngredients)
        .innerJoin("dishes", "dishes.id", "ingredients.dish_id")
        .groupBy("dishes.id")
        .orderBy("dishes.name");
    } else {
      dishes = await knex("dishes")
        .whereLike("name", `%${name}%`)
        .orderBy("name");
    }

    const dishesIngredients = await knex("ingredients");
    const dishesWithIngredients = dishes.map((dish) => {
      const dishIngredient = dishesIngredients.filter(
        (ingredient) => ingredient.dish_id === dish.id
      );

      return {
        ...dish,
        ingredients: dishIngredient,
      };
    });

    return response.status(200).json(dishesWithIngredients);
  }

  async show(request, response) {
    const { id } = request.params;

    const dish = await knex("dishes").where({ id }).first();
    if (!dish) {
      throw new AppError("Prato não encontrado!");
    }
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

    const nameAlreadyInUse = await knex("dishes").where({ name }).first();
    if (nameAlreadyInUse) {
      throw new AppError("O nome deste prato já está em uso.");
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
