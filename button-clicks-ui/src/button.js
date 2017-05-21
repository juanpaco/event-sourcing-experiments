import { Button as BSButton, Col } from 'react-bootstrap'
import PropTypes from 'prop-types'
import React from 'react'

function Button({ button, onClick }) {
  return <Col md={ 4 } style={ { marginBottom: '30px', textAlign: 'center' } }>
    <BSButton onClick={ () => onClick(button.id) }>Click me!</BSButton>
    <br />
    Click count: { button.clicks }
  </Col>
}

Button.propTypes = {
  button: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
  onClick: PropTypes.func.isRequired,
}

export default Button
