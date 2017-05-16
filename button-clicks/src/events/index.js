import createQueries from './queries';
import createResolvers from './resolvers';
import schema from './schema';

export default ({ db }) => {
    const queries = createQueries({ db });
    const resolvers = createResolvers({ queries });

    return {
      emit: queries.create,
      queries,
      resolvers,
      schema,
    }
}
