exports.up = (knex) =>
  knex.schema.createTable("dishes", (table) => {
    table.increments("id");
    table.string("image");
    table.string("category");
    table.string("name", 50).notNullable();
    table.text("description");
    table.integer("price").notNullable();
  });
exports.down = (knex) => knex.schema.dropTable("dishes");
