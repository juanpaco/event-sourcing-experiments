import knex from 'knex';

export default ({
    allowDbWipe,
    databaseUrl,
}) => {
    const client = knex({
      client: 'sqlite',
      connection: databaseUrl,
      useNullAsDefault: true
    })

    const retval = {
      client
    }

    /**
     * @describes - Destroys and recreates the db. Testing likes clean
     *   environments.  Production does not.  This only gets enabled if
     *   the `allowDbWipe` settings is true.
     * @returns {Promise} - A promise chain that resolves when the db has been
     *   created.
    */
    function wipeDb() {
        const tables = [
          'events',
        ];

        return tables.reduce(
          (chain, t) => chain.then(() => client(t).del()),
          Promise.resolve(true),
        )
    }

    // Some things aren't meant for non-test environments.
    if (allowDbWipe) {
        retval.wipeDb = wipeDb;
    }

    return retval;
};
