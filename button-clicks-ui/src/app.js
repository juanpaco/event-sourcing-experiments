import { Button as BSButton, Col, Grid, Navbar, Row } from 'react-bootstrap'
import { compose, gql, graphql, withApollo } from 'react-apollo'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

import Button from './button'

class App extends Component {
  static propTypes = {
    clickButton: PropTypes.func.isRequired,
    createButton: PropTypes.func.isRequired,
    data: PropTypes.shape({
      buttons: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
      })),
      loading: PropTypes.bool.isRequired,
    }).isRequired,
  }

  constructor(props) {
    super(props)

    this.handleButtonClick = this.handleButtonClick.bind(this)
    this.handleCreateButton = this.handleCreateButton.bind(this)
  }

  handleButtonClick(id) {
    this.props.clickButton(id)
  }

  handleCreateButton() {
    this.props.createButton()
  }

  renderBody() {
    const { buttons, loading } = this.props.data

    if (loading) return <Col xs={ 12 }>loading...</Col>
    if (buttons.length === 0) return <Col xs={ 12 }>No buttons! Make one!</Col>

    return buttons.map(b => <Button
      button={ b }
      key={ b.id }
      onClick={ this.handleButtonClick }
    />)
  }

  render() {
    return <div>
      <Navbar inverse collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">Button Clicks</a>
          </Navbar.Brand>
        </Navbar.Header>
      </Navbar>

      <Grid>
        <Row>
          <Col xs={ 12 }>
            <BSButton bsStyle="success" onClick={ this.handleCreateButton }>
              Create button
            </BSButton>
            <hr />
          </Col>
        </Row>
        <Row>
          { this.renderBody() }
        </Row>
      </Grid>
    </div>
  }
}

const buttonsQuery = gql`
  query {
    buttons {
      id
      clicks
    }
  }
`

const createButtonMutation = gql`
  mutation {
    createButton {
      id
      clicks
    }
  }
`

const createButtonMutationOptions = {
  name: 'createButton',
  options: {
    update: (proxy, { data: { createButton } }) => {
      const data = proxy.readQuery({ query: buttonsQuery })

      data.buttons.push(createButton)
      proxy.writeQuery({ query: buttonsQuery, data })
    },
  },
}

const clickButtonMutation = gql`
  mutation ($id: String!) {
    clickButton(id: $id) {
      id
      clicks
    }
  }
`

const clickButtonMutationOptions = {
  props: ({ mutate }) => ({
    clickButton: id => mutate({ variables: { id } }),
  }),
  options: {
    update: (proxy, { data: { clickButton } }) => {
      const data = proxy.readQuery({ query: buttonsQuery })

      const button = data.buttons.find(b => b.id === clickButton.id)
      button.clicks = clickButton.clicks

      // data.buttons.push(createButton);
      proxy.writeQuery({ query: buttonsQuery, data })
    },
  },
}

export default compose(
  graphql(buttonsQuery),
  graphql(createButtonMutation, createButtonMutationOptions),
  graphql(clickButtonMutation, clickButtonMutationOptions),
)(withApollo(App))

