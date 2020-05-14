import React from 'react'
import firebase from '../firebase/auth'
import common from '../utils/common'

export default function withAuth (WrappedComponent) {
  return class extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        authorized: false,
        loading: true
      }
    }

    componentDidMount () {
      console.log('OK')
      firebase.auth().onAuthStateChanged((user) => {
        if(!user) {
          common.redirect('/signin')
          return
        }
        this.setState({
          authorized: true,
          loading: false
        })

      })
    }

    render() {
      if (this.state.loading) {
        return null
      } else if(this.state.authorized) {
        return <WrappedComponent />
      } else {
        console.log('UNHANDLED')
        return null
      }
    }
  }
}
