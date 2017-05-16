import { graphiqlExpress, graphqlExpress } from 'graphql-server-express';
import { makeExecutableSchema } from 'graphql-tools';

import createResolvers from './resolvers';
import createSchema from './schema';

export default config => {
    const resolvers = createResolvers(config);
    const schema = createSchema(config);

    function requestToOptions(req) {
        const executableSchema = makeExecutableSchema({
            resolvers,
            typeDefs: schema,
        });

        return {
            context: req.context,
            schema: executableSchema,
            // This function is useful in development to see graphql errors.
            formatError: error => {
                console.log(error);
                return error;
            },
        };
    }

    return {
        graphiql: graphiqlExpress({ endpointURL: '/graphql' }),
        server: graphqlExpress(requestToOptions),
    };
};
