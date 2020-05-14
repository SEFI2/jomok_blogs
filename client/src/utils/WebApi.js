import firebase from '../firebase/auth'
import _ from 'lodash'

const API_URL = 'http://localhost:3000'

let currentUser = null

firebase.auth().onAuthStateChanged(function (user) {
  console.log('WEB_API', { user })
  currentUser = user
})

function parseJSON (response) {
  if (response.status >= 400) {
    throw new Error(response)
  }
  const contentType = response.headers.get('Content-Type')
  if (contentType && contentType.includes('application/json')) {
    return response.json()
  }
  return response
}

const attachToken = async(options) => {
  const user = currentUser || await firebase.auth().currentUser
  if (user) {
    return user.getIdToken(true).then(token => {
      console.log('TOKEN', token)
      if (!token) {
        throw new Error('Unauthorized')
      }
      if (!options) {
        options = {}
      }
      options.headers = {
        ...options.headers,
        Authorization: token
      }
      return options
    })
  } else {
    return options
  }
}

export default {
  getUsers: (limit, skip) => {
    let requestUrl = `${API_URL}/users/all`
    if (skip) {
      requestUrl += `&skip=${skip}`
    }
    if (limit) {
      request += `&limit=${limit}`
    }
    return attachToken().then((options) => {
      return fetch(requestUrl, options).then(parseJSON)
    })
  },
  getUser: (uid) => {
    return attachToken().then((options) => {
      return fetch(`${API_URL}/users?uid=${uid}`, options).then(parseJSON)
    })
  }
}




















