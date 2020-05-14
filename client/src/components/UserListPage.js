import React, { Component } from 'react'
import '../App.css'
import NavigationBar from '../components/NavigationBar'
import WebApi from '../utils/WebApi'
import { Table } from 'reactstrap'
import queryString from 'query-string'

class UserListPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      users: [],
      loading: true
    }
  }

  componentDidMount () {
    const parsedQuery = queryString.parse(this.props.location.search)
    WebApi.getUsers(parsedQuery.skip, parsedQuery.limit).then(users => {
      console.log({ users })
      this.setState({
        users,
        loading: false
      })
    })
  }

  render () {
    return this.state.loading === true ? null : (
      <div>
        <NavigationBar />
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>UID</th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.users.map(function (user, idx) {
                return (
                  <tr key={idx}>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>{user.uid}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </Table>
      </div>
    )
  }
}

export default UserListPage

