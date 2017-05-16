export default config => {
    const rootSchema = `
        type Query {
          buttons: [ Button ]
          events: [ Event ]
        }
        
        type Mutation {
          clickButton(id: String!): Button
          createButton: Button
        }
        
        schema {
            query: Query
            mutation: Mutation
        }
  `;

    return [
        rootSchema,
        config.buttons.schema,
        config.events.schema,
    ];
};
