const firebaseAdmin = require('firebase-admin')
const _ = require('lodash')
const models = require('../models')

const firebaseServiceAccount = require('../secrets/jomokk-2f312-firebase-adminsdk-q9udz-fe7c39d482.json')

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseServiceAccount)
})

const EXCLUDED_ROUTES_FROM_VERIFICATION = [
  '/users/getRole',
  '/users',
  '/users/profile',
  '/reviews',
  '/blogs',
  '/blogs/attach',
  '/users/all'
]

/**
 * A middleware to check user's authentication
 */
const firebaseAuthenticationMiddleware = async (req, res, next) => {
  const token = req.get('Authorization')
  let tokenCheckFailed = false
  if (token) {
    try {
      const payload = await firebaseAdmin.auth().verifyIdToken(token)
      res.locals.userPayload = payload
    } catch (error) {
      tokenCheckFailed = true
    }
  }
  if (!token || tokenCheckFailed === true) {
    if (_.includes(EXCLUDED_ROUTES_FROM_VERIFICATION, req.path)) {
      return next()
    }
    return res.status(403).send('Not Authorized')
  }
  next()
}


/**
 * A middleware to check user's permissions and authorization.
 */
const firebaseAuthorizationMiddleware = async (req, res, next) => {
  // TODO(aibek): add rules for authorization check
  next()
}


/**
 * A middleware to add a new user using his authorization token payload.
 * @param res.locals.userPayload is a user's payload retrieved from previous middlewares
 */
const firebaseAddUserMiddleware = async (req, res, next) => {
  const payload = res.locals.userPayload
  if (payload && payload.uid) {
    const user = await models.User.find({ uid: payload.uid })
    if (_.isEmpty(user)) {
      await addUser(payload)
    }
  }
  next()
}

/**
 * A method to create a user in a database using firebase middleware.
 */
async function addUser (payload) {
  console.log({ payload })
  const user = new models.User({ uid: payload.uid, fullName: payload.uid, email: payload.email })
  await user.save()
}

module.exports = {
  firebaseAuthenticationMiddleware,
  firebaseAuthorizationMiddleware,
  firebaseAddUserMiddleware
}

