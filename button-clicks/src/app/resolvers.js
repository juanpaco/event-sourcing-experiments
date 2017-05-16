import { merge } from 'lodash';

export default config => {
    const rootResolvers = {
        Query: merge(
          config.buttons.resolvers.root,
        ),
        Mutation: merge(
          config.buttons.resolvers.mutation,
        ),
    };

    return merge(
        rootResolvers,
    );
};

