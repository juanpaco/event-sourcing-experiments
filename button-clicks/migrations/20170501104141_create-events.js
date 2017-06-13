
exports.up = function(knex, Promise) {
  return knex.schema.createTable('events', table => {
    table.increments()   
    table.string('event_type')
    table.string('stream_id')
    table.string('stream_type')
    table.string('correlation_id')
    table.string('payload')
    table.timestamps()

    table.index('event_type')
    table.index('stream_type')
    table.index('stream_id')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('events')
};
