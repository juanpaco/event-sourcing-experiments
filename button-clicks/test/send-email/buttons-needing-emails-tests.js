import test from 'blue-tape'

import { getButtonsNeedingEmail } from '../../src/send-email'

test(`${ __filename }: Can project buttons for emails`, t => {
  const events = [
    // 1 does not need an email because it was already sent
    {
      type: 'buttonCreated',
      streamId: '1',
      streamType: 'button',
      correlationId: '1-1',
    },
    {
      type: 'countIncremented',
      streamId: '1',
      streamType: 'button',
      correlationId: '1-2',
    },
    {
      type: 'emailSent',
      streamId: '1',
      streamType: 'button',
      correlation: '1-2',
    },
    {
      type: 'countIncremented',
      streamId: '1',
      streamType: 'button',
      correlationId: '1-3',
    },

    // 2 does need an email, because it has the click and the email has not
    //   been sent
    {
      type: 'buttonCreated',
      streamId: '2',
      streamType: 'button',
      correlationId: '2-1',
    },
    {
      type: 'countIncremented',
      streamId: '2',
      streamType: 'button',
      correlationId: '2-2',
    },

    // 3 does not need an email, because it has not yet been clicked
    {
      type: 'buttonCreated',
      streamId: '3',
      streamIdgateType: 'button',
      correlationId: '3-1',
    },
  ]

  const buttons = getButtonsNeedingEmail(events)

  t.equal(buttons.length, 1, 'Only 1 needs an email')
  t.equal(buttons[0].id, '2', 'Button 2 needs the email')
  t.equal(
    buttons[0].emailTriggerCorrelationId,
    '2-2',
    'Cor id matches causal click'
  )

  t.end()
})
