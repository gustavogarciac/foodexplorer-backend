exports.up = knex => knex.schema.createTable("users", table => {
  table.increments("id")
  table.boolean("isAdmin").default(false)
  table.string("name", 50).notNullable()
  table.string("email", 50).notNullable()
  table.string("password", 50).notNullable()
  table.timestamp("created_at").default(knex.fn.now())
})

exports.down = knex => knex.schema.dropTable("users")