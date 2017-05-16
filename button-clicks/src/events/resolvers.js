export default ({ queries }) => ({
  root: {
    events(_, params, context) {
      return queries.all(context);
    },
  }
})

