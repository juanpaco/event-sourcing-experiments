const Event = `
  type Event {
    streamId: String!
    streamType: String!
    type: String!
    correlation_id: String!
    payload: String
  }
`

export default () => [ Event ]
