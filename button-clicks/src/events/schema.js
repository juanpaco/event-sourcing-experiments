const Event = `
  type Event {
    aggregateId: String!
    aggregateType: String!
    type: String!
    correlation_id: String!
    payload: String
  }
`

export default () => [ Event ];
