const express = require('express')
const router = express.Router()
const models = require('../models')
const _ = require('lodash')
const { query, body, validationResult } = require('express-validator/check')
const multer = require('multer')
//const utils = require('../utils/util')
const uuidv4 = require('uuid/v4')

const storage = multer.memoryStorage({
  // TODO(aibek): check if it does delete in-memory files after execution
  destination: function (req, file, callback) {
    callback(null, '')
  }
})
// TODO(aibek): define the limits of uploaded data
// TODO(aibek): define file filter for allowed file types
const upload = multer({ storage })
//const AWS = require('aws-sdk')
//const s3 = new AWS.S3()

/**
 * Gets a user
 * @param req.query.uid
 */
router.get('/', [
  query('uid').isAlphanumeric().isLength({ min: 1 })
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  const user = await models.User.findOne({ uid: req.query.uid })
  if (_.isEmpty(user)) {
    res.status(400).send({
      error: `User with uid: ${req.query.uid} does not exist`
    })
    return
  }
  res.send(user)
})

/**
 * Get users
 * @param req.query.skip
 * @param req.query.limit
 */
router.get('/all', [
  query('limit').optional().isInt().toInt(),
  query('skip').optional().isInt().toInt()
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  if (!req.query.skip) {
    req.query.skip = 0
  }
  if (!req.query.limit) {
    req.query.limit = 20
  }
  // TODO(aibek): filter out important fields
  const users = await models.User.find().limit(req.query.limit).skip(req.query.skip).select('-reviews -_id -__v')
  res.send(users)
})

// TODO(aibek): roles must be assigned by users with specific permissions
// Maybe even add middleware with route access permissions
/**
 * Assigns a user's role by his uid.
 * @param req.query.uid
 * @param req.body.role - can be one of three: {'student', 'teacher', 'both'}
 */
router.post('/assignRole', [
  query('uid').isAlphanumeric().isLength({ min: 1 }),
  body('role').isIn(['student', 'teacher', 'both'])
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  const user = await models.User.findOne({ uid: req.query.uid })
  if (_.isEmpty(user)) {
    res.status(400).send({
      error: `User with uid: ${req.query.uid} does not exist`
    })
    return
  }
  models.User.updateOne({ uid: req.query.uid }, { role: req.body.role }, function (result) {
    res.sendStatus(200)
  })
})


  /*
router.post('/profile', [
  upload.single('avatar'),
  query('uid').isAlphanumeric().isLength({ min: 1 })
], async (req, res) => {
  if (!req.file) {
    res.sendStatus(400)
  }
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  const user = await models.User.findOne({ uid: req.query.uid })
  if (_.isEmpty(user)) {
    res.status(400).send({
      error: `User with uid: ${req.query.uid} does not exist`
    })
    return
  }
  // TODO(aibek): check file's extension and maximum size, also maybe format it
  let ext = utils.getFileExtension(req.file.originalname)
  if (!ext) {
    ext = ''
  } else {
    ext = '.' + ext
  }
  const s3Params = {
    Bucket: 'psixs',
    Key: 'user-profile-pictures/' + uuidv4() + ext,
    ACL: 'public-read',
    Body: req.file.buffer
  }
  // TODO(aibek): delete previous avatar of the user
  s3.upload(s3Params).promise().then((data) => {
    return models.User.updateOne({ uid: req.query.uid }, { avatarUrl: data.Location })
  }).then(() => {
    res.sendStatus(200)
  })
})
*/
module.exports = router
