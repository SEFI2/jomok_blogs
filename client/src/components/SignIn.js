import React, { Component } from 'react'
import '../App.css'
import * as firebaseui from 'firebaseui'
import firebase from '../firebase/auth'
import common from '../utils/common'

const uiConfig = {
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    signInSuccessWithAuthResult: async function (authResult) {
      console.log({authResult})
      common.redirect('/my')
      return false
    }
  }
}

class SignInPage extends Component {
  componentDidMount () {
    const ui = new firebaseui.auth.AuthUI(firebase.auth())
    ui.start('#firebaseui-auth-container', uiConfig)
  }

  render () {
    return (
      <div>
        <h1>Welcome to Jomokk</h1>
        <div id='firebaseui-auth-container' />
      </div>
    )
  }
}
  /*
const mapStateToProp = (state) => ({
  user: state.authUser.user
  user: state.authUser.user
});

const mapDispatchToProps = (dispatch) => ({
  signedIn: (user) => { dispatch({ type: 'SET_USER', user})}
})
*/
export default SignInPage

