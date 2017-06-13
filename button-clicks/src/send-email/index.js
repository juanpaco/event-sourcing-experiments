import { filter } from 'lodash'
import { join } from 'path'

export function getButtonsNeedingEmail(events) {
  /* eslint-disable no-param-reassign */
  const reduction = events.reduce(
    (memo, e) => {
      switch (e.type) {
        case 'buttonClicked':
          if (typeof (memo[e.streamId].needsEmail) === 'undefined') {
            memo[e.streamId].needsEmail = true
            memo[e.streamId].emailTriggerCorrelationId = e.correlationId
          }
          break
        case 'buttonCreated':
          memo[e.streamId] = { id: e.streamId }
          break
        case 'emailSent':
          memo[e.streamId].needsEmail = false
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
            streamId: button.id,
            streamType: 'button',
            correlationId: button.emailTriggerCorrelationId,
          }))
  }

  function checkForSend() {
    const context = { correlationId: 'email-check' }

    return events.queries.allByStreamType('button', context)
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
