import { Button as BSButton, Col } from 'react-bootstrap'
import React from 'react'

function Button({ button, onClick }) {
  return <Col md={ 4 } style={ { marginBottom: '30px', textAlign: 'center' } }>
    <BSButton onClick={ () => onClick(button.id) }>Click me!</BSButton> 
    <br />
    Click count: { button.clicks }
  </Col>
}

export default Button
