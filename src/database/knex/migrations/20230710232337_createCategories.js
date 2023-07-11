
exports.up = knex => knex.schema.createTable("categories", table => {
  table.increments("id")
  table.integer("plate_id").references("id").inTable("plates").onDelete("CASCADE")
  table.string("name", 30).notNullable()
})

exports.down = knex => knex.schema.dropTable("categories")
