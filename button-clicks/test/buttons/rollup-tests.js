import test from 'blue-tape'

import { rollup } from '../../src/buttons'

test(`${ __filename }: It can rollup the button state`, t => {
  const events = [
    { type: 'buttonCreated', streamId: '1', streamType: 'button' },
     { type: 'countIncremented', streamId: '1', streamType: 'button' },
     { type: 'buttonCreated', streamId: '2', streamType: 'button' },
     { type: 'buttonCreated', streamId: '3', streamType: 'button' },
  ]

  const buttons = rollup(events)

  t.equal(buttons[0].id, '1', 'Correct id')
  t.equal(buttons[0].clicks, 1, 'Correct click count')
  t.equal(buttons[1].id, '2', 'Correct id')
  t.equal(buttons[1].clicks, 0, 'Correct click count')

  t.end()
})
