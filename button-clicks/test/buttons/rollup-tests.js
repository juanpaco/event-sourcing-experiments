import test from 'blue-tape'

import { rollup } from '../../src/buttons'

test(`${ __filename }: It can rollup the button state`, t => {
  const events = [
    { type: 'buttonCreated', aggregateId: '1', aggregateType: 'button' },
     { type: 'buttonClicked', aggregateId: '1', aggregateType: 'button' },
     { type: 'buttonCreated', aggregateId: '2', aggregateType: 'button' },
     { type: 'buttonCreated', aggregateId: '3', aggregateType: 'button' },
  ]

  const buttons = rollup(events)

  t.equal(buttons[0].id, '1', 'Correct id')
  t.equal(buttons[0].clicks, 1, 'Correct click count')
  t.equal(buttons[1].id, '2', 'Correct id')
  t.equal(buttons[1].clicks, 0, 'Correct click count')

  t.end()
})
