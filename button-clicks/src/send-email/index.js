import { filter } from 'lodash'
import { join } from 'path'

export function getButtonsNeedingEmail(events) {
  /* eslint-disable no-param-reassign */
  const reduction = events.reduce(
    (memo, e) => {
      switch (e.type) {
        case 'buttonClicked':
          if (typeof (memo[e.aggregateId].needsEmail) === 'undefined') {
            memo[e.aggregateId].needsEmail = true
            memo[e.aggregateId].emailTriggerCorrelationId = e.correlationId
          }
          break
        case 'buttonCreated':
          memo[e.aggregateId] = { id: e.aggregateId }
          break
        case 'emailSent':
          memo[e.aggregateId].needsEmail = false
          break
        default:
          break
      }

      return memo
    },
    {},
  )
  /* eslint-enable no-param-reassign */

  return filter(reduction, button => button.needsEmail)
}

export default ({ emit, events, sendEmail }) => {
  const templatesPath = join(__dirname, 'templates')

  function sendEmailForButton(button) {
    const template = 'first-button-click'
    const templateContext = { buttonId: button.id }
    const subject = ''
    const to = 'someonebuttony@example.com'
    const sendEmailPromise = sendEmail(
            templatesPath,
            template,
            templateContext,
            subject,
            to,
        )

    return sendEmailPromise
          .then(() => emit({
            type: 'emailSent',
            aggregateId: button.id,
            aggregateType: 'button',
            correlationId: button.emailTriggerCorrelationId,
          }))
  }

  function checkForSend() {
    const context = { correlationId: 'email-check' }

    return events.queries.allByAggregateType('button', context)
        .then(getButtonsNeedingEmail)
        .then(buttons => {
          if (buttons.length === 0) return null

          return buttons.reduce(
            (chain, b) => chain.then(() => sendEmailForButton(b)),
            Promise.resolve(true),
          )
        })
  }

  function tick() {
    return checkForSend()
        .then(() => setTimeout(tick, 10000))
  }

  tick()

  return {}
}
