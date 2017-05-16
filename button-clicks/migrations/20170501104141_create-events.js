
exports.up = function(knex, Promise) {
  return knex.schema.createTable('events', table => {
    table.increments()   
    table.string('event_type')
    table.string('aggregate_id')
    table.string('aggregate_type')
    table.string('correlation_id')
    table.string('payload')
    table.timestamps()

    table.index('event_type')
    table.index('aggregate_type')
    table.index('aggregate_id')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('events')
};
