import firebase from 'firebase'
import common from '../utils/common'

export default function Logout() {
  firebase.auth().signOut().then(function() {
    common.redirect('/signin')
  }, function(error) {
    console.log(error)
  })
  return null
}
